import { NextRequest, NextResponse } from 'next/server';
import { parseCvWithGemini, ParseEvent } from '@/lib/cv-parser';
import type { CvDesign } from '@/lib/cv-design';
import type { CVData } from '@/types/types';

export const runtime = 'nodejs';
export const maxDuration = 120;

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
// Vercel rejects request bodies above 4.5 MB
const MAX_FILE_SIZE = 4 * 1024 * 1024;

export type ParseStreamEvent =
  | ParseEvent
  | { type: 'done'; cvData: CVData; design: CvDesign }
  | { type: 'error'; error: 'not_a_cv' | 'parse_failed' };

export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set');
    return NextResponse.json({ error: 'not_configured' }, { status: 500 });
  }

  let file: FormDataEntryValue | null = null;
  try {
    const formData = await req.formData();
    file = formData.get('file');
  } catch {
    return NextResponse.json({ error: 'invalid_file_type' }, { status: 400 });
  }

  if (!(file instanceof File) || file.size === 0 || !ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: 'invalid_file_type' }, { status: 400 });
  }
  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: 'file_too_large' }, { status: 400 });
  }

  const base64 = Buffer.from(await file.arrayBuffer()).toString('base64');
  const mimeType = file.type;
  const encoder = new TextEncoder();
  // Aborted when the client goes away (tab closed, page reloaded), so we stop calling Gemini
  const abort = new AbortController();
  let closed = false;

  // Newline-delimited JSON so the client can show each step (model attempts, fallbacks) as it happens
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: ParseStreamEvent) => {
        if (!closed) controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'));
      };

      try {
        const { isResume, cvData, design } = await parseCvWithGemini(base64, mimeType, send, abort.signal);
        send(isResume ? { type: 'done', cvData, design } : { type: 'error', error: 'not_a_cv' });
      } catch (error) {
        if (abort.signal.aborted) return;
        console.error('CV parsing error:', error);
        send({ type: 'error', error: 'parse_failed' });
      } finally {
        if (!closed) {
          closed = true;
          controller.close();
        }
      }
    },
    cancel() {
      closed = true;
      abort.abort();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
    },
  });
}
