'use client';

import React from 'react';
import { CVData } from '@/types/types';
import { useLanguage } from '@/contexts/LanguageContext';

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <div className="mb-2">
    <h2 className="font-bold tracking-widest text-gray-500 uppercase">{title}</h2>
    <hr className="mt-1 border-gray-200" />
  </div>
);

interface Template1Props {
  data: CVData;
  isPreview?: boolean;
  fontFamily?: string;
  fontSize?: string;
  highlightColor?: string;
  imageSize?: string;
}

const Template1: React.FC<Template1Props> = ({ 
  data, 
  isPreview = false,
  fontFamily = 'Calibri',
  fontSize = '11',
  highlightColor = '#22c55e',
  imageSize = '20'
}) => {
  const { t } = useLanguage();
  const imageSizeClass = `w-${imageSize} h-${imageSize}`;
  
  return (
    <div 
      className="bg-white text-gray-800 p-10 max-w-4xl mx-auto"
      style={{ fontFamily: `${fontFamily}, sans-serif`, fontSize: `${fontSize}pt` }}
    >
      <header className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-4xl font-bold text-black tracking-normal">{data.personalInfo.name}</h1>
          <div className="mt-2 space-y-0.5 text-gray-500">
            <p>{data.personalInfo.phone}</p>
            <p>{data.personalInfo.email}</p>
            <p>{data.personalInfo.address}</p>
          </div>
        </div>
        {data.personalInfo.photoUrl && (
          <img 
            src={data.personalInfo.photoUrl} 
            alt={data.personalInfo.name} 
            className={`object-cover rounded-full flex-shrink-0`}
            style={{ width: `${parseInt(imageSize) * 4}px`, height: `${parseInt(imageSize) * 4}px` }}
          />
        )}
      </header>

      <p className="text-gray-700 mb-5">{data.summary}</p>

      {data.education.length > 0 && <section><SectionTitle title={t('educationSection')} />
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-2">
          {data.education.map((edu, index) => (
            <div key={index}>
              <h3 className="font-bold uppercase" style={{ color: highlightColor }}>{edu.institution}</h3>
              <p>{edu.degree}</p>
              <div className="flex justify-between text-gray-500 mt-0.5"><span>{edu.dateRange}</span><span>{edu.gpa}</span></div>
            </div>
          ))}
        </div>
      </section>}

      {data.workExperience.length > 0 && <section className="mt-5"><SectionTitle title={t('workExperienceSection')} />
        <div className="space-y-3 mt-2">
          {data.workExperience.map((exp, index) => (
            <div key={index}>
              <div className="flex justify-between items-start">
                <div><h3 className="font-bold" style={{ color: highlightColor }}>{exp.role}</h3><p>{exp.company}</p></div>
                <p className="font-semibold flex-shrink-0 ml-4" style={{ color: highlightColor }}>{exp.dateRange}</p>
              </div>
              <ul className="list-disc list-inside mt-1 text-gray-700 space-y-0.5 pl-2">
                {exp.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>}
      
      {data.organizationalExperience.length > 0 && <section className="mt-5"><SectionTitle title={t('organizationalSection')} />
        <div className="space-y-3 mt-2">
          {data.organizationalExperience.map((org, index) => (
            <div key={index}>
              <div className="flex justify-between items-start">
                <div><h3 className="font-bold" style={{ color: highlightColor }}>{org.role}</h3><p>{org.company}</p></div>
                <p className="font-semibold flex-shrink-0 ml-4" style={{ color: highlightColor }}>{org.dateRange}</p>
              </div>
              <ul className="list-disc list-inside mt-1 text-gray-700 space-y-0.5 pl-2">
                {org.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>}

      {data.achievements.length > 0 && <section className="mt-5"><SectionTitle title={t('achievementSection')} />
        <div className="space-y-3 mt-2">
          {data.achievements.map((ach, index) => (
            <div key={index}>
              <div><h3 className="font-bold" style={{ color: highlightColor }}>{ach.role}</h3><p>{ach.company}</p></div>
              <ul className="list-disc list-inside mt-1 text-gray-700 space-y-0.5 pl-2">
                {ach.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>}

      {data.projects.length > 0 && <section className="mt-5"><SectionTitle title={t('projectSection')} />
        <div className="space-y-3 mt-2">
          {data.projects.map((proj, index) => (
            <div key={index}>
              <div><h3 className="font-bold" style={{ color: highlightColor }}>{proj.name}</h3><p>{proj.date}</p></div>
              <ul className="list-disc list-inside mt-1 text-gray-700 space-y-0.5 pl-2">
                {proj.details.map((detail, i) => <li key={i}>{detail}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>}

      {data.skills.length > 0 && <section className="mt-5"><SectionTitle title={t('skillSection')} />
        <div className="flex flex-wrap gap-2 mt-2">
          {data.skills.map((skill, index) => (<span key={index} className="border border-gray-400 rounded-full px-3 py-1">{skill}</span>))}
        </div>
      </section>}

      {data.languages.length > 0 && <section className="mt-5"><SectionTitle title={t('languageSection')} />
        <div className="flex flex-wrap gap-2 mt-2">
          {data.languages.map((lang, index) => (<span key={index} className="border border-gray-400 rounded-full px-3 py-1">{lang}</span>))}
        </div>
      </section>}

      <footer className="mt-8 text-center">
        <p>{t('myPortfolio')} - 
          {isPreview ? (<span className="text-blue-600 font-bold"> {data.personalInfo.portfolio}</span>) 
          : (<a href={`https://${data.personalInfo.portfolio}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-bold"> {data.personalInfo.portfolio}</a>)}
        </p>
      </footer>
    </div>
  );
};

export default Template1;