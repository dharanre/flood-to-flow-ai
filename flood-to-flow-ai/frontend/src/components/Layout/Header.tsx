import React from 'react';
import { ShieldAlert, Zap, PlusCircle, Cpu, Wifi, WifiOff } from 'lucide-react';
import { HardwareStatus } from '../../types/incident';

interface HeaderProps {
  hardware: HardwareStatus | null;
  isOnline: boolean;
  onToggleOnline: () => void;
  onOpenCreate: () => void;
  onTriggerDemo: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  hardware,
  isOnline,
  onToggleOnline,
  onOpenCreate,
  onTriggerDemo,
}) => {
  const isNpu = hardware?.active_provider === 'QNNExecutionProvider';

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand & Project Identity */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shadow-lg shadow-sky-500/20">
          <ShieldAlert className="w-6 h-6 text-slate-950 stroke-[2.5]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-white">Flood-to-Flow AI</h1>
            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-sky-950 border border-sky-800/60 text-sky-400">
              Disaster Copilot
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            Offline Disaster Intelligence for Snapdragon-powered HP AI PCs
          </p>
        </div>
      </div>

      {/* Action Controls & Hardware acceleration indicators */}
      <div className="flex items-center gap-3">
        {/* Hardware Execution Provider Badge */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs">
          <Cpu className={`w-4 h-4 ${isNpu ? 'text-teal-400' : 'text-amber-400'}`} />
          <span className="text-slate-400">Provider:</span>
          <span className={`font-semibold ${isNpu ? 'text-teal-400' : 'text-amber-400'}`}>
            {isNpu ? 'Snapdragon Hexagon NPU' : 'CPU Graceful Fallback'}
          </span>
          {hardware?.npu_tops && (
            <span className="text-[10px] px-1.5 py-0.2 bg-teal-950 text-teal-300 rounded font-mono">
              {hardware.npu_tops}
            </span>
          )}
        </div>

        {/* Offline / Online Mode Toggle */}
        <button
          onClick={onToggleOnline}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
            isOnline
              ? 'bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800'
              : 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300 hover:bg-emerald-950/60'
          }`}
          title={isOnline ? 'Online Mode (Cloud sync enabled)' : 'Offline Mode (100% on-device processing)'}
        >
          {isOnline ? <Wifi className="w-3.5 h-3.5 text-sky-400" /> : <WifiOff className="w-3.5 h-3.5 text-emerald-400" />}
          <span>{isOnline ? 'ONLINE MODE' : 'OFFLINE MODE'}</span>
        </button>

        {/* 1-Click 90s Demo Mode Button */}
        <button
          onClick={onTriggerDemo}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
        >
          <Zap className="w-4 h-4 fill-slate-950" />
          <span>⚡ QUICK DEMO (90s)</span>
        </button>

        {/* Create Incident Button */}
        <button
          onClick={onOpenCreate}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-md shadow-sky-600/20 transition-all cursor-pointer active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Incident</span>
        </button>
      </div>
    </header>
  );
};
