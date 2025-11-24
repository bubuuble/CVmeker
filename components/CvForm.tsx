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
    <div className="relative h-full flex flex-col" style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Header */}
      <div className="border-b border-stone-300 px-6 py-4">
        <h2 className="text-xl font-light tracking-wide text-stone-800" style={{ letterSpacing: '0.05em' }}>
          {t('resumeBuilder')}
        </h2>
        <h1 className="text-l font-light tracking-wide text-stone-800" style={{ letterSpacing: '0.05em' }}>
          {t('deleteOrLeave')}
        </h1>
      </div>

      {/* Horizontal Navigation Bar */}
      <div className="border-b border-stone-200 bg-stone-50/50">
        <div className="flex overflow-x-auto" style={{ 
          scrollbarWidth: 'thin',
          scrollbarColor: '#3b82f6 transparent'
        }}>
          {sections.map(section => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`
                relative px-6 py-3 text-sm uppercase tracking-wider whitespace-nowrap transition-all duration-300
                ${activeSection === section.key 
                  ? 'text-blue-700 bg-white' 
                  : 'text-stone-600 hover:text-stone-800 hover:bg-stone-100/50'
                }
              `}
              style={{ letterSpacing: '0.1em' }}
            >
              {section.label}
              {activeSection === section.key && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-700" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area with Smooth Transitions */}
      <div className="flex-1 overflow-y-auto p-6" style={{ 
        scrollbarWidth: 'thin',
        scrollbarColor: '#3b82f6 transparent'
      }}>
        <div className="max-w-4xl mx-auto">
          
          {/* Personal Information */}
          <div className={`transition-all duration-500 ${activeSection === 'personal' ? 'opacity-100 translate-y-0 block' : 'hidden opacity-0 translate-y-4'}`}>
            <div className="space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-600 mb-3" style={{ letterSpacing: '0.12em' }}>{t('profilePhoto')}</label>
                {data.personalInfo.photoUrl ? (
                  <div className="relative inline-block">
                    <img src={data.personalInfo.photoUrl} alt="Profile" className="w-32 h-32 object-cover border-2 border-stone-300" />
                    <button
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white text-sm hover:bg-red-700 transition-colors flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-stone-600 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:uppercase file:tracking-widest file:bg-stone-800 file:text-white hover:file:bg-blue-700 file:transition-colors"
                  />
                )}
              </div>
              
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>{t('name')}</label>
                <input 
                  type="text" 
                  name="name" 
                  value={data.personalInfo.name || ''} 
                  onChange={handlePersonalInfoChange} 
                  className="w-full px-0 py-2 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800 transition-colors"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>{t('email')}</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={data.personalInfo.email || ''} 
                    onChange={handlePersonalInfoChange} 
                    className="w-full px-0 py-2 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>{t('phone')}</label>
                  <input 
                    type="tel" 
                    name="phone" 
                    value={data.personalInfo.phone || ''} 
                    onChange={handlePersonalInfoChange} 
                    className="w-full px-0 py-2 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>{t('address')}</label>
                <input 
                  type="text" 
                  name="address" 
                  value={data.personalInfo.address || ''} 
                  onChange={handlePersonalInfoChange} 
                  className="w-full px-0 py-2 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>{t('portfolio')}</label>
                <input 
                  type="text" 
                  name="portfolio" 
                  value={data.personalInfo.portfolio || ''} 
                  onChange={handlePersonalInfoChange} 
                  className="w-full px-0 py-2 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className={`transition-all duration-500 ${activeSection === 'summary' ? 'opacity-100 translate-y-0 block' : 'hidden opacity-0 translate-y-4'}`}>
            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-widest text-stone-600" style={{ letterSpacing: '0.12em' }}>{t('professionalSummary')}</label>
              <textarea 
                rows={8} 
                value={data.summary || ''} 
                onChange={handleSummaryChange} 
                placeholder="Describe your professional background, key achievements, and career objectives..."
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600/20 text-stone-800 leading-relaxed transition-all"
              />
            </div>
          </div>

          {/* Education */}
          <div className={`transition-all duration-500 ${activeSection === 'education' ? 'opacity-100 translate-y-0 block' : 'hidden opacity-0 translate-y-4'}`}>
            <div className="space-y-6">
              {data.education.map((edu, index) => (
                <div key={index} className="relative bg-stone-50/50 border-l-2 border-blue-600 pl-5 pr-4 py-4">
                  <button 
                    onClick={() => removeEntry('education', index)} 
                    className="absolute -top-2 -right-2 w-6 h-6 bg-stone-800 text-white text-sm hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    ×
                  </button>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>Institution</label>
                      <input 
                        type="text" 
                        name="institution" 
                        value={edu.institution || ''} 
                        onChange={(e) => handleSimpleArrayChange('education', index, e)} 
                        className="w-full px-0 py-1 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>Degree</label>
                        <input 
                          type="text" 
                          name="degree" 
                          value={edu.degree || ''} 
                          onChange={(e) => handleSimpleArrayChange('education', index, e)} 
                          className="w-full px-0 py-1 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>Date Range</label>
                        <input 
                          type="text" 
                          name="dateRange" 
                          value={edu.dateRange || ''} 
                          onChange={(e) => handleSimpleArrayChange('education', index, e)} 
                          className="w-full px-0 py-1 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>GPA (Optional)</label>
                      <input 
                        type="text" 
                        name="gpa" 
                        value={edu.gpa || ''} 
                        onChange={(e) => handleSimpleArrayChange('education', index, e)} 
                        className="w-full px-0 py-1 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => addEntry('education')} 
                className="inline-flex items-center gap-2 px-5 py-2 text-xs uppercase tracking-widest bg-stone-800 text-white hover:bg-blue-700 transition-colors"
                style={{ letterSpacing: '0.15em' }}
              >
                <span>+</span> Add Education
              </button>
            </div>
          </div>

          {/* Work Experience */}
          <div className={`transition-all duration-500 ${activeSection === 'work' ? 'opacity-100 translate-y-0 block' : 'hidden opacity-0 translate-y-4'}`}>
            <div className="space-y-6">
              {(data.workExperience as ExperienceEntry[]).map((entry, index) => (
                <div key={index} className="relative bg-stone-50/50 border-l-2 border-blue-600 pl-5 pr-4 py-4">
                  <button 
                    onClick={() => removeEntry('workExperience', index)} 
                    className="absolute -top-2 -right-2 w-6 h-6 bg-stone-800 text-white text-sm hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    ×
                  </button>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>Role / Position</label>
                        <input 
                          type="text" 
                          name="role" 
                          value={entry.role || ''} 
                          onChange={(e) => handleSimpleArrayChange('workExperience', index, e)} 
                          className="w-full px-0 py-1 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>Date Range</label>
                        <input 
                          type="text" 
                          name="dateRange" 
                          value={entry.dateRange || ''} 
                          onChange={(e) => handleSimpleArrayChange('workExperience', index, e)} 
                          className="w-full px-0 py-1 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>Company / Organization</label>
                      <input 
                        type="text" 
                        name="company" 
                        value={entry.company || ''} 
                        onChange={(e) => handleSimpleArrayChange('workExperience', index, e)} 
                        className="w-full px-0 py-1 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>Responsibilities</label>
                      <textarea 
                        rows={4} 
                        value={entry.responsibilities.join('\n')} 
                        onChange={(e) => handleListChange('workExperience', index, e.target.value)} 
                        placeholder="One responsibility per line..."
                        className="w-full px-4 py-3 bg-white border border-stone-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600/20 text-stone-800 text-sm leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => addEntry('workExperience')} 
                className="inline-flex items-center gap-2 px-5 py-2 text-xs uppercase tracking-widest bg-stone-800 text-white hover:bg-blue-700 transition-colors"
                style={{ letterSpacing: '0.15em' }}
              >
                <span>+</span> Add Work Experience
              </button>
            </div>
          </div>

          {/* Organizational Experience */}
          <div className={`transition-all duration-500 ${activeSection === 'organization' ? 'opacity-100 translate-y-0 block' : 'hidden opacity-0 translate-y-4'}`}>
            <div className="space-y-6">
              {(data.organizationalExperience as ExperienceEntry[]).map((entry, index) => (
                <div key={index} className="relative bg-stone-50/50 border-l-2 border-blue-600 pl-5 pr-4 py-4">
                  <button 
                    onClick={() => removeEntry('organizationalExperience', index)} 
                    className="absolute -top-2 -right-2 w-6 h-6 bg-stone-800 text-white text-sm hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    ×
                  </button>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>Role / Position</label>
                        <input 
                          type="text" 
                          name="role" 
                          value={entry.role || ''} 
                          onChange={(e) => handleSimpleArrayChange('organizationalExperience', index, e)} 
                          className="w-full px-0 py-1 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>Date Range</label>
                        <input 
                          type="text" 
                          name="dateRange" 
                          value={entry.dateRange || ''} 
                          onChange={(e) => handleSimpleArrayChange('organizationalExperience', index, e)} 
                          className="w-full px-0 py-1 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>Organization</label>
                      <input 
                        type="text" 
                        name="company" 
                        value={entry.company || ''} 
                        onChange={(e) => handleSimpleArrayChange('organizationalExperience', index, e)} 
                        className="w-full px-0 py-1 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>Responsibilities</label>
                      <textarea 
                        rows={4} 
                        value={entry.responsibilities.join('\n')} 
                        onChange={(e) => handleListChange('organizationalExperience', index, e.target.value)} 
                        placeholder="One responsibility per line..."
                        className="w-full px-4 py-3 bg-white border border-stone-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600/20 text-stone-800 text-sm leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => addEntry('organizationalExperience')} 
                className="inline-flex items-center gap-2 px-5 py-2 text-xs uppercase tracking-widest bg-stone-800 text-white hover:bg-blue-700 transition-colors"
                style={{ letterSpacing: '0.15em' }}
              >
                <span>+</span> Add Organization
              </button>
            </div>
          </div>

          {/* Achievements */}
          <div className={`transition-all duration-500 ${activeSection === 'achievements' ? 'opacity-100 translate-y-0 block' : 'hidden opacity-0 translate-y-4'}`}>
            <div className="space-y-6">
              {(data.achievements as ExperienceEntry[]).map((entry, index) => (
                <div key={index} className="relative bg-stone-50/50 border-l-2 border-blue-600 pl-5 pr-4 py-4">
                  <button 
                    onClick={() => removeEntry('achievements', index)} 
                    className="absolute -top-2 -right-2 w-6 h-6 bg-stone-800 text-white text-sm hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    ×
                  </button>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>Title</label>
                        <input 
                          type="text" 
                          name="role" 
                          value={entry.role || ''} 
                          onChange={(e) => handleSimpleArrayChange('achievements', index, e)} 
                          className="w-full px-0 py-1 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>Date</label>
                        <input 
                          type="text" 
                          name="dateRange" 
                          value={entry.dateRange || ''} 
                          onChange={(e) => handleSimpleArrayChange('achievements', index, e)} 
                          className="w-full px-0 py-1 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>Issuer / Organization</label>
                      <input 
                        type="text" 
                        name="company" 
                        value={entry.company || ''} 
                        onChange={(e) => handleSimpleArrayChange('achievements', index, e)} 
                        className="w-full px-0 py-1 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>Details</label>
                      <textarea 
                        rows={3} 
                        value={entry.responsibilities.join('\n')} 
                        onChange={(e) => handleListChange('achievements', index, e.target.value)} 
                        placeholder="One detail per line..."
                        className="w-full px-4 py-3 bg-white border border-stone-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600/20 text-stone-800 text-sm leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => addEntry('achievements')} 
                className="inline-flex items-center gap-2 px-5 py-2 text-xs uppercase tracking-widest bg-stone-800 text-white hover:bg-blue-700 transition-colors"
                style={{ letterSpacing: '0.15em' }}
              >
                <span>+</span> Add Achievement
              </button>
            </div>
          </div>

          {/* Projects */}
          <div className={`transition-all duration-500 ${activeSection === 'projects' ? 'opacity-100 translate-y-0 block' : 'hidden opacity-0 translate-y-4'}`}>
            <div className="space-y-6">
              {(data.projects as ProjectEntry[]).map((entry, index) => (
                <div key={index} className="relative bg-stone-50/50 border-l-2 border-blue-600 pl-5 pr-4 py-4">
                  <button 
                    onClick={() => removeEntry('projects', index)} 
                    className="absolute -top-2 -right-2 w-6 h-6 bg-stone-800 text-white text-sm hover:bg-red-600 transition-colors flex items-center justify-center"
                  >
                    ×
                  </button>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>Project Name</label>
                        <input 
                          type="text" 
                          name="name" 
                          value={entry.name || ''} 
                          onChange={(e) => handleSimpleArrayChange('projects', index, e)} 
                          className="w-full px-0 py-1 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>Date</label>
                        <input 
                          type="text" 
                          name="date" 
                          value={entry.date || ''} 
                          onChange={(e) => handleSimpleArrayChange('projects', index, e)} 
                          className="w-full px-0 py-1 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-stone-600 mb-2" style={{ letterSpacing: '0.12em' }}>Project Details</label>
                      <textarea 
                        rows={4} 
                        value={entry.details.join('\n')} 
                        onChange={(e) => handleListChange('projects', index, e.target.value)} 
                        placeholder="One detail per line..."
                        className="w-full px-4 py-3 bg-white border border-stone-200 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600/20 text-stone-800 text-sm leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button 
                onClick={() => addEntry('projects')} 
                className="inline-flex items-center gap-2 px-5 py-2 text-xs uppercase tracking-widest bg-stone-800 text-white hover:bg-blue-700 transition-colors"
                style={{ letterSpacing: '0.15em' }}
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
                <h4 className="text-base font-light tracking-wide text-stone-700 uppercase mb-4" style={{ letterSpacing: '0.08em' }}>Skills</h4>
                <div className="space-y-3">
                  {(data.skills as string[]).map((skill, index) => (
                    <div key={index} className="relative bg-stone-50/50 border-l-2 border-blue-600 pl-5 pr-4 py-3">
                      <button 
                        onClick={() => removeSkillLanguage('skills', index)} 
                        className="absolute -top-2 -right-2 w-6 h-6 bg-stone-800 text-white text-sm hover:bg-red-600 transition-colors flex items-center justify-center"
                      >
                        ×
                      </button>
                      <input 
                        type="text" 
                        value={skill} 
                        onChange={(e) => handleSkillLanguageChange('skills', index, e.target.value)} 
                        placeholder="e.g. JavaScript, React, Python..."
                        className="w-full px-0 py-1 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800"
                      />
                    </div>
                  ))}
                  <button 
                    onClick={() => addSkillLanguage('skills')} 
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs uppercase tracking-widest bg-stone-800 text-white hover:bg-blue-700 transition-colors"
                    style={{ letterSpacing: '0.15em' }}
                  >
                    <span>+</span> Add Skill
                  </button>
                </div>
              </div>

              {/* Languages */}
              <div>
                <h4 className="text-base font-light tracking-wide text-stone-700 uppercase mb-4" style={{ letterSpacing: '0.08em' }}>Languages</h4>
                <div className="space-y-3">
                  {(data.languages as string[]).map((language, index) => (
                    <div key={index} className="relative bg-stone-50/50 border-l-2 border-blue-600 pl-5 pr-4 py-3">
                      <button 
                        onClick={() => removeSkillLanguage('languages', index)} 
                        className="absolute -top-2 -right-2 w-6 h-6 bg-stone-800 text-white text-sm hover:bg-red-600 transition-colors flex items-center justify-center"
                      >
                        ×
                      </button>
                      <input 
                        type="text" 
                        value={language} 
                        onChange={(e) => handleSkillLanguageChange('languages', index, e.target.value)} 
                        placeholder="e.g. English, Spanish, French..."
                        className="w-full px-0 py-1 bg-transparent border-0 border-b border-stone-300 focus:border-blue-700 focus:outline-none text-stone-800"
                      />
                    </div>
                  ))}
                  <button 
                    onClick={() => addSkillLanguage('languages')} 
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs uppercase tracking-widest bg-stone-800 text-white hover:bg-blue-700 transition-colors"
                    style={{ letterSpacing: '0.15em' }}
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
