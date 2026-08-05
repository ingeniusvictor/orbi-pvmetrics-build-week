import React from 'react';
import { AlertTriangle, Ban, CheckCircle2, Clock3, HelpCircle, Info, ShieldCheck } from 'lucide-react';
import type { PortfolioQuantity, PresentationAvailability, PresentationValue } from '../../../climate-recovery';
import type { ClimateRecoveryCopy, ClimateRecoveryLocale } from '../copy';

type DisplayValue = PresentationValue<unknown> | PortfolioQuantity;

const availabilityStyle: Record<PresentationAvailability, string> = {
  available: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  unavailable: 'border-slate-600 bg-slate-800 text-slate-300',
  blocked: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  'not-applicable': 'border-slate-700 bg-slate-900 text-slate-400',
  'pending-review': 'border-amber-500/30 bg-amber-500/10 text-amber-300',
};

const availabilityLabel = (availability: PresentationAvailability, t: ClimateRecoveryCopy) => ({
  available: '', unavailable: t.unavailable, blocked: t.blocked,
  'not-applicable': t.notApplicable, 'pending-review': t.pending,
})[availability];

const presentNumber = (value: number, unit: string | undefined, locale: ClimateRecoveryLocale) => {
  const formatted = new Intl.NumberFormat(locale === 'es' ? 'es-CL' : 'en-US', {
    maximumFractionDigits: 2,
  }).format(value);
  return `${formatted}${unit ? ` ${unit}` : ''}`;
};

export const AvailabilityValue: React.FC<{
  value: DisplayValue;
  locale: ClimateRecoveryLocale;
  t: ClimateRecoveryCopy;
  className?: string;
}> = ({ value, locale, t, className = '' }) => {
  const availability = value.availability as PresentationAvailability;
  const formattedValue = 'formattedValue' in value
    ? value.formattedValue
    : typeof value.value === 'number'
      ? presentNumber(value.value, value.unit, locale)
      : '';
  const unavailable = availability !== 'available' || value.value === undefined;
  const label = unavailable ? availabilityLabel(availability, t) || t.unavailable : formattedValue;
  const tooltip = [
    'tooltip' in value ? value.tooltip : undefined,
    ...value.limitations,
  ].filter(Boolean).join(' ');
  return (
    <span
      className={`${unavailable ? `inline-flex rounded-md border px-2 py-1 text-xs ${availabilityStyle[availability]}` : ''} ${className}`}
      aria-label={`${label}. ${tooltip}`}
      title={tooltip}
    >
      {label}
    </span>
  );
};

const tokenStyles: Record<string, string> = {
  critical: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  high: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
  warning: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
  medium: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  caution: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  low: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
  informational: 'border-sky-500/30 bg-sky-500/10 text-sky-300',
  recoverable: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  'partially-recoverable': 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  'non-recoverable': 'border-slate-600 bg-slate-800 text-slate-300',
  indeterminate: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
  insufficient: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  unavailable: 'border-slate-600 bg-slate-800 text-slate-300',
  blocked: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  valid: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  degraded: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  incomplete: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
  stale: 'border-orange-500/30 bg-orange-500/10 text-orange-300',
  conflicting: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  unknown: 'border-violet-500/30 bg-violet-500/10 text-violet-300',
  'pending-review': 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  'not-applicable': 'border-slate-700 bg-slate-900 text-slate-400',
};

export const StatusBadge: React.FC<{ value: string; t: ClimateRecoveryCopy; label?: string }> = ({ value, t, label }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${tokenStyles[value] ?? 'border-slate-700 bg-slate-900 text-slate-300'}`}>
    {label ?? (value in t.statusLabels ? t.statusLabels[value as keyof typeof t.statusLabels] : value.replaceAll('-', ' '))}
  </span>
);

export const SyntheticBadge: React.FC<{ label: string }> = ({ label }) => (
  <span className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-cyan-300">
    <ShieldCheck className="h-3 w-3" aria-hidden="true" /> {label}
  </span>
);

export const SectionHeader: React.FC<{
  title: string;
  description?: string;
  action?: React.ReactNode;
}> = ({ title, description, action }) => (
  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
    <div>
      <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl">{title}</h2>
      {description && <p className="mt-1.5 max-w-3xl text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">{description}</p>}
    </div>
    {action}
  </div>
);

export const MetricCard: React.FC<{
  label: string;
  children: React.ReactNode;
  explanation: string;
  status?: string;
  tooltip?: string;
  tier?: 'primary' | 'secondary';
}> = ({ label, children, explanation, status = 'available', tooltip, tier = 'secondary' }) => (
  <article data-metric-card data-kpi-tier={tier} className={`group relative min-w-0 rounded-2xl border bg-slate-900/80 shadow-sm ${tier === 'primary' ? 'cr-kpi-reveal border-slate-700 p-5 sm:p-6' : 'border-slate-800 p-4'}`}>
    <div className="flex items-start justify-between gap-2">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">{label}</p>
      {tooltip && (
        <span title={tooltip} aria-label={tooltip} tabIndex={0} className="rounded text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400">
          <HelpCircle className="h-4 w-4" />
        </span>
      )}
    </div>
    <div className={`mt-3 break-words font-mono font-black tracking-tight text-white ${tier === 'primary' ? 'text-3xl sm:text-4xl' : 'text-2xl'}`}>{children}</div>
    <div className="mt-3 flex items-start gap-2 border-t border-slate-800 pt-3 text-xs leading-4 text-slate-400">
      {status === 'blocked' || status === 'not-applicable' ? <Ban className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-400" />
        : status === 'unavailable' ? <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
          : status === 'pending-review' ? <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-400" />
            : <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />}
      <span>{explanation}</span>
    </div>
  </article>
);

export const ScoreMetricCard: React.FC<{
  label: string;
  score: number;
  band: string;
  explanation: string;
  tooltip: string;
  syntheticLabel: string;
}> = ({ label, score, band, explanation, tooltip, syntheticLabel }) => (
  <article data-metric-card data-kpi-tier="primary" className="group relative min-w-0 overflow-hidden rounded-3xl border border-cyan-500/30 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.14),transparent_48%),linear-gradient(145deg,rgba(15,23,42,0.98),rgba(2,6,23,0.98))] p-5 shadow-[var(--cr-glow-accent)] sm:p-6">
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-cyan-200">{label}</p>
          <span title={tooltip} aria-label={tooltip} tabIndex={0} className="rounded text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"><HelpCircle className="h-4 w-4" /></span>
        </div>
        <p className="mt-3 text-sm font-semibold text-white">{band}</p>
        <p className="mt-2 text-xs leading-5 text-slate-400">{explanation}</p>
        <div className="mt-4"><SyntheticBadge label={syntheticLabel} /></div>
      </div>
      <div
        className="cr-score-ring shrink-0"
        style={{ background: `conic-gradient(#22d3ee 0 ${score}%, rgba(51,65,85,0.75) ${score}% 100%)` }}
        role="img"
        aria-label={`${label}: ${score.toFixed(2)} out of 100. ${band}. ${tooltip}`}
      >
        <div className="text-center"><span className="block font-mono text-3xl font-black text-white">{score.toFixed(2)}</span><span className="text-xs font-bold text-slate-400">/100</span></div>
      </div>
    </div>
  </article>
);

export const DisclosurePanel: React.FC<{ disclosure: string; boundary: string; ariaLabel?: string }> = ({ disclosure, boundary, ariaLabel = 'Synthetic data disclosure' }) => (
  <aside className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.06] p-4" aria-label={ariaLabel}>
    <div className="flex items-start gap-3">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
      <div className="space-y-1 text-xs leading-5 text-cyan-100/80">
        <p className="font-semibold text-cyan-200">{disclosure}</p>
        <p>{boundary}</p>
      </div>
    </div>
  </aside>
);

export const EmptyState: React.FC<{ title: string; description?: string; action?: React.ReactNode }> = ({ title, description, action }) => (
  <div className="rounded-2xl border border-dashed border-slate-700 bg-[linear-gradient(145deg,rgba(15,23,42,0.7),rgba(2,6,23,0.5))] px-5 py-10 text-center shadow-[var(--cr-shadow-sm)]">
    <Clock3 className="mx-auto h-6 w-6 text-slate-500" />
    <p className="mt-3 text-sm font-bold text-slate-200">{title}</p>
    {description && <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-slate-400">{description}</p>}
    {action && <div className="mt-4">{action}</div>}
  </div>
);

export const Panel: React.FC<{ children: React.ReactNode; className?: string; ariaLabel?: string }> = ({ children, className = '', ariaLabel }) => (
  <section aria-label={ariaLabel} className={`cr-premium-panel rounded-2xl border p-4 sm:p-5 ${className}`}>{children}</section>
);
