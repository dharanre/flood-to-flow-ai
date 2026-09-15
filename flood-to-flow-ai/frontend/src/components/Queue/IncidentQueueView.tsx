import React, { useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  FileText,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ShieldAlert
} from 'lucide-react';
import { Incident } from '../../types/incident';

interface IncidentQueueViewProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
  onDownloadPdf: (incidentId: string) => void;
  onUpdateStatus: (incidentId: string, status: any) => void;
  onDeleteIncident: (incidentId: string) => void;
}

export const IncidentQueueView: React.FC<IncidentQueueViewProps> = ({
  incidents,
  onSelectIncident,
  onDownloadPdf,
  onUpdateStatus,
  onDeleteIncident
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = incidents.filter((inc) => {
    if (priorityFilter !== 'ALL' && inc.priority !== priorityFilter) return false;
    if (statusFilter !== 'ALL' && inc.status !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        inc.title.toLowerCase().includes(q) ||
        inc.location_name.toLowerCase().includes(q) ||
        inc.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Controls & Search Bar */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by ID, title, location..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                  priorityFilter === p ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="TRIAGED">Triaged</option>
            <option value="DISPATCHED">Dispatched</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
      </div>

      {/* Incident Queue Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-300 font-bold border-b border-slate-800 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="p-3.5">ID / Priority</th>
                <th className="p-3.5">Incident Title & Location</th>
                <th className="p-3.5">Field Signals</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((inc) => {
                const isHigh = inc.priority === 'HIGH';
                const isMed = inc.priority === 'MEDIUM';

                return (
                  <tr key={inc.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                          {inc.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] border ${
                          isHigh
                            ? 'bg-red-950 text-red-300 border-red-700'
                            : isMed
                            ? 'bg-amber-950 text-amber-300 border-amber-700'
                            : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                        }`}>
                          {inc.priority} ({inc.priority_score}p)
                        </span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-white line-clamp-1">{inc.title}</div>
                      <div className="text-slate-400 flex items-center gap-1 text-[11px] mt-0.5">
                        <MapPin className="w-3 h-3 text-sky-400 shrink-0" />
                        <span className="truncate">{inc.location_name}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {inc.people_affected} people
                        </span>
                        {inc.vulnerable_present && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                            Vulnerable
                          </span>
                        )}
                        {inc.medical_emergency && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                            Medical
                          </span>
                        )}
                        {inc.road_blocked && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                            Road Blocked
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <select
                        value={inc.status}
                        onChange={(e) => onUpdateStatus(inc.id, e.target.value)}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none cursor-pointer"
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="TRIAGED">TRIAGED</option>
                        <option value="DISPATCHED">DISPATCHED</option>
                        <option value="RESOLVED">RESOLVED</option>
                      </select>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectIncident(inc)}
                          className="p-1.5 rounded-lg bg-sky-600/10 hover:bg-sky-600/20 text-sky-400 border border-sky-600/30 transition-all cursor-pointer"
                          title="Explain Triage"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDownloadPdf(inc.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all cursor-pointer"
                          title="Download Brief (PDF)"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteIncident(inc.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400 transition-all cursor-pointer"
                          title="Delete Incident"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
