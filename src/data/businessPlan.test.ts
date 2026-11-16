import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BUYER_PERSONAS,
  CORE_VALUES,
  HERO_PILLARS,
  LAB_SOLUTIONS,
  ROADMAP_PHASES,
  SOFTWARE_PROVIDER_TIERS,
  computePhaseRecommendation,
  isValidEmail,
  validateDiagnosticForm,
  validateProviderSubscription,
  type DiagnosticFormInput,
  type ProviderSubscriptionInput,
} from './businessPlan';

test('business plan catalog completeness', () => {
  assert.equal(HERO_PILLARS.length, 4);
  assert.equal(LAB_SOLUTIONS.length, 5);
  assert.equal(BUYER_PERSONAS.length, 4);
  assert.equal(ROADMAP_PHASES.length, 3);
  assert.equal(CORE_VALUES.length, 4);
  assert.equal(SOFTWARE_PROVIDER_TIERS.length, 3);
});

test('email validation rejects malformed addresses and accepts corporate emails', () => {
  assert.equal(isValidEmail(''), false);
  assert.equal(isValidEmail('nombre@'), false);
  assert.equal(isValidEmail('sin-arroba.ve'), false);
  assert.equal(isValidEmail('direccion@megamercado.ve'), true);
});

test('validateDiagnosticForm returns field errors for empty required inputs', () => {
  const emptyInput: DiagnosticFormInput = {
    fullName: '',
    company: ' ',
    email: 'correo-invalido',
    phone: '',
    sector: '',
    phase: 'fase-1',
    currentPlatform: 'ninguna',
    goal: 'validar-nicho',
    notes: '',
  };

  const result = validateDiagnosticForm(emptyInput);
  assert.equal(result.isValid, false);
  assert.ok(result.errors.fullName);
  assert.ok(result.errors.company);
  assert.ok(result.errors.email);
  assert.ok(result.errors.phone);
  assert.ok(result.errors.sector);
});

test('validateDiagnosticForm passes with complete valid corporate submission', () => {
  const validInput: DiagnosticFormInput = {
    fullName: 'Carlos Mendoza',
    company: 'Distribuidora Andina C.A.',
    email: 'cmendoza@distribuidoraandina.ve',
    phone: '+58 412 555 0199',
    sector: 'Repuestos Automotrices',
    phase: 'fase-2',
    currentPlatform: 'prestashop',
    goal: 'lanzar-marketplace',
    notes: 'Interesados en ciclo de 6 semanas.',
  };

  const result = validateDiagnosticForm(validInput);
  assert.equal(result.isValid, true);
  assert.deepEqual(result.errors, {});
});

test('validateProviderSubscription validates software provider fields accurately', () => {
  const invalidProvider: ProviderSubscriptionInput = {
    companyName: '',
    contactName: 'A',
    email: 'invalido',
    phone: '123',
    category: 'ia-analitica',
    planId: 'marketplace-saas',
    websiteOrDocs: '',
  };

  const badResult = validateProviderSubscription(invalidProvider);
  assert.equal(badResult.isValid, false);
  assert.ok(badResult.errors.companyName);
  assert.ok(badResult.errors.contactName);
  assert.ok(badResult.errors.email);
  assert.ok(badResult.errors.phone);

  const validProvider: ProviderSubscriptionInput = {
    companyName: 'NubeTech Soluciones C.A.',
    contactName: 'Elena Vargas',
    email: 'elena@nubetech.ve',
    phone: '+58 414 555 0144',
    category: 'conectores-api',
    planId: 'marketplace-saas',
    websiteOrDocs: 'https://docs.nubetech.ve',
  };

  const okResult = validateProviderSubscription(validProvider);
  assert.equal(okResult.isValid, true);
  assert.deepEqual(okResult.errors, {});
});

test('computePhaseRecommendation routes platforms and goals to accurate roadmap phase', () => {
  const recPhase3 = computePhaseRecommendation('woocommerce', 'validar-nicho');
  assert.equal(recPhase3.recommendedPhase, 'fase-3');
  assert.equal(recPhase3.estimatedWeeks, 8);

  const recPhase2 = computePhaseRecommendation('prestashop', 'lanzar-marketplace');
  assert.equal(recPhase2.recommendedPhase, 'fase-2');
  assert.equal(recPhase2.estimatedWeeks, 6);

  const recPhase1 = computePhaseRecommendation('ninguna', 'estabilizar-precios');
  assert.equal(recPhase1.recommendedPhase, 'fase-1');
  assert.equal(recPhase1.estimatedWeeks, 3);
});
