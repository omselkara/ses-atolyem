export type Cursor = { week: number; day: number; repeat: number };
export type Profile = {
  name: string; started: boolean; startDate: string; time: string; theme: 'light'|'dark'; fontSize: number;
  low: number; high: number; transition: number|null; transpose: number; reading: string; textVersion: string;
  tongueTwisters: string[]; cursor: Cursor; lastBackup?: string; finished?: boolean;
};
export type Exercise = { id: string; name: string; category: 'Isınma'|'Ses'|'Diksiyon'|'Ölçüm'; description: string; steps: string[]; tip: string; seconds: number; page: number; optional?: boolean };
export type Step = { id: string; exercise: string; seconds: number; detail: string; notes?: number[]; repeats?: number; hidden?: boolean; blocked?: string };
export type Trial = { note: number; cents: number; at: string; method: 'microphone'|'manual' };
export type Assessment = {
  speech?: number; low?: number; transition?: number; high?: number; pitch?: Trial[];
  ah?: number[]; sss?: number[]; zzz?: number[]; errors?: number; leakage?: number; endings?: number;
  textVersion?: string; humming?: number; stable?: boolean; jumps?: number[]; crossings?: number;
  song?: boolean; symptomFree?: boolean; calibration?: boolean;
};
export type Session = {
  id: string; cursor: Cursor; date: string; seconds: number; throat: number|null; note: string;
  completed: string[]; skipped: string[]; assessment: Assessment; interrupted: boolean; status: 'complete'|'partial'|'stopped';
};
export type Draft = { id: string; cursor: Cursor; step: number; completed: string[]; skipped: string[]; elapsed: number; totalSeconds: number; assessment: Assessment; interrupted: boolean };
export type Recording = { id: string; date: string; title: string; exercise?: string; sessionId?: string; seconds: number; mime: string; blob: Blob; markers: { time: number; text: string }[] };
export type State = { profile: Profile; sessions: Session[]; draft: Draft|null };
export const PROGRAM_VERSION = '1.0.0';
export const keyOf = (c: Cursor) => `${c.week}:${c.day}:${c.repeat}`;
export const localDate = (d = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Istanbul', year:'numeric',month:'2-digit',day:'2-digit' }).format(d);
export const uuid = () => crypto.randomUUID();
export const formatTime = (n: number) => `${Math.floor(n / 60).toString().padStart(2,'0')}:${Math.floor(n % 60).toString().padStart(2,'0')}`;
