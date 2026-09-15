# Flood-to-Flow AI
### *Offline Disaster Intelligence for Snapdragon-powered HP AI PCs*

[![Snapdragon NPU](https://img.shields.io/badge/Qualcomm-Snapdragon_X_Elite_45_TOPS-0052CC?logo=qualcomm)](https://www.qualcomm.com/products/mobile/snapdragon/pcs-and-tablets/snapdragon-x-elite)
[![HP AI PC](https://img.shields.io/badge/Target-HP_OmniBook_X_|_EliteBook_Ultra-0096D6?logo=hp)](https://www.hp.com)
[![ONNX Runtime](https://img.shields.io/badge/Runtime-ONNX_|_QNN_Execution_Provider-blue)](https://onnxruntime.ai/)
[![Offline First](https://img.shields.io/badge/Operation-100%25_Offline_Local_First-emerald)](#7-localoffline-design)
[![License](https://img.shields.io/badge/License-Apache_2.0-orange)](LICENSE)

---

## 1. Project Overview

**Flood-to-Flow AI** is an offline-first disaster-response copilot engineered for flood and extreme-weather emergencies across India. Built and optimized for **Snapdragon-powered HP AI PCs** (such as the HP OmniBook X and HP EliteBook Ultra), it transforms chaotic, multimodal field evidence—flood photographs, short videos, spoken distress recordings, and field observations—into structured intelligence, visual hazard detections, transparent explainable priority scores, and tactical field briefs.

### Core Value Proposition:
$$\text{Flood-to-Flow AI} = \text{Multimodal Local AI} + \text{Explainable Triage} + \text{Offline-First Disaster Response}$$

---

## 2. Problem Statement

During monsoon deluge and flash floods in urban and rural India (e.g., Prayagraj, Kerala, Assam, Cuttack, Chennai):
- **Cellular & Power Grid Collapse**: Cellular towers, fiber backhauls, and power grids fail, rendering cloud APIs (`OpenAI`, `Google Cloud`, `AWS`) completely unreachable.
- **Fragmented, Noisy Data**: Emergency response coordinators are overwhelmed by disparate signals: WhatsApp photos of submerged cars, panicked voice calls, and handwritten volunteer tallies.
- **Black-Box Triage Failure**: Traditional automated systems output opaque "risk probabilities" that field commanders cannot audit, leading to delayed deployments or misdirected rescue boats.

---

## 3. Solution

Flood-to-Flow AI brings dedicated **local machine intelligence directly to the field command vehicle**:
1. **Multimodal Local Ingestion**: Ingests ground-level photos, recorded audio calls, and structured checklist observations.
2. **Local Neural Inference**: Runs custom YOLOv8, PidNet, and Whisper models on-device using ONNX Runtime with Qualcomm QNN Execution Provider.
3. **Consensus Fusion**: Cross-correlates findings (e.g., if vision identifies a submerged roadway AND audio transcript reports *"road is completely blocked"*, confidence escalates to 96%+).
4. **Explainable Triage**: Computes an auditable, transparent point score ($+30$ vulnerable, $+25$ medical, $+20$ building, $+15$ road, $+10$ water).
5. **Responder-Ready PDF Export**: Generates standardized, printable Incident Briefs with one click.

---

## 4. Why Snapdragon Matters

The Snapdragon X Elite and Snapdragon X Plus system-on-chip platforms are central to the technical viability of Flood-to-Flow AI:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SNAPDRAGON HP AI PC                             │
│                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │  Snapdragon Oryon CPU │  │      Qualcomm Hexagon NPU (45 TOPS)   │  │
│  │  (Graceful Fallback)  │  │   • QNN Execution Provider            │  │
│  │  • Host OS management │  │   • Sub-15ms Vision Tensor Execution  │  │
│  │  • SQLite persistence │  │   • Low Thermal Footprint on Battery  │  │
│  └───────────────────────┘  └───────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Dedicated 45 TOPS Hexagon NPU**: Provides massive tensor throughput for INT8 quantized computer vision and Whisper encoder blocks without bottlenecking the main CPU.
2. **Battery Life in Crisis Zones**: Emergency teams operate on battery in shelter camps or mobile rescue boats. Discrete laptop GPUs drain batteries in 60–90 minutes; the Snapdragon Hexagon NPU delivers continuous inference across 10+ hours of battery operation.
3. **Hardware-Agnostic ModelRunner Layer**: Clean abstraction in `ml/runners/base.py` prioritizes `QNNExecutionProvider`, with automatic fallback to `DmlExecutionProvider` and `CPUExecutionProvider` on host machines.

---

## 5. Architectural Pipeline

```
                                  USER / FIELD OPERATOR
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               ▼                            ▼                            ▼
         FLOOD PHOTO                  VOICE CALL NOTE           FIELD OBSERVATION
               │                            │                            │
               ▼                            ▼                            ▼
        [VisionRunner]               [SpeechRunner]              [Input Validator]
     (YOLOv8n + PidNet-S)           (Whisper-Base Local)        (Field Counts & Toggles)
               │                            │                            │
               └────────────────────────────┼────────────────────────────┘
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
               ┌────────────────────────────┼────────────────────────────┐
               ▼                            ▼                            ▼
         TOTAL SCORE                 EXPLAINABLE WHY             TACTICAL ACTIONS
         (100 / 100)             (+Points Decomposition)       (Evac Boat / Medic Team)
                                            │
                                            ▼
                                 ┌──────────────────────┐
                                 │ LOCAL SQLITE DB CORE │
                                 └──────────┬───────────┘
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               ▼                            ▼                            ▼
       COMMAND DASHBOARD            TACTICAL INCIDENT MAP        RESPONDER BRIEF (PDF)
```

---

## 6. AI Models

| Model Name | Role | Architecture | Precision | Runtime Provider |
|:---|:---|:---|:---|:---|
| **`yolov8n-flood`** | Hazard Object Detection | YOLOv8 Nano | INT8 / FP16 | Qualcomm QNN / DirectML / CPU |
| **`pidnet-s-water`** | Water Surface Segmentation | PIDNet Small | INT8 | Qualcomm QNN / DirectML / CPU |
| **`whisper-base-en`** | Speech-to-Text & Entity Tagging | Whisper Encoder-Decoder | INT8 | Qualcomm QNN / DirectML / CPU |

---

## 7. Local / Offline Design

Flood-to-Flow AI runs **100% disconnected from the internet**:
- Local SQLite database (`data/flood_to_flow.db`).
- Offline tactical coordinate map projected using mathematical SVG transforms (no third-party tile downloads).
- Offline PDF generation using ReportLab.
- Prominent toggle between **OFFLINE MODE** and **ONLINE MODE** (optional future cloud sync).

---

## 8. Explainable Triage: Transparent Mathematical Scoring

Unlike black-box AI systems, Flood-to-Flow AI decomposes every incident priority into auditable points:

$$\text{Priority Score} = \sum (\text{Vulnerable}) + (\text{Medical}) + (\text{Building}) + (\text{Road}) + (\text{Water}) + (\text{Volume})$$

```
HIGH PRIORITY (100 / 100 PTS)
────────────────────────────────────────────────────────────────
+30 pts | Vulnerable resident present (elderly / bedridden)
+25 pts | Urgent medical assistance requested
+20 pts | Building entrance flooded / interior entered
+15 pts | Roadway blocked / primary evacuation route severed
+10 pts | Severe floodwater evidence (surface ratio > 50%)
────────────────────────────────────────────────────────────────
TOTAL   = 100 PTS
```

- **HIGH PRIORITY**: Score $\ge 70$
- **MEDIUM PRIORITY**: Score $40 - 69$
- **LOW PRIORITY**: Score $< 40$

---

## 9. 90-Second Demo Mode

The application includes an interactive, 1-click **⚡ QUICK DEMO (90s)** button in the top navigation bar:
1. Loads the **Sector 12, Prayagraj Residential Flooding** scenario.
2. Ingests the flood image and 911 audio dispatch.
3. Executes local vision & speech pipelines.
4. Performs multimodal fusion (96% confidence).
5. Displays the 100-point explainable triage breakdown.
6. Generates the printable **Responder Brief (PDF)** in under 90 seconds.

---

## 10. Installation & Quick Start

### Prerequisites
- Windows 11 (ARM64 Snapdragon or x86_64 CPU)
- Python 3.10+ (tested on Python 3.14)
- Node.js 18+

### Setup
```bash
# 1. Clone repository
git clone https://github.com/your-username/flood-to-flow-ai.git
cd flood-to-flow-ai

# 2. Install backend Python dependencies
pip install -r requirements.txt

# 3. Install frontend dependencies
cd frontend
npm install
cd ..
```

---

## 11. Running Locally

### 1-Click Windows Launcher:
Double-click `run_app.bat` or execute:
```cmd
run_app.bat
```

### Manual Execution:
```bash
# Terminal 1: Backend
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 12. Snapdragon NPU Deployment

To bind directly to the Qualcomm Hexagon NPU on HP Snapdragon AI PCs:
```cmd
pip install onnxruntime-qnn
```
The application will automatically detect `QNNExecutionProvider` in `ml/hardware_detector.py` and assign model execution to the NPU.

---

## 13. Benchmarking Suite

Flood-to-Flow AI includes an automated benchmark tool:
```cmd
python benchmarks/run_benchmark.py
```
Outputs measured latencies for preprocessing, inference, and postprocessing to `benchmarks/benchmark_results.json` and `.csv`.

> **Zero Fabrication Policy**: If executed on non-Snapdragon host hardware, it reports real measured host CPU timing and labels NPU as *"Not yet benchmarked on physical Snapdragon NPU"*.

---

## 14. Screenshots & Interface Preview

| View | Purpose |
|:---|:---|
| **Disaster Command Dashboard** | Overview of active incidents, priority metrics, and hardware acceleration status |
| **Explainable AI Score Card** | Itemized $+30, +25, +20$ point breakdown with multimodal consensus evidence |
| **Tactical Disaster Map** | Offline geographic coordinate grid with pulsing priority radar beacons |
| **Hardware Acceleration View** | NPU vs. CPU execution provider telemetry and latency benchmark suite |

---

## 15. Privacy Guarantee

> *"Your incident evidence is processed locally on this device unless synchronization is enabled."*
- Zero cloud telemetry by default.
- Media stays on local disk storage.
- No personal identifiers stored.

---

## 16. Operational Safety Directive

> **MANDATORY SAFETY ADVISORY:**  
> *"AI-assisted assessment — verify critical decisions with trained emergency personnel."*  
> Flood-to-Flow AI acts as a force-multiplier for dispatchers, never replacing trained incident commanders.

---

## 17. Future Roadmap
- [ ] Multilingual Indian language support (Hindi, Bengali, Tamil, Telugu audio transcription).
- [ ] Peer-to-peer Wi-Fi Direct mesh synchronization between HP AI PCs in disconnected field camps.
- [ ] Direct drone video stream decoding over RTSP on Qualcomm Adreno GPU.

---

## 18. Competition Evaluation Criteria Mapping

| Evaluation Pillar | Implementation in Flood-to-Flow AI | Verification File / Artifact |
|:---|:---|:---|
| **1. Technical Implementation** | • Clean `ModelRunner` abstraction (`ml/runners/base.py`)<br/>• ONNX Runtime QNN Execution Provider integration<br/>• Automated benchmarking suite & 13 unit/e2e tests | `ml/runners/`, `ml/hardware_detector.py`, `tests/` |
| **2. Application Use Case & Innovation** | • Solves real Indian flood disaster response chaos<br/>• Multimodal fusion (Vision + Speech + Human fields)<br/>• Explainable mathematical triage scoring | `ml/fusion/`, `docs/ARCHITECTURE.md` |
| **3. Deployment & Accessibility** | • 1-Click `run_app.bat` for Windows<br/>• 100% offline operation without cloud dependency<br/>• High-contrast emergency UI with keyboard navigation | `run_app.bat`, `frontend/src/` |
| **4. Presentation & Documentation** | • 90-second judge presentation script<br/>• Complete architecture, privacy, and security specs<br/>• Responder-ready PDF brief export via ReportLab | `docs/DEMO_SCRIPT.md`, `backend/app/utils/pdf_generator.py` |
