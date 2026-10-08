// Server-only: reads an uploaded CV (PDF or image) with Gemini and maps it to CVData.
import { GoogleGenAI, Type, Schema, ApiError } from '@google/genai';
import { z } from 'zod';
import { CVData } from '@/types/types';
import { CvDesign, DESIGN_FONTS, SECTION_KEYS, normalizeDesign } from '@/lib/cv-design';

// Free-tier Flash models, tried in order. gemini-3.5-flash goes first because it is the one most often
// available; newer models frequently return 503 (high demand) or 429 (quota), so they are only fallbacks.
// GEMINI_MODEL, if set, is tried first.
const MODELS = ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-3.7-flash', 'gemini-3.5-flash-lite'];
const FALLBACK_STATUSES = [404, 429, 500, 503];
const REQUEST_TIMEOUT_MS = 45_000;
// Whole parse must finish before the route's maxDuration (120s)
const TOTAL_BUDGET_MS = 105_000;
const MIN_ATTEMPT_MS = 10_000;

const experienceSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    role: { type: Type.STRING },
    company: { type: Type.STRING },
    dateRange: { type: Type.STRING },
    responsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
  },
  required: ['role', 'company', 'dateRange', 'responsibilities'],
  propertyOrdering: ['role', 'company', 'dateRange', 'responsibilities'],
};

const STRING: Schema = { type: Type.STRING };
const NUMBER: Schema = { type: Type.NUMBER };
const BOOLEAN: Schema = { type: Type.BOOLEAN };
const enumOf = (values: readonly string[]): Schema => ({ type: Type.STRING, format: 'enum', enum: [...values] });
const object = (properties: Record<string, Schema>): Schema => ({
  type: Type.OBJECT,
  properties,
  required: Object.keys(properties),
  propertyOrdering: Object.keys(properties),
});
const sectionKeyList: Schema = { type: Type.ARRAY, items: enumOf(SECTION_KEYS) };

// Mirrors lib/cv-design.ts; values are validated again by normalizeDesign
const designSchema = object({
  layout: enumOf(['single', 'two-column']),
  sidebar: object({
    side: enumOf(['left', 'right']),
    widthPct: NUMBER,
    bg: STRING,
    text: STRING,
    sections: sectionKeyList,
  }),
  sectionOrder: sectionKeyList,
  sectionTitles: object(Object.fromEntries(SECTION_KEYS.map((key) => [key, STRING]))),
  header: object({
    placement: enumOf(['top', 'main', 'sidebar']),
    align: enumOf(['left', 'center', 'right']),
    bg: STRING,
    text: STRING,
    nameScale: NUMBER,
    nameWeight: enumOf(['normal', 'semibold', 'bold', 'extrabold']),
    nameUppercase: BOOLEAN,
    nameLetterSpacing: NUMBER,
    contactLayout: enumOf(['inline', 'stacked']),
    contactSeparator: STRING,
    summary: enumOf(['section', 'above-name', 'below-name']),
    contactPlacement: enumOf(['header', 'sidebar']),
    contactTitle: STRING,
  }),
  photo: object({
    show: BOOLEAN,
    shape: enumOf(['circle', 'rounded', 'square']),
    position: enumOf(['left', 'right', 'sidebar-top']),
  }),
  typography: object({
    headingFont: enumOf(DESIGN_FONTS),
    bodyFont: enumOf(DESIGN_FONTS),
    baseSizePt: NUMBER,
    lineHeight: NUMBER,
  }),
  colors: object({ text: STRING, muted: STRING, accent: STRING, divider: STRING, pageBg: STRING }),
  sectionHeading: object({
    style: enumOf(['plain', 'underline', 'line-after', 'bar-left', 'filled']),
    uppercase: BOOLEAN,
    letterSpacing: NUMBER,
    scale: NUMBER,
    color: STRING,
  }),
  entry: object({
    datePosition: enumOf(['right', 'below']),
    titleFirst: enumOf(['role', 'organization']),
    educationTitleFirst: enumOf(['degree', 'institution']),
    bullet: enumOf(['disc', 'dash', 'arrow', 'none']),
  }),
  skillsStyle: enumOf(['tags', 'list', 'lines', 'inline']),
});

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isResume: { type: Type.BOOLEAN },
    personalInfo: {
      type: Type.OBJECT,
      properties: {
        name: { type: Type.STRING },
        title: { type: Type.STRING },
        phone: { type: Type.STRING },
        email: { type: Type.STRING },
        address: { type: Type.STRING },
        portfolio: { type: Type.STRING },
      },
      required: ['name', 'title', 'phone', 'email', 'address', 'portfolio'],
      propertyOrdering: ['name', 'title', 'phone', 'email', 'address', 'portfolio'],
    },
    summary: { type: Type.STRING },
    education: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          institution: { type: Type.STRING },
          degree: { type: Type.STRING },
          dateRange: { type: Type.STRING },
          gpa: { type: Type.STRING },
        },
        required: ['institution', 'degree', 'dateRange', 'gpa'],
        propertyOrdering: ['institution', 'degree', 'dateRange', 'gpa'],
      },
    },
    workExperience: { type: Type.ARRAY, items: experienceSchema },
    organizationalExperience: { type: Type.ARRAY, items: experienceSchema },
    achievements: { type: Type.ARRAY, items: experienceSchema },
    projects: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          date: { type: Type.STRING },
          details: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['name', 'date', 'details'],
        propertyOrdering: ['name', 'date', 'details'],
      },
    },
    skills: { type: Type.ARRAY, items: { type: Type.STRING } },
    languages: { type: Type.ARRAY, items: { type: Type.STRING } },
    design: designSchema,
  },
  required: [
    'isResume', 'personalInfo', 'summary', 'education', 'workExperience',
    'organizationalExperience', 'achievements', 'projects', 'skills', 'languages', 'design',
  ],
  propertyOrdering: [
    'isResume', 'personalInfo', 'summary', 'education', 'workExperience',
    'organizationalExperience', 'achievements', 'projects', 'skills', 'languages', 'design',
  ],
};

const PROMPT = `You are a CV/resume parser. Read the attached document and extract its content into the JSON schema.

Rules:
- Set "isResume" to false if the document is not a CV/resume (then leave every other field empty).
- Only use information that is actually written in the document. Never invent, guess or embellish. Use "" or [] for anything missing.
- Keep the original language of the CV. Do not translate anything.
- Copy bullet points and descriptions as written (fix only obvious line-break artifacts). One array item per bullet point. If a description is a paragraph without bullets, split it into its sentences.
- Section mapping:
  - workExperience: jobs, internships, freelance and part-time work. "role" = job title, "company" = employer.
  - organizationalExperience: student organizations, volunteering, committees, community work. "role" = position, "company" = organization name.
  - achievements: awards, honors, certifications, scholarships, competitions. "role" = title of the award/certificate, "company" = issuer or event, "dateRange" = date, "responsibilities" = short description lines (may be empty).
  - projects: "name", "date", "details" = bullet points.
  - education: "degree" includes the major/field of study, "gpa" only if written (e.g. "3.80/4.00").
  - skills: one short item per skill or tool (e.g. "Python", "Figma", "Public Speaking"). Split comma-separated lists.
  - languages: spoken languages with proficiency if written, e.g. "English (Fluent)".
- Dates: keep them as "Start - End", e.g. "Jan 2020 - Present" or "2018 - 2022". Use the month/year precision written in the document.
- personalInfo.address: city and country (or what is written), not a full street address unless that is all there is.
- personalInfo.portfolio: the single most relevant link (personal website, otherwise LinkedIn, otherwise GitHub), without "https://" or "http://" and without "www.".
- personalInfo.title: the headline / job title written right under the name (e.g. "Software Engineer"), if any.
- summary: the profile / about me / objective text, if present.
- Order entries as they appear in the document (usually newest first).

Design: also describe the VISUAL DESIGN of the CV in "design", so the CV can be re-created to look the same. Look at the first page carefully.
- layout: "two-column" if there is a distinct side column (often with its own background color) holding some sections; otherwise "single".
- sidebar (two-column only): side, widthPct = width of the side column as % of the page width (typically 25-38), bg = its background color, text = its text color, sections = keys of the sections placed in it, top to bottom. For "single" use side "left", widthPct 30, bg "#ffffff", text = body text color, sections [].
- sectionOrder: keys of the sections in the main column (or the only column), top to bottom, using these keys: summary, education, workExperience, organizationalExperience, achievements, projects, skills, languages. Include only sections that exist in the CV.
- sectionTitles: the section heading text exactly as written in the CV (same language and wording, without changing case), per key. For sections that do not exist, use a sensible title in the CV's language.
- header: where the name/contact block is. placement "top" = full-width band across the whole page above everything; "main" = at the top of the main column only (the side column runs from the very top of the page); "sidebar" = inside the side column. align = text alignment of the name. bg = background color behind the name (use the page background color if there is no colored band). text = name color. nameScale = name font size divided by body text size (e.g. 2.4). nameWeight, nameUppercase (true if the name is written in capitals), nameLetterSpacing in em (0 normal, ~0.1 for widely spaced letters). contactLayout "inline" if contact details are on one line separated by a character, "stacked" if one per line. contactSeparator = that character (e.g. "|", "•", "·"), or "|" if stacked. summary = "above-name" or "below-name" if the profile/summary text sits in the header block next to the name WITHOUT its own section heading; "section" if it has a heading like other sections (then include "summary" in sectionOrder or sidebar.sections; otherwise leave it out of both). contactPlacement = "sidebar" if (two-column only) the contact details are a titled block in the side column, else "header"; contactTitle = that block's heading as written (e.g. "Kontak"), or "Contact" in the CV's language.
- photo: show = true if the CV has a profile photo; shape; position = "left"/"right" of the name, or "sidebar-top" at the top of the side column.
- typography: pick the closest font from the allowed list for headings and for body text (serif vs sans-serif matters most; geometric sans like Montserrat/Poppins, humanist like Open Sans/Lato, classic serif like Georgia/Times New Roman/Merriweather, elegant display serif like Playfair Display). baseSizePt = body text size in pt (usually 9-11). lineHeight = line spacing (1.2 tight, 1.4 normal, 1.6 airy).
- colors: hex "#rrggbb" values sampled from the document. text = body text, muted = secondary text such as dates/company lines, accent = the main highlight color (section headings, lines, icons), divider = separator line color, pageBg = main page background (usually "#ffffff").
- sectionHeading: look closely for thin horizontal rules near the headings (they are often light gray and easy to miss). style "plain" (just text, no line anywhere), "underline" (full-width line under the heading), "line-after" (heading followed by a line on the same row), "bar-left" (vertical bar to the left), "filled" (heading text on a colored background block). uppercase, letterSpacing in em, scale = heading size divided by body size, color = heading text color.
- entry: datePosition "right" if dates are right-aligned on the same line as the title, "below" if under the title. titleFirst (work/organization/achievement entries) "role" if the job title is the bold first line, "organization" if the company comes first. educationTitleFirst "degree" or "institution" = which one is the first (bold) line of education entries. bullet = bullet marker style.
- skillsStyle: "tags" (pills/boxes), "list" (bulleted list), "lines" (one per line, no bullet markers), "inline" (comma-separated text).`;

const str = z.string().catch('').transform((s) => s.trim());
const strList = z
  .array(z.string().catch(''))
  .catch([])
  .transform((list) => list.map((s) => s.trim()).filter(Boolean));

const experience = z.object({
  role: str,
  company: str,
  dateRange: str,
  responsibilities: strList,
});

const list = <T extends z.ZodTypeAny>(item: T) => z.array(item.nullable().catch(null)).catch([]);

const cvSchema = z.object({
  isResume: z.boolean().catch(true),
  personalInfo: z
    .object({ name: str, title: str, phone: str, email: str, address: str, portfolio: str })
    .catch({ name: '', title: '', phone: '', email: '', address: '', portfolio: '' }),
  summary: str,
  education: list(z.object({ institution: str, degree: str, dateRange: str, gpa: str })),
  workExperience: list(experience),
  organizationalExperience: list(experience),
  achievements: list(experience),
  projects: list(z.object({ name: str, date: str, details: strList })),
  skills: strList,
  languages: strList,
});

const hasContent = (entry: object | null) =>
  !!entry && Object.values(entry).some((v) => (Array.isArray(v) ? v.length > 0 : !!v));

export const normalizeCVData = (raw: unknown): { isResume: boolean; cvData: CVData; design: CvDesign } => {
  const parsed = cvSchema.parse(raw ?? {});
  const compact = <T extends object>(entries: (T | null)[]) => entries.filter(hasContent) as T[];

  return {
    isResume: parsed.isResume,
    design: normalizeDesign((raw as { design?: unknown } | null)?.design),
    cvData: {
      personalInfo: {
        ...parsed.personalInfo,
        portfolio: parsed.personalInfo.portfolio.replace(/^https?:\/\//i, '').replace(/^www\./i, ''),
        photoUrl: '',
      },
      summary: parsed.summary,
      education: compact(parsed.education).map(({ gpa, ...rest }) => (gpa ? { ...rest, gpa } : rest)),
      workExperience: compact(parsed.workExperience),
      organizationalExperience: compact(parsed.organizationalExperience),
      achievements: compact(parsed.achievements),
      projects: compact(parsed.projects),
      skills: parsed.skills,
      languages: parsed.languages,
    },
  };
};

export type ParseEvent =
  | { type: 'trying'; model: string }
  | { type: 'fallback'; model: string; reason: string; hasNext: boolean };

export const parseCvWithGemini = async (
  base64: string,
  mimeType: string,
  onEvent: (event: ParseEvent) => void = () => {},
  signal?: AbortSignal,
) => {
  // No SDK retries: its default backoff on 503 can take minutes; switching models is faster
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: { retryOptions: { attempts: 1 } },
  });
  const models = [...new Set([process.env.GEMINI_MODEL, ...MODELS].filter((m): m is string => !!m))];
  const deadline = Date.now() + TOTAL_BUDGET_MS;

  let lastError: unknown;
  for (const [index, model] of models.entries()) {
    signal?.throwIfAborted();
    const remaining = deadline - Date.now();
    if (remaining < MIN_ATTEMPT_MS) break;

    onEvent({ type: 'trying', model });
    try {
      const response = await ai.models.generateContent({
        model,
        contents: [
          { inlineData: { mimeType, data: base64 } },
          { text: PROMPT },
        ],
        config: {
          abortSignal: signal,
          httpOptions: { timeout: Math.min(REQUEST_TIMEOUT_MS, remaining) },
          responseMimeType: 'application/json',
          responseSchema,
        },
      });

      if (!response.text) {
        throw new Error(`Gemini (${model}) returned an empty response`);
      }

      return normalizeCVData(JSON.parse(response.text));
    } catch (error) {
      lastError = error;
      if (signal?.aborted) throw error;
      // Request errors (bad key, invalid file...) fail the same on every model, so stop there
      if (error instanceof ApiError && !FALLBACK_STATUSES.includes(error.status)) throw error;

      const reason = error instanceof ApiError ? String(error.status) : 'timeout';
      const hasNext = index < models.length - 1;
      console.warn(`Gemini model ${model} unavailable (${reason})${hasNext ? ', trying next model' : ''}`, error);
      onEvent({ type: 'fallback', model, reason, hasNext });
    }
  }

  throw lastError ?? new Error('No Gemini model could be tried within the time budget');
};
