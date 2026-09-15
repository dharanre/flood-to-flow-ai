import React from 'react';
import { FileText, Download, Printer, ShieldCheck, ArrowDownToLine, Clock, MapPin } from 'lucide-react';
import { Incident } from '../../types/incident';

interface ReportsViewProps {
  incidents: Incident[];
  onDownloadPdf: (incidentId: string) => void;
  onSelectIncident: (incident: Incident) => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  incidents,
  onDownloadPdf,
  onSelectIncident
}) => {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 space-y-2">
        <h2 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <FileText className="w-5 h-5 text-sky-400" />
          <span>Responder Incident Briefs & Field Documentation</span>
        </h2>
        <p className="text-xs text-slate-400">
          Standardized emergency briefs generated locally via ReportLab. Contains multimodal AI evidence, explainable score breakdown, and commander sign-off blocks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {incidents.map((inc) => {
          const isHigh = inc.priority === 'HIGH';
          const isMed = inc.priority === 'MEDIUM';

          return (
            <div
              key={inc.id}
              className="p-4.5 rounded-xl border border-slate-800 bg-slate-950 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-xl"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                    {inc.id}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    isHigh
                      ? 'bg-red-950 text-red-300 border-red-700'
                      : isMed
                      ? 'bg-amber-950 text-amber-300 border-amber-700'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                  }`}>
                    {inc.priority} ({inc.priority_score}p)
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white line-clamp-1">{inc.title}</h3>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="line-clamp-1">{inc.location_name}</span>
                </div>

                <p className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800/80 leading-relaxed line-clamp-2">
                  {inc.triage_assessment?.detailed_reasoning || 'Evaluated on multimodal evidence.'}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectIncident(inc)}
                  className="flex-1 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                >
                  Inspect
                </button>
                <button
                  onClick={() => onDownloadPdf(inc.id)}
                  className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md shadow-sky-600/20 transition-all cursor-pointer"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
