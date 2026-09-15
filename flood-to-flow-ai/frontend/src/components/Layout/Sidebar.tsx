import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  MapPin,
  ListOrdered,
  BrainCircuit,
  FileText,
  Cpu,
  Lock
} from 'lucide-react';

export type NavSection =
  | 'overview'
  | 'create'
  | 'map'
  | 'queue'
  | 'analysis'
  | 'reports'
  | 'hardware';

interface SidebarProps {
  currentSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  incidentCount: number;
  highPriorityCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentSection,
  onSelectSection,
  incidentCount,
  highPriorityCount
}) => {
  const navItems = [
    { id: 'overview' as NavSection, label: 'Overview', icon: LayoutDashboard },
    { id: 'create' as NavSection, label: 'Create Incident', icon: PlusCircle },
    { id: 'map' as NavSection, label: 'Incident Map', icon: MapPin },
    {
      id: 'queue' as NavSection,
      label: 'Incident Queue',
      icon: ListOrdered,
      badge: incidentCount,
      badgeColor: highPriorityCount > 0 ? 'bg-red-500/20 text-red-400 border-red-500/40' : undefined
    },
    { id: 'analysis' as NavSection, label: 'AI Analysis', icon: BrainCircuit },
    { id: 'reports' as NavSection, label: 'Reports', icon: FileText },
    { id: 'hardware' as NavSection, label: 'System / Hardware', icon: Cpu },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col justify-between shrink-0 select-none">
      <div className="p-4 space-y-6">
        {/* Navigation items */}
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Disaster Command
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectSection(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-sky-600/15 text-sky-400 border border-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${
                      item.badgeColor || 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Offline Privacy Guarantee Badge */}
      <div className="p-4 border-t border-slate-900 bg-slate-900/40 m-3 rounded-xl">
        <div className="flex items-center gap-2 mb-1.5 text-xs font-semibold text-slate-300">
          <Lock className="w-3.5 h-3.5 text-teal-400" />
          <span>Local Data Privacy</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Your incident evidence is processed locally on this device unless synchronization is enabled.
        </p>
      </div>
    </aside>
  );
};
