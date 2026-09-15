"""
Explainable Triage Engine for Flood-to-Flow AI.
Calculates transparent priority score with an itemized point breakdown,
natural language rationale, and tactical response actions.
"""

from typing import Dict, Any, List


class TriageEngine:
    """
    Transparent, auditable scoring engine.
    Calculates priority based on verified emergency factors without black-box opacity.
    """

    def calculate_priority(self, fused_evidence: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluate fused multimodal evidence and produce an explainable priority verdict.
        """
        breakdown = []
        total_score = 0
        reasons_summary = []

        # 1. Vulnerable Person (+30 pts)
        if fused_evidence.get("vulnerable_confirmed"):
            pts = 30
            total_score += pts
            breakdown.append({
                "factor": "Vulnerable resident present",
                "points": pts,
                "source": "Speech & Manual",
                "detail": "Elderly, disabled, or child resident requiring evacuation assistance."
            })
            reasons_summary.append("vulnerable resident")

        # 2. Medical Emergency (+25 pts)
        if fused_evidence.get("medical_confirmed"):
            pts = 25
            total_score += pts
            breakdown.append({
                "factor": "Medical assistance requested",
                "points": pts,
                "source": "Speech / Field observation",
                "detail": "Urgent health intervention or emergency medical transport indicated."
            })
            reasons_summary.append("medical need")

        # 3. Building Flooding Impact (+20 pts)
        if fused_evidence.get("building_impact_confirmed"):
            pts = 20
            total_score += pts
            breakdown.append({
                "factor": "Building flooded / entrance breached",
                "points": pts,
                "source": "Vision (YOLO/PidNet) & Report",
                "detail": "Water entered ground floor living area, threatening occupant shelter."
            })
            reasons_summary.append("building structural threat")

        # 4. Road Blocked / Ingress Severed (+15 pts)
        if fused_evidence.get("road_blockage_confirmed"):
            pts = 15
            total_score += pts
            breakdown.append({
                "factor": "Road blocked / route cut off",
                "points": pts,
                "source": "Vision & Speech",
                "detail": "Primary evacuation route or access road submerged and impassable."
            })
            reasons_summary.append("infrastructure disruption")

        # 5. Severe Water Depth / Inundation (+10 pts)
        water_ratio = fused_evidence.get("water_ratio", 0.0)
        has_submerged_car = fused_evidence.get("submerged_vehicle", False)
        if water_ratio >= 0.40 or has_submerged_car:
            pts = 10
            total_score += pts
            breakdown.append({
                "factor": "Severe floodwater evidence",
                "points": pts,
                "source": "Vision (YOLOv8 & PidNet)",
                "detail": f"High surface water ratio ({int(water_ratio * 100)}%) with submerged infrastructure."
            })
            reasons_summary.append("deep standing water")

        # 6. Multi-person Impact (>3 people: +10 pts)
        people_count = fused_evidence.get("people_count", 1)
        if people_count >= 4:
            pts = 10
            total_score += pts
            breakdown.append({
                "factor": f"High occupant volume ({people_count} individuals)",
                "points": pts,
                "source": "Field consensus",
                "detail": "Cluster of multiple citizens exposed to acute hazard."
            })
            reasons_summary.append("multiple occupants")

        # Cap total score at 100
        total_score = min(100, total_score)

        # Classify priority
        if total_score >= 70:
            priority = "HIGH"
            priority_color = "red"
        elif total_score >= 40:
            priority = "MEDIUM"
            priority_color = "amber"
        else:
            priority = "LOW"
            priority_color = "emerald"

        # Generate human-readable explanation
        headline_reason = f"Why this incident is {priority} priority"
        if reasons_summary:
            detailed_reasoning = " + ".join(reasons_summary).capitalize() + "."
        else:
            detailed_reasoning = "Routine localized drainage concern without immediate life hazard."

        # Generate targeted tactical response actions
        recommended_actions = self._generate_response_actions(
            priority,
            fused_evidence.get("vulnerable_confirmed"),
            fused_evidence.get("medical_confirmed"),
            fused_evidence.get("road_blockage_confirmed"),
            fused_evidence.get("building_impact_confirmed")
        )

        return {
            "priority": priority,
            "priority_color": priority_color,
            "total_score": total_score,
            "max_score": 100,
            "points_breakdown": breakdown,
            "headline_reason": headline_reason,
            "detailed_reasoning": detailed_reasoning,
            "recommended_actions": recommended_actions,
            "safety_disclaimer": "AI-assisted assessment — verify critical decisions with trained emergency personnel."
        }

    def _generate_response_actions(
        self,
        priority: str,
        vulnerable: bool,
        medical: bool,
        road_blocked: bool,
        building_flooded: bool
    ) -> List[Dict[str, str]]:
        """Synthesize concrete, actionable rescue directives."""
        actions = []

        if medical:
            actions.append({
                "title": "Dispatch Emergency Medical Triage",
                "type": "medical",
                "description": "Alert nearest district disaster medical post with BLS kit, stretcher, and dry thermal wraps."
            })

        if vulnerable:
            actions.append({
                "title": "Deploy Evacuation Asset (Inflatable / High-Clearance)",
                "type": "evacuation",
                "description": "Send NDRF/SDRF boat team or high-clearance rescue vehicle to evacuate elderly/disabled occupant."
            })

        if road_blocked:
            actions.append({
                "title": "Establish Route Bypass & Mark Perimeter",
                "type": "traffic",
                "description": "Issue road obstruction advisory on local disaster channel and coordinate alternative egress route."
            })

        if building_flooded:
            actions.append({
                "title": "De-energize Ground Power & Verify Floor Height",
                "type": "safety",
                "description": "Request state electricity board de-energize sector feeder to eliminate electrocution hazard."
            })

        # Generic action if list is empty
        if not actions:
            actions.append({
                "title": "Routine Field Monitoring",
                "type": "monitoring",
                "description": "Deploy patrol vehicle to inspect drainage recession rate at 2-hour intervals."
            })

        return actions


triage_engine = TriageEngine()
