import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Zap,
  Activity,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCw,
  FileSpreadsheet,
  Info,
  Server
} from 'lucide-react';
import { HardwareStatus } from '../../types/incident';
import { api } from '../../services/api';

interface HardwareAccelerationViewProps {
  hardware: HardwareStatus | null;
  onRefreshHardware: () => void;
}

export const HardwareAccelerationView: React.FC<HardwareAccelerationViewProps> = ({
  hardware,
  onRefreshHardware
}) => {
  const [benchmarkData, setBenchmarkData] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExistingResults = async () => {
    try {
      const res = await api.getBenchmarkResults();
      setBenchmarkData(res);
    } catch (e: any) {
      // Benchmark not yet run
    }
  };

  useEffect(() => {
    fetchExistingResults();
  }, []);

  const handleRunBenchmark = async () => {
    setIsRunning(true);
    setError(null);
    try {
      const res = await api.runBenchmark(5);
      setBenchmarkData(res);
    } catch (e: any) {
      setError(e.message || 'Benchmark execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  if (!hardware) return null;

  const isNpu = hardware.active_provider === 'QNNExecutionProvider';

  return (
    <div className="space-y-6">
      {/* Top Banner & Hardware Profile */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`p-3.5 rounded-2xl border ${
              isNpu
                ? 'bg-teal-950/60 border-teal-700 text-teal-400'
                : 'bg-amber-950/60 border-amber-700 text-amber-400'
            }`}>
              <Cpu className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  Snapdragon NPU Acceleration Architecture
                </h2>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                  isNpu
                    ? 'bg-teal-950 border-teal-700 text-teal-300'
                    : 'bg-amber-950 border-amber-700 text-amber-300'
                }`}>
                  {isNpu ? 'NPU ACTIVE' : 'CPU FALLBACK'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Target Platform: Snapdragon X Elite / Snapdragon X Plus (45 TOPS Qualcomm Hexagon NPU)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefreshHardware}
              className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Refresh Hardware Probe"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleRunBenchmark}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-500 hover:to-sky-500 text-white font-bold text-xs shadow-lg shadow-teal-600/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isRunning ? <RotateCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Benchmarking Hardware...' : 'Run Local Benchmark'}</span>
            </button>
          </div>
        </div>

        {/* 4-Item Telemetry Matrix (Required for competition demo) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Execution Provider
            </span>
            <span className={`text-sm font-extrabold ${isNpu ? 'text-teal-400' : 'text-amber-400'}`}>
              {hardware.active_provider}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              {isNpu ? 'Qualcomm QNN Runtime' : 'Universal Fallback Provider'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Active Multimodal Models
            </span>
            <span className="text-sm font-extrabold text-white">
              YOLOv8 + PidNet + Whisper
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Qualcomm AI Hub Target Models
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Inference Latency
            </span>
            <span className="text-sm font-extrabold text-sky-400">
              {benchmarkData?.models?.yolov8n_object_detection?.avg_total_ms
                ? `${benchmarkData.models.yolov8n_object_detection.avg_total_ms} ms (Vision Pipeline)`
                : 'Not yet benchmarked'}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Measured on active host hardware
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Detected Host Device
            </span>
            <span className="text-sm font-extrabold text-white truncate block" title={hardware.device_name}>
              {hardware.device_name}
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Architecture: {hardware.architecture} ({hardware.os})
            </span>
          </div>
        </div>

        {/* Fallback & Architectural Status Explanation */}
        {hardware.fallback_reason && (
          <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block mb-0.5">Execution Provider Diagnostic Note:</strong>
              {hardware.fallback_reason}
            </div>
          </div>
        )}
      </div>

      {/* Latency Benchmark Results Section */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-950 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Multimodal Inference Latency Breakdown
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {benchmarkData?.timestamp ? `Last Run: ${benchmarkData.timestamp}` : 'Awaiting Run'}
          </span>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300">
            {error}
          </div>
        )}

        {benchmarkData ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-900 text-slate-300 font-bold border-b border-slate-800">
                <tr>
                  <th className="p-3">Model Architecture</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Active Provider</th>
                  <th className="p-3">Preprocess</th>
                  <th className="p-3">Inference</th>
                  <th className="p-3">Postprocess</th>
                  <th className="p-3 text-right">Total Pipeline Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {/* YOLO */}
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3 font-semibold text-white">yolov8n-flood</td>
                  <td className="p-3 text-slate-400">Object Detection (Vehicles, Roads)</td>
                  <td className="p-3 font-mono text-slate-300">{benchmarkData.models.yolov8n_object_detection.execution_provider}</td>
                  <td className="p-3 font-mono text-slate-400">{benchmarkData.models.yolov8n_object_detection.avg_preprocess_ms} ms</td>
                  <td className="p-3 font-mono text-sky-400 font-bold">{benchmarkData.models.yolov8n_object_detection.avg_inference_ms} ms</td>
                  <td className="p-3 font-mono text-slate-400">{benchmarkData.models.yolov8n_object_detection.avg_postprocess_ms} ms</td>
                  <td className="p-3 text-right font-mono font-extrabold text-teal-400">{benchmarkData.models.yolov8n_object_detection.avg_total_ms} ms</td>
                </tr>

                {/* PidNet */}
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3 font-semibold text-white">pidnet-s-water</td>
                  <td className="p-3 text-slate-400">Water Segmentation / Depth Ratio</td>
                  <td className="p-3 font-mono text-slate-300">{benchmarkData.models.pidnet_s_segmentation.execution_provider}</td>
                  <td className="p-3 font-mono text-slate-400">{benchmarkData.models.pidnet_s_segmentation.avg_preprocess_ms} ms</td>
                  <td className="p-3 font-mono text-sky-400 font-bold">{benchmarkData.models.pidnet_s_segmentation.avg_inference_ms} ms</td>
                  <td className="p-3 font-mono text-slate-400">{benchmarkData.models.pidnet_s_segmentation.avg_postprocess_ms} ms</td>
                  <td className="p-3 text-right font-mono font-extrabold text-teal-400">{benchmarkData.models.pidnet_s_segmentation.avg_total_ms} ms</td>
                </tr>

                {/* Whisper */}
                <tr className="hover:bg-slate-900/40">
                  <td className="p-3 font-semibold text-white">whisper-base-en</td>
                  <td className="p-3 text-slate-400">Speech Transcription & Entities</td>
                  <td className="p-3 font-mono text-slate-300">{benchmarkData.models.whisper_base_speech.execution_provider}</td>
                  <td className="p-3 font-mono text-slate-400">{benchmarkData.models.whisper_base_speech.avg_preprocess_ms} ms</td>
                  <td className="p-3 font-mono text-sky-400 font-bold">{benchmarkData.models.whisper_base_speech.avg_inference_ms} ms</td>
                  <td className="p-3 font-mono text-slate-400">--</td>
                  <td className="p-3 text-right font-mono font-extrabold text-teal-400">{benchmarkData.models.whisper_base_speech.avg_total_ms} ms</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center rounded-xl border border-dashed border-slate-800 text-slate-500 text-xs">
            No live benchmark captured on this session. Click "Run Local Benchmark" above to test on this machine.
          </div>
        )}

        {/* Honest NPU Status Footer Note */}
        <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            {benchmarkData?.comparison?.npu_status_note ||
              'Strict Zero-Fabrication Policy: Measured on active local processor. Deploy on HP Snapdragon PC to record Qualcomm Hexagon NPU acceleration.'}
          </span>
        </div>
      </div>
    </div>
  );
};
