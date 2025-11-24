import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { CVData } from '@/types/types';

interface PDFRequest {
  cvData: CVData;
  templateId?: string;
  fontFamily?: string;
  fontSize?: string;
  highlightColor?: string;
  imageSize?: string;
}

export async function POST(req: NextRequest) {
  try {
    const { cvData, templateId = 'template1', fontFamily = 'Calibri', fontSize = '11', highlightColor = '#22c55e', imageSize = '24' } = (await req.json()) as PDFRequest;

    // Generate HTML manually without using ReactDOMServer
    const html = templateId === 'template2' 
      ? generateTemplate2HTML(cvData, fontFamily, fontSize, imageSize)
      : templateId === 'template3'
      ? generateTemplate3HTML(cvData, fontFamily, fontSize, highlightColor, imageSize)
      : generateTemplate1HTML(cvData, fontFamily, fontSize, highlightColor, imageSize);

    const isDev = process.env.NODE_ENV === 'development';

    let browser;
    if (isDev) {
      // For development, try to use local Chrome/Edge
      const puppeteerFull = await import('puppeteer');
      browser = await puppeteerFull.default.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });
    } else {
      // For production (Vercel), use puppeteer-core with chromium
      browser = await puppeteer.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      });
    }

    const page = await browser.newPage();
    
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm',
      },
      preferCSSPageSize: false,
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="cv-document.pdf"',
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return new NextResponse(
      JSON.stringify({ error: 'Failed to generate PDF.', details: errorMessage }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

function generateTemplate1HTML(data: CVData, fontFamily: string, fontSize: string, highlightColor: string, imageSize: string): string {
  const imgSize = `${parseInt(imageSize) * 4}px`;
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: ${fontFamily}, sans-serif;
            font-size: ${fontSize}pt;
            color: #1f2937;
            background: white;
          }
          .container { padding: 2rem 2.5rem; max-width: 800px; margin: 0 auto; }
          header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
          h1 { font-size: 1.875rem; font-weight: 700; color: #000; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
          .contact-info { font-size: 0.75rem; color: #6b7280; line-height: 1.4; }
          .contact-info p { margin: 0.125rem 0; }
          .photo { width: ${imgSize}; height: ${imgSize}; object-fit: cover; border-radius: 50%; flex-shrink: 0; }
          .summary { font-size: 0.875rem; color: #374151; margin-bottom: 1.5rem; line-height: 1.6; }
          .section { margin-top: 1.5rem; }
          .section-title { 
            font-size: 0.75rem; 
            font-weight: 700; 
            text-transform: uppercase; 
            color: #4b5563; 
            letter-spacing: 0.1em;
            margin-bottom: 0.75rem;
            padding-bottom: 0.25rem;
            border-bottom: 1px solid #d1d5db;
          }
          .edu-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem 1.5rem; }
          .edu-item h3 { font-size: 0.75rem; font-weight: 700; color: ${highlightColor}; text-transform: uppercase; }
          .edu-item p { font-size: 0.875rem; font-weight: 600; margin: 0.125rem 0; }
          .edu-item .date-gpa { display: flex; justify-between; font-size: 0.75rem; color: #6b7280; }
          .exp-item { margin-bottom: 0.75rem; }
          .exp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.25rem; }
          .exp-item h3 { font-size: 0.875rem; font-weight: 700; color: ${highlightColor}; }
          .exp-item .company { font-size: 0.75rem; font-weight: 600; }
          .exp-item .date { font-size: 0.75rem; color: ${highlightColor}; font-weight: 600; white-space: nowrap; margin-left: 1rem; }
          .exp-item ul { list-style-type: disc; padding-left: 1.5rem; margin-top: 0.25rem; }
          .exp-item li { font-size: 0.875rem; color: #374151; line-height: 1.5; margin: 0.125rem 0; }
          .skills-container { display: flex; flex-wrap: wrap; gap: 0.5rem; }
          .skill-tag { 
            font-size: 0.75rem; 
            border: 1px solid #9ca3af; 
            border-radius: 9999px; 
            padding: 0.25rem 0.75rem;
          }
          .project-item { margin-bottom: 0.75rem; }
          .project-item h3 { font-size: 0.875rem; font-weight: 700; color: ${highlightColor}; }
          .project-item .date { font-size: 0.75rem; color: #6b7280; font-weight: 600; margin-bottom: 0.25rem; }
          footer { margin-top: 2.5rem; text-align: center; font-size: 0.75rem; }
          footer a { color: #2563eb; font-weight: 700; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div>
              <h1>${escapeHtml(data.personalInfo.name)}</h1>
              <div class="contact-info">
                <p>${escapeHtml(data.personalInfo.phone)}</p>
                <p>${escapeHtml(data.personalInfo.email)}</p>
                <p>${escapeHtml(data.personalInfo.address)}</p>
              </div>
            </div>
            ${data.personalInfo.photoUrl ? `<img src="${escapeHtml(data.personalInfo.photoUrl)}" alt="Photo" class="photo" />` : ''}
          </header>

          <p class="summary">${escapeHtml(data.summary)}</p>

          ${data.education.length > 0 ? `
            <div class="section">
              <div class="section-title">Education</div>
              <div class="edu-grid">
                ${data.education.map(edu => `
                  <div class="edu-item">
                    <h3>${escapeHtml(edu.institution)}</h3>
                    <p>${escapeHtml(edu.degree)}</p>
                    <div class="date-gpa">
                      <span>${escapeHtml(edu.dateRange)}</span>
                      ${edu.gpa ? `<span>${escapeHtml(edu.gpa)}</span>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${data.workExperience.length > 0 ? `
            <div class="section">
              <div class="section-title">Work Experience</div>
              ${data.workExperience.map(exp => `
                <div class="exp-item">
                  <div class="exp-header">
                    <div>
                      <h3>${escapeHtml(exp.role)}</h3>
                      <p class="company">${escapeHtml(exp.company)}</p>
                    </div>
                    <p class="date">${escapeHtml(exp.dateRange)}</p>
                  </div>
                  <ul>
                    ${exp.responsibilities.map(resp => `<li>${escapeHtml(resp)}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${data.organizationalExperience.length > 0 ? `
            <div class="section">
              <div class="section-title">Organizational Experience</div>
              ${data.organizationalExperience.map(org => `
                <div class="exp-item">
                  <div class="exp-header">
                    <div>
                      <h3>${escapeHtml(org.role)}</h3>
                      <p class="company">${escapeHtml(org.company)}</p>
                    </div>
                    <p class="date">${escapeHtml(org.dateRange)}</p>
                  </div>
                  <ul>
                    ${org.responsibilities.map(resp => `<li>${escapeHtml(resp)}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${data.achievements.length > 0 ? `
            <div class="section">
              <div class="section-title">Achievement</div>
              ${data.achievements.map(ach => `
                <div class="exp-item">
                  <h3>${escapeHtml(ach.role)}</h3>
                  <p class="company">${escapeHtml(ach.company)}</p>
                  <ul>
                    ${ach.responsibilities.map(resp => `<li>${escapeHtml(resp)}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${data.projects.length > 0 ? `
            <div class="section">
              <div class="section-title">Project</div>
              ${data.projects.map(proj => `
                <div class="project-item">
                  <h3>${escapeHtml(proj.name)}</h3>
                  <p class="date">${escapeHtml(proj.date)}</p>
                  <ul>
                    ${proj.details.map(detail => `<li>${escapeHtml(detail)}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>
          ` : ''}

          ${data.skills.length > 0 ? `
            <div class="section">
              <div class="section-title">Skill</div>
              <div class="skills-container">
                ${data.skills.map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          ${data.languages.length > 0 ? `
            <div class="section">
              <div class="section-title">Language</div>
              <div class="skills-container">
                ${data.languages.map(lang => `<span class="skill-tag">${escapeHtml(lang)}</span>`).join('')}
              </div>
            </div>
          ` : ''}

          <footer>
            <p>My Portfolio - <a href="https://${escapeHtml(data.personalInfo.portfolio)}">${escapeHtml(data.personalInfo.portfolio)}</a></p>
          </footer>
        </div>
      </body>
    </html>
  `;
}

function generateTemplate2HTML(data: CVData, fontFamily: string, fontSize: string, imageSize: string): string {
  const imgSize = `${parseInt(imageSize) * 4}px`;
  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: ${fontFamily}, sans-serif;
            font-size: ${fontSize}pt;
            line-height: 1.4;
            color: #000;
            background: white;
          }
          .container { padding: 3rem; max-width: 800px; margin: 0 auto; }
          header { display: flex; align-items: center; gap: 2rem; margin-bottom: 1.5rem; }
          .photo { width: ${imgSize}; height: ${imgSize}; object-fit: cover; border-radius: 50%; flex-shrink: 0; }
          h1 { font-size: 1.875rem; font-weight: 700; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
          .contact-info p { margin: 0.125rem 0; }
          .section { margin-top: 1.25rem; }
          .section-title { 
            font-weight: 700; 
            text-transform: uppercase; 
            letter-spacing: 0.25em;
            margin-bottom: 0.25rem;
            padding-bottom: 0.25rem;
            border-bottom: 2px solid #000;
          }
          .section-content { margin-top: 0.5rem; }
          .section-item { display: grid; grid-template-columns: 1fr 2fr; gap: 1rem; margin-bottom: 1rem; }
          .section-item .left { font-weight: 700; }
          .section-item ul { list-style-type: disc; padding-left: 1.25rem; margin: 0.25rem 0; }
          .section-item li { margin: 0.125rem 0; }
          .skills-list { list-style-type: disc; padding-left: 1.25rem; margin-top: 0.5rem; }
          .skills-list li { margin: 0.125rem 0; }
          .gpa-right { text-align: right; font-weight: 700; margin-bottom: 0.25rem; }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            ${data.personalInfo.photoUrl ? `<img src="${escapeHtml(data.personalInfo.photoUrl)}" alt="${escapeHtml(data.personalInfo.name)}" class="photo" />` : ''}
            <div>
              <h1>${escapeHtml(data.personalInfo.name)}</h1>
              <div class="contact-info">
                <p>${escapeHtml(data.personalInfo.address)}</p>
                <p>${escapeHtml(data.personalInfo.phone)} | ${escapeHtml(data.personalInfo.email)} | ${escapeHtml(data.personalInfo.portfolio)}</p>
              </div>
            </div>
          </header>

          ${data.education.length > 0 ? `
            <div class="section">
              <div class="section-title">Education & Additional Courses</div>
              <div class="section-content">
                ${data.education.map(edu => `
                  <div class="section-item">
                    <div class="left">
                      <p><strong>${escapeHtml(edu.institution)}</strong></p>
                      <p>${escapeHtml(edu.degree)}</p>
                      <p>${escapeHtml(edu.dateRange)}</p>
                    </div>
                    <div>
                      ${edu.gpa ? `<p class="gpa-right">${escapeHtml(edu.gpa)}</p>` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${data.workExperience.length > 0 ? `
            <div class="section">
              <div class="section-title">Work Experiences</div>
              <div class="section-content">
                ${data.workExperience.map(exp => `
                  <div class="section-item">
                    <div class="left">
                      <p><strong>${escapeHtml(exp.role)}</strong></p>
                      <p>${escapeHtml(exp.company)}</p>
                      <p>${escapeHtml(exp.dateRange)}</p>
                    </div>
                    <div>
                      <ul>
                        ${exp.responsibilities.map(resp => `<li>${escapeHtml(resp)}</li>`).join('')}
                      </ul>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${data.projects.length > 0 ? `
            <div class="section">
              <div class="section-title">Projects</div>
              <div class="section-content">
                ${data.projects.map(proj => `
                  <div class="section-item">
                    <div class="left">
                      <p><strong>${escapeHtml(proj.name)}</strong></p>
                      <p>${escapeHtml(proj.date)}</p>
                    </div>
                    <div>
                      <ul>
                        ${proj.details.map(detail => `<li>${escapeHtml(detail)}</li>`).join('')}
                      </ul>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${data.achievements.length > 0 ? `
            <div class="section">
              <div class="section-title">Achievements</div>
              <div class="section-content">
                ${data.achievements.map(ach => `
                  <div class="section-item">
                    <div class="left">
                      <p><strong>${escapeHtml(ach.role)}</strong></p>
                      <p>${escapeHtml(ach.company)}</p>
                    </div>
                    <div>
                      <ul>
                        ${ach.responsibilities.map(resp => `<li>${escapeHtml(resp)}</li>`).join('')}
                      </ul>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${data.organizationalExperience.length > 0 ? `
            <div class="section">
              <div class="section-title">Volunteer Experience</div>
              <div class="section-content">
                ${data.organizationalExperience.map(org => `
                  <div class="section-item">
                    <div class="left">
                      <p><strong>${escapeHtml(org.role)}</strong></p>
                      <p>${escapeHtml(org.company)}</p>
                      <p>${escapeHtml(org.dateRange)}</p>
                    </div>
                    <div>
                      <ul>
                        ${org.responsibilities.map(resp => `<li>${escapeHtml(resp)}</li>`).join('')}
                      </ul>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${(data.languages.length > 0 || data.skills.length > 0) ? `
            <div class="section">
              <div class="section-title">Languages & Skills</div>
              <ul class="skills-list">
                ${data.languages.map(lang => `<li>${escapeHtml(lang)}</li>`).join('')}
                ${data.skills.map(skill => `<li>${escapeHtml(skill)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      </body>
    </html>
  `;
}

function generateTemplate3HTML(data: CVData, fontFamily: string, fontSize: string, highlightColor: string, imageSize: string): string {
  const imgSize = `${parseInt(imageSize) * 4}px`;
  
  const photoHTML = data.personalInfo.photoUrl ? `
    <img 
      src="${data.personalInfo.photoUrl}" 
      alt="${escapeHtml(data.personalInfo.name)}" 
      style="width: ${imgSize}; height: ${imgSize}; object-fit: cover; border-radius: 50%; flex-shrink: 0;"
    />
  ` : '';

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: ${fontFamily}, sans-serif;
            font-size: ${fontSize}pt;
            line-height: 1.5;
            color: #1f2937;
            background: white;
          }
          .container { padding: 2.5rem; max-width: 800px; margin: 0 auto; }
          header { margin-bottom: 1.5rem; }
          .header-content { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1rem; }
          .header-text { flex: 1; text-align: center; }
          .summary { font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem; }
          h1 { font-size: 2.25rem; font-weight: 700; color: #000; margin-bottom: 0.5rem; }
          .contact { font-size: 0.875rem; color: #4b5563; text-align: center; }
          .section { margin-top: 1rem; }
          .section-title { 
            font-size: 0.875rem;
            font-weight: 700; 
            color: ${highlightColor};
            letter-spacing: 0.05em;
            margin-bottom: 0.25rem;
            padding-bottom: 0.25rem;
            border-bottom: 1px solid #d1d5db;
          }
          .section-content { margin-top: 0.5rem; }
          .section-item { margin-bottom: 0.75rem; }
          .item-grid { display: grid; grid-template-columns: 3fr 1fr; gap: 1rem; }
          .item-grid .left p { margin: 0.125rem 0; }
          .item-grid .left .title { font-weight: 700; }
          .item-grid .left .subtitle { font-size: 0.875rem; }
          .item-grid .right { text-align: right; }
          .item-grid .right p { font-size: 0.875rem; font-weight: 500; }
          .section-item ul { list-style-type: disc; padding-left: 1rem; margin-top: 0.25rem; }
          .section-item li { margin: 0.125rem 0; color: #374151; }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <div class="header-content">
              ${photoHTML}
              <div class="header-text">
                ${data.summary ? `<p class="summary">${escapeHtml(data.summary)}</p>` : ''}
                <h1>${escapeHtml(data.personalInfo.name)}</h1>
              </div>
            </div>
            <p class="contact">
              ${escapeHtml(data.personalInfo.phone)} | ${escapeHtml(data.personalInfo.address)} | ${escapeHtml(data.personalInfo.email)} | ${escapeHtml(data.personalInfo.portfolio)}
            </p>
          </header>

          ${data.workExperience.length > 0 ? `
            <div class="section">
              <div class="section-title">Professional Experience</div>
              <div class="section-content">
                ${data.workExperience.map(exp => `
                  <div class="section-item">
                    <div class="item-grid">
                      <div class="left">
                        <p class="title">${escapeHtml(exp.role)}</p>
                        <p class="subtitle">${escapeHtml(exp.company)}</p>
                      </div>
                      <div class="right">
                        <p>${escapeHtml(exp.dateRange)}</p>
                      </div>
                    </div>
                    <ul>
                      ${exp.responsibilities.map(resp => `<li>${escapeHtml(resp)}</li>`).join('')}
                    </ul>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${data.education.length > 0 ? `
            <div class="section">
              <div class="section-title">Education</div>
              <div class="section-content">
                ${data.education.map(edu => `
                  <div class="section-item">
                    <div class="item-grid">
                      <div class="left">
                        <p class="title">${escapeHtml(edu.institution)}</p>
                        <p class="subtitle">${escapeHtml(edu.degree)}</p>
                      </div>
                      <div class="right">
                        <p>${escapeHtml(edu.dateRange)}</p>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${data.organizationalExperience.length > 0 ? `
            <div class="section">
              <div class="section-title">Organisational Experience</div>
              <div class="section-content">
                ${data.organizationalExperience.map(org => `
                  <div class="section-item">
                    <div class="item-grid">
                      <div class="left">
                        <p class="title">${escapeHtml(org.role)}</p>
                        <p class="subtitle">${escapeHtml(org.company)}</p>
                      </div>
                      <div class="right">
                        <p>${escapeHtml(org.dateRange)}</p>
                      </div>
                    </div>
                    <ul>
                      ${org.responsibilities.map(resp => `<li>${escapeHtml(resp)}</li>`).join('')}
                    </ul>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${data.achievements.length > 0 ? `
            <div class="section">
              <div class="section-title">Skills, Achievements & Other Experience</div>
              <div class="section-content">
                ${data.achievements.map(ach => `
                  <div class="section-item">
                    <div class="item-grid">
                      <div class="left">
                        <p class="title">${escapeHtml(ach.role)}</p>
                        <p class="subtitle">${escapeHtml(ach.company)}</p>
                      </div>
                      <div class="right">
                        <p>${escapeHtml(ach.dateRange)}</p>
                      </div>
                    </div>
                    <ul>
                      ${ach.responsibilities.map(resp => `<li>${escapeHtml(resp)}</li>`).join('')}
                    </ul>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </body>
    </html>
  `;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}