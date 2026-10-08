'use client';

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { CVData } from '@/types/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { CvDesign, googleFontsHref } from '@/lib/cv-design';
import { customCvFonts, renderCustomCv } from '@/lib/custom-template';

// A4 width in CSS pixels (210mm at 96dpi)
const PAGE_WIDTH_PX = 794;

interface CustomTemplateProps {
  data: CVData;
  design: CvDesign;
  fontFamily?: string;
  fontSize?: string;
  highlightColor?: string;
  imageSize?: string;
}

// Template generated from an uploaded CV's design. Markup comes from lib/custom-template.ts,
// the same renderer the PDF route uses, with all user text escaped there.
// It is laid out at the real A4 width and scaled down to fit, so line breaks match the PDF.
const CustomTemplate: React.FC<CustomTemplateProps> = ({ data, design, fontFamily, fontSize, highlightColor, imageSize }) => {
  const { t } = useLanguage();
  const outerRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState<number>();
  const fontsHref = googleFontsHref(customCvFonts(design, { fontFamily, fontSize, highlightColor, imageSize }));

  useEffect(() => {
    if (!fontsHref || document.querySelector(`link[data-cvx-fonts="${fontsHref}"]`)) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = fontsHref;
    link.dataset.cvxFonts = fontsHref;
    document.head.appendChild(link);
  }, [fontsHref]);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const page = pageRef.current;
    if (!outer || !page) return;
    const update = () => {
      // Hidden instances (e.g. the mobile preview on desktop) have no width; keep them unscaled
      const next = outer.clientWidth ? Math.min(1, outer.clientWidth / PAGE_WIDTH_PX) : 1;
      setScale(next);
      setHeight(page.offsetHeight * next);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(outer);
    observer.observe(page);
    return () => observer.disconnect();
  }, []);

  const html = useMemo(
    () => renderCustomCv(data, design, {
      fontFamily,
      fontSize,
      highlightColor,
      imageSize,
      photoPlaceholder: true,
      photoPlaceholderLabel: t('photoPlaceholderHint'),
    }),
    [data, design, fontFamily, fontSize, highlightColor, imageSize, t],
  );

  return (
    <div ref={outerRef} style={{ width: '100%', height, overflow: 'hidden' }}>
      <div
        ref={pageRef}
        style={{ width: PAGE_WIDTH_PX, transform: `scale(${scale})`, transformOrigin: 'top left' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default CustomTemplate;
