// Design spec for the "custom" template: a parametric description of an uploaded CV's look
// (columns, colors, fonts, heading style...) that lib/custom-template.ts renders.
// Shared by client and server; every value is validated because it ends up in inline CSS.
import { z } from 'zod';

export const SECTION_KEYS = [
  'summary', 'education', 'workExperience', 'organizationalExperience',
  'achievements', 'projects', 'skills', 'languages',
] as const;
export type SectionKey = typeof SECTION_KEYS[number];

export const DESIGN_FONTS = [
  'Calibri', 'Arial', 'Times New Roman', 'Georgia', 'Verdana', 'Montserrat',
  'Roboto', 'Open Sans', 'Lato', 'Poppins', 'Raleway', 'Merriweather', 'Playfair Display', 'Source Serif 4',
] as const;
export type DesignFont = typeof DESIGN_FONTS[number];

// Fonts that are not installed everywhere and are loaded from Google Fonts (value = available weights)
export const GOOGLE_FONTS: Partial<Record<DesignFont, string>> = {
  'Montserrat': '400;600;700;800',
  'Roboto': '400;500;700;900',
  'Open Sans': '400;600;700;800',
  'Lato': '400;700;900',
  'Poppins': '400;600;700;800',
  'Raleway': '400;600;700;800',
  'Merriweather': '400;700;900',
  'Playfair Display': '400;600;700;800',
  'Source Serif 4': '400;600;700;800',
};

const SERIF_FONTS: string[] = ['Times New Roman', 'Georgia', 'Merriweather', 'Playfair Display', 'Source Serif 4'];

export const DEFAULT_SECTION_TITLES: Record<SectionKey, string> = {
  summary: 'Summary',
  education: 'Education',
  workExperience: 'Work Experience',
  organizationalExperience: 'Organizational Experience',
  achievements: 'Achievements',
  projects: 'Projects',
  skills: 'Skills',
  languages: 'Languages',
};

const isSectionKey = (value: string): value is SectionKey => (SECTION_KEYS as readonly string[]).includes(value);

const hex = (fallback: string) =>
  z.string().catch(fallback).transform((s) => (/^#[0-9a-f]{6}$/i.test(s.trim()) ? s.trim().toLowerCase() : fallback));
const num = (min: number, max: number, fallback: number) =>
  z.number().catch(fallback).transform((n) => Math.min(max, Math.max(min, n)));
const oneOf = <const T extends string>(values: readonly [T, ...T[]], fallback: NoInfer<T>) =>
  z.enum(values as [T, ...T[]]).catch(fallback);
const bool = (fallback: boolean) => z.boolean().catch(fallback);
const text = (max: number, fallback: string) =>
  z.string().catch(fallback).transform((s) => s.trim().slice(0, max) || fallback);
const sectionList = (fallback: SectionKey[]) =>
  z.array(z.string().catch('')).catch(fallback).transform((list) => [...new Set(list.filter(isSectionKey))]);
// Missing or malformed groups fall back to their field defaults
const group = <T extends z.ZodRawShape>(shape: T) =>
  z.preprocess((v) => (v && typeof v === 'object' && !Array.isArray(v) ? v : {}), z.object(shape));

export const cvDesignSchema = group({
  layout: oneOf(['single', 'two-column'], 'single'),
  sidebar: group({
    side: oneOf(['left', 'right'], 'left'),
    widthPct: num(22, 42, 32),
    bg: hex('#f3f4f6'),
    text: hex('#1f2937'),
    sections: sectionList(['skills', 'languages']),
  }),
  sectionOrder: sectionList([...SECTION_KEYS]),
  sectionTitles: group(
    Object.fromEntries(SECTION_KEYS.map((key) => [key, text(60, DEFAULT_SECTION_TITLES[key])])) as Record<SectionKey, ReturnType<typeof text>>,
  ),
  header: group({
    placement: oneOf(['top', 'main', 'sidebar'], 'top'),
    align: oneOf(['left', 'center', 'right'], 'left'),
    bg: hex('#ffffff'),
    text: hex('#111827'),
    nameScale: num(1.4, 3.6, 2.2),
    nameWeight: oneOf(['normal', 'semibold', 'bold', 'extrabold'], 'bold'),
    nameUppercase: bool(false),
    nameLetterSpacing: num(0, 0.3, 0),
    contactLayout: oneOf(['inline', 'stacked'], 'inline'),
    contactSeparator: text(3, '|'),
    // Summary shown inside the header block (no heading) instead of as its own section
    summary: oneOf(['section', 'above-name', 'below-name'], 'section'),
    // Two-column CVs often list contact details as a titled block in the side column
    contactPlacement: oneOf(['header', 'sidebar'], 'header'),
    contactTitle: text(40, 'Contact'),
  }),
  photo: group({
    show: bool(false),
    shape: oneOf(['circle', 'rounded', 'square'], 'circle'),
    position: oneOf(['left', 'right', 'sidebar-top'], 'right'),
  }),
  typography: group({
    headingFont: oneOf(DESIGN_FONTS, 'Arial'),
    bodyFont: oneOf(DESIGN_FONTS, 'Arial'),
    baseSizePt: num(9, 12, 10).transform(Math.round),
    lineHeight: num(1.15, 1.7, 1.4),
  }),
  colors: group({
    text: hex('#1f2937'),
    muted: hex('#6b7280'),
    accent: hex('#1f2937'),
    divider: hex('#d1d5db'),
    pageBg: hex('#ffffff'),
  }),
  sectionHeading: group({
    style: oneOf(['plain', 'underline', 'line-after', 'bar-left', 'filled'], 'underline'),
    uppercase: bool(true),
    letterSpacing: num(0, 0.3, 0.05),
    scale: num(0.9, 1.7, 1.1),
    color: hex('#1f2937'),
  }),
  entry: group({
    datePosition: oneOf(['right', 'below'], 'right'),
    titleFirst: oneOf(['role', 'organization'], 'role'),
    educationTitleFirst: oneOf(['degree', 'institution'], 'institution'),
    bullet: oneOf(['disc', 'dash', 'arrow', 'none'], 'disc'),
  }),
  skillsStyle: oneOf(['tags', 'list', 'lines', 'inline'], 'list'),
});

export type CvDesign = z.infer<typeof cvDesignSchema>;

export const normalizeDesign = (raw: unknown): CvDesign => {
  const design = cvDesignSchema.parse(raw ?? {});
  // Sidebar-only options make no sense in a single-column layout
  if (design.layout === 'single') {
    if (design.header.placement !== 'top') design.header.placement = 'top';
    if (design.photo.position === 'sidebar-top') design.photo.position = 'right';
    design.header.contactPlacement = 'header';
  }
  return design;
};

export const DEFAULT_DESIGN: CvDesign = normalizeDesign({});

export const fontStack = (font: string) =>
  `'${font.replace(/[^\w\s-]/g, '')}', ${SERIF_FONTS.includes(font) ? 'Georgia, serif' : 'Arial, Helvetica, sans-serif'}`;

export const googleFontsHref = (fonts: string[]) => {
  const families = [...new Set(fonts)]
    .filter((font): font is DesignFont => font in GOOGLE_FONTS)
    .map((font) => `family=${font.replace(/ /g, '+')}:wght@${GOOGLE_FONTS[font]}`);
  return families.length ? `https://fonts.googleapis.com/css2?${families.join('&')}&display=swap` : null;
};
