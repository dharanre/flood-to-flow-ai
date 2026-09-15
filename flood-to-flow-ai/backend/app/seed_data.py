"""
Seed Data Generator for Flood-to-Flow AI.
Populates realistic Indian flood scenarios with complete multimodal AI evidence,
transcripts, fused findings, and explainable triage breakdowns.
"""

import json
from sqlalchemy.orm import Session
from backend.app.models import Incident
from backend.app.database import engine, Base


def seed_database_if_empty(db: Session):
    """Seed 5 realistic Indian disaster scenarios if database is empty."""
    Base.metadata.create_all(bind=engine)

    existing_count = db.query(Incident).count()
    if existing_count > 0:
        return

    sample_incidents = [
        # Incident A: Residential Flooding (High Priority - Flagship Demo)
        {
            "id": "INC-2026-8801",
            "title": "Ground-floor flooding near residential block",
            "location_name": "Sector 12, Prayagraj, Uttar Pradesh",
            "latitude": 25.4358,
            "longitude": 81.8463,
            "priority": "HIGH",
            "priority_score": 100,
            "status": "TRIAGED",
            "people_affected": 5,
            "vulnerable_present": True,
            "medical_emergency": True,
            "road_blocked": True,
            "water_entering_building": True,
            "manual_notes": "Water breached threshold rapidly after drainage culvert failure. 1 bedridden senior requires immediate rescue.",
            "execution_provider": "CPUExecutionProvider",
            "is_demo": True,
            "image_url": "/demo/sample_images/residential_flood.jpg",
            "voice_url": "/demo/sample_audio/distress_call_sector12.wav",
            "visual_evidence": {
                "model": "yolov8n-flood-qualcomm-aihub.onnx",
                "provider": "CPUExecutionProvider",
                "water_coverage_percentage": 58.0,
                "hazard_category": "Severe Inundation",
                "detections": [
                    {"label": "standing_water", "class_name": "Severe Standing Floodwater", "confidence": 0.97, "severity_impact": "critical"},
                    {"label": "submerged_vehicle", "class_name": "Partially Submerged Vehicle", "confidence": 0.94, "severity_impact": "high"},
                    {"label": "blocked_road", "class_name": "Inundated / Blocked Roadway", "confidence": 0.96, "severity_impact": "high"},
                    {"label": "building_entrance_flooded", "class_name": "Flooded Building Entrance", "confidence": 0.91, "severity_impact": "high"}
                ]
            },
            "voice_evidence": {
                "model": "whisper-base-qualcomm-aihub.onnx",
                "provider": "CPUExecutionProvider",
                "confidence": 0.96,
                "transcript": "Water has entered the ground floor. Five people are inside and one elderly resident needs assistance. The nearby road is completely blocked.",
                "entities": {
                    "vulnerable_person_detected": True,
                    "vulnerable_terms": ["elderly resident"],
                    "medical_emergency_detected": True,
                    "medical_terms": ["needs assistance"],
                    "building_impact_detected": True,
                    "building_terms": ["ground floor", "inside"],
                    "road_blockage_detected": True,
                    "road_terms": ["road", "blocked"],
                    "people_count_extracted": 5
                }
            },
            "fused_evidence": {
                "vulnerable_confirmed": True,
                "medical_confirmed": True,
                "building_impact_confirmed": True,
                "road_blockage_confirmed": True,
                "people_count": 5,
                "water_ratio": 0.58,
                "submerged_vehicle": True,
                "overall_confidence": 0.96,
                "corroborations": [
                    "Road blockage corroborated across Vision and Speech reports.",
                    "Building entrance inundation corroborated across Vision and Speech reports.",
                    "Vulnerable resident presence verified across voice call and field entry."
                ],
                "ai_findings": [
                    "Severe standing floodwater detected (Estimated surface ratio: 58%)",
                    "Partially submerged vehicle identified in roadway",
                    "Surface road impassable due to deep moving water",
                    "Ground floor building entrance breached by flood level"
                ],
                "voice_findings": [
                    "Vulnerable person explicitly mentioned (elderly resident)",
                    "Medical aid or urgent evacuation requested",
                    "Water entering ground floor reported by caller",
                    "Blocked community transit route described"
                ],
                "human_findings": [
                    "5 people affected",
                    "Vulnerable persons present: Yes",
                    "Medical emergency flagged: Yes",
                    "Road blocked: Yes",
                    "Water inside building: Yes"
                ]
            },
            "triage_assessment": {
                "priority": "HIGH",
                "priority_color": "red",
                "total_score": 100,
                "max_score": 100,
                "headline_reason": "Why this incident is HIGH priority",
                "detailed_reasoning": "Vulnerable resident + medical need + building structural threat + infrastructure disruption + deep standing water + multiple occupants.",
                "points_breakdown": [
                    {"factor": "Vulnerable resident present", "points": 30, "source": "Speech & Manual", "detail": "Elderly resident requiring emergency evacuation."},
                    {"factor": "Medical assistance requested", "points": 25, "source": "Speech / Field observation", "detail": "Urgent health intervention or emergency medical transport indicated."},
                    {"factor": "Building flooded / entrance breached", "points": 20, "source": "Vision & Speech", "detail": "Water entered ground floor living area."},
                    {"factor": "Road blocked / route cut off", "points": 15, "source": "Vision & Speech", "detail": "Primary evacuation route submerged and impassable."},
                    {"factor": "Severe floodwater evidence", "points": 10, "source": "Vision (YOLOv8 & PidNet)", "detail": "High surface water ratio (58%) with submerged vehicle."}
                ],
                "recommended_actions": [
                    {"title": "Deploy Evacuation Boat Team", "type": "evacuation", "description": "Dispatch inflatable boat or high-clearance rescue vehicle for elderly occupant evacuation."},
                    {"title": "Dispatch Emergency Medical Triage", "type": "medical", "description": "Alert district emergency medical post with BLS kit and stretcher."},
                    {"title": "Establish Route Bypass & Perimeter", "type": "traffic", "description": "Coordinate traffic diversion around submerged Sector 12 access road."},
                    {"title": "De-energize Ground Power Feed", "type": "safety", "description": "Request state electricity board de-energize sector feeder to prevent electrocution."}
                ],
                "safety_disclaimer": "AI-assisted assessment — verify critical decisions with trained emergency personnel."
            }
        },

        # Incident B: Road Blocked / Stranded Vehicle (High Priority)
        {
            "id": "INC-2026-8802",
            "title": "Road blocked & vehicle stranded in underpass",
            "location_name": "Kazhakkoottam Bypass, Thiruvananthapuram, Kerala",
            "latitude": 8.5686,
            "longitude": 76.8731,
            "priority": "HIGH",
            "priority_score": 75,
            "status": "DISPATCHED",
            "people_affected": 3,
            "vulnerable_present": False,
            "medical_emergency": True,
            "road_blocked": True,
            "water_entering_building": False,
            "manual_notes": "Car stalled in railway underpass under 4 feet of fast-rising stormwater. 3 occupants on roof.",
            "execution_provider": "CPUExecutionProvider",
            "is_demo": True,
            "image_url": "/demo/sample_images/underpass_submerged.jpg",
            "voice_url": "/demo/sample_audio/underpass_call.wav",
            "visual_evidence": {
                "model": "yolov8n-flood-qualcomm-aihub.onnx",
                "provider": "CPUExecutionProvider",
                "water_coverage_percentage": 64.0,
                "hazard_category": "Severe Inundation",
                "detections": [
                    {"label": "standing_water", "class_name": "Severe Standing Floodwater", "confidence": 0.98, "severity_impact": "critical"},
                    {"label": "submerged_vehicle", "class_name": "Partially Submerged Vehicle", "confidence": 0.95, "severity_impact": "high"},
                    {"label": "blocked_road", "class_name": "Inundated / Blocked Roadway", "confidence": 0.97, "severity_impact": "high"}
                ]
            },
            "voice_evidence": {
                "model": "whisper-base-qualcomm-aihub.onnx",
                "provider": "CPUExecutionProvider",
                "confidence": 0.94,
                "transcript": "We are trapped on the car roof under the Kazhakkoottam bridge. Water is rising fast and someone has injured their arm trying to climb out.",
                "entities": {
                    "vulnerable_person_detected": False,
                    "vulnerable_terms": [],
                    "medical_emergency_detected": True,
                    "medical_terms": ["injured", "arm"],
                    "building_impact_detected": False,
                    "building_terms": [],
                    "road_blockage_detected": True,
                    "road_terms": ["under the bridge", "water is rising"],
                    "people_count_extracted": 3
                }
            },
            "fused_evidence": {
                "vulnerable_confirmed": False,
                "medical_confirmed": True,
                "building_impact_confirmed": False,
                "road_blockage_confirmed": True,
                "people_count": 3,
                "water_ratio": 0.64,
                "submerged_vehicle": True,
                "overall_confidence": 0.95,
                "corroborations": ["Underpass road blockage confirmed by vision and emergency audio."],
                "ai_findings": ["Submerged vehicle identified", "Underpass road completely blocked by 4ft water"],
                "voice_findings": ["Occupants on roof", "Injured passenger reported"],
                "human_findings": ["3 people stranded", "Medical emergency: Yes"]
            },
            "triage_assessment": {
                "priority": "HIGH",
                "priority_color": "red",
                "total_score": 75,
                "max_score": 100,
                "headline_reason": "Why this incident is HIGH priority",
                "detailed_reasoning": "Medical emergency + acute road blockage + vehicle submergence in rapid rising water.",
                "points_breakdown": [
                    {"factor": "Medical emergency", "points": 25, "source": "Speech", "detail": "Injured occupant trapped on vehicle."},
                    {"factor": "Road blocked / underpass submerged", "points": 15, "source": "Vision & Speech", "detail": "Key underpass completely impassable."},
                    {"factor": "Severe water & submerged vehicle", "points": 10, "source": "Vision (YOLO)", "detail": "Vehicle stalled under fast-rising storm runoff."}
                ],
                "recommended_actions": [
                    {"title": "Deploy Rescue Boat & Ladder Rig", "type": "evacuation", "description": "Dispatch fast water rescue unit to extract occupants from vehicle roof."},
                    {"title": "Deploy Paramedic Unit", "type": "medical", "description": "Triage injured passenger arm laceration upon extraction."}
                ],
                "safety_disclaimer": "AI-assisted assessment — verify critical decisions with trained emergency personnel."
            }
        },

        # Incident C: Community Shelter Access Disrupted (Medium Priority)
        {
            "id": "INC-2026-8803",
            "title": "Community shelter access disrupted",
            "location_name": "Ward 4 Relief Center, Cuttack, Odisha",
            "latitude": 20.4625,
            "longitude": 85.8828,
            "priority": "MEDIUM",
            "priority_score": 55,
            "status": "TRIAGED",
            "people_affected": 25,
            "vulnerable_present": False,
            "medical_emergency": False,
            "road_blocked": True,
            "water_entering_building": False,
            "manual_notes": "Main approach lane to government school shelter is flooded by 1.5 ft of water. Food delivery trucks cannot enter.",
            "execution_provider": "CPUExecutionProvider",
            "is_demo": True,
            "image_url": "/demo/sample_images/shelter_access.jpg",
            "voice_url": "/demo/sample_audio/shelter_report.wav",
            "visual_evidence": {
                "model": "yolov8n-flood-qualcomm-aihub.onnx",
                "provider": "CPUExecutionProvider",
                "water_coverage_percentage": 42.0,
                "hazard_category": "Moderate Waterlogging",
                "detections": [
                    {"label": "standing_water", "class_name": "Moderate Standing Water", "confidence": 0.92, "severity_impact": "medium"},
                    {"label": "blocked_road", "class_name": "Inundated Access Lane", "confidence": 0.91, "severity_impact": "high"}
                ]
            },
            "voice_evidence": {
                "model": "whisper-base-qualcomm-aihub.onnx",
                "provider": "CPUExecutionProvider",
                "confidence": 0.93,
                "transcript": "The shelter school itself is dry on elevated plinth, but food trucks cannot drive through the inundated school approach road.",
                "entities": {
                    "vulnerable_person_detected": False,
                    "vulnerable_terms": [],
                    "medical_emergency_detected": False,
                    "medical_terms": [],
                    "building_impact_detected": False,
                    "building_terms": ["shelter school dry"],
                    "road_blockage_detected": True,
                    "road_terms": ["inundated approach road"],
                    "people_count_extracted": 25
                }
            },
            "fused_evidence": {
                "vulnerable_confirmed": False,
                "medical_confirmed": False,
                "building_impact_confirmed": False,
                "road_blockage_confirmed": True,
                "people_count": 25,
                "water_ratio": 0.42,
                "submerged_vehicle": False,
                "overall_confidence": 0.91,
                "corroborations": ["Shelter approach road blockage confirmed."],
                "ai_findings": ["Inundated access road", "Building structure currently dry"],
                "voice_findings": ["Supply trucks cannot enter", "25 occupants safely indoors"],
                "human_findings": ["Access road blocked", "High occupant count (25)"]
            },
            "triage_assessment": {
                "priority": "MEDIUM",
                "priority_color": "amber",
                "total_score": 55,
                "max_score": 100,
                "headline_reason": "Why this incident is MEDIUM priority",
                "detailed_reasoning": "High volume of sheltered residents + supply logistics route blocked; shelter structure remains dry.",
                "points_breakdown": [
                    {"factor": "Road / Access route blocked", "points": 15, "source": "Vision & Speech", "detail": "Shelter approach lane submerged by 1.5 ft."},
                    {"factor": "Severe water on access road", "points": 10, "source": "Vision (PidNet)", "detail": "Surface water ratio 42% on supply lane."},
                    {"factor": "High volume occupants (25)", "points": 10, "source": "Field Entry", "detail": "25 individuals in relief camp requiring continuous supply chain."}
                ],
                "recommended_actions": [
                    {"title": "Deploy Tractor / High-Tread Vehicle for Supplies", "type": "logistics", "description": "Use municipal tractor or elevated vehicle to ferry ration boxes across flooded lane."},
                    {"title": "Position Mobile Dewatering Pump", "type": "drainage", "description": "Station 25HP dewatering pump at lane mouth to clear approach by morning."}
                ],
                "safety_disclaimer": "AI-assisted assessment — verify critical decisions with trained emergency personnel."
            }
        },

        # Incident D: Drainage Overflow Near Marketplace (Medium Priority)
        {
            "id": "INC-2026-8804",
            "title": "Stormwater drain surge near Velachery Market",
            "location_name": "Velachery Main Road, Chennai, Tamil Nadu",
            "latitude": 12.9815,
            "longitude": 80.2180,
            "priority": "MEDIUM",
            "priority_score": 45,
            "status": "TRIAGED",
            "people_affected": 8,
            "vulnerable_present": False,
            "medical_emergency": False,
            "road_blocked": True,
            "water_entering_building": False,
            "manual_notes": "Storm drain backflow spilling onto shopping corridor. Water 1 ft deep across 200m stretch.",
            "execution_provider": "CPUExecutionProvider",
            "is_demo": True,
            "image_url": "/demo/sample_images/market_waterlogging.jpg",
            "voice_url": "/demo/sample_audio/velachery_call.wav",
            "visual_evidence": {
                "model": "yolov8n-flood-qualcomm-aihub.onnx",
                "provider": "CPUExecutionProvider",
                "water_coverage_percentage": 35.0,
                "hazard_category": "Moderate Waterlogging",
                "detections": [
                    {"label": "standing_water", "class_name": "Drain Surge Water", "confidence": 0.89, "severity_impact": "medium"},
                    {"label": "blocked_road", "class_name": "Lane Impassable for Two-Wheelers", "confidence": 0.88, "severity_impact": "medium"}
                ]
            },
            "voice_evidence": {
                "model": "whisper-base-qualcomm-aihub.onnx",
                "provider": "CPUExecutionProvider",
                "confidence": 0.91,
                "transcript": "Drain overflow is covering the main bazaar street. Shopkeepers are stacking sandbags. No one is injured.",
                "entities": {
                    "vulnerable_person_detected": False,
                    "vulnerable_terms": [],
                    "medical_emergency_detected": False,
                    "medical_terms": [],
                    "building_impact_detected": False,
                    "building_terms": [],
                    "road_blockage_detected": True,
                    "road_terms": ["covering main bazaar street"],
                    "people_count_extracted": 8
                }
            },
            "fused_evidence": {
                "vulnerable_confirmed": False,
                "medical_confirmed": False,
                "building_impact_confirmed": False,
                "road_blockage_confirmed": True,
                "people_count": 8,
                "water_ratio": 0.35,
                "submerged_vehicle": False,
                "overall_confidence": 0.89,
                "corroborations": ["Corridor road inundation identified by vision & voice."],
                "ai_findings": ["Drainage runoff on thoroughfare", "Shops protected by sandbags"],
                "voice_findings": ["No injuries reported", "Commercial street flooded"],
                "human_findings": ["8 people affected", "Road blocked: Yes"]
            },
            "triage_assessment": {
                "priority": "MEDIUM",
                "priority_color": "amber",
                "total_score": 45,
                "max_score": 100,
                "headline_reason": "Why this incident is MEDIUM priority",
                "detailed_reasoning": "Commercial thoroughfare waterlogged + active drainage overflow; no vulnerable or medical casualties.",
                "points_breakdown": [
                    {"factor": "Roadway partially impassable", "points": 15, "source": "Vision & Report", "detail": "Water 1 ft deep hindering two-wheelers and pedestrians."},
                    {"factor": "High occupant count (8)", "points": 10, "source": "Field Observation", "detail": "Shopkeepers attempting to protect property."}
                ],
                "recommended_actions": [
                    {"title": "Clear Stormwater Drain Culvert", "type": "maintenance", "description": "Deploy municipal suction truck to clear plastic debris choking storm drain outlet."},
                    {"title": "Distribute Sandbag Bunds", "type": "protection", "description": "Supply 200 heavy polymer sandbags to shopkeeper committee."}
                ],
                "safety_disclaimer": "AI-assisted assessment — verify critical decisions with trained emergency personnel."
            }
        },

        # Incident E: Agricultural Lowland Inundation (Low Priority)
        {
            "id": "INC-2026-8805",
            "title": "Lowland waterlogging in agricultural basin",
            "location_name": "Krishnanagar Rural, Nadia District, West Bengal",
            "latitude": 23.4013,
            "longitude": 88.4969,
            "priority": "LOW",
            "priority_score": 25,
            "status": "RESOLVED",
            "people_affected": 2,
            "vulnerable_present": False,
            "medical_emergency": False,
            "road_blocked": False,
            "water_entering_building": False,
            "manual_notes": "River overflow onto paddy fields. No residential houses impacted. Farmers observed from embankment.",
            "execution_provider": "CPUExecutionProvider",
            "is_demo": True,
            "image_url": "/demo/sample_images/paddy_field_water.jpg",
            "voice_url": "/demo/sample_audio/rural_field_report.wav",
            "visual_evidence": {
                "model": "yolov8n-flood-qualcomm-aihub.onnx",
                "provider": "CPUExecutionProvider",
                "water_coverage_percentage": 28.0,
                "hazard_category": "Minor Waterlogging",
                "detections": [
                    {"label": "standing_water", "class_name": "Field Runoff", "confidence": 0.85, "severity_impact": "low"}
                ]
            },
            "voice_evidence": {
                "model": "whisper-base-qualcomm-aihub.onnx",
                "provider": "CPUExecutionProvider",
                "confidence": 0.90,
                "transcript": "River water entered the low-lying field. All villagers are on the high embankment. No houses or roads are submerged.",
                "entities": {
                    "vulnerable_person_detected": False,
                    "vulnerable_terms": [],
                    "medical_emergency_detected": False,
                    "medical_terms": [],
                    "building_impact_detected": False,
                    "building_terms": [],
                    "road_blockage_detected": False,
                    "road_terms": [],
                    "people_count_extracted": 2
                }
            },
            "fused_evidence": {
                "vulnerable_confirmed": False,
                "medical_confirmed": False,
                "building_impact_confirmed": False,
                "road_blockage_confirmed": False,
                "people_count": 2,
                "water_ratio": 0.28,
                "submerged_vehicle": False,
                "overall_confidence": 0.88,
                "corroborations": ["No human life or infrastructure hazard verified."],
                "ai_findings": ["Shallow standing water in agricultural zone", "No structures flooded"],
                "voice_findings": ["Villagers on high ground", "No road closure"],
                "human_findings": ["2 farmers observing", "No immediate rescue needed"]
            },
            "triage_assessment": {
                "priority": "LOW",
                "priority_color": "emerald",
                "total_score": 25,
                "max_score": 100,
                "headline_reason": "Why this incident is LOW priority",
                "detailed_reasoning": "Localized agricultural waterlogging without human habitation or critical road disruption.",
                "points_breakdown": [
                    {"factor": "Shallow waterlogging", "points": 10, "source": "Vision (YOLO)", "detail": "Agricultural runoff in natural retention basin."}
                ],
                "recommended_actions": [
                    {"title": "Routine River Gauge Monitoring", "type": "monitoring", "description": "Check upstream river water level hourly at Krishnanagar barrage gauge."}
                ],
                "safety_disclaimer": "AI-assisted assessment — verify critical decisions with trained emergency personnel."
            }
        }
    ]

    for inc in sample_incidents:
        db_obj = Incident(
            id=inc["id"],
            title=inc["title"],
            location_name=inc["location_name"],
            latitude=inc["latitude"],
            longitude=inc["longitude"],
            priority=inc["priority"],
            priority_score=inc["priority_score"],
            status=inc["status"],
            people_affected=inc["people_affected"],
            vulnerable_present=inc["vulnerable_present"],
            medical_emergency=inc["medical_emergency"],
            road_blocked=inc["road_blocked"],
            water_entering_building=inc["water_entering_building"],
            manual_notes=inc["manual_notes"],
            execution_provider=inc["execution_provider"],
            is_demo=inc["is_demo"],
            image_url=inc.get("image_url"),
            voice_url=inc.get("voice_url"),
            visual_evidence=json.dumps(inc.get("visual_evidence", {})),
            voice_evidence=json.dumps(inc.get("voice_evidence", {})),
            fused_evidence=json.dumps(inc.get("fused_evidence", {})),
            triage_assessment=json.dumps(inc.get("triage_assessment", {}))
        )
        db.add(db_obj)

    db.commit()
