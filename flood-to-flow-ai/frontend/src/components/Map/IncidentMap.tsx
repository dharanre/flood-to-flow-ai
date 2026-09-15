import React, { useState } from 'react';
import {
  MapPin,
  Flame,
  AlertTriangle,
  CheckCircle2,
  HeartPulse,
  NavigationOff,
  Building,
  Eye,
  Layers,
  FileText
} from 'lucide-react';
import { Incident } from '../../types/incident';

interface IncidentMapProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onDownloadPdf: (incidentId: string) => void;
}

export const IncidentMap: React.FC<IncidentMapProps> = ({
  incidents,
  onSelectIncident,
  onDownloadPdf
}) => {
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterMedical, setFilterMedical] = useState<boolean>(false);
  const [filterRoad, setFilterRoad] = useState<boolean>(false);
  const [filterBuilding, setFilterBuilding] = useState<boolean>(false);
  const [activeIncident, setActiveIncident] = useState<Incident | null>(null);

  // Filter incidents according to toggles
  const filtered = incidents.filter((inc) => {
    if (filterPriority !== 'ALL' && inc.priority !== filterPriority) return false;
    if (filterMedical && !inc.medical_emergency) return false;
    if (filterRoad && !inc.road_blocked) return false;
    if (filterBuilding && !inc.water_entering_building) return false;
    return true;
  });

  // Project coordinates (India Lat: 8°N - 30°N, Lng: 72°E - 90°E) to SVG bounds (800x550)
  const projectToMap = (lat: number, lng: number) => {
    const minLat = 7.5;
    const maxLat = 31.0;
    const minLng = 72.0;
    const maxLng = 91.0;

    // Normalization
    const x = ((lng - minLng) / (maxLng - minLng)) * 720 + 40;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 480 + 35;

    return { x: Math.max(30, Math.min(770, x)), y: Math.max(30, Math.min(520, y)) };
  };

  return (
    <div className="space-y-4">
      {/* Map Control Filters */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-sky-400" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Tactical Map Filters:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Filters */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
              <button
                key={p}
                onClick={() => setFilterPriority(p)}
                className={`px-2.5 py-1 rounded text-xs font-bold transition-all cursor-pointer ${
                  filterPriority === p
                    ? 'bg-sky-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Quick Hazard Toggles */}
          <button
            onClick={() => setFilterMedical(!filterMedical)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              filterMedical
                ? 'bg-rose-950/80 border-rose-700 text-rose-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
            <span>Medical Alert</span>
          </button>

          <button
            onClick={() => setFilterRoad(!filterRoad)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              filterRoad
                ? 'bg-amber-950/80 border-amber-700 text-amber-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <NavigationOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Road Blocked</span>
          </button>

          <button
            onClick={() => setFilterBuilding(!filterBuilding)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
              filterBuilding
                ? 'bg-sky-950/80 border-sky-700 text-sky-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-3.5 h-3.5 text-sky-400" />
            <span>Building Flooded</span>
          </button>
        </div>
      </div>

      {/* Interactive Tactical Map Canvas */}
      <div className="relative rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-950 via-[#0B132B] to-[#0A0E1A] overflow-hidden shadow-2xl h-[560px]">
        {/* SVG Tactical Coordinate Grid */}
        <svg className="w-full h-full" viewBox="0 0 800 550">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1E293B" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
            {/* Radar Sweep Effect */}
            <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="url(#grid)" />
          <circle cx="400" cy="275" r="220" fill="url(#radar-glow)" />
          <circle cx="400" cy="275" r="220" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />
          <circle cx="400" cy="275" r="140" fill="none" stroke="#1E293B" strokeWidth="1" strokeDasharray="4 4" />

          {/* Stylized Regional Flood Corridors (Ganges / Mahanadi / Coastal) */}
          <path
            d="M 120 180 Q 280 190, 420 220 T 680 320"
            fill="none"
            stroke="#0284C7"
            strokeWidth="1.5"
            strokeOpacity="0.3"
            strokeDasharray="6 3"
          />
          <path
            d="M 220 380 Q 340 420, 520 480"
            fill="none"
            stroke="#0D9488"
            strokeWidth="1.5"
            strokeOpacity="0.25"
            strokeDasharray="6 3"
          />

          {/* Coordinate Labels */}
          <text x="50" y="50" fill="#475569" fontSize="10" fontFamily="monospace">GRID 28°N / 77°E (NORTH SECTOR)</text>
          <text x="50" y="520" fill="#475569" fontSize="10" fontFamily="monospace">GRID 10°N / 76°E (SOUTH SECTOR)</text>
          <text x="600" y="520" fill="#475569" fontSize="10" fontFamily="monospace">GRID 20°N / 86°E (EAST COAST)</text>

          {/* Incident Location Pins */}
          {filtered.map((inc) => {
            const { x, y } = projectToMap(inc.latitude, inc.longitude);
            const isHigh = inc.priority === 'HIGH';
            const isMed = inc.priority === 'MEDIUM';
            const isSelected = activeIncident?.id === inc.id;

            const pinColor = isHigh ? '#EF4444' : isMed ? '#F59E0B' : '#10B981';

            return (
              <g
                key={inc.id}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => setActiveIncident(inc)}
              >
                {/* Pulsing beacon ring for high priority */}
                {isHigh && (
                  <circle
                    cx={x}
                    cy={y}
                    r="18"
                    fill={pinColor}
                    fillOpacity="0.2"
                    className="animate-beacon"
                  />
                )}

                {/* Outer selection ring */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="14"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="2"
                  />
                )}

                {/* Solid Core Pin */}
                <circle
                  cx={x}
                  cy={y}
                  r="7"
                  fill={pinColor}
                  stroke="#0F172A"
                  strokeWidth="2"
                />

                {/* Floating Short Label */}
                <text
                  x={x + 12}
                  y={y + 4}
                  fill="#F8FAFC"
                  fontSize="10"
                  fontWeight="bold"
                  filter="drop-shadow(0px 1px 2px rgba(0,0,0,0.8))"
                >
                  {inc.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Incident Tactical Popup */}
        {activeIncident && (
          <div className="absolute bottom-4 right-4 w-96 p-4 rounded-xl border border-slate-700 bg-slate-950/95 backdrop-blur-md shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  {activeIncident.id}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                  activeIncident.priority === 'HIGH'
                    ? 'bg-red-950 text-red-300 border-red-700'
                    : activeIncident.priority === 'MEDIUM'
                    ? 'bg-amber-950 text-amber-300 border-amber-700'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                }`}>
                  {activeIncident.priority} ({activeIncident.priority_score}/100)
                </span>
              </div>
              <button
                onClick={() => setActiveIncident(null)}
                className="text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div>
              <h4 className="text-sm font-bold text-white line-clamp-1">
                {activeIncident.title}
              </h4>
              <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span>{activeIncident.location_name}</span>
              </p>
            </div>

            <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
              <strong className="text-slate-400 block text-[10px] uppercase">
                Consensus Reason:
              </strong>
              {activeIncident.triage_assessment?.detailed_reasoning || 'Evaluated based on multimodal inputs.'}
            </p>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={() => onSelectIncident(activeIncident)}
                className="flex-1 py-1.5 px-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Explain Triage</span>
              </button>
              <button
                onClick={() => onDownloadPdf(activeIncident.id)}
                className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        )}

        {/* Legend Overlay */}
        <div className="absolute top-4 left-4 p-3 rounded-xl border border-slate-800 bg-slate-950/80 backdrop-blur-sm text-xs space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Priority Indicators
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-beacon" />
            <span className="text-slate-300">High Priority (&ge;70 pts)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-slate-300">Medium Priority (40-69 pts)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Low Priority (&lt;40 pts)</span>
          </div>
          <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-800">
            Offline Geographic Projection
          </div>
        </div>
      </div>
    </div>
  );
};
