import React from 'react';
import {
  AlertTriangle,
  Flame,
  Clock,
  CheckCircle2,
  HeartPulse,
  NavigationOff
} from 'lucide-react';
import { DashboardStats } from '../../types/incident';

interface MetricsGridProps {
  stats: DashboardStats | null;
  onFilterPriority?: (priority: string) => void;
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ stats, onFilterPriority }) => {
  if (!stats) return null;

  const cards = [
    {
      title: 'High Priority Triage',
      value: stats.high_priority_count,
      subtext: 'Immediate life hazard / critical intervention',
      icon: Flame,
      color: 'text-red-400',
      bgColor: 'bg-red-950/20',
      borderColor: 'border-red-800/40',
      glow: 'shadow-red-950/40',
      priorityKey: 'HIGH'
    },
    {
      title: 'Medium Priority',
      value: stats.medium_priority_count,
      subtext: 'Logistics cut off / sheltered monitoring',
      icon: AlertTriangle,
      color: 'text-amber-400',
      bgColor: 'bg-amber-950/20',
      borderColor: 'border-amber-800/40',
      glow: 'shadow-amber-950/40',
      priorityKey: 'MEDIUM'
    },
    {
      title: 'Low Priority / Resolved',
      value: stats.low_priority_count,
      subtext: 'Non-residential waterlogging',
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-950/20',
      borderColor: 'border-emerald-800/40',
      glow: 'shadow-emerald-950/40',
      priorityKey: 'LOW'
    },
    {
      title: 'Medical Emergencies',
      value: stats.medical_emergencies_count,
      subtext: 'Urgent medical triage requested',
      icon: HeartPulse,
      color: 'text-rose-400',
      bgColor: 'bg-rose-950/20',
      borderColor: 'border-rose-800/40',
      glow: 'shadow-rose-950/40'
    },
    {
      title: 'Road Blockages',
      value: stats.road_blockages_count,
      subtext: 'Transit routes severed',
      icon: NavigationOff,
      color: 'text-sky-400',
      bgColor: 'bg-sky-950/20',
      borderColor: 'border-sky-800/40',
      glow: 'shadow-sky-950/40'
    },
    {
      title: 'Total Active Records',
      value: stats.total_incidents,
      subtext: 'Local SQLite offline database',
      icon: Clock,
      color: 'text-slate-300',
      bgColor: 'bg-slate-900/40',
      borderColor: 'border-slate-800',
      glow: 'shadow-slate-950/40'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            onClick={() => card.priorityKey && onFilterPriority?.(card.priorityKey)}
            className={`p-4 rounded-xl border ${card.bgColor} ${card.borderColor} transition-all duration-200 shadow-lg ${card.glow} ${
              card.priorityKey ? 'cursor-pointer hover:scale-[1.02] hover:border-slate-600' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-slate-400 tracking-wide uppercase">
                {card.title}
              </span>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className="text-2xl font-bold text-white tracking-tight mb-1">
              {card.value}
            </div>
            <p className="text-[10px] text-slate-400 line-clamp-1">
              {card.subtext}
            </p>
          </div>
        );
      })}
    </div>
  );
};
