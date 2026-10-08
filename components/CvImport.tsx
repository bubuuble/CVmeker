'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Upload, Loader2, X, Check, AlertTriangle, ShieldCheck, Sparkles } from 'lucide-react';
import { CVData } from '@/types/types';
import type { CvDesign } from '@/lib/cv-design';
import { useLanguage } from '@/contexts/LanguageContext';
import { TranslationKey } from '@/lib/translations';
import type { ParseStreamEvent } from '@/app/api/parse-cv/route';

const ACCEPTED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 4 * 1024 * 1024;

const ERROR_KEYS: Record<string, TranslationKey> = {
  invalid_file_type: 'importErrorFileType',
  file_too_large: 'importErrorFileSize',
  not_a_cv: 'importErrorNotCv',
  not_configured: 'importErrorNotConfigured',
  parse_failed: 'importErrorFailed',
};

type LogStatus = 'active' | 'done' | 'failed' | 'skipped';
interface LogEntry {
  key: TranslationKey;
  status: LogStatus;
}

interface CvImportProps {
  // Called once the CV is read; the parent opens the editor with it
  onImported: (result: { cvData: CVData; design: CvDesign }) => void;
}

const CvImport: React.FC<CvImportProps> = ({ onImported }) => {
  const { t } = useLanguage();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<TranslationKey | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isUploading || startedAt === null) return;
    const timer = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 500);
    return () => clearInterval(timer);
  }, [isUploading, startedAt]);

  // Marks the last running step as finished and optionally appends a new one
  const pushLog = (finishAs: LogStatus, next?: LogEntry) =>
    setLog(prev => {
      const updated = prev.map((entry, i) => (i === prev.length - 1 && entry.status === 'active' ? { ...entry, status: finishAs } : entry));
      return next ? [...updated, next] : updated;
    });

  // Model names and error codes stay out of the UI; the user only sees generic progress steps
  const handleEvent = (event: ParseStreamEvent, state: { attempts: number }) => {
    if (event.type === 'trying') {
      state.attempts += 1;
      pushLog('done', { key: state.attempts === 1 ? 'importLogTrying' : 'importLogRetrying', status: 'active' });
    } else if (event.type === 'fallback') {
      pushLog('skipped', { key: event.hasNext ? 'importLogFallback' : 'importLogFallbackLast', status: 'failed' });
    } else if (event.type === 'done') {
      pushLog('done', { key: 'importLogDone', status: 'done' });
      pushLog('done', { key: 'importLogRedirect', status: 'active' });
      setIsRedirecting(true);
      onImported({ cvData: event.cvData, design: event.design });
    } else if (event.type === 'error') {
      pushLog('failed');
      setError(ERROR_KEYS[event.error] || 'importErrorFailed');
    }
  };

  const handleFile = async (file: File | undefined) => {
    if (!file || isUploading || isRedirecting) return;
    setError(null);
    setLog([]);

    if (!ACCEPTED_TYPES.includes(file.type)) {
      setError('importErrorFileType');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('importErrorFileSize');
      return;
    }

    setIsUploading(true);
    setStartedAt(Date.now());
    setElapsed(0);
    setLog([{ key: 'importLogUploading', status: 'active' }]);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch('/api/parse-cv', { method: 'POST', body: formData });

      // Validation errors come back as plain JSON before any parsing starts
      if (!response.ok || !response.body || !response.headers.get('content-type')?.includes('ndjson')) {
        const result = await response.json().catch(() => ({}));
        pushLog('failed');
        setError(ERROR_KEYS[result.error] || 'importErrorFailed');
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      const state = { attempts: 0 };
      let buffer = '';
      let finished = false;

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as ParseStreamEvent;
          if (event.type === 'done' || event.type === 'error') finished = true;
          handleEvent(event, state);
        }
      }

      if (!finished) {
        pushLog('failed');
        setError('importErrorFailed');
      }
    } catch (e) {
      console.error('CV import failed:', e);
      pushLog('failed');
      setError('importErrorFailed');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const progressLog = log.length > 0 && (
    <div className="mt-6 w-full max-w-xl mx-auto rounded-xl border bg-slate-950 text-left shadow-inner overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/10 text-[11px] uppercase tracking-wider text-slate-400">
        <span>{t('importLogTitle')}</span>
        {elapsed > 0 && <span className="tabular-nums">{elapsed}s</span>}
      </div>
      <ul className="px-4 py-3 space-y-2 font-mono text-xs sm:text-[13px]">
        {log.map((entry, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-0.5 shrink-0">
              {entry.status === 'active' && <Loader2 className="h-3.5 w-3.5 animate-spin text-sky-400" />}
              {entry.status === 'done' && <Check className="h-3.5 w-3.5 text-emerald-400" />}
              {entry.status === 'failed' && <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />}
              {entry.status === 'skipped' && <X className="h-3.5 w-3.5 text-slate-500" />}
            </span>
            <span className={
              entry.status === 'failed' ? 'text-amber-200'
                : entry.status === 'skipped' ? 'text-slate-500 line-through decoration-slate-600'
                  : entry.status === 'done' ? 'text-slate-300' : 'text-white'
            }>
              {t(entry.key)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div id="import" className="scroll-mt-28">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-6 sm:p-10 text-center transition-all ${
          isDragging ? 'border-primary bg-primary/5 scale-[1.01]' : 'border-border bg-card hover:border-primary/40'
        }`}
      >
        <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-primary/10 blur-3xl" />
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        <div className="relative">
          {isUploading || isRedirecting ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              </div>
              <p className="font-medium text-foreground">{t('importCvParsing')}</p>
              <p className="max-w-md rounded-lg bg-amber-50 px-3 py-2 text-xs sm:text-sm text-amber-800">
                {t('importCvFidelityNote')}
              </p>
            </div>
          ) : (
            <>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                {t('importCvBadge')}
              </span>
              <h2 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{t('importCvTitle')}</h2>
              <p className="mt-2 text-muted-foreground max-w-xl mx-auto">{t('importCvDesc')}</p>
              <div className="mt-6 flex flex-col items-center gap-3">
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="inline-flex items-center gap-2 rounded-xl h-12 px-7 bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 transition-all"
                >
                  <Upload className="h-4 w-4" />
                  {t('importCvButton')}
                </button>
                <span className="hidden sm:block text-sm text-muted-foreground">{t('importCvDrop')}</span>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">{t('importCvFormats')}</p>
            </>
          )}

          {progressLog}
          {error && (
            <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {t(error)}
            </p>
          )}
        </div>
      </div>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground text-center">
        <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
        {t('importCvPrivacy')}
      </p>
    </div>
  );
};

export default CvImport;
