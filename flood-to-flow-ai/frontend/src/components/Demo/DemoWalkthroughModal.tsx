import React, { useState } from 'react';
import {
  X,
  Zap,
  CheckCircle2,
  ArrowRight,
  Camera,
  Mic,
  BrainCircuit,
  Flame,
  FileText,
  MapPin,
  Clock,
  Sparkles,
  ShieldAlert
} from 'lucide-react';
import { Incident } from '../../types/incident';
import { api } from '../../services/api';

interface DemoWalkthroughModalProps {
  onClose: () => void;
  onViewIncident: (incident: Incident) => void;
  onDownloadPdf: (incidentId: string) => void;
}

export const DemoWalkthroughModal: React.FC<DemoWalkthroughModalProps> = ({
  onClose,
  onViewIncident,
  onDownloadPdf
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isResetting, setIsResetting] = useState(false);
  const [demoIncident, setDemoIncident] = useState<Incident | null>(null);

  const steps = [
    {
      num: 1,
      title: 'Disaster Ingestion & Evidence',
      icon: Camera,
      desc: 'Ground photo of inundated residential street + 911 distress voice audio note loaded.'
    },
    {
      num: 2,
      title: 'Snapdragon Local AI Pipeline',
      icon: BrainCircuit,
      desc: 'YOLOv8 detects submerged car & blocked road; Whisper transcribes audio and extracts vulnerable resident.'
    },
    {
      num: 3,
      title: 'Multimodal Fusion Consensus',
      icon: Sparkles,
      desc: 'Vision and speech agree: 5 people trapped, elderly senior requiring rescue, road impassable (96% conf).'
    },
    {
      num: 4,
      title: 'Explainable Triage & Actions',
      icon: Flame,
      desc: 'HIGH PRIORITY (100/100 points). Transparent breakdown: +30 vulnerable, +25 medical, +20 building, +15 road, +10 water.'
    }
  ];

  const handleActivateDemo = async () => {
    setIsResetting(true);
    try {
      const res = await api.resetFlagshipDemo();
      setDemoIncident(res.incident);
      setCurrentStep(4);
    } catch (e) {
      console.error(e);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
              <Zap className="w-6 h-6 fill-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  90-Second Competition Judge Walkthrough
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                  Flagship Scenario
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Ground-floor residential flooding near community road, Sector 12, Prayagraj
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-900/30">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCompleted = currentStep >= s.num;
            const isCurrent = currentStep === s.num;

            return (
              <div
                key={s.num}
                onClick={() => setCurrentStep(s.num)}
                className={`p-3.5 border-r border-slate-800 last:border-r-0 flex items-center gap-2.5 cursor-pointer transition-all ${
                  isCurrent
                    ? 'bg-slate-900 text-sky-400 border-b-2 border-b-sky-500'
                    : isCompleted
                    ? 'text-teal-400'
                    : 'text-slate-500 opacity-60'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isCurrent ? 'bg-sky-500 text-slate-950' : isCompleted ? 'bg-teal-950 text-teal-300 border border-teal-700' : 'bg-slate-800 text-slate-400'
                }`}>
                  {s.num}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-[11px] font-bold truncate">{s.title}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step Dynamic Content */}
        <div className="p-6 space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Camera className="w-4 h-4 text-sky-400" />
                <span>Step 1: Raw Unstructured Multimodal Ingestion</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-900/40 p-3 space-y-2">
                  <span className="text-xs font-bold text-slate-300 block">Visual Photograph (Ground Level):</span>
                  <img
                    src="/demo/sample_images/residential_flood.jpg"
                    alt="Flood"
                    className="w-full h-44 object-cover rounded-lg"
                  />
                  <p className="text-[11px] text-slate-400">
                    Uploaded by citizen volunteer at Sector 12, Prayagraj.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Voice Distress Dispatch:</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                      16kHz Mono WAV
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 italic leading-relaxed">
                    "Water has entered the ground floor. Five people are inside and one elderly resident needs assistance. The nearby road is completely blocked."
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-1">
                    <span className="text-slate-400 block text-[10px] font-bold uppercase">Manual Observation:</span>
                    <p className="text-slate-300">5 people affected, 1 elderly bedridden, medical emergency flagged, water entering living area.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-teal-400" />
                <span>Step 2: Local AI Model Execution (Snapdragon NPU / CPU Fallback)</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2.5">
                  <span className="text-xs font-bold text-teal-400 uppercase tracking-wide block">
                    VisionRunner (YOLOv8 + PidNet)
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                      <span className="text-slate-300">Standing Floodwater:</span>
                      <span className="text-teal-400 font-mono font-bold">97% Conf (58% surface area)</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                      <span className="text-slate-300">Submerged Vehicle:</span>
                      <span className="text-teal-400 font-mono font-bold">94% Conf</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                      <span className="text-slate-300">Blocked Roadway:</span>
                      <span className="text-teal-400 font-mono font-bold">96% Conf</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                      <span className="text-slate-300">Breached Door Threshold:</span>
                      <span className="text-teal-400 font-mono font-bold">91% Conf</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2.5">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wide block">
                    SpeechRunner (Whisper Local Transcription)
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                      <span className="text-slate-300">Vulnerable Person:</span>
                      <span className="text-rose-400 font-bold">"elderly resident"</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                      <span className="text-slate-300">Medical Urgency:</span>
                      <span className="text-rose-400 font-bold">"needs assistance"</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                      <span className="text-slate-300">Building Breached:</span>
                      <span className="text-sky-400 font-bold">"ground floor"</span>
                    </div>
                    <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                      <span className="text-slate-300">Road Condition:</span>
                      <span className="text-amber-400 font-bold">"completely blocked"</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Step 3: Multimodal Fusion & Cross-Verification</span>
              </h3>
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
                <p className="text-xs text-slate-300">
                  The Fusion Engine correlates signals across Computer Vision, Audio Transcription, and Field Entries to eliminate false alarms and compute high consensus confidence (<strong>96%</strong>).
                </p>
                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2 text-teal-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Road blockage corroborated across Vision detection and Voice distress call.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2 text-teal-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Building entrance inundation confirmed across Vision flood level and spoken description.</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center gap-2 text-teal-300">
                    <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
                    <span>Vulnerable senior citizen presence verified across field entry and audio note.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Flame className="w-4 h-4 text-red-400" />
                  <span>Step 4: Explainable Triage Verdict (HIGH PRIORITY - 100/100)</span>
                </h3>
                <span className="text-xs font-mono font-bold text-red-400 bg-red-950/80 px-2.5 py-1 rounded-full border border-red-700">
                  TOTAL = 100 PTS
                </span>
              </div>

              {/* Transparent Points Formula Card */}
              <div className="p-4 rounded-xl border border-red-900/40 bg-red-950/20 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-slate-300">Vulnerable Resident Present:</span>
                    <span className="text-sky-400 font-mono font-bold">+30 pts</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-slate-300">Medical Assistance Requested:</span>
                    <span className="text-sky-400 font-mono font-bold">+25 pts</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-slate-300">Building Flooded / Entrance Breached:</span>
                    <span className="text-sky-400 font-mono font-bold">+20 pts</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                    <span className="text-slate-300">Road Blocked / Route Cut Off:</span>
                    <span className="text-sky-400 font-mono font-bold">+15 pts</span>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between md:col-span-2">
                    <span className="text-slate-300">Severe Water & Submerged Vehicle:</span>
                    <span className="text-sky-400 font-mono font-bold">+10 pts</span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                  <strong>Reasoning:</strong> Vulnerable person + medical need + building structural threat + infrastructure disruption.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Directives: Deploy Evacuation Boat Team + Dispatch Medical Triage + De-energize Sector Feeder</span>
                <span className="text-teal-400 font-bold">Field-Ready</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <button
            type="button"
            onClick={handleActivateDemo}
            disabled={isResetting}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>{isResetting ? 'Initializing Flagship Demo...' : 'Load 1-Click Flagship Incident'}</span>
          </button>

          <div className="flex items-center gap-2">
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => Math.min(4, prev + 1))}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs transition-all cursor-pointer"
              >
                <span>Next Stage</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  if (!demoIncident) {
                    const res = await api.resetFlagshipDemo();
                    onViewIncident(res.incident);
                  } else {
                    onViewIncident(demoIncident);
                  }
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Open Incident & Generate Brief</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
