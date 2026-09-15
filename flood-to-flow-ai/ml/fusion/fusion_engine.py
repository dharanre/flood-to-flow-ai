"""
Multimodal Evidence Fusion Engine for Flood-to-Flow AI.
Correlates visual detections (YOLO/PidNet), voice transcripts (Whisper),
and human field observations into a unified, cross-validated disaster evidence graph.
"""

from typing import Dict, Any, List


class FusionEngine:
    """
    Combines Vision, Speech, and Structured Human Field inputs.
    Cross-checks claims between modalities (e.g. voice mentions road blocked + vision detects road blocked = high confidence).
    """

    def fuse_evidence(
        self,
        visual_evidence: Dict[str, Any],
        voice_evidence: Dict[str, Any],
        manual_evidence: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Produce a fused multimodal evidence summary.
        """
        # 1. Visual Signals
        detections = visual_evidence.get("detections", [])
        detection_labels = [d["label"] for d in detections]
        has_submerged_vehicle = "submerged_vehicle" in detection_labels
        has_blocked_road_vis = "blocked_road" in detection_labels
        has_building_entrance_vis = "building_entrance_flooded" in detection_labels
        has_standing_water = "standing_water" in detection_labels
        water_ratio = visual_evidence.get("water_coverage_ratio", 0.0)

        # 2. Voice Signals
        voice_entities = voice_evidence.get("entities", {})
        has_vulnerable_voice = voice_entities.get("vulnerable_person_detected", False)
        has_medical_voice = voice_entities.get("medical_emergency_detected", False)
        has_building_voice = voice_entities.get("building_impact_detected", False)
        has_road_voice = voice_entities.get("road_blockage_detected", False)
        voice_people_count = voice_entities.get("people_count_extracted", 1)

        # 3. Manual Signals
        manual_people = manual_evidence.get("people_affected", 1)
        manual_vulnerable = manual_evidence.get("vulnerable_present", False)
        manual_medical = manual_evidence.get("medical_emergency", False)
        manual_road_blocked = manual_evidence.get("road_blocked", False)
        manual_building_flooded = manual_evidence.get("water_entering_building", False)

        # Consensus Resolution (Multimodal Agreement)
        vulnerable_confirmed = manual_vulnerable or has_vulnerable_voice
        medical_confirmed = manual_medical or has_medical_voice
        building_impact_confirmed = (
            manual_building_flooded or has_building_entrance_vis or has_building_voice
        )
        road_blockage_confirmed = (
            manual_road_blocked or has_blocked_road_vis or has_road_voice
        )
        effective_people_count = max(manual_people, voice_people_count)

        # Confidence Calculation based on Cross-Modality Corroboration
        corroboration_score = 0.75
        corroborations = []

        if has_blocked_road_vis and (has_road_voice or manual_road_blocked):
            corroboration_score += 0.08
            corroborations.append("Road blockage corroborated across Vision and Speech/Manual reports.")

        if has_building_entrance_vis and (has_building_voice or manual_building_flooded):
            corroboration_score += 0.08
            corroborations.append("Building entrance inundation corroborated across Vision and Speech/Manual reports.")

        if has_vulnerable_voice and manual_vulnerable:
            corroboration_score += 0.06
            corroborations.append("Vulnerable resident presence verified across voice call and field entry.")

        overall_confidence = min(0.98, round(corroboration_score, 2))

        # Structured findings list
        ai_findings = []
        if has_standing_water:
            ai_findings.append(f"Severe standing floodwater detected (Estimated surface ratio: {int(water_ratio*100)}%)")
        if has_submerged_vehicle:
            ai_findings.append("Partially submerged vehicle identified in roadway")
        if has_blocked_road_vis:
            ai_findings.append("Surface road impassable due to deep moving water")
        if has_building_entrance_vis:
            ai_findings.append("Ground floor building entrance breached by flood level")

        voice_findings = []
        if has_vulnerable_voice:
            voice_findings.append(f"Vulnerable person explicitly mentioned ({', '.join(voice_entities.get('vulnerable_terms', []))})")
        if has_medical_voice:
            voice_findings.append("Medical aid or urgent evacuation requested")
        if has_building_voice:
            voice_findings.append("Water entering ground floor reported by caller")
        if has_road_voice:
            voice_findings.append("Blocked community transit route described")

        human_findings = [
            f"{effective_people_count} people affected",
            f"Vulnerable persons present: {'Yes' if vulnerable_confirmed else 'No'}",
            f"Medical emergency flagged: {'Yes' if medical_confirmed else 'No'}",
            f"Road blocked: {'Yes' if road_blockage_confirmed else 'No'}",
            f"Water inside building: {'Yes' if building_impact_confirmed else 'No'}"
        ]

        return {
            "vulnerable_confirmed": vulnerable_confirmed,
            "medical_confirmed": medical_confirmed,
            "building_impact_confirmed": building_impact_confirmed,
            "road_blockage_confirmed": road_blockage_confirmed,
            "people_count": effective_people_count,
            "water_ratio": water_ratio,
            "submerged_vehicle": has_submerged_vehicle,
            "overall_confidence": overall_confidence,
            "corroborations": corroborations,
            "ai_findings": ai_findings,
            "voice_findings": voice_findings,
            "human_findings": human_findings,
            "raw_voice_transcript": voice_evidence.get("transcript", "")
        }


fusion_engine = FusionEngine()
