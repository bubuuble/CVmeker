'use client';

import React, { useState } from 'react';
import { CVData, EducationEntry, ExperienceEntry, ProjectEntry } from '@/types/types';
import { useLanguage } from '@/contexts/LanguageContext';

type CvFormProps = {
  data: CVData;
  setData: React.Dispatch<React.SetStateAction<CVData | null>>;
};

type SectionKey = 'personal' | 'summary' | 'education' | 'work' | 'organization' | 'achievements' | 'projects' | 'skills';

const CvForm: React.FC<CvFormProps> = ({ data, setData }) => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<SectionKey>('personal');
  
  if (!data) return null;

  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prev => prev ? { ...prev, personalInfo: { ...prev.personalInfo, [name]: value } } : null);
  };
  
  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setData(prev => prev ? { ...prev, summary: e.target.value } : null);
  };

  const handleSimpleArrayChange = (section: keyof CVData, index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const array = data[section] as any[];
    const newArray = [...array];
    newArray[index] = { ...newArray[index], [name]: value };
    setData(prev => prev ? { ...prev, [section]: newArray } : null);
  };
  
  const handleListChange = (section: 'workExperience' | 'organizationalExperience' | 'achievements' | 'projects', index: number, value: string) => {
    const list = value.split('\n');
    const array = data[section] as any[];
    const newArray = [...array];
    const key = section === 'projects' ? 'details' : 'responsibilities';
    newArray[index] = { ...newArray[index], [key]: list };
    setData(prev => prev ? { ...prev, [section]: newArray } : null);
  };

  const handleCommaSeparatedChange = (section: 'skills' | 'languages', value: string) => {
    const newArray = value.split(',').map(item => item.trim()).filter(item => item);
    setData(prev => prev ? { ...prev, [section]: newArray } : null);
  }

  const handleSkillLanguageChange = (section: 'skills' | 'languages', index: number, value: string) => {
    const array = data[section] as string[];
    const newArray = [...array];
    newArray[index] = value;
    setData(prev => prev ? { ...prev, [section]: newArray } : null);
  };

  const addSkillLanguage = (section: 'skills' | 'languages') => {
    setData(prev => prev ? { ...prev, [section]: [...(prev[section] as string[]), ''] } : null);
  };

  const removeSkillLanguage = (section: 'skills' | 'languages', index: number) => {
    const array = data[section] as string[];
    setData(prev => prev ? { ...prev, [section]: array.filter((_, i) => i !== index) } : null);
  };
  
  const addEntry = (section: keyof CVData) => {
    let newEntry: any;
    switch(section) {
      case 'education':
        newEntry = { institution: '', degree: '', dateRange: '', gpa: '' } as EducationEntry;
        break;
      case 'workExperience':
      case 'organizationalExperience':
      case 'achievements':
        newEntry = { role: '', company: '', dateRange: '', responsibilities: [] } as ExperienceEntry;
        break;
      case 'projects':
        newEntry = { name: '', date: '', details: [] } as ProjectEntry;
        break;
      default: return;
    }
    setData(prev => prev ? { ...prev, [section]: [...(prev[section] as any[]), newEntry] } : null);
  };

  const removeEntry = (section: keyof CVData, index: number) => {
    const array = data[section] as any[];
    setData(prev => prev ? { ...prev, [section]: array.filter((_, i) => i !== index) } : null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setData(prev => prev ? {
          ...prev,
          personalInfo: { ...prev.personalInfo, photoUrl: reader.result as string }
        } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setData(prev => prev ? {
      ...prev,
      personalInfo: { ...prev.personalInfo, photoUrl: '' }
    } : null);
  };

  const sections = [
    { key: 'personal' as SectionKey, label: t('personal') },
    { key: 'summary' as SectionKey, label: t('summary') },
    { key: 'education' as SectionKey, label: t('education') },
    { key: 'work' as SectionKey, label: t('work') },
    { key: 'organization' as SectionKey, label: t('organization') },
    { key: 'achievements' as SectionKey, label: t('achievements') },
    { key: 'projects' as SectionKey, label: t('projects') },
    { key: 'skills' as SectionKey, label: t('skills') },
  ];

  return (
    <div className="relative h-full flex flex-col">
      {/* Header */}
      <div className="border-b px-5 sm:px-6 py-5">
        <h2 className="text-lg font-extrabold tracking-tight text-foreground">
          {t('resumeBuilder')}
        </h2>
        <h1 className="mt-0.5 text-sm font-normal text-muted-foreground">
          {t('deleteOrLeave')}
        </h1>
      </div>

      {/* Horizontal Navigation Bar */}
      <div className="border-b bg-secondary/50 px-2 sm:px-3">
        <div className="flex gap-1 overflow-x-auto py-2" style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: 'hsl(var(--border)) transparent'
        }}>
          {sections.map(section => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`
                relative px-3.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200
                ${activeSection === section.key 
                  ? 'text-primary bg-card shadow-sm ring-1 ring-border' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-card/70'
                }
              `}
            >
              {section.label}
              {activeSection === section.key && (
                <div className="hidden" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area with Smooth Transitions */}
      <div className="flex-1 overflow-y-auto p-5 sm:p-6" style={{ 
        scrollbarWidth: 'thin',
        scrollbarColor: 'hsl(var(--border)) transparent'
      }}>
        <div className="max-w-4xl mx-auto">
          
          {/* Personal Information */}
          <div className={`transition-all duration-500 ${activeSection === 'personal' ? 'opacity-100 translate-y-0 block' : 'hidden opacity-0 translate-y-4'}`}>
            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2">{t('profilePhoto')}</label>
                {data.personalInfo.photoUrl ? (
                  <div className="relative inline-block">
                    <img src={data.personalInfo.photoUrl} alt="Profile" className="w-28 h-28 object-cover rounded-2xl border shadow-sm" />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-600 text-white text-sm shadow hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-muted-foreground file:mr-4 file:h-10 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/15 file:transition-colors file:cursor-pointer"
                  />
                )}
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{t('name')}</label>
                <input 
                  type="text" 
                  name="name"
                  value={data.personalInfo.name || ''}
                  onChange={handlePersonalInfoChange}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{t('jobTitle')}</label>
                <input
                  type="text"
                  name="title"
                  value={data.personalInfo.title || ''}
                  onChange={handlePersonalInfoChange}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{t('email')}</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={data.personalInfo.email || ''} 
                    onChange={handlePersonalInfoChange} 
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{t('phone')}</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={data.personalInfo.phone || ''} 
                    onChange={handlePersonalInfoChange} 
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{t('address')}</label>
                <input 
                  type="text" 
                  name="address" 
                  value={data.personalInfo.address || ''} 
                  onChange={handlePersonalInfoChange} 
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-1.5">{t('portfolio')}</label>
                <input 
                  type="text" 
                  name="portfolio" 
                  value={data.personalInfo.portfolio || ''} 
                  onChange={handlePersonalInfoChange} 
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className={`transition-all duration-500 ${activeSection === 'summary' ? 'opacity-100 translate-y-0 block' : 'hidden opacity-0 translate-y-4'}`}>
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-muted-foreground">{t('professionalSummary')}</label>
              <textarea 
                rows={8} 
                value={data.summary || ''} 
                onChange={handleSummaryChange} 
                placeholder="Describe your professional background, key achievements, and career objectives..."
                className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm text-foreground leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
              />
            </div>
          </div>

          {/* Education */}
          <div className={`transition-all duration-500 ${activeSection === 'education' ? 'opacity-100 translate-y-0 block' : 'hidden opacity-0 translate-y-4'}`}>
            <div className="space-y-6">
              {data.education.map((edu, index) => (
                <div key={index} className="relative rounded-xl border bg-secondary/40 p-4 pr-12 sm:p-5 sm:pr-12">
                  <button 
                    onClick={() => removeEntry('education', index)} 
                    className="absolute top-3 right-3 w-7 h-7 rounded-full border bg-card text-muted-foreground text-base leading-none hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center"
                  >
                    ×
                  </button>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Institution</label>
                      <input 
                        type="text" 
                        name="institution" 
                        value={edu.institution || ''} 
                        onChange={(e) => handleSimpleArrayChange('education', index, e)} 
                        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Degree</label>
                        <input 
                          type="text" 
                          name="degree" 
                          value={edu.degree || ''} 
                          onChange={(e) => handleSimpleArrayChange('education', index, e)} 
                          className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Date Range</label>
                        <input 
                          type="text" 
                          name="dateRange" 
                          value={edu.dateRange || ''} 
                          onChange={(e) => handleSimpleArrayChange('education', index, e)} 
                          className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">GPA (Optional)</label>
                      <input 
                        type="text" 
                        name="gpa" 
                        value={edu.gpa || ''} 
                        onChange={(e) => handleSimpleArrayChange('education', index, e)} 
                        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => addEntry('education')} 
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                <span>+</span> Add Education
              </button>
            </div>
          </div>

          {/* Work Experience */}
          <div className={`transition-all duration-500 ${activeSection === 'work' ? 'opacity-100 translate-y-0 block' : 'hidden opacity-0 translate-y-4'}`}>
            <div className="space-y-6">
              {(data.workExperience as ExperienceEntry[]).map((entry, index) => (
                <div key={index} className="relative rounded-xl border bg-secondary/40 p-4 pr-12 sm:p-5 sm:pr-12">
                  <button 
                    onClick={() => removeEntry('workExperience', index)} 
                    className="absolute top-3 right-3 w-7 h-7 rounded-full border bg-card text-muted-foreground text-base leading-none hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center"
                  >
                    ×
                  </button>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Role / Position</label>
                        <input 
                          type="text" 
                          name="role" 
                          value={entry.role || ''} 
                          onChange={(e) => handleSimpleArrayChange('workExperience', index, e)} 
                          className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Date Range</label>
                        <input 
                          type="text" 
                          name="dateRange" 
                          value={entry.dateRange || ''} 
                          onChange={(e) => handleSimpleArrayChange('workExperience', index, e)} 
                          className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Company / Organization</label>
                      <input 
                        type="text" 
                        name="company" 
                        value={entry.company || ''} 
                        onChange={(e) => handleSimpleArrayChange('workExperience', index, e)} 
                        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Responsibilities</label>
                      <textarea 
                        rows={4} 
                        value={entry.responsibilities.join('\n')} 
                        onChange={(e) => handleListChange('workExperience', index, e.target.value)} 
                        placeholder="One responsibility per line..."
                        className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm text-foreground leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => addEntry('workExperience')} 
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                <span>+</span> Add Work Experience
              </button>
            </div>
          </div>

          {/* Organizational Experience */}
          <div className={`transition-all duration-500 ${activeSection === 'organization' ? 'opacity-100 translate-y-0 block' : 'hidden opacity-0 translate-y-4'}`}>
            <div className="space-y-6">
              {(data.organizationalExperience as ExperienceEntry[]).map((entry, index) => (
                <div key={index} className="relative rounded-xl border bg-secondary/40 p-4 pr-12 sm:p-5 sm:pr-12">
                  <button 
                    onClick={() => removeEntry('organizationalExperience', index)} 
                    className="absolute top-3 right-3 w-7 h-7 rounded-full border bg-card text-muted-foreground text-base leading-none hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center"
                  >
                    ×
                  </button>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Role / Position</label>
                        <input 
                          type="text" 
                          name="role" 
                          value={entry.role || ''} 
                          onChange={(e) => handleSimpleArrayChange('organizationalExperience', index, e)} 
                          className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Date Range</label>
                        <input 
                          type="text" 
                          name="dateRange" 
                          value={entry.dateRange || ''} 
                          onChange={(e) => handleSimpleArrayChange('organizationalExperience', index, e)} 
                          className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Organization</label>
                      <input 
                        type="text" 
                        name="company" 
                        value={entry.company || ''} 
                        onChange={(e) => handleSimpleArrayChange('organizationalExperience', index, e)} 
                        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Responsibilities</label>
                      <textarea 
                        rows={4} 
                        value={entry.responsibilities.join('\n')} 
                        onChange={(e) => handleListChange('organizationalExperience', index, e.target.value)} 
                        placeholder="One responsibility per line..."
                        className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm text-foreground leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => addEntry('organizationalExperience')} 
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                <span>+</span> Add Organization
              </button>
            </div>
          </div>

          {/* Achievements */}
          <div className={`transition-all duration-500 ${activeSection === 'achievements' ? 'opacity-100 translate-y-0 block' : 'hidden opacity-0 translate-y-4'}`}>
            <div className="space-y-6">
              {(data.achievements as ExperienceEntry[]).map((entry, index) => (
                <div key={index} className="relative rounded-xl border bg-secondary/40 p-4 pr-12 sm:p-5 sm:pr-12">
                  <button 
                    onClick={() => removeEntry('achievements', index)} 
                    className="absolute top-3 right-3 w-7 h-7 rounded-full border bg-card text-muted-foreground text-base leading-none hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center"
                  >
                    ×
                  </button>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Title</label>
                        <input 
                          type="text" 
                          name="role" 
                          value={entry.role || ''} 
                          onChange={(e) => handleSimpleArrayChange('achievements', index, e)} 
                          className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Date</label>
                        <input 
                          type="text" 
                          name="dateRange" 
                          value={entry.dateRange || ''} 
                          onChange={(e) => handleSimpleArrayChange('achievements', index, e)} 
                          className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Issuer / Organization</label>
                      <input 
                        type="text" 
                        name="company" 
                        value={entry.company || ''} 
                        onChange={(e) => handleSimpleArrayChange('achievements', index, e)} 
                        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Details</label>
                      <textarea 
                        rows={3} 
                        value={entry.responsibilities.join('\n')} 
                        onChange={(e) => handleListChange('achievements', index, e.target.value)} 
                        placeholder="One detail per line..."
                        className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm text-foreground leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => addEntry('achievements')} 
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                <span>+</span> Add Achievement
              </button>
            </div>
          </div>

          {/* Projects */}
          <div className={`transition-all duration-500 ${activeSection === 'projects' ? 'opacity-100 translate-y-0 block' : 'hidden opacity-0 translate-y-4'}`}>
            <div className="space-y-6">
              {(data.projects as ProjectEntry[]).map((entry, index) => (
                <div key={index} className="relative rounded-xl border bg-secondary/40 p-4 pr-12 sm:p-5 sm:pr-12">
                  <button 
                    onClick={() => removeEntry('projects', index)} 
                    className="absolute top-3 right-3 w-7 h-7 rounded-full border bg-card text-muted-foreground text-base leading-none hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center"
                  >
                    ×
                  </button>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Project Name</label>
                        <input 
                          type="text" 
                          name="name" 
                          value={entry.name || ''} 
                          onChange={(e) => handleSimpleArrayChange('projects', index, e)} 
                          className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Date</label>
                        <input 
                          type="text" 
                          name="date" 
                          value={entry.date || ''} 
                          onChange={(e) => handleSimpleArrayChange('projects', index, e)} 
                          className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1.5">Project Details</label>
                      <textarea 
                        rows={4} 
                        value={entry.details.join('\n')} 
                        onChange={(e) => handleListChange('projects', index, e.target.value)} 
                        placeholder="One detail per line..."
                        className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-sm text-foreground leading-relaxed placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => addEntry('projects')} 
                className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
              >
                <span>+</span> Add Project
              </button>
            </div>
          </div>

          {/* Skills & Languages */}
          <div className={`transition-all duration-500 ${activeSection === 'skills' ? 'opacity-100 translate-y-0 block' : 'hidden opacity-0 translate-y-4'}`}>
            <div className="space-y-8">
              {/* Skills */}
              <div>
                <h4 className="text-sm font-bold text-foreground mb-3">Skills</h4>
                <div className="space-y-3">
                  {(data.skills as string[]).map((skill, index) => (
                    <div key={index} className="relative rounded-xl border bg-secondary/40 p-4 pr-12">
                      <button 
                        onClick={() => removeSkillLanguage('skills', index)} 
                        className="absolute top-3 right-3 w-7 h-7 rounded-full border bg-card text-muted-foreground text-base leading-none hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center"
                      >
                        ×
                      </button>
                      <input 
                        type="text" 
                        value={skill} 
                        onChange={(e) => handleSkillLanguageChange('skills', index, e.target.value)} 
                        placeholder="e.g. JavaScript, React, Python..."
                        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                      />
                    </div>
                  ))}
                  <button 
                    onClick={() => addSkillLanguage('skills')} 
                    className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
                  >
                    <span>+</span> Add Skill
                  </button>
                </div>
              </div>

              {/* Languages */}
              <div>
                <h4 className="text-sm font-bold text-foreground mb-3">Languages</h4>
                <div className="space-y-3">
                  {(data.languages as string[]).map((language, index) => (
                    <div key={index} className="relative rounded-xl border bg-secondary/40 p-4 pr-12">
                      <button 
                        onClick={() => removeSkillLanguage('languages', index)} 
                        className="absolute top-3 right-3 w-7 h-7 rounded-full border bg-card text-muted-foreground text-base leading-none hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors flex items-center justify-center"
                      >
                        ×
                      </button>
                      <input 
                        type="text" 
                        value={language} 
                        onChange={(e) => handleSkillLanguageChange('languages', index, e.target.value)} 
                        placeholder="e.g. English, Spanish, French..."
                        className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition"
                      />
                    </div>
                  ))}
                  <button 
                    onClick={() => addSkillLanguage('languages')} 
                    className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-dashed border-primary/40 bg-primary/5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
                  >
                    <span>+</span> Add Language
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CvForm;
