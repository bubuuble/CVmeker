'use client';

import React from 'react';
import { CVData } from '@/types/types';
import { useLanguage } from '@/contexts/LanguageContext';

const SectionTitle: React.FC<{ title: string; highlightColor: string }> = ({ title, highlightColor }) => (
  <div>
    <h2 className="text-sm font-bold tracking-wider" style={{ color: highlightColor }}>{title}</h2>
    <hr className="mt-1 border-gray-300" />
  </div>
);

interface Template3Props {
  data: CVData;
  isPreview?: boolean;
  fontFamily?: string;
  fontSize?: string;
  highlightColor?: string;
  imageSize?: string;
}

const Template3: React.FC<Template3Props> = ({ 
  data, 
  isPreview = false,
  fontFamily = 'Arial',
  fontSize = '10',
  highlightColor = '#3b82f6', // A nice default blue
  imageSize = '28' // 112px - same as template2
}) => {
  const { t } = useLanguage();
  
  return (
    <div 
      className="bg-white text-gray-800 p-10 max-w-4xl mx-auto"
      style={{ fontFamily: `${fontFamily}, sans-serif`, fontSize: `${fontSize}pt`, lineHeight: '1.5' }}
    >
      <header className="mb-6">
        <div className="flex items-center gap-6 mb-4">
          {data.personalInfo.photoUrl && (
            <img 
              src={data.personalInfo.photoUrl} 
              alt={data.personalInfo.name} 
              className={`object-cover rounded-full flex-shrink-0`}
              style={{ width: `${parseInt(imageSize) * 4}px`, height: `${parseInt(imageSize) * 4}px` }}
            />
          )}
          <div className="flex-1 text-center">
            {data.summary && <p className="text-sm text-gray-500 mb-2">{data.summary}</p>}
            <h1 className="text-4xl font-bold text-black tracking-normal">{data.personalInfo.name}</h1>
          </div>
        </div>
        <p className="text-sm text-gray-600 text-center">
          {data.personalInfo.phone} | {data.personalInfo.address} | {data.personalInfo.email} | {data.personalInfo.portfolio}
        </p>
      </header>

      {(['workExperience', 'education', 'organizationalExperience', 'achievements'] as const).map(sectionKey => {
        const sectionData = data[sectionKey];
        if (!sectionData || sectionData.length === 0) return null;
        
        const titles = {
            workExperience: t('professionalExperience'),
            education: t('educationSection'),
            organizationalExperience: t('organisationalExperience'),
            achievements: t('skillsAchievements'),
        };

        return (
          <section key={sectionKey} className="mt-4">
            <SectionTitle title={titles[sectionKey]} highlightColor={highlightColor} />
            <div className="mt-2 space-y-3">
              {sectionData.map((item: any, index: number) => (
                <div key={index}>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3">
                      <p className="font-bold">{item.institution || item.role}</p>
                      <p className="text-sm">{item.degree || item.company}</p>
                    </div>
                    <div className="col-span-1 text-right">
                      <p className="text-sm font-medium">{item.dateRange}</p>
                    </div>
                  </div>
                  <ul className="list-disc list-inside mt-1 space-y-1 pl-4 text-gray-700">
                    {(item.responsibilities || item.details || []).map((point: string, i: number) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Template3;