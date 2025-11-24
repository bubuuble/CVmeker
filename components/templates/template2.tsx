'use client';

import React from 'react';
import { CVData } from '@/types/types';
import { useLanguage } from '@/contexts/LanguageContext';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div>
    <h2 className="font-bold tracking-[.25em] text-black uppercase">{children}</h2>
    <hr className="mt-1 border-black border-t-2" />
  </div>
);

interface Template2Props {
  data: CVData;
  isPreview?: boolean;
  fontFamily?: string;
  fontSize?: string;
  highlightColor?: string;
  imageSize?: string;
}

const Template2: React.FC<Template2Props> = ({ 
  data, 
  isPreview = false,
  fontFamily = 'Arial',
  fontSize = '10.5',
  imageSize = '28' // 112px
}) => {
  const { t } = useLanguage();
  
  return (
    <div 
      className="bg-white text-black p-12 max-w-4xl mx-auto"
      style={{ fontFamily: `${fontFamily}, sans-serif`, fontSize: `${fontSize}pt`, lineHeight: '1.4' }}
    >
      <header className="flex items-center gap-8 mb-6">
        {data.personalInfo.photoUrl && (
          <img 
            src={data.personalInfo.photoUrl} 
            alt={data.personalInfo.name} 
            className={`object-cover rounded-full flex-shrink-0`}
            style={{ width: `${parseInt(imageSize) * 4}px`, height: `${parseInt(imageSize) * 4}px` }}
          />
        )}
        <div>
          <h1 className="text-3xl font-bold tracking-wider">{data.personalInfo.name}</h1>
          <p className="mt-1">{data.personalInfo.address}</p>
          <p>{data.personalInfo.phone} | {data.personalInfo.email} | {data.personalInfo.portfolio}</p>
        </div>
      </header>

      {(['education', 'workExperience', 'projects', 'achievements', 'organizationalExperience'] as const).map(sectionKey => {
        const sectionData = data[sectionKey];
        if (!sectionData || sectionData.length === 0) return null;
        
        // Custom titles for display
        const titles = {
            education: t('educationCourses'),
            workExperience: t('workExperiences'),
            projects: t('projectSection'),
            achievements: t('achievementSection'),
            organizationalExperience: t('volunteerExperience'),
        };

        return (
          <section key={sectionKey} className="mt-5">
            <SectionTitle>{titles[sectionKey]}</SectionTitle>
            <div className="mt-2 space-y-4">
              {sectionData.map((item: any, index: number) => (
                <div key={index} className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <p className="font-bold">{item.institution || item.role || item.name}</p>
                    <p>{item.degree || item.company || item.date}</p>
                    <p>{item.dateRange}</p>
                  </div>
                  <div className="col-span-2">
                    {item.gpa && <p className="font-bold text-right">{item.gpa}</p>}
                    <ul className="list-disc list-inside space-y-1">
                      {(item.responsibilities || item.details || []).map((point: string, i: number) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      {(data.languages.length > 0 || data.skills.length > 0) && (
        <section className="mt-5">
          <SectionTitle>{t('languagesSkills')}</SectionTitle>
          <ul className="list-disc list-inside mt-2 space-y-1">
            {data.languages.map((lang, i) => <li key={i}>{lang}</li>)}
            {data.skills.map((skill, i) => <li key={i}>{skill}</li>)}
          </ul>
        </section>
      )}
    </div>
  );
};

export default Template2;