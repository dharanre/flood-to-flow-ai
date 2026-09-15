import React from 'react';
import {
  X,
  MapPin,
  Clock,
  Users,
  AlertTriangle,
  FileText,
  ShieldAlert,
  Sparkles,
  Camera,
  Mic,
  FileSpreadsheet,
  CheckSquare,
  AlertOctagon,
  ArrowDownToLine,
  Cpu
} from 'lucide-react';
import { Incident } from '../../types/incident';

interface IncidentDetailViewProps {
  incident: Incident;
  onClose: () => void;
  onDownloadPdf: (incidentId: string) => void;
}

export const IncidentDetailView: React.FC<IncidentDetailViewProps> = ({
  incident,
  onClose,
  onDownloadPdf
}) => {
  const isHigh = incident.priority === 'HIGH';
  const isMed = incident.priority === 'MEDIUM';

  const triage = incident.triage_assessment;
  const fused = incident.fused_evidence;
  const vis = incident.visual_evidence;
  const voice = incident.voice_evidence;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-5xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 shrink-0">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl border ${
              isHigh
                ? 'bg-red-950/80 border-red-700 text-red-400'
                : isMed
                ? 'bg-amber-950/80 border-amber-700 text-amber-400'
                : 'bg-emerald-950/80 border-emerald-700 text-emerald-400'
            }`}>
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  {incident.id}
                </span>
                <span className={`text-xs font-bold px-3 py-0.5 rounded-full border ${
                  isHigh
                    ? 'bg-red-950 text-red-300 border-red-700'
                    : isMed
                    ? 'bg-amber-950 text-amber-300 border-amber-700'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                }`}>
                  {incident.priority} PRIORITY ({incident.priority_score}/100)
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Status: <strong className="text-white">{incident.status}</strong>
                </span>
              </div>
              <h2 className="text-lg font-bold text-white mt-1">
                {incident.title}
              </h2>
              <div className="flex items-center gap-4 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" />
                  {incident.location_name}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {new Date(incident.created_at).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onDownloadPdf(incident.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-lg shadow-sky-600/30 transition-all cursor-pointer active:scale-95"
            >
              <ArrowDownToLine className="w-4 h-4" />
              <span>Generate Brief (PDF)</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Transparent Explainable Scoring Card */}
          <div className="p-5 rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-950 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/30 text-sky-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    {triage?.headline_reason || `Why this incident is ${incident.priority} priority`}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Transparent, auditable scoring calculation — zero black-box opacity
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-white">{incident.priority_score}</span>
                <span className="text-xs text-slate-500 font-bold"> / 100 PTS</span>
              </div>
            </div>

            {/* Itemized Points Breakdown Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
              {triage?.points_breakdown.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-200">{item.factor}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 font-mono">
                        {item.source}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.detail}</p>
                  </div>
                  <span className="text-sm font-extrabold text-sky-400 shrink-0 font-mono">
                    +{item.points}
                  </span>
                </div>
              ))}
            </div>

            {/* Summary Rationale Box */}
            {triage?.detailed_reasoning && (
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
                <strong className="text-slate-400 block mb-0.5 text-[10px] uppercase tracking-wide">
                  Consensus Reasoning:
                </strong>
                {triage.detailed_reasoning}
              </div>
            )}
          </div>

          {/* Multimodal Triangulation Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Vision Findings */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Computer Vision
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800 font-mono">
                  YOLOv8 + PidNet
                </span>
              </div>

              {/* Sample flood image preview */}
              {incident.image_url && (
                <div className="rounded-lg overflow-hidden border border-slate-800 relative group">
                  <img
                    src={incident.image_url}
                    alt="Flood observation"
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/80 text-[10px] font-mono text-teal-300 border border-teal-800/60">
                    Water Ratio: {vis?.water_coverage_percentage || 58}%
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                  Detected Visual Hazards:
                </span>
                <ul className="space-y-1 text-xs text-slate-300">
                  {vis?.detections?.map((d, i) => (
                    <li key={i} className="flex items-center justify-between text-[11px] bg-slate-950/60 px-2 py-1 rounded border border-slate-800/60">
                      <span>{d.class_name}</span>
                      <span className="text-teal-400 font-mono">{(d.confidence * 100).toFixed(0)}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* 2. Speech Audio Transcript */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4 text-sky-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Voice Dispatch
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-mono">
                  Whisper Local
                </span>
              </div>

              {/* Verbatim Transcript */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-200 italic leading-relaxed min-h-[120px]">
                "{voice?.transcript || fused?.raw_voice_transcript || 'No voice report provided.'}"
              </div>

              {/* Extracted Entities */}
              <div className="space-y-1">
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">
                  Extracted Emergency Entities:
                </span>
                <div className="flex flex-wrap gap-1">
                  {voice?.entities?.vulnerable_person_detected && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                      Elderly resident mentioned
                    </span>
                  )}
                  {voice?.entities?.medical_emergency_detected && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                      Assistance requested
                    </span>
                  )}
                  {voice?.entities?.road_blockage_detected && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                      Blocked road identified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Human Field Observations */}
            <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Field Observations
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
                  Ground Entry
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Citizens Exposed:</span>
                  <span className="font-bold text-white">{incident.people_affected} individuals</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Vulnerable Resident:</span>
                  <span className={`font-bold ${incident.vulnerable_present ? 'text-rose-400' : 'text-slate-400'}`}>
                    {incident.vulnerable_present ? 'YES (High Alert)' : 'NO'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Medical Emergency:</span>
                  <span className={`font-bold ${incident.medical_emergency ? 'text-red-400' : 'text-slate-400'}`}>
                    {incident.medical_emergency ? 'YES' : 'NO'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Access Roadway:</span>
                  <span className={`font-bold ${incident.road_blocked ? 'text-amber-400' : 'text-slate-400'}`}>
                    {incident.road_blocked ? 'BLOCKED' : 'PASSABLE'}
                  </span>
                </div>
              </div>

              {incident.manual_notes && (
                <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800">
                  <strong>Notes:</strong> {incident.manual_notes}
                </p>
              )}
            </div>
          </div>

          {/* Recommended Tactical Response Actions */}
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-teal-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Recommended Response Actions
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {triage?.recommended_actions.map((act, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-3"
                >
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 cursor-pointer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{act.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                      {act.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety Disclaimer */}
          <div className="p-4 rounded-xl border border-red-900/50 bg-red-950/20 text-center">
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-red-400 mb-1">
              <AlertOctagon className="w-4 h-4" />
              <span>MANDATORY EMERGENCY SAFETY DIRECTIVE</span>
            </div>
            <p className="text-xs text-slate-300 max-w-2xl mx-auto">
              {triage?.safety_disclaimer || "AI-assisted assessment — verify critical decisions with trained emergency personnel."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
