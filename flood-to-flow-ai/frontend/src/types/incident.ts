export type PriorityLevel = 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'PENDING' | 'TRIAGED' | 'DISPATCHED' | 'RESOLVED';

export interface Detection {
  label: string;
  class_name: string;
  confidence: number;
  bbox?: [number, number, number, number];
  severity_impact?: string;
  description?: string;
}

export interface VisualEvidence {
  model: string;
  provider: string;
  device: string;
  detections: Detection[];
  water_coverage_percentage: number;
  water_coverage_ratio?: number;
  road_submerged?: boolean;
  building_entrance_flooded?: boolean;
  estimated_depth_cm?: number;
  hazard_category?: string;
  latency_ms?: number;
}

export interface VoiceEntities {
  vulnerable_person_detected: boolean;
  vulnerable_terms: string[];
  medical_emergency_detected: boolean;
  medical_terms: string[];
  building_impact_detected: boolean;
  building_terms: string[];
  road_blockage_detected: boolean;
  road_terms: string[];
  people_count_extracted: number;
}

export interface VoiceEvidence {
  model: string;
  provider: string;
  device: string;
  transcript: string;
  confidence: number;
  entities: VoiceEntities;
  latency_ms?: number;
}

export interface FusedEvidence {
  vulnerable_confirmed: boolean;
  medical_confirmed: boolean;
  building_impact_confirmed: boolean;
  road_blockage_confirmed: boolean;
  people_count: number;
  water_ratio: number;
  submerged_vehicle: boolean;
  overall_confidence: number;
  corroborations: string[];
  ai_findings: string[];
  voice_findings: string[];
  human_findings: string[];
  raw_voice_transcript?: string;
}

export interface PointsBreakdownItem {
  factor: string;
  points: number;
  source: string;
  detail: string;
}

export interface RecommendedAction {
  title: string;
  type: string;
  description: string;
}

export interface TriageAssessment {
  priority: PriorityLevel;
  priority_color: string;
  total_score: number;
  max_score: number;
  headline_reason: string;
  detailed_reasoning: string;
  points_breakdown: PointsBreakdownItem[];
  recommended_actions: RecommendedAction[];
  safety_disclaimer: string;
}

export interface Incident {
  id: string;
  title: string;
  location_name: string;
  latitude: number;
  longitude: number;
  priority: PriorityLevel;
  priority_score: number;
  status: IncidentStatus;
  people_affected: number;
  vulnerable_present: boolean;
  medical_emergency: boolean;
  road_blocked: boolean;
  water_entering_building: boolean;
  manual_notes?: string;
  image_url?: string;
  voice_url?: string;
  execution_provider: string;
  is_demo: boolean;
  created_at: string;
  updated_at: string;
  visual_evidence?: VisualEvidence;
  voice_evidence?: VoiceEvidence;
  fused_evidence?: FusedEvidence;
  triage_assessment?: TriageAssessment;
}

export interface IncidentCreatePayload {
  title: string;
  location_name: string;
  latitude: number;
  longitude: number;
  people_affected: number;
  vulnerable_present: boolean;
  medical_emergency: boolean;
  road_blocked: boolean;
  water_entering_building: boolean;
  manual_notes?: string;
  sample_scenario_type?: string;
  sample_voice_text?: string;
  image_url?: string;
  voice_url?: string;
  is_demo?: boolean;
}

export interface HardwareStatus {
  os: string;
  architecture: string;
  processor: string;
  device_name: string;
  is_snapdragon_detected: boolean;
  npu_available: boolean;
  npu_tops?: string | null;
  active_provider: string;
  available_providers: string[];
  fallback_active: boolean;
  fallback_reason?: string | null;
  benchmark_status: string;
  recommended_target: string;
}

export interface DashboardStats {
  total_incidents: number;
  high_priority_count: number;
  medium_priority_count: number;
  low_priority_count: number;
  active_triaged_count: number;
  dispatched_count: number;
  medical_emergencies_count: number;
  road_blockages_count: number;
  hardware_status: HardwareStatus;
}
