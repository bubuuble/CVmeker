// Renders CV data with a CvDesign as a self-contained HTML fragment (scoped <style> + markup).
// Single source for both the editor preview (components/templates/custom-template.tsx)
// and the PDF (app/api/generate-pdf/route.ts), so they always look the same.
import { CVData, EducationEntry, ExperienceEntry, ProjectEntry } from '@/types/types';
import { CvDesign, SECTION_KEYS, SectionKey, fontStack } from '@/lib/cv-design';

export interface CustomRenderOptions {
  fontFamily?: string;
  fontSize?: string | number;
  highlightColor?: string;
  imageSize?: string | number;
  // Preview only: show an empty photo frame when the design has a photo but none is uploaded
  photoPlaceholder?: boolean;
  photoPlaceholderLabel?: string;
  // PDF: page height comes from the paper, not from a min-height
  forPdf?: boolean;
}

const esc = (value: unknown) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

const validHex = (value: string | undefined) => {
  const match = value?.trim().match(/^#([0-9a-f]{6})([0-9a-f]{2})?$/i);
  return match ? `#${match[1].toLowerCase()}` : undefined;
};

const isDark = (hex: string) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.5;
};

const clampNumber = (value: string | number | undefined, min: number, max: number, fallback: number) => {
  const n = typeof value === 'number' ? value : parseFloat(value ?? '');
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : fallback;
};

const WEIGHTS = { normal: 400, semibold: 600, bold: 700, extrabold: 800 } as const;
const BULLETS = { disc: '•', dash: '–', arrow: '›', none: '' } as const;

// Resolves design + editor toolbar overrides into the concrete values used by the renderer
const resolveTheme = (design: CvDesign, opts: CustomRenderOptions) => {
  const designBody = design.typography.bodyFont;
  const bodyFont = (opts.fontFamily || designBody).replace(/[^\w\s-]/g, '') || designBody;
  // A heading font that matched the body font follows the toolbar font too
  const headingFont = design.typography.headingFont === designBody ? bodyFont : design.typography.headingFont;
  const accent = validHex(opts.highlightColor) ?? design.colors.accent;
  const followsAccent = (color: string) => (color === design.colors.accent ? accent : color);
  return {
    bodyFont,
    headingFont,
    baseSize: clampNumber(opts.fontSize, 6, 24, design.typography.baseSizePt),
    accent,
    headingColor: followsAccent(design.sectionHeading.color),
    headerBg: followsAccent(design.header.bg),
    sidebarBg: followsAccent(design.sidebar.bg),
    photoEm: 6.5 * (clampNumber(opts.imageSize, 8, 40, 24) / 24),
  };
};

export const customCvFonts = (design: CvDesign, opts: CustomRenderOptions = {}) => {
  const theme = resolveTheme(design, opts);
  return [theme.bodyFont, theme.headingFont];
};

// Background for the whole page: keeps a two-column sidebar colored down to the bottom of every page
export const customCvPageBackground = (design: CvDesign, opts: CustomRenderOptions = {}) => {
  const { sidebarBg } = resolveTheme(design, opts);
  if (design.layout !== 'two-column') return design.colors.pageBg;
  const w = design.sidebar.widthPct;
  return design.sidebar.side === 'left'
    ? `linear-gradient(to right, ${sidebarBg} 0, ${sidebarBg} ${w}%, ${design.colors.pageBg} ${w}%)`
    : `linear-gradient(to left, ${sidebarBg} 0, ${sidebarBg} ${w}%, ${design.colors.pageBg} ${w}%)`;
};

export const renderCustomCv = (data: CVData, design: CvDesign, opts: CustomRenderOptions = {}): string => {
  const theme = resolveTheme(design, opts);
  const twoCol = design.layout === 'two-column';
  const sidebarDark = isDark(theme.sidebarBg);
  const headerPlacement = twoCol ? design.header.placement : 'top';
  const photoPosition = !twoCol && design.photo.position === 'sidebar-top' ? 'right' : design.photo.position;

  // Summary can live in the header block instead of being its own section
  const summaryInHeader = design.header.summary !== 'section';
  const isSection = (k: SectionKey) => !(summaryInHeader && k === 'summary');

  // Section placement: sidebar sections first, every other section in the main column, nothing dropped
  const sidebarKeys = twoCol ? design.sidebar.sections.filter(isSection) : [];
  const mainKeys = [
    ...design.sectionOrder.filter((k) => !sidebarKeys.includes(k)),
    ...SECTION_KEYS.filter((k) => !design.sectionOrder.includes(k) && !sidebarKeys.includes(k)),
  ].filter(isSection);

  // ---------- pieces ----------
  const photo = (extraClass = '') => {
    if (!design.photo.show) return '';
    const url = data.personalInfo.photoUrl;
    // Only inline images: the PDF renderer must not fetch arbitrary URLs
    if (url && /^data:image\/[a-z+.-]+;base64,/i.test(url)) {
      return `<img class="cvx-photo ${extraClass}" src="${esc(url)}" alt="${esc(data.personalInfo.name)}" />`;
    }
    if (!opts.photoPlaceholder) return '';
    return `<div class="cvx-photo cvx-photo-empty ${extraClass}" title="${esc(opts.photoPlaceholderLabel || '')}">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm0 2.25c-4.14 0-7.5 2.35-7.5 5.25 0 .41.34.75.75.75h13.5c.41 0 .75-.34.75-.75 0-2.9-3.36-5.25-7.5-5.25Z"/></svg>
    </div>`;
  };

  const { phone, email, address, portfolio } = data.personalInfo;
  const contacts = [phone, email, address, portfolio].filter((c) => c && c.trim());
  const contactsInSidebar = twoCol && design.header.contactPlacement === 'sidebar';
  const stackedContacts = contacts.map((c) => `<div>${esc(c)}</div>`).join('');

  const header = (inSidebar: boolean) => {
    const { name, title } = data.personalInfo;
    const stacked = inSidebar || design.header.contactLayout === 'stacked';
    const sep = ` <span class="cvx-sep">${esc(design.header.contactSeparator)}</span> `;
    const contactHtml = stacked ? stackedContacts : contacts.map(esc).join(sep);
    const showContacts = contacts.length > 0 && !contactsInSidebar;
    const sidePhoto = !inSidebar && (photoPosition === 'left' || photoPosition === 'right') ? photo() : '';
    // Header summary spans the full header width, above or below the name/photo row
    const summary = summaryInHeader && data.summary?.trim() ? `<p class="cvx-header-summary">${esc(data.summary)}</p>` : '';
    return `${design.header.summary === 'above-name' ? summary : ''}
    <header class="cvx-header ${inSidebar ? 'cvx-header-side' : ''} ${sidePhoto ? `cvx-photo-${photoPosition}` : ''}">
      ${sidePhoto}
      <div class="cvx-header-text">
        ${name ? `<h1 class="cvx-name">${esc(name)}</h1>` : ''}
        ${title ? `<div class="cvx-title">${esc(title)}</div>` : ''}
        ${showContacts ? `<div class="cvx-contacts ${stacked ? 'cvx-stacked' : ''}">${contactHtml}</div>` : ''}
      </div>
    </header>
    ${design.header.summary === 'below-name' ? summary : ''}`;
  };

  const contactSection = () =>
    contactsInSidebar && contacts.length
      ? `<section class="cvx-section"><h2 class="cvx-heading"><span>${esc(design.header.contactTitle)}</span></h2><div class="cvx-contacts-side">${stackedContacts}</div></section>`
      : '';

  const bullets = (items: string[]) => {
    const list = items.filter((i) => i && i.trim());
    return list.length ? `<ul class="cvx-bullets">${list.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : '';
  };

  const entry = (title: string, subtitle: string, date: string, items: string[], inSidebar: boolean, extra = '') => {
    const dateBelow = inSidebar || design.entry.datePosition === 'below';
    return `<div class="cvx-entry">
      <div class="cvx-entry-head">
        <div class="cvx-entry-main">
          ${title ? `<div class="cvx-entry-title">${esc(title)}</div>` : ''}
          ${subtitle || extra ? `<div class="cvx-entry-sub">${esc(subtitle)}${extra ? `${subtitle ? ' · ' : ''}${esc(extra)}` : ''}</div>` : ''}
          ${date && dateBelow ? `<div class="cvx-date">${esc(date)}</div>` : ''}
        </div>
        ${date && !dateBelow ? `<div class="cvx-date cvx-date-right">${esc(date)}</div>` : ''}
      </div>
      ${bullets(items)}
    </div>`;
  };

  const experience = (items: ExperienceEntry[], inSidebar: boolean) =>
    items.map((e) => {
      const org = [e.company, e.organization].filter(Boolean).join(' · ');
      return design.entry.titleFirst === 'organization'
        ? entry(org, e.role, e.dateRange, e.responsibilities || [], inSidebar)
        : entry(e.role, org, e.dateRange, e.responsibilities || [], inSidebar);
    }).join('');

  const education = (items: EducationEntry[], inSidebar: boolean) =>
    items.map((e) =>
      design.entry.educationTitleFirst === 'degree'
        ? entry(e.degree, e.institution, e.dateRange, [], inSidebar, e.gpa || '')
        : entry(e.institution, e.degree, e.dateRange, [], inSidebar, e.gpa || ''),
    ).join('');

  const projects = (items: ProjectEntry[], inSidebar: boolean) =>
    items.map((p) => entry(p.name, '', p.date, p.details || [], inSidebar)).join('');

  const tags = (items: string[]) => {
    const list = items.filter((i) => i && i.trim());
    if (!list.length) return '';
    if (design.skillsStyle === 'tags') return `<div class="cvx-tags">${list.map((i) => `<span>${esc(i)}</span>`).join('')}</div>`;
    if (design.skillsStyle === 'inline') return `<p class="cvx-inline">${list.map(esc).join(', ')}</p>`;
    if (design.skillsStyle === 'lines') return `<div class="cvx-lines">${list.map((i) => `<div>${esc(i)}</div>`).join('')}</div>`;
    return bullets(list);
  };

  const sectionBody = (key: SectionKey, inSidebar: boolean) => {
    switch (key) {
      case 'summary': return data.summary?.trim() ? `<p class="cvx-summary">${esc(data.summary)}</p>` : '';
      case 'education': return education(data.education || [], inSidebar);
      case 'workExperience': return experience(data.workExperience || [], inSidebar);
      case 'organizationalExperience': return experience(data.organizationalExperience || [], inSidebar);
      case 'achievements': return experience(data.achievements || [], inSidebar);
      case 'projects': return projects(data.projects || [], inSidebar);
      case 'skills': return tags(data.skills || []);
      case 'languages': return tags(data.languages || []);
    }
  };

  const section = (key: SectionKey, inSidebar: boolean) => {
    const body = sectionBody(key, inSidebar);
    return body
      ? `<section class="cvx-section"><h2 class="cvx-heading"><span>${esc(design.sectionTitles[key])}</span></h2>${body}</section>`
      : '';
  };

  // ---------- styles ----------
  const h = design.header;
  const sh = design.sectionHeading;
  const c = design.colors;
  const sideText = design.sidebar.text;
  const sideHeading = sidebarDark ? sideText : theme.headingColor;
  const photoRadius = design.photo.shape === 'circle' ? '50%' : design.photo.shape === 'rounded' ? '14%' : '0';
  const headingOnAccent = isDark(theme.headingColor) ? '#ffffff' : '#111827';
  const headerHasBg = theme.headerBg !== c.pageBg;
  const justify = h.align === 'center' ? 'center' : h.align === 'right' ? 'flex-end' : 'flex-start';

  const headingStyle = {
    plain: '',
    underline: `padding-bottom:.25em;border-bottom:1px solid var(--cvx-heading-line);`,
    'line-after': '',
    'bar-left': `padding-left:.55em;border-left:.22em solid var(--cvx-heading);`,
    filled: `padding:.28em .6em;background:var(--cvx-heading);color:${headingOnAccent} !important;`,
  }[sh.style];

  const css = `
.cvx{--cvx-heading:${theme.headingColor};--cvx-heading-line:${sh.style === 'underline' ? theme.headingColor : c.divider};
  font-family:${fontStack(theme.bodyFont)};font-size:${theme.baseSize}pt;line-height:${design.typography.lineHeight};
  color:${c.text};width:100%;${opts.forPdf ? '' : `min-height:297mm;background:${customCvPageBackground(design, opts)};`}
  -webkit-print-color-adjust:exact;print-color-adjust:exact;text-align:left;}
.cvx *{box-sizing:border-box;margin:0;padding:0;}
.cvx-cols{display:flex;${design.sidebar.side === 'right' ? 'flex-direction:row-reverse;' : ''}align-items:stretch;}
.cvx-side{width:${design.sidebar.widthPct}%;flex-shrink:0;padding:2.4em 1.7em;color:${sideText};}
.cvx-main{flex:1;min-width:0;padding:2.4em 2.6em;}
.cvx-single{padding:0 2.6em 2.4em;}
/* In the PDF each page fragment gets the top/bottom padding again (the page itself has no margins) */
.cvx-side,.cvx-main,.cvx-single{-webkit-box-decoration-break:clone;box-decoration-break:clone;}
.cvx-header{display:flex;align-items:center;justify-content:${justify};gap:1.4em;text-align:${h.align};}
.cvx-top{background:${theme.headerBg};color:${h.text};padding:${headerHasBg ? '2.2em 2.6em' : '2.4em 2.6em 0'};}
.cvx-header.cvx-photo-right{flex-direction:${h.align === 'right' ? 'row' : 'row-reverse'};justify-content:${h.align === 'center' ? 'center' : 'space-between'};}
.cvx-header.cvx-photo-left{flex-direction:row;}
.cvx-header-main{margin-bottom:1.6em;color:${h.text};${headerHasBg ? `background:${theme.headerBg};padding:1.4em 1.6em;margin:-2.4em -2.6em 1.6em;` : ''}}
.cvx-header-side{flex-direction:column;align-items:${justify};margin-bottom:1.6em;color:${sideText};}
.cvx-header-text{min-width:0;}
.cvx-name{font-family:${fontStack(theme.headingFont)};font-size:${h.nameScale}em;font-weight:${WEIGHTS[h.nameWeight]};line-height:1.1;
  letter-spacing:${h.nameLetterSpacing}em;${h.nameUppercase ? 'text-transform:uppercase;' : ''}color:inherit;}
.cvx-header-side .cvx-name{font-size:${Math.min(h.nameScale, 2)}em;}
.cvx-title{margin-top:.3em;font-size:1.15em;font-weight:500;opacity:.85;}
.cvx-contacts{margin-top:.6em;font-size:.92em;opacity:.85;}
.cvx-contacts.cvx-stacked div+div{margin-top:.15em;}
.cvx-header-summary{white-space:pre-line;opacity:.85;margin:.9em 0 0;text-align:${h.align};}
.cvx-header-summary:first-child{margin:0 0 .6em;}
.cvx-contacts-side div+div,.cvx-lines div+div{margin-top:.2em;}
.cvx-contacts-side div{overflow-wrap:anywhere;}
.cvx-sep{opacity:.6;margin:0 .15em;}
.cvx-photo{width:${theme.photoEm}em;height:${theme.photoEm}em;border-radius:${photoRadius};object-fit:cover;flex-shrink:0;}
.cvx-photo-empty{display:flex;align-items:flex-end;justify-content:center;overflow:hidden;background:#e5e7eb;color:#9ca3af;border:1px dashed #9ca3af;}
.cvx-photo-empty svg{width:78%;height:78%;}
.cvx-photo-sidebar{display:block;margin:0 auto 1.4em;}
.cvx-section{margin-top:1.35em;break-inside:auto;}
.cvx-section:first-child{margin-top:0;}
.cvx-heading{font-family:${fontStack(theme.headingFont)};font-size:${sh.scale}em;font-weight:700;color:var(--cvx-heading);
  ${sh.uppercase ? 'text-transform:uppercase;' : ''}letter-spacing:${sh.letterSpacing}em;margin-bottom:.6em;${headingStyle}
  ${sh.style === 'line-after' ? 'display:flex;align-items:center;gap:.6em;' : ''}break-after:avoid;}
${sh.style === 'line-after' ? `.cvx-heading::after{content:'';flex:1;height:1px;background:${c.divider};}` : ''}
.cvx-side .cvx-heading{color:${sideHeading};${sidebarDark ? '--cvx-heading-line:rgba(255,255,255,.35);' : ''}}
${sh.style === 'filled' ? `.cvx-side .cvx-heading{background:${sidebarDark ? 'rgba(255,255,255,.15)' : 'var(--cvx-heading)'};}` : ''}
.cvx-entry{break-inside:avoid;}
.cvx-entry+.cvx-entry{margin-top:.8em;}
.cvx-entry-head{display:flex;justify-content:space-between;align-items:flex-start;gap:1em;}
.cvx-entry-main{min-width:0;}
.cvx-entry-title{font-weight:700;}
.cvx-entry-sub{color:${c.muted};}
.cvx-date{color:${c.muted};font-size:.92em;}
.cvx-date-right{white-space:nowrap;flex-shrink:0;text-align:right;}
.cvx-side .cvx-entry-sub,.cvx-side .cvx-date{color:inherit;opacity:.78;}
.cvx-summary{white-space:pre-line;}
.cvx-bullets{list-style:none;margin-top:.3em;}
.cvx-bullets li{position:relative;padding-left:${design.entry.bullet === 'none' ? '0' : '1.05em'};}
.cvx-bullets li+li{margin-top:.15em;}
${design.entry.bullet === 'none' ? '' : `.cvx-bullets li::before{content:'${BULLETS[design.entry.bullet]}';position:absolute;left:.15em;color:${theme.accent};}`}
.cvx-side .cvx-bullets li::before{color:inherit;}
.cvx-tags{display:flex;flex-wrap:wrap;gap:.35em;}
.cvx-tags span{border:1px solid ${c.divider};border-radius:999px;padding:.12em .65em;font-size:.92em;}
.cvx-side .cvx-tags span{border-color:${sidebarDark ? 'rgba(255,255,255,.35)' : c.divider};}
`;

  // ---------- layout ----------
  const sidebarPhoto = twoCol && photoPosition === 'sidebar-top' ? photo('cvx-photo-sidebar') : '';
  const topHeader = headerPlacement === 'top' ? `<div class="cvx-top">${header(false)}</div>` : '';

  const body = twoCol
    ? `<div class="cvx-cols">
        <aside class="cvx-side">
          ${sidebarPhoto}
          ${headerPlacement === 'sidebar' ? header(true) : ''}
          ${contactSection()}
          ${sidebarKeys.map((k) => section(k, true)).join('')}
        </aside>
        <main class="cvx-main">
          ${headerPlacement === 'main' ? `<div class="cvx-header-main">${header(false)}</div>` : ''}
          ${mainKeys.map((k) => section(k, false)).join('')}
        </main>
      </div>`
    : `<div class="cvx-single" style="padding-top:${headerPlacement === 'top' ? '1.6em' : '2.4em'}">${mainKeys.map((k) => section(k, false)).join('')}</div>`;

  return `<style>${css}</style><div class="cvx">${topHeader}${body}</div>`;
};
