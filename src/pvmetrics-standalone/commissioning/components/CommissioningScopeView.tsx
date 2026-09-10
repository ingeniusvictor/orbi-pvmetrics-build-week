import React from 'react';
import { AlertCircle, Box, CheckCircle2, Layers3, XCircle } from 'lucide-react';
import type { CommissioningWorkspaceState } from '../application/commissioningService';
import { useCommissioningI18n } from '../localization/CommissioningLocaleContext';

const statusClass: Record<string, string> = {
  INCLUDED: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300',
  PARTIAL: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
  EXCLUDED: 'border-gray-600 bg-gray-800 text-gray-300',
  THIRD_PARTY: 'border-cyan-500/25 bg-cyan-500/10 text-cyan-300',
  PENDING_CONFIRMATION: 'border-orange-500/25 bg-orange-500/10 text-orange-300',
};

export const CommissioningScopeView: React.FC<{ state: CommissioningWorkspaceState }> = ({ state }) => {
  const i18n = useCommissioningI18n();
  const t = i18n.text;
  const scope = state.snapshot.scopes[0];
  const assetById = new Map(state.snapshot.assets.map((asset) => [asset.assetId, asset]));
  const scopeRows = state.snapshot.scopeAssets.map((scopeAsset) => ({ scopeAsset, asset: assetById.get(scopeAsset.assetId) })).filter((row) => row.asset);
  const pending = scopeRows.filter((row) => row.scopeAsset.status === 'PENDING_CONFIRMATION').length;

  if (!scope) return <p className="text-xs text-gray-400">{t('No hay alcance de Puesta en Servicio cargado.', 'No commissioning scope loaded.')}</p>;

  return (
    <div className="space-y-5" id="commissioning-scope-view">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-5 lg:col-span-2">
          <div className="flex items-center gap-2"><Layers3 className="h-4 w-4 text-emerald-400" /><p className="text-[10px] font-black uppercase tracking-wider text-gray-500">{t('Revisión del alcance', 'Scope revision')}</p></div>
          <h2 className="mt-2 text-lg font-bold text-white">{scope.name}</h2>
          <p className="mt-2 text-xs leading-relaxed text-gray-400">{scope.description}</p>
          <div className="mt-4 flex flex-wrap gap-2 text-[10px]">
            <span className="rounded border border-gray-700 bg-gray-900 px-2 py-1 text-gray-300">{t('Revisión', 'Revision')} {scope.revision}</span>
            <span className="rounded border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-emerald-300">{i18n.canonical(scope.status)}</span>
            <span className="rounded border border-gray-700 bg-gray-900 px-2 py-1 text-gray-300">{t('Fuente', 'Source')}: {scope.sourceReference ?? i18n.missing}</span>
          </div>
        </div>
        <div className="rounded-xl border border-gray-800 bg-gray-950 p-5">
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">{t('Validación del cliente', 'Client validation')}</p>
          <p className="mt-2 text-2xl font-extrabold text-white">{pending}</p>
          <p className="mt-1 text-xs text-gray-400">{t('activo(s) pendiente(s) de confirmación', 'asset(s) pending confirmation')}</p>
          {pending > 0 ? <AlertCircle className="mt-4 h-5 w-5 text-orange-400" /> : <CheckCircle2 className="mt-4 h-5 w-5 text-emerald-400" />}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-800 bg-gray-950">
        <div className="border-b border-gray-800 px-4 py-3"><h3 className="text-sm font-bold text-white">{t('Mapeo de Activos en Alcance', 'Asset Scope Mapping')}</h3></div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-gray-900 text-[10px] uppercase tracking-wider text-gray-500"><tr><th className="px-4 py-3">{t('Activo', 'Asset')}</th><th className="px-4 py-3">{t('Tipo', 'Type')}</th><th className="px-4 py-3">{t('Padre', 'Parent')}</th><th className="px-4 py-3">{t('Estado', 'Status')}</th><th className="px-4 py-3">{t('Responsabilidad', 'Responsibility')}</th></tr></thead>
            <tbody className="divide-y divide-gray-800">
              {scopeRows.map(({ scopeAsset, asset }) => (
                <tr key={scopeAsset.scopeAssetId} className="text-gray-300">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><Box className="h-3.5 w-3.5 text-gray-500" /><div><p className="font-semibold text-white">{asset!.name}</p><p className="font-mono text-[9px] text-gray-600">{asset!.assetId}</p></div></div></td>
                  <td className="px-4 py-3 font-mono text-[10px]">{asset!.assetType}</td>
                  <td className="px-4 py-3 font-mono text-[10px] text-gray-500">{asset!.parentAssetId ?? t('RAÍZ', 'ROOT')}</td>
                  <td className="px-4 py-3"><span className={`rounded border px-2 py-1 text-[9px] font-black ${statusClass[scopeAsset.status] ?? 'border-gray-700 bg-gray-900 text-gray-300'}`}>{i18n.canonical(scopeAsset.status)}</span></td>
                  <td className="px-4 py-3 text-[10px] text-gray-400">{scopeAsset.responsibility ?? t('POR CONFIRMAR', 'TO CONFIRM')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 text-xs text-gray-400">
        <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
        <p><strong className="text-amber-300">{t('Protección de alcance:', 'Scope guard:')}</strong> {t('los activos marcados como EXCLUIDO o TERCERO nunca se incorporan silenciosamente al alcance de aceptación. Toda suposición de topología debe confirmarse contra documentación aprobada del proyecto/as-built.', 'assets marked EXCLUDED or THIRD_PARTY are never silently promoted into acceptance scope. Any topology assumption must be confirmed against approved project/as-built documentation.')}</p>
      </div>
    </div>
  );
};