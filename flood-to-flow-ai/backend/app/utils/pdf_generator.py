"""
Responder-Ready Incident Brief PDF Generator.
Generates an emergency briefing document using ReportLab for field response teams.
Includes AI findings, transparent triage points, voice transcript, and safety sign-off.
"""

import os
import json
from datetime import datetime, timezone
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable


def generate_incident_brief_pdf(incident: dict, output_path: str) -> str:
    """
    Build a clean, high-contrast, professional emergency PDF brief.
    """
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#0F172A'),
        fontName='Helvetica-Bold'
    )
    
    subtitle_style = ParagraphStyle(
        'SubTitle',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#475569'),
        fontName='Helvetica'
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Heading2'],
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0F172A'),
        fontName='Helvetica-Bold',
        spaceBefore=8,
        spaceAfter=4
    )
    
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontSize=9,
        leading=13,
        textColor=colors.HexColor('#1E293B')
    )
    
    disclaimer_style = ParagraphStyle(
        'Disclaimer',
        parent=styles['Normal'],
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#DC2626'),
        fontName='Helvetica-Bold',
        alignment=1
    )

    story = []

    # 1. Header Banner
    header_data = [
        [
            Paragraph("<b>FLOOD-TO-FLOW AI</b><br/><font size=8 color='#475569'>Offline Disaster Intelligence for Snapdragon HP AI PCs</font>", title_style),
            Paragraph(f"<b>INCIDENT BRIEF</b><br/><font size=9 color='#0284C7'>ID: {incident.get('id', 'INC-000')}</font><br/><font size=8 color='#64748B'>{datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}</font>", ParagraphStyle('RightH', parent=subtitle_style, alignment=2))
        ]
    ]
    t_header = Table(header_data, colWidths=[360, 180])
    t_header.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_header)
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#0284C7'), spaceBefore=4, spaceAfter=8))

    # 2. Priority & Tactical Status Matrix
    priority = incident.get("priority", "MEDIUM")
    p_color = colors.HexColor('#DC2626') if priority == "HIGH" else (colors.HexColor('#D97706') if priority == "MEDIUM" else colors.HexColor('#059669'))
    score = incident.get("priority_score", 50)
    
    triage_info = incident.get("triage_assessment") or {}
    headline_reason = triage_info.get("headline_reason", f"{priority} Priority Assessment")
    detailed_reason = triage_info.get("detailed_reasoning", "Assessed based on fused field & sensor indicators.")

    status_matrix = [
        [
            Paragraph(f"<font color='white' size=12><b>TRIAGE LEVEL: {priority} ({score}/100)</b></font><br/><font color='white' size=8>{headline_reason}</font>", ParagraphStyle('PBox', parent=body_style)),
            Paragraph(f"<b>Location:</b> {incident.get('location_name', 'Unknown')}<br/><b>Coordinates:</b> {incident.get('latitude', 0.0):.4f}° N, {incident.get('longitude', 0.0):.4f}° E<br/><b>Field Status:</b> {incident.get('status', 'TRIAGED')}", body_style)
        ]
    ]
    t_matrix = Table(status_matrix, colWidths=[270, 270])
    t_matrix.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, 0), p_color),
        ('BACKGROUND', (1, 0), (1, 0), colors.HexColor('#F1F5F9')),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(t_matrix)
    story.append(Spacer(1, 8))

    # 3. Transparent Scoring Rationale Breakdown
    story.append(Paragraph("EXPLAINABLE AI TRIAGE BREAKDOWN", section_heading))
    breakdown_list = triage_info.get("points_breakdown", [])
    if not breakdown_list:
        breakdown_list = [{"factor": "Base emergency indicators", "points": score, "source": "Fused", "detail": detailed_reason}]

    breakdown_rows = [["Factor Evaluated", "Points", "Evidence Source", "Operational Impact"]]
    for item in breakdown_list:
        breakdown_rows.append([
            Paragraph(f"<b>{item.get('factor')}</b>", body_style),
            Paragraph(f"+{item.get('points')}", body_style),
            Paragraph(f"{item.get('source')}", body_style),
            Paragraph(f"{item.get('detail')}", body_style)
        ])
    t_breakdown = Table(breakdown_rows, colWidths=[150, 45, 110, 235])
    t_breakdown.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0F172A')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(t_breakdown)
    story.append(Spacer(1, 8))

    # 4. Multimodal Evidence Summary (AI + Speech + Human)
    story.append(Paragraph("CROSS-MODALITY EVIDENCE COMPARISON", section_heading))
    fused_info = incident.get("fused_evidence") or {}
    ai_findings = "<br/>• " + "<br/>• ".join(fused_info.get("ai_findings", ["Visual features analyzed"]))
    voice_findings = "<br/>• " + "<br/>• ".join(fused_info.get("voice_findings", ["Voice data transcribed"]))
    human_findings = "<br/>• " + "<br/>• ".join(fused_info.get("human_findings", ["Field observations logged"]))

    evidence_table_data = [
        [
            Paragraph("<b>Computer Vision (YOLO/PidNet)</b>", ParagraphStyle('EvH', parent=body_style, fontName='Helvetica-Bold')),
            Paragraph("<b>Speech Audio (Whisper)</b>", ParagraphStyle('EvH', parent=body_style, fontName='Helvetica-Bold')),
            Paragraph("<b>Human Field Entry</b>", ParagraphStyle('EvH', parent=body_style, fontName='Helvetica-Bold'))
        ],
        [
            Paragraph(ai_findings, body_style),
            Paragraph(voice_findings, body_style),
            Paragraph(human_findings, body_style)
        ]
    ]
    t_ev = Table(evidence_table_data, colWidths=[180, 180, 180])
    t_ev.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#E2E8F0')),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(t_ev)
    story.append(Spacer(1, 8))

    # 5. Voice Transcript
    raw_transcript = incident.get("voice_evidence", {}).get("transcript") or fused_info.get("raw_voice_transcript")
    if raw_transcript:
        story.append(Paragraph("VERBATIM VOICE DISPATCH TRANSCRIPT", section_heading))
        t_box = Table([[Paragraph(f"<i>\"{raw_transcript}\"</i>", body_style)]], colWidths=[540])
        t_box.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, 0), colors.HexColor('#F8FAFC')),
            ('BOX', (0, 0), (0, 0), 0.5, colors.HexColor('#94A3B8')),
            ('TOPPADDING', (0, 0), (-1, -1), 6),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ]))
        story.append(t_box)
        story.append(Spacer(1, 8))

    # 6. Recommended Action Directives
    story.append(Paragraph("RECOMMENDED TACTICAL ACTIONS", section_heading))
    actions = triage_info.get("recommended_actions", [])
    action_rows = []
    for a in actions:
        action_rows.append([
            Paragraph("<b>[  ]</b>", body_style),
            Paragraph(f"<b>{a.get('title')}</b><br/><font color='#475569'>{a.get('description')}</font>", body_style)
        ])
    if not action_rows:
        action_rows.append([Paragraph("<b>[  ]</b>", body_style), Paragraph("Deploy initial scout team to monitor water height.", body_style)])

    t_actions = Table(action_rows, colWidths=[30, 510])
    t_actions.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(t_actions)
    story.append(Spacer(1, 12))

    # 7. Safety Disclaimer & Sign-off
    story.append(HRFlowable(width="100%", thickness=0.8, color=colors.HexColor('#CBD5E1'), spaceBefore=4, spaceAfter=6))
    story.append(Paragraph(
        "<b>MANDATORY SAFETY ADVISORY:</b> AI-assisted assessment — verify critical decisions with trained emergency personnel. "
        "Do not deploy hazardous operations solely on automated scoring.", disclaimer_style
    ))
    story.append(Spacer(1, 6))

    signoff_data = [
        [
            Paragraph("<b>Field Commander Sign-off:</b> ___________________________", body_style),
            Paragraph("<b>Dispatch Unit ID:</b> ___________________________", body_style)
        ]
    ]
    t_sign = Table(signoff_data, colWidths=[270, 270])
    story.append(t_sign)

    doc.build(story)
    return output_path
