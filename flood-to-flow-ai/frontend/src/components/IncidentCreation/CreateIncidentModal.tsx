import React, { useState } from 'react';
import {
  X,
  Camera,
  Mic,
  FileText,
  MapPin,
  Users,
  AlertOctagon,
  Sparkles,
  Loader2,
  Check,
  Zap
} from 'lucide-react';
import { IncidentCreatePayload, Incident } from '../../types/incident';

interface CreateIncidentModalProps {
  onClose: () => void;
  onCreated: (incident: Incident) => void;
  onCreateApi: (payload: IncidentCreatePayload) => Promise<Incident>;
}

export const CreateIncidentModal: React.FC<CreateIncidentModalProps> = ({
  onClose,
  onCreated,
  onCreateApi
}) => {
  const [title, setTitle] = useState('');
  const [locationName, setLocationName] = useState('');
  const [latitude, setLatitude] = useState(25.4358);
  const [longitude, setLongitude] = useState(81.8463);
  const [peopleAffected, setPeopleAffected] = useState(5);
  const [vulnerablePresent, setVulnerablePresent] = useState(true);
  const [medicalEmergency, setMedicalEmergency] = useState(true);
  const [roadBlocked, setRoadBlocked] = useState(true);
  const [waterEnteringBuilding, setWaterEnteringBuilding] = useState(true);
  const [manualNotes, setManualNotes] = useState('');
  const [scenarioType, setScenarioType] = useState('residential');
  const [voiceText, setVoiceText] = useState(
    'Water has entered the ground floor. Five people are inside and one elderly resident needs assistance. The nearby road is completely blocked.'
  );
  const [selectedImage, setSelectedImage] = useState('/demo/sample_images/residential_flood.jpg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Preset Scenario Templates for Instant Demonstration
  const presets = [
    {
      name: 'Flagship: Sector 12 Residential Inundation',
      title: 'Residential Flooding near Sector 12',
      location: 'Sector 12, Prayagraj, Uttar Pradesh',
      lat: 25.4358,
      lng: 81.8463,
      people: 5,
      vulnerable: true,
      medical: true,
      road: true,
      building: true,
      type: 'severe_residential',
      image: '/demo/sample_images/residential_flood.jpg',
      voice: 'Water has entered the ground floor. Five people are inside and one elderly resident needs assistance. The nearby road is completely blocked.',
      notes: 'Water rising 2 inches every 15 minutes. 1 senior citizen cannot walk unassisted.'
    },
    {
      name: 'Bypass Underpass: Vehicle Submerged',
      title: 'Road blocked & vehicle stranded in underpass',
      location: 'Kazhakkoottam Bypass, Thiruvananthapuram, Kerala',
      lat: 8.5686,
      lng: 76.8731,
      people: 3,
      vulnerable: false,
      medical: true,
      road: true,
      building: false,
      type: 'road_block',
      image: '/demo/sample_images/underpass_submerged.jpg',
      voice: 'We are trapped on the car roof under the Kazhakkoottam bridge. Water is rising fast and someone has injured their arm trying to climb out.',
      notes: 'Car stalled in underpass. 3 occupants on roof.'
    },
    {
      name: 'Relief Shelter Access Road Cut-off',
      title: 'Community shelter access disrupted',
      location: 'Ward 4 Relief Center, Cuttack, Odisha',
      lat: 20.4625,
      lng: 85.8828,
      people: 25,
      vulnerable: false,
      medical: false,
      road: true,
      building: false,
      type: 'road_block',
      image: '/demo/sample_images/shelter_access.jpg',
      voice: 'The shelter school itself is dry on elevated plinth, but food trucks cannot drive through the inundated school approach road.',
      notes: 'School building dry, but access lane impassable.'
    }
  ];

  const applyPreset = (p: typeof presets[0]) => {
    setTitle(p.title);
    setLocationName(p.location);
    setLatitude(p.lat);
    setLongitude(p.lng);
    setPeopleAffected(p.people);
    setVulnerablePresent(p.vulnerable);
    setMedicalEmergency(p.medical);
    setRoadBlocked(p.road);
    setWaterEnteringBuilding(p.building);
    setScenarioType(p.type);
    setSelectedImage(p.image);
    setVoiceText(p.voice);
    setManualNotes(p.notes);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !locationName) {
      setError('Please provide incident title and location');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const payload: IncidentCreatePayload = {
        title,
        location_name: locationName,
        latitude,
        longitude,
        people_affected: peopleAffected,
        vulnerable_present: vulnerablePresent,
        medical_emergency: medicalEmergency,
        road_blocked: roadBlocked,
        water_entering_building: waterEnteringBuilding,
        manual_notes: manualNotes,
        sample_scenario_type: scenarioType,
        sample_voice_text: voiceText,
        image_url: selectedImage,
        voice_url: '/demo/sample_audio/distress_call_sector12.wav',
        is_demo: true
      };

      const result = await onCreateApi(payload);
      onCreated(result);
    } catch (err: any) {
      setError(err.message || 'Failed to create and triage incident');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-4xl my-8 overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 shrink-0">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span>Create New Disaster Incident</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 border border-sky-800 text-sky-400 font-mono">
                Multimodal Input
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Provide visual photographs, voice dispatch recordings, and field observations
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300">
              {error}
            </div>
          )}

          {/* Quick Scenario Templates */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              ⚡ Quick Template Load (For Evaluation & Demos):
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {presets.map((p, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-sky-500/50 text-left transition-all cursor-pointer"
                >
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="line-clamp-1">{p.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                    {p.location}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left Column: Basic Details & Modalities */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Incident Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Ground-floor residential flooding"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Location Name *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    placeholder="e.g. Sector 12, Prayagraj, Uttar Pradesh"
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={latitude}
                    onChange={(e) => setLatitude(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={longitude}
                    onChange={(e) => setLongitude(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>

              {/* Media Evidence Uploader (Simulated / Local Files) */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wide">
                    Flood Image Evidence
                  </span>
                </div>
                {selectedImage && (
                  <div className="rounded-lg overflow-hidden border border-slate-800 h-28 relative">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1 right-2 text-[10px] bg-black/80 px-2 py-0.5 rounded text-teal-300 font-mono">
                      Ready for YOLOv8/PidNet
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Voice Note & Field Checklist */}
            <div className="space-y-4">
              {/* Voice Dispatch Audio */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4 text-sky-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wide">
                      Voice Distress Call
                    </span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-mono">
                    Whisper Local
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={voiceText}
                  onChange={(e) => setVoiceText(e.target.value)}
                  placeholder="Type or simulate incoming spoken voice report..."
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-sky-500 italic"
                />
              </div>

              {/* Field Observation Checklists */}
              <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 space-y-3">
                <span className="text-xs font-bold text-white uppercase tracking-wide block">
                  Human Field Observations Checklist
                </span>

                <div className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800">
                  <span className="text-xs text-slate-300 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    People Affected:
                  </span>
                  <input
                    type="number"
                    min="1"
                    value={peopleAffected}
                    onChange={(e) => setPeopleAffected(parseInt(e.target.value) || 1)}
                    className="w-16 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-white text-center"
                  />
                </div>

                <label className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 cursor-pointer">
                  <span className="text-xs text-slate-300">Vulnerable People Present? (Elderly/Children)</span>
                  <input
                    type="checkbox"
                    checked={vulnerablePresent}
                    onChange={(e) => setVulnerablePresent(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 cursor-pointer">
                  <span className="text-xs text-slate-300">Medical Emergency / Immediate Rescue?</span>
                  <input
                    type="checkbox"
                    checked={medicalEmergency}
                    onChange={(e) => setMedicalEmergency(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 cursor-pointer">
                  <span className="text-xs text-slate-300">Road Blocked / Impassable?</span>
                  <input
                    type="checkbox"
                    checked={roadBlocked}
                    onChange={(e) => setRoadBlocked(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded bg-slate-950 border border-slate-800 cursor-pointer">
                  <span className="text-xs text-slate-300">Water Entering Building Interior?</span>
                  <input
                    type="checkbox"
                    checked={waterEnteringBuilding}
                    onChange={(e) => setWaterEnteringBuilding(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-sky-500 focus:ring-sky-500 cursor-pointer"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Submission Bar */}
          <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/90 flex items-center justify-between">
            <p className="text-xs text-slate-400">
              Inference executes 100% locally via Snapdragon NPU / CPU ModelRunner.
            </p>

            <button
              type="submit"
              disabled={isProcessing}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-sky-600/30 transition-all cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Running Multimodal AI Triage...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Execute Local AI Triage</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
