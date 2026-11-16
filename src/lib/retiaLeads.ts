export interface RetiaTrackingContext {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  ttclid?: string;
  msclkid?: string;
  first_landing_url?: string;
  last_page_url?: string;
  referrer?: string;
}

export interface RetiaLeadPayload {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  service?: string;
  message?: string;
  jobTitle?: string;
  type?: 'lead' | 'provider' | 'newsletter';
  formId: string;
  extra?: Record<string, string | number | boolean | undefined>;
}

export interface RetiaLeadResponse {
  success: boolean;
  leadId?: string;
  submissionId?: string;
  error?: string;
}

declare global {
  interface Window {
    RetiaTracking?: {
      getContext: () => RetiaTrackingContext;
      saveContext: (ctx: RetiaTrackingContext) => void;
    };
  }
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'] as const;
const CLICK_KEYS = ['gclid', 'fbclid', 'ttclid', 'msclkid'] as const;
const STORAGE_KEY = 'retia_tracking_ctx';

const DEFAULT_ORCHESTRATOR_URL = 'https://api.retia.online';
const DEFAULT_CLIENT_SLUG = 'megamercado';

export function getRetiaOrchestratorEndpoint(): string {
  const env = (import.meta as { env?: Record<string, string | undefined> }).env;
  const host = (env?.VITE_RETIA_ORCHESTRATOR_URL || DEFAULT_ORCHESTRATOR_URL).replace(/\/$/, '');
  const slug = (env?.VITE_RETIA_CLIENT_SLUG || DEFAULT_CLIENT_SLUG).trim();
  return `${host}/api/leads/${encodeURIComponent(slug)}`;
}

export function getStoredTrackingContext(): RetiaTrackingContext {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY) || window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as RetiaTrackingContext) : {};
  } catch {
    return {};
  }
}

export function saveTrackingContext(ctx: RetiaTrackingContext): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(ctx);
    window.sessionStorage.setItem(STORAGE_KEY, serialized);
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // Ignore storage quota or private mode restrictions
  }
}

export function captureRetiaTracking(): RetiaTrackingContext {
  if (typeof window === 'undefined') return {};

  const searchParams = new URLSearchParams(window.location.search);
  const ctx = getStoredTrackingContext();

  for (const key of [...UTM_KEYS, ...CLICK_KEYS]) {
    const val = searchParams.get(key);
    if (val && val.trim()) {
      ctx[key] = val.trim();
    }
  }

  if (!ctx.first_landing_url) {
    ctx.first_landing_url = window.location.href;
    ctx.referrer = document.referrer || '';
  }
  ctx.last_page_url = window.location.href;

  saveTrackingContext(ctx);

  window.RetiaTracking = {
    getContext: getStoredTrackingContext,
    saveContext: saveTrackingContext,
  };

  return ctx;
}

export async function submitLeadToRetia(payload: RetiaLeadPayload): Promise<RetiaLeadResponse> {
  const ctx = captureRetiaTracking();

  const body: Record<string, unknown> = {
    ...ctx,
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    email: payload.email?.trim() || '',
    company: payload.company?.trim() || '',
    service: payload.service?.trim() || '',
    message: payload.message?.trim() || '',
    jobTitle: payload.jobTitle?.trim() || '',
    type: payload.type || 'lead',
    formId: payload.formId,
    landing_page_url: typeof window !== 'undefined' ? window.location.href : '',
    referrer: typeof document !== 'undefined' ? document.referrer || ctx.referrer || '' : '',
    ...(payload.extra || {}),
  };

  const response = await fetch(getRetiaOrchestratorEndpoint(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = (await response.json().catch(() => ({}))) as RetiaLeadResponse & {
    id?: string;
    _id?: string;
  };

  if (!response.ok || data.success === false) {
    throw new Error(data.error || `Error del orquestador (HTTP ${response.status})`);
  }

  return {
    success: true,
    leadId: data.leadId || data.submissionId || data.id || data._id,
  };
}

