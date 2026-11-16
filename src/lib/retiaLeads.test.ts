import test from 'node:test';
import assert from 'node:assert/strict';
import {
  captureRetiaTracking,
  getRetiaOrchestratorEndpoint,
  getStoredTrackingContext,
  submitLeadToRetia,
} from './retiaLeads';

function createMemoryStorage() {
  const store = new Map<string, string>();
  return {
    getItem(key: string) {
      return store.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
    clear() {
      store.clear();
    },
  };
}

function setupBrowserGlobals(url: string, referrer = 'https://google.com/') {
  const sessionStorage = createMemoryStorage();
  const localStorage = createMemoryStorage();

  const windowMock = {
    location: new URL(url),
    sessionStorage,
    localStorage,
  };

  Object.defineProperty(globalThis, 'window', {
    value: windowMock,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(globalThis, 'document', {
    value: { referrer },
    configurable: true,
    writable: true,
  });

  return { windowMock, sessionStorage, localStorage };
}

test('getRetiaOrchestratorEndpoint defaults to api.retia.online/api/leads/megamercado', () => {
  assert.equal(getRetiaOrchestratorEndpoint(), 'https://api.retia.online/api/leads/megamercado');
});

test('captureRetiaTracking extracts UTMs and Click IDs and persists across navigations', () => {
  const { windowMock } = setupBrowserGlobals(
    'https://megamercado.com.ve/?utm_source=meta&utm_medium=cpc&utm_campaign=lanzamiento_2026&utm_term=ecommerce&utm_content=reel_1&fbclid=fb_12345&gclid=g_67890',
    'https://instagram.com/'
  );

  const ctx = captureRetiaTracking();
  assert.equal(ctx.utm_source, 'meta');
  assert.equal(ctx.utm_medium, 'cpc');
  assert.equal(ctx.utm_campaign, 'lanzamiento_2026');
  assert.equal(ctx.utm_term, 'ecommerce');
  assert.equal(ctx.utm_content, 'reel_1');
  assert.equal(ctx.fbclid, 'fb_12345');
  assert.equal(ctx.gclid, 'g_67890');
  assert.equal(ctx.referrer, 'https://instagram.com/');
  assert.ok(ctx.first_landing_url?.includes('utm_source=meta'));

  // Navigate to clean URL without query params: UTMs and first_landing_url must persist
  windowMock.location = new URL('https://megamercado.com.ve/#contacto');
  const nextCtx = captureRetiaTracking();
  assert.equal(nextCtx.utm_source, 'meta');
  assert.equal(nextCtx.fbclid, 'fb_12345');
  assert.equal(nextCtx.last_page_url, 'https://megamercado.com.ve/#contacto');
  assert.ok(nextCtx.first_landing_url?.includes('utm_source=meta'));
  assert.equal(getStoredTrackingContext().utm_campaign, 'lanzamiento_2026');
});

test('submitLeadToRetia sends POST with payload + UTM context and returns leadId', async () => {
  setupBrowserGlobals(
    'https://megamercado.com.ve/?utm_source=google&utm_medium=search&gclid=gclid_abc',
    'https://google.co.ve/'
  );

  let capturedUrl = '';
  let capturedMethod = '';
  let capturedBody: Record<string, unknown> = {};

  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    capturedUrl = String(input);
    capturedMethod = init?.method || 'GET';
    capturedBody = JSON.parse(String(init?.body || '{}')) as Record<string, unknown>;
    return new Response(JSON.stringify({ success: true, leadId: 'lead_mm_999' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as typeof fetch;

  try {
    const res = await submitLeadToRetia({
      name: '  Andrea Rojas  ',
      phone: ' +58 412 555 0199 ',
      email: 'andrea@empresa.ve',
      company: 'Grupo Caribe',
      service: 'Fase 2 Marketplace',
      message: 'Consulta integral',
      type: 'lead',
      formId: 'megamercado-diagnostico',
    });

    assert.equal(res.success, true);
    assert.equal(res.leadId, 'lead_mm_999');
    assert.equal(capturedUrl, 'https://api.retia.online/api/leads/megamercado');
    assert.equal(capturedMethod, 'POST');
    assert.equal(capturedBody.name, 'Andrea Rojas');
    assert.equal(capturedBody.phone, '+58 412 555 0199');
    assert.equal(capturedBody.utm_source, 'google');
    assert.equal(capturedBody.utm_medium, 'search');
    assert.equal(capturedBody.gclid, 'gclid_abc');
    assert.equal(capturedBody.formId, 'megamercado-diagnostico');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('submitLeadToRetia throws descriptive error when orchestrator returns 4xx/5xx', async () => {
  setupBrowserGlobals('https://megamercado.com.ve/');
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (async () => {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Campos requeridos incompletos: Nombre y Teléfono/WhatsApp son obligatorios.',
      }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }) as typeof fetch;

  try {
    await assert.rejects(
      () =>
        submitLeadToRetia({
          name: 'Test',
          phone: '',
          formId: 'megamercado-diagnostico',
        }),
      /Nombre y Teléfono\/WhatsApp son obligatorios/
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
});

