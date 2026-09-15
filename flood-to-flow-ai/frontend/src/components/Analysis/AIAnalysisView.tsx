import React from 'react';
import {
  BrainCircuit,
  Camera,
  Mic,
  Cpu,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  Activity
} from 'lucide-react';
import { HardwareStatus, Incident } from '../../types/incident';

interface AIAnalysisViewProps {
  hardware: HardwareStatus | null;
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
}

export const AIAnalysisView: React.FC<AIAnalysisViewProps> = ({
  hardware,
  incidents,
  onSelectIncident
}) => {
  const isNpu = hardware?.active_provider === 'QNNExecutionProvider';

  return (
    <div className="space-y-6">
      {/* Pipeline Explanation Card */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Multimodal Local AI Pipeline Architecture
            </h2>
            <p className="text-xs text-slate-400">
              Zero-cloud execution optimized for Snapdragon Hexagon NPU & Windows ML ONNX Runtime
            </p>
          </div>
        </div>

        {/* Pipeline Flow Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 pt-2">
          {/* Stage 1 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-teal-400 font-bold text-xs">
              <Camera className="w-4 h-4" />
              <span>1. Vision Pipeline</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              <strong>YOLOv8 + PidNet</strong>
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Detects submerged vehicles, blocked roadways, breached doors, and calculates surface water inundation ratio.
            </p>
          </div>

          {/* Stage 2 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
              <Mic className="w-4 h-4" />
              <span>2. Speech Pipeline</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              <strong>Whisper Local</strong>
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Transcribes audio calls in real time and extracts vulnerable residents (elderly/infants), medical needs, and access cuts.
            </p>
          </div>

          {/* Stage 3 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
              <Sparkles className="w-4 h-4" />
              <span>3. Fusion Engine</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              <strong>Cross-Validation</strong>
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Corroborates claims across vision, speech, and field counts to establish high-confidence consensus.
            </p>
          </div>

          {/* Stage 4 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>4. Explainable Triage</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              <strong>Transparent Points</strong>
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Calculates deterministic priority score (+30, +25, +20, +15, +10) and synthesizes field response actions.
            </p>
          </div>
        </div>
      </div>

      {/* Model Specifications Table */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Target Qualcomm AI Hub Model Manifest
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3">Model</th>
                <th className="p-3">Architecture</th>
                <th className="p-3">Quantization</th>
                <th className="p-3">Target Hardware</th>
                <th className="p-3">Role in Emergency Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-white">yolov8n-flood</td>
                <td className="p-3">YOLOv8 Nano</td>
                <td className="p-3 font-mono text-teal-400">INT8 / FP16</td>
                <td className="p-3 text-sky-400 font-semibold">Snapdragon Hexagon NPU</td>
                <td className="p-3">Detects submerged cars, standing water, blocked streets</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-white">pidnet-s-water</td>
                <td className="p-3">PIDNet Small</td>
                <td className="p-3 font-mono text-teal-400">INT8</td>
                <td className="p-3 text-sky-400 font-semibold">Snapdragon Hexagon NPU</td>
                <td className="p-3">Water surface area segmentation & road submergence index</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-3 font-semibold text-white">whisper-base-en</td>
                <td className="p-3">Whisper Base</td>
                <td className="p-3 font-mono text-teal-400">INT8</td>
                <td className="p-3 text-sky-400 font-semibold">Snapdragon Hexagon NPU</td>
                <td className="p-3">Offline 911 distress speech recognition & entity tagging</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
