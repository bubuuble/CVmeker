"use client";

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { CVData } from '@/types/types';
import { useLanguage } from '@/contexts/LanguageContext';

import Template1 from '@/components/templates/template1';
import Template2 from '@/components/templates/template2';
import Template3 from '@/components/templates/template3';
import { modernProfessionalData, classicATSData, joshuaPhuaData } from '@/lib/mock-data';
import CvForm from '@/components/CvForm';

const STORAGE_KEY = 'cvmaker_data';

function EditorContent() {
  const { t } = useLanguage();
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [isLoadingPDF, setIsLoadingPDF] = useState(false);
  const [templateId, setTemplateId] = useState<string>('');
  const [fontFamily, setFontFamily] = useState('Calibri');
  const [fontSize, setFontSize] = useState('11');
  const [highlightColor, setHighlightColor] = useState('#000000ff'); 
  const [imageSize, setImageSize] = useState('24');
  const [isLoading, setIsLoading] = useState(true);
  const cvPreviewRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  // Load data from localStorage or template on mount
  useEffect(() => {
    const template = searchParams.get('template');
    const savedData = localStorage.getItem(STORAGE_KEY);
    
    console.log('Loading editor with template:', template);
    console.log('Saved data exists:', !!savedData);
    
    // Helper function to load template data
    const loadTemplate = (templateName: string) => {
      console.log('Loading fresh template:', templateName);
      if (templateName === 'template1') {
        setTemplateId('template1');
        setCvData(JSON.parse(JSON.stringify(modernProfessionalData)));
      } else if (templateName === 'template2') {
        setTemplateId('template2');
        setCvData(JSON.parse(JSON.stringify(classicATSData)));
      } else if (templateName === 'template3') {
        setTemplateId('template3');
        setCvData(JSON.parse(JSON.stringify(joshuaPhuaData)));
      }
      setIsLoading(false);
    };
    
    // If URL has template parameter, load that template
    if (template) {
      // Check if saved data matches the requested template
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          // Validate saved data has proper cvData object
          if (parsed.templateId === template && parsed.cvData && parsed.cvData.personalInfo) {
            console.log('Loading saved data for template:', template);
            // Load saved data for this template
            setCvData(parsed.cvData);
            setTemplateId(parsed.templateId);
            setFontFamily(parsed.fontFamily || 'Calibri');
            setFontSize(parsed.fontSize || '11');
            setHighlightColor(parsed.highlightColor || '#000000ff');
            setImageSize(parsed.imageSize || '24');
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error('Failed to parse saved CV data:', e);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      
      // Load fresh template data
      loadTemplate(template);
    } else {
      // No template in URL, try to load from localStorage
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          // Validate saved data has proper cvData object
          if (parsed.cvData && parsed.cvData.personalInfo && parsed.templateId) {
            console.log('Loading saved data from localStorage');
            setCvData(parsed.cvData);
            setTemplateId(parsed.templateId);
            setFontFamily(parsed.fontFamily || 'Calibri');
            setFontSize(parsed.fontSize || '11');
            setHighlightColor(parsed.highlightColor || '#000000ff');
            setImageSize(parsed.imageSize || '24');
          }
        } catch (e) {
          console.error('Failed to parse saved CV data:', e);
          localStorage.removeItem(STORAGE_KEY);
        }
      }
      setIsLoading(false);
    }
  }, [searchParams]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (cvData && templateId) {
      const dataToSave = {
        cvData,
        templateId,
        fontFamily,
        fontSize,
        highlightColor,
        imageSize,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [cvData, templateId, fontFamily, fontSize, highlightColor, imageSize]);

  // Empty CV data structure
  const getEmptyCVData = (): CVData => ({
    personalInfo: {
      name: '',
      phone: '',
      email: '',
      address: '',
      portfolio: '',
      photoUrl: '',
    },
    summary: '',
    education: [],
    workExperience: [],
    organizationalExperience: [],
    achievements: [],
    projects: [],
    skills: [],
    languages: [],
  });

  const handleClearData = () => {
    if (window.confirm(t('clearDataConfirm'))) {
      const emptyData = getEmptyCVData();
      setCvData(emptyData);
      // Keep templateId so the template layout remains visible
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        cvData: emptyData,
        templateId,
        fontFamily,
        fontSize,
        highlightColor,
        imageSize,
      }));
    }
  };

  const handleDownloadPDF = async () => {
    if (!cvData) return;
    setIsLoadingPDF(true);

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvData,
          templateId,
          fontFamily,
          fontSize,
          highlightColor,
          imageSize,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = "cv-document.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Failed to download PDF:", error);
      alert("An error occurred while generating the PDF. Please check the console for details.");
    } finally {
      setIsLoadingPDF(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-secondary">
      <Navbar />
      <main className="flex-grow w-full px-4 py-8 sm:px-6 lg:px-8">
        {!cvData ? (
          <div className="flex flex-col items-center justify-center h-full pt-16 px-4">
            <div className="w-full max-w-xl p-6 sm:p-8 border rounded-lg bg-card shadow-lg text-center">
              <h1 className="text-xl sm:text-2xl font-bold">{t('editor')}</h1>
              <p className="text-muted-foreground my-4 text-sm sm:text-base">{t('pleaseSelect')}</p>
              <Link href="/templates" className="w-full inline-block h-11 px-6 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 leading-[44px] text-sm sm:text-base">{t('goToTemplates')}</Link>
            </div>
          </div>
        ) : (
          <div>
            {/* Toolbar with customization controls */}
            <div className="max-w-7xl mx-auto mb-6">
              <div className="flex flex-col gap-3 p-3 sm:p-4 bg-card border rounded-lg">
                <div className="flex items-center justify-between">
                  <h1 className="text-lg sm:text-xl font-bold">{t('liveEditor')}</h1>
                  {/* Buttons - Mobile Top */}
                  <div className="flex gap-2 lg:hidden">
                    <button 
                      onClick={handleClearData}
                      className="h-9 px-3 text-xs sm:text-sm bg-destructive text-destructive-foreground rounded font-medium hover:bg-destructive/90 whitespace-nowrap"
                    >
                      {t('clearData')}
                    </button>
                    <button 
                      onClick={handleDownloadPDF} 
                      disabled={isLoadingPDF}
                      className="h-9 px-3 text-xs sm:text-sm bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90 disabled:bg-muted whitespace-nowrap"
                    >
                      {isLoadingPDF ? t('generating') : t('downloadPDF')}
                    </button>
                  </div>
                </div>
                
                {/* Customization Controls */}
                <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
                  {/* Font Family */}
                  <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                    <label className="text-xs sm:text-sm font-medium whitespace-nowrap">{t('font')}</label>
                    <select 
                      value={fontFamily} 
                      onChange={(e) => setFontFamily(e.target.value)}
                      className="h-8 px-2 text-xs sm:text-sm border rounded bg-background flex-1"
                    >
                      <option value="Calibri">Calibri</option>
                      <option value="Arial">Arial</option>
                      <option value="Times New Roman">Times New Roman</option>
                      <option value="Georgia">Georgia</option>
                      <option value="Verdana">Verdana</option>
                      <option value="Montserrat">Montserrat</option>
                    </select>
                  </div>

                  {/* Font Size */}
                  <div className="flex items-center gap-2 flex-1 min-w-[100px]">
                    <label className="text-xs sm:text-sm font-medium whitespace-nowrap">{t('size')}</label>
                    <select 
                      value={fontSize} 
                      onChange={(e) => setFontSize(e.target.value)}
                      className="h-8 px-2 text-xs sm:text-sm border rounded bg-background flex-1"
                    >
                      <option value="9">9pt</option>
                      <option value="10">10pt</option>
                      <option value="11">11pt</option>
                      <option value="12">12pt</option>
                      <option value="13">13pt</option>
                      <option value="14">14pt</option>
                      <option value="16">16pt</option>
                      <option value="18">18pt</option>
                      <option value="20">20pt</option>
                      <option value="22">22pt</option>
                      <option value="24">24pt</option>
                    </select>
                  </div>

                  {/* Highlight Color */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs sm:text-sm font-medium whitespace-nowrap">{t('highlight')}</label>
                    <input 
                      type="color" 
                      value={highlightColor} 
                      onChange={(e) => setHighlightColor(e.target.value)}
                      className="h-8 w-12 sm:w-16 border rounded cursor-pointer"
                    />
                  </div>

                  {/* Image Size */}
                  <div className="flex items-center gap-2 flex-1 min-w-[140px]">
                    <label className="text-xs sm:text-sm font-medium whitespace-nowrap">{t('imageSize')}</label>
                    <select 
                      value={imageSize} 
                      onChange={(e) => setImageSize(e.target.value)}
                      className="h-8 px-2 text-xs sm:text-sm border rounded bg-background flex-1"
                    >
                      <option value="16">Small</option>
                      <option value="20">Medium</option>
                      <option value="24">Large</option>
                      <option value="32">X-Large</option>
                    </select>
                  </div>

                  {/* Buttons - Desktop */}
                  <div className="hidden lg:flex gap-2 ml-auto">
                    <button 
                      onClick={handleClearData}
                      className="h-8 px-4 text-sm bg-destructive text-destructive-foreground rounded font-medium hover:bg-destructive/90 whitespace-nowrap"
                    >
                      {t('clearData')}
                    </button>
                    <button 
                      onClick={handleDownloadPDF} 
                      disabled={isLoadingPDF}
                      className="h-8 px-4 text-sm bg-primary text-primary-foreground rounded font-medium hover:bg-primary/90 disabled:bg-muted whitespace-nowrap"
                    >
                      {isLoadingPDF ? t('generating') : t('downloadPDF')}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              <div className="order-1 lg:order-1"><CvForm data={cvData} setData={setCvData} /></div>
              <div className="order-2 lg:order-2">
                {/* Mobile View - Full width with better visibility */}
                <div className="lg:hidden w-full overflow-x-auto bg-gray-100 p-4 rounded-lg">
                  <div 
                    className="w-full bg-white shadow-lg mx-auto"
                    style={{ 
                      minHeight: '100vh',
                      fontSize: '8px' // Smaller font for mobile readability
                    }}
                  >
                    {templateId === 'template1' && (
                      <Template1 
                        data={cvData} 
                        fontFamily={fontFamily}
                        fontSize="8"
                        highlightColor={highlightColor}
                        imageSize="12"
                      />
                    )}
                    {templateId === 'template2' && (
                      <Template2 
                        data={cvData} 
                        fontFamily={fontFamily}
                        fontSize="8"
                        highlightColor={highlightColor}
                        imageSize="12"
                      />
                    )}
                    {templateId === 'template3' && (
                      <Template3 
                        data={cvData} 
                        fontFamily={fontFamily}
                        fontSize="8"
                        highlightColor={highlightColor}
                        imageSize="12"
                      />
                    )}
                  </div>
                </div>
                
                {/* Desktop View - Keep original design */}
                <div className="hidden lg:block">
                  <div 
                    ref={cvPreviewRef}
                    className="w-full max-w-[210mm] min-h-[297mm] bg-white shadow-lg mx-auto transform origin-top scale-[0.8]"
                  >
                    {templateId === 'template1' && (
                      <Template1 
                        data={cvData} 
                        fontFamily={fontFamily}
                        fontSize={fontSize}
                        highlightColor={highlightColor}
                        imageSize={imageSize}
                      />
                    )}
                    {templateId === 'template2' && (
                      <Template2 
                        data={cvData} 
                        fontFamily={fontFamily}
                        fontSize={fontSize}
                        highlightColor={highlightColor}
                        imageSize={imageSize}
                      />
                    )}
                    {templateId === 'template3' && (
                      <Template3 
                        data={cvData} 
                        fontFamily={fontFamily}
                        fontSize={fontSize}
                        highlightColor={highlightColor}
                        imageSize={imageSize}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const EditorPage: React.FC = () => {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-lg">Loading...</div></div>}>
      <EditorContent />
    </Suspense>
  );
};

export default EditorPage;