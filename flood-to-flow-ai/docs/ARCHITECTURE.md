# Technical Architecture: Flood-to-Flow AI

**Flood-to-Flow AI: Offline Disaster Intelligence for Snapdragon-powered HP AI PCs**

---

## 1. Executive Summary

During severe flood emergencies in India (such as the monsoon floods in Prayagraj, Assam, Kerala, and Chennai), emergency dispatchers and field coordinators receive unorganized, fragmented multi-source reports:
- Photographs taken on mobile phones showing submerged roads and flooded houses
- Urgent voice calls and audio notes from trapped residents
- Field observations manually noted by local volunteers

Traditional cloud-dependent disaster solutions collapse when cellular backhauls and grid power fail. **Flood-to-Flow AI** solves this critical problem by executing multimodal AI triage **100% locally** on Snapdragon-powered HP AI PCs, leveraging the **45 TOPS Qualcomm Hexagon NPU** for ultra-low-latency, zero-cloud inference.

---

## 2. End-to-End System Diagram

```
                              FIELD USER / DISPATCHER
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
  FLOOD PHOTOGRAPHS              VOICE AUDIO NOTE                STRUCTURED OBSERVATIONS
  (JPG / PNG / WebP)             (WAV / MP3 / AAC)              (Checklist & Field Counts)
        │                                │                                │
        ▼                                ▼                                ▼
 ┌──────────────────────┐      ┌──────────────────────┐                 │
 │     VisionRunner     │      │     SpeechRunner     │                 │
 │  (YOLOv8 + PidNet)   │      │  (Whisper Local AI)  │                 │
 └──────────┬───────────┘      └──────────┬───────────┘                 │
            │                             │                             │
            ▼                             ▼                             ▼
   [Visual Evidence]              [Speech Evidence]             [Human Evidence]
   - Submerged vehicle            - Vulnerable resident         - 5 people affected
   - Blocked road                 - Medical aid needed          - High water depth
   - Building entrance            - Ground floor breached       - Egress severed
            │                             │                             │
            └─────────────────────────────┼─────────────────────────────┘
                                          │
                                          ▼
                                ┌───────────────────┐
                                │   FUSION ENGINE   │
                                └─────────┬─────────┘
                                          │
                                          ▼
                             ┌─────────────────────────┐
                             │ EXPLAINABLE TRIAGE CORE │
                             │  (Transparent Points)   │
                             └────────────┬────────────┘
                                          │
           ┌──────────────────────────────┼──────────────────────────────┐
           ▼                              ▼                              ▼
     TOTAL SCORE                   EXPLAINABLE WHY              TACTICAL ACTIONS
     (100 / 100)               (+Points Decomposition)       (Evac Boat / Medic Team)
           │                              │                              │
           └──────────────────────────────┼──────────────────────────────┘
                                          │
                                          ▼
                               ┌──────────────────────┐
                               │ LOCAL DATABASE (DB)  │
                               │   (Offline SQLite)   │
                               └──────────┬───────────┘
                                          │
           ┌──────────────────────────────┼──────────────────────────────┐
           ▼                              ▼                              ▼
   COMMAND DASHBOARD              INTERACTIVE MAP             RESPONDER BRIEF (PDF)
   (Emergency Status)            (Priority Beacons)           (Sign-Off Field Card)
```

---

## 3. Snapdragon NPU Acceleration Layer

### Why Snapdragon Matters
Modern HP AI PCs equipped with the **Snapdragon X Elite** and **Snapdragon X Plus** system-on-chip architectures incorporate a dedicated **Qualcomm Hexagon NPU** delivering up to **45 TOPS** (Trillion Operations Per Second) of INT8/FP16 tensor processing.

In a disaster scenario:
1. **Power Efficiency**: In battery-powered emergency field shelters or mobile command vans, running continuous computer vision on CPU or power-hungry discrete GPUs drains laptops in 1–2 hours. The Hexagon NPU delivers sustained high throughput at a fraction of the thermal and electrical envelope.
2. **Zero Cloud Latency**: Rural or severed network conditions cannot upload high-resolution photos or audio to cloud APIs. The Snapdragon NPU processes vision and speech on-device in milliseconds.
3. **Deterministic Response**: No API rate limits, no pay-per-token pricing, and zero latency spikes.

### Execution Provider Hierarchy
The application leverages the `ModelRunner` abstraction in `ml/runners/base.py`, orchestrating execution providers via ONNX Runtime:

1. **Primary Target (`QNNExecutionProvider`)**:
   - Compiles and binds subgraphs directly to the Qualcomm Hexagon NPU using Qualcomm Neural Processing Engine (QNN) libraries.
2. **DirectML Fallback (`DmlExecutionProvider`)**:
   - Executes via Windows DirectML API across integrated Qualcomm Adreno GPU hardware if NPU QNN backend is unavailable.
3. **Universal Graceful Fallback (`CPUExecutionProvider`)**:
   - Runs multithreaded CPU inference with vectorized instructions when executing on non-Snapdragon host environments.

---

## 4. Multimodal Fusion Engine

The `FusionEngine` in `ml/fusion/fusion_engine.py` aggregates heterogeneous sensory streams:
- **Computer Vision Pipeline**:
  - `yolov8n-flood`: Identifies submerged vehicles, flooded doorways, blocked roads, and stranded victims.
  - `pidnet-s-water`: Measures water surface area ratio, road submergence percentage, and estimated depth index.
- **Voice Transcription Pipeline**:
  - `whisper-base`: Converts speech into verbatim text and extracts safety-critical entity tags (vulnerable persons, medical requests, water ingress).
- **Human Consensus**:
  - Cross-validates automated detections against field entries. If the computer vision pipeline detects a blocked road AND the voice transcript reports "the nearby road is blocked", the confidence rating escalates to 96%+.

---

## 5. Explainable AI & Transparent Triage

Rather than emitting an opaque probabilistic prediction, Flood-to-Flow AI computes an **auditable, itemized priority score** (0 to 100):

| Emergency Factor | Points | Modality | Operational Criteria |
|:---|:---:|:---|:---|
| **Vulnerable Resident** | `+30` | Speech / Manual | Elderly, infant, pregnant, or disabled citizen present |
| **Medical Emergency** | `+25` | Speech / Manual | Urgent medical attention, oxygen, or trauma treatment requested |
| **Building Inundation** | `+20` | Vision / Speech | Water breached living quarters, ground floor threshold inundated |
| **Road Blockage** | `+15` | Vision / Speech | Primary egress or logistics transit corridor cut off |
| **Severe Water Depth** | `+10` | Vision (YOLO/PidNet) | Water surface ratio > 40% or submerged vehicle detected |
| **High Occupant Volume** | `+10` | Field Count | $\ge 4$ individuals exposed to hazard |

### Triage Classification
- **HIGH PRIORITY**: Total Score $\ge 70$ (Immediate life hazard, active rescue dispatched)
- **MEDIUM PRIORITY**: Total Score $40 - 69$ (Logistics disruption, supply delivery needed)
- **LOW PRIORITY**: Total Score $< 40$ (Drainage monitoring, non-residential inundation)

---

## 6. Safety & Verification Protocol
Every triage report and incident brief includes the mandatory advisory:
> **"AI-assisted assessment — verify critical decisions with trained emergency personnel."**
AI acts strictly as a force-multiplier for human dispatchers, organizing chaos into structured clarity without usurping human authority.
