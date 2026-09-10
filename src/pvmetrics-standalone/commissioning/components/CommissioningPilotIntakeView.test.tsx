import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { CommissioningPilotIntakeView } from './CommissioningPilotIntakeView';
import { CommissioningLocaleProvider } from '../localization/CommissioningLocaleContext';

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(here, 'CommissioningPilotIntakeView.tsx'), 'utf8');
const renderPilotIntake = (locale?: 'es' | 'en') => renderToStaticMarkup(
  locale
    ? React.createElement(CommissioningLocaleProvider, { locale }, React.createElement(CommissioningPilotIntakeView))
    : React.createElement(CommissioningPilotIntakeView),
);
const spanishHtml = renderPilotIntake();
const englishHtml = renderPilotIntake('en');

test('renders controlled Pilot Intake in the default Spanish locale without requiring a dataset', () => {
  assert.match(spanishHtml, /G34 · Ingreso Piloto/);
  assert.match(spanishHtml, /Preparación controlada del paquete piloto offline/);
  assert.match(spanishHtml, /ID del proyecto/);
  assert.match(spanishHtml, /Revisión del alcance/);
  assert.match(spanishHtml, /Evaluar preparación offline/);
});

test('keeps the operational authority boundary explicit', () => {
  assert.match(spanishHtml, /SOLO OFFLINE/);
  assert.match(spanishHtml, /SIN ESCRITURA OT/);
  assert.match(spanishHtml, /SIN AUTORIDAD DE ENERGIZACIÓN/);
  assert.match(spanishHtml, /no conecta SCADA\/BMS\/PCS\/EMS/i);
  assert.match(englishHtml, /OFFLINE ONLY/);
  assert.match(englishHtml, /NO OT WRITEBACK/);
  assert.match(englishHtml, /NO ENERGIZATION AUTHORITY/);
});

test('renders all required and optional pilot artifact classes', () => {
  for (const label of [
    'Identidad del proyecto',
    'Registro de alcance',
    'Registro de activos',
    'Matriz de pruebas',
    'Fuentes de criterios de aceptación',
    'Mapeo de señales',
    'Exportación de telemetría',
    'Índice del paquete de evidencias',
    'Registro de autoridad / testigos / revisores',
    'Diccionario de señales (opcional)',
    'Exportación de eventos / alarmas (opcional)',
  ]) {
    assert.match(spanishHtml, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  for (const label of [
    'Project identity',
    'Scope register',
    'Asset register',
    'Test matrix',
    'Acceptance criteria sources',
    'Signal mapping',
    'Telemetry export',
    'Evidence package index',
    'Authority / witness / reviewer register',
    'Signal dictionary (optional)',
    'Event / alarm export (optional)',
  ]) {
    assert.match(englishHtml, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('offers a header-only CSV template download for every artifact class', () => {
  assert.equal((spanishHtml.match(/aria-label="Descargar plantilla CSV para/g) ?? []).length, 11);
  assert.equal((englishHtml.match(/aria-label="Download CSV template for/g) ?? []).length, 11);
  assert.match(source, /renderPilotCsvTemplate/);
  assert.match(source, /URL\.createObjectURL/);
  assert.match(source, /anchor\.download/);
  assert.match(spanishHtml, /sin datos sintéticos ni de proyecto/i);
  assert.match(englishHtml, /no synthetic or project data/i);
});

test('validates selected CSV headers locally before marking an artifact provided', () => {
  assert.match(source, /assessPilotCsvHeader/);
  assert.match(source, /file\.slice\(0, CSV_HEADER_READ_LIMIT_BYTES\)\.text\(\)/);
  assert.match(source, /CSV HEADER BLOCKED/);
  assert.match(source, /CSV header admission PASS/);
  assert.match(source, /PENDING_VALIDATION/);
  assert.match(spanishHtml, /Los encabezados y, para telemetría, el contenido se validan localmente/i);
  assert.match(englishHtml, /Headers and, for telemetry, content are validated locally/i);
});

test('requires deterministic telemetry row-content admission before PROVIDED', () => {
  assert.match(source, /assessTelemetryCsvContent/);
  assert.match(source, /TELEMETRY CONTENT BLOCKED/);
  assert.match(source, /Admisión de contenido de telemetría: CUMPLE/);
  assert.match(source, /Telemetry content admission PASS/);
  assert.match(source, /10 \* 1024 \* 1024/);
  assert.match(source, /no partial sample is accepted as full validation/i);
  assert.match(spanishHtml, /sin corregir filas, unidades ni valores automáticamente/i);
  assert.match(englishHtml, /without automatically correcting rows, units or values/i);
});

test('hashes selected files locally with Web Crypto SHA-256', () => {
  assert.match(source, /crypto\.subtle\.digest\(['\"]SHA-256['\"]/);
  assert.match(spanishHtml, /no los sube a un servidor/i);
  assert.match(spanishHtml, /no usa red/i);
  assert.match(englishHtml, /does not upload them to a server/i);
  assert.match(englishHtml, /use the network/i);
});

test('introduces no network or browser-storage write path', () => {
  assert.doesNotMatch(source, /fetch\s*\(/);
  assert.doesNotMatch(source, /XMLHttpRequest/);
  assert.doesNotMatch(source, /new\s+WebSocket/);
  assert.doesNotMatch(source, /window\.localStorage/);
  assert.doesNotMatch(source, /globalThis\.localStorage/);
  assert.doesNotMatch(source, /window\.sessionStorage/);
  assert.doesNotMatch(source, /globalThis\.sessionStorage/);
});
