import { CVData } from '@/types/types';
import type { CvDesign } from '@/lib/cv-design';

export const STORAGE_KEY = 'cvmaker_data';

export const DEFAULT_EDITOR_SETTINGS = {
  fontFamily: 'Calibri',
  fontSize: '11',
  highlightColor: '#000000ff',
  imageSize: '24',
};

interface SaveOptions {
  // Design of the "custom" template (an imported CV's look)
  customDesign?: CvDesign;
  settings?: Partial<typeof DEFAULT_EDITOR_SETTINGS>;
}

// Saves CV data in the same shape the editor autosaves, so /editor?template=<id> loads it.
export const saveCvToStorage = (cvData: CVData, templateId: string, { customDesign, settings }: SaveOptions = {}) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    cvData,
    templateId,
    ...DEFAULT_EDITOR_SETTINGS,
    ...settings,
    customDesign: customDesign ?? null,
  }));
};
