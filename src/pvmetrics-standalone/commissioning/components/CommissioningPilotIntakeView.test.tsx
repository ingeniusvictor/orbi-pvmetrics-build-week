import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { CommissioningPilotIntakeView } from './CommissioningPilotIntakeView';

const here = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(join(here, 'CommissioningPilotIntakeView.tsx'), 'utf8');
const html = renderToStaticMarkup(React.createElement(CommissioningPilotIntakeView));

test('renders controlled Pilot Intake without requiring a dataset', () => {
  assert.match(html, /G34 · Pilot Intake/);
  assert.match(html, /Preparación controlada de paquete piloto offline/);
  assert.match(html, /Project ID/);
  assert.match(html, /Scope revision/);
  assert.match(html, /Evaluar preparación offline/);
});

test('keeps the operational authority boundary explicit', () => {
  assert.match(html, /OFFLINE ONLY/);
  assert.match(html, /NO OT WRITEBACK/);
  assert.match(html, /NO ENERGIZATION AUTHORITY/);
  assert.match(html, /no conecta SCADA\/BMS\/PCS\/EMS/i);
});

test('renders all required and optional pilot artifact classes', () => {
  for (const label of [
    'Identidad del proyecto',
    'Registro de alcance / Scope',
    'Registro de activos',
    'Matriz de pruebas',
    'Fuentes de criterios de aceptación',
    'Mapeo de señales',
    'Export de telemetría',
    'Índice del paquete de evidencias',
    'Registro de autoridad / testigos / revisores',
    'Diccionario de señales (opcional)',
    'Export de eventos / alarmas (opcional)',
  ]) {
    assert.match(html, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
});

test('offers a header-only CSV template download for every artifact class', () => {
  assert.equal((html.match(/aria-label="Descargar plantilla CSV para/g) ?? []).length, 11);
  assert.match(source, /renderPilotCsvTemplate/);
  assert.match(source, /URL\.createObjectURL/);
  assert.match(source, /anchor\.download/);
  assert.match(html, /sin datos sintéticos ni datos de proyecto/i);
});

test('validates selected CSV headers locally before marking an artifact provided', () => {
  assert.match(source, /assessPilotCsvHeader/);
  assert.match(source, /file\.slice\(0, CSV_HEADER_READ_LIMIT_BYTES\)\.text\(\)/);
  assert.match(source, /CSV HEADER BLOCKED/);
  assert.match(source, /CSV header admission PASS/);
  assert.match(source, /PENDING_VALIDATION/);
  assert.match(html, /encabezados se validan localmente/i);
});

test('requires deterministic telemetry row-content admission before PROVIDED', () => {
  assert.match(source, /assessTelemetryCsvContent/);
  assert.match(source, /TELEMETRY CONTENT BLOCKED/);
  assert.match(source, /Telemetry content admission PASS/);
  assert.match(source, /10 \* 1024 \* 1024/);
  assert.match(source, /no partial sample is accepted as full validation/i);
  assert.match(html, /telemetría CSV además pasa una validación determinística de contenido/i);
  assert.match(html, /no corrige filas, unidades ni valores automáticamente/i);
});

test('hashes selected files locally with Web Crypto SHA-256', () => {
  assert.match(source, /crypto\.subtle\.digest\(['\"]SHA-256['\"]/);
  assert.match(html, /no los sube a un servidor/i);
  assert.match(html, /no usa red/i);
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
