import React from 'react';
import { Cpu, Activity, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { HardwareStatus } from '../../types/incident';

interface HardwareBannerProps {
  hardware: HardwareStatus | null;
  onOpenHardwareView: () => void;
}

export const HardwareBanner: React.FC<HardwareBannerProps> = ({
  hardware,
  onOpenHardwareView
}) => {
  if (!hardware) return null;

  const isNpu = hardware.active_provider === 'QNNExecutionProvider';

  return (
    <div className="p-4 rounded-xl border border-slate-800 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-slate-950 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-start gap-3.5">
        <div className={`p-2.5 rounded-xl border ${
          isNpu
            ? 'bg-teal-950/40 border-teal-800 text-teal-400'
            : 'bg-amber-950/40 border-amber-800 text-amber-400'
        }`}>
          <Cpu className="w-6 h-6" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Hardware Acceleration Status
            </span>
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
              isNpu
                ? 'bg-teal-950 border-teal-700 text-teal-300'
                : 'bg-amber-950 border-amber-700 text-amber-300'
            }`}>
              {isNpu ? 'SNAPDRAGON HEXAGON NPU' : 'CPU FALLBACK ACTIVE'}
            </span>
          </div>
          <p className="text-sm font-semibold text-white mt-0.5">
            {hardware.device_name}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {hardware.fallback_reason || 'Qualcomm QNN Execution Provider active across YOLO, PidNet & Whisper models.'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-6 shrink-0">
        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-500 block">
            Target Platform
          </span>
          <span className="text-xs font-semibold text-slate-200">
            Snapdragon X Elite / Plus
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-semibold text-slate-500 block">
            NPU Compute
          </span>
          <span className="text-xs font-semibold text-teal-400">
            {hardware.npu_tops || '45 TOPS Capable'}
          </span>
        </div>

        <button
          onClick={onOpenHardwareView}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 hover:text-sky-300 text-xs font-semibold border border-slate-700 transition-all cursor-pointer"
        >
          <span>Run Benchmarks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
