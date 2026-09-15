import React from 'react';
import {
  MapPin,
  Users,
  AlertOctagon,
  FileText,
  ChevronRight,
  Eye,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { Incident } from '../../types/incident';

interface RecentIncidentsProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onDownloadPdf: (incidentId: string) => void;
  onViewAllQueue: () => void;
}

export const RecentIncidents: React.FC<RecentIncidentsProps> = ({
  incidents,
  onSelectIncident,
  onDownloadPdf,
  onViewAllQueue
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide uppercase">
            Active Disaster Incident Queue
          </h2>
          <p className="text-xs text-slate-400">
            Ranked by multimodal explainable priority score
          </p>
        </div>
        <button
          onClick={onViewAllQueue}
          className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-all cursor-pointer"
        >
          <span>View Full Queue ({incidents.length})</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {incidents.slice(0, 4).map((incident) => {
          const isHigh = incident.priority === 'HIGH';
          const isMed = incident.priority === 'MEDIUM';

          const priorityBadgeClass = isHigh
            ? 'bg-red-950/60 border-red-700 text-red-400 shadow-sm shadow-red-950'
            : isMed
            ? 'bg-amber-950/60 border-amber-700 text-amber-400 shadow-sm shadow-amber-950'
            : 'bg-emerald-950/60 border-emerald-700 text-emerald-400';

          const scoreColor = isHigh ? 'text-red-400' : isMed ? 'text-amber-400' : 'text-emerald-400';

          return (
            <div
              key={incident.id}
              className="p-4.5 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/80 hover:border-slate-700 transition-all duration-200 flex flex-col justify-between group shadow-lg shadow-black/40"
            >
              <div>
                {/* Header line with ID and Priority Score */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {incident.id}
                    </span>
                    {incident.is_demo && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Flagship Demo
                      </span>
                    )}
                  </div>

                  <div className={`px-2.5 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 ${priorityBadgeClass}`}>
                    <span className={`w-2 h-2 rounded-full ${isHigh ? 'bg-red-500 animate-beacon' : isMed ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                    <span>{incident.priority}</span>
                    <span className="opacity-60">|</span>
                    <span className={scoreColor}>{incident.priority_score}/100</span>
                  </div>
                </div>

                {/* Title and Location */}
                <h3 className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors line-clamp-1 mb-1">
                  {incident.title}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3">
                  <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="line-clamp-1">{incident.location_name}</span>
                </div>

                {/* Explainable Tag Badges */}
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    {incident.people_affected} affected
                  </span>

                  {incident.vulnerable_present && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-950/60 border border-rose-800/40 text-rose-300">
                      Vulnerable Person
                    </span>
                  )}

                  {incident.medical_emergency && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-red-950/60 border border-red-800/40 text-red-300 flex items-center gap-1">
                      <AlertOctagon className="w-3 h-3" />
                      Medical Alert
                    </span>
                  )}

                  {incident.road_blocked && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40 text-amber-300">
                      Road Blocked
                    </span>
                  )}

                  {incident.water_entering_building && (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800/40 text-sky-300">
                      Building Flooded
                    </span>
                  )}
                </div>

                {/* Headline Reason Quote */}
                {incident.triage_assessment?.headline_reason && (
                  <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 mb-3 leading-relaxed">
                    <span className="text-slate-500 font-semibold block text-[10px] uppercase">
                      Triage Explanation:
                    </span>
                    {incident.triage_assessment.detailed_reasoning}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => onSelectIncident(incident)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-sky-600/10 hover:bg-sky-600/20 text-sky-400 border border-sky-600/30 text-xs font-semibold transition-all cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Explain Triage</span>
                </button>

                <button
                  onClick={() => onDownloadPdf(incident.id)}
                  className="flex items-center gap-1 py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all cursor-pointer"
                  title="Generate Incident Brief (PDF)"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Brief (PDF)</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
