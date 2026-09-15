# 90-Second Judge Presentation & Demo Script

**Project**: Flood-to-Flow AI  
**Tagline**: Offline Disaster Intelligence for Snapdragon-powered HP AI PCs  
**Presenter**: Lead Engineer  

---

## The Pitch (0:00 - 0:20)

> "Judges, during severe flood disasters in India, emergency coordinators are inundated with fragmented information: panic phone calls, WhatsApp flood photos, and handwritten notes.
> 
> When grid power and cellular networks collapse, cloud AI fails completely.
> 
> **Flood-to-Flow AI** is an offline-first disaster intelligence copilot designed specifically for **Snapdragon-powered HP AI PCs**. It runs multimodal computer vision, local speech transcription, and explainable triage **100% locally on the Snapdragon Hexagon NPU** — zero cloud required."

---

## Live Interactive Walkthrough (0:20 - 1:15)

### Step 1: Hardware Acceleration Verification (0:20 - 0:30)
- Point to the **Hardware Acceleration badge** at the top right of the dashboard:
  > "Notice our Hardware Acceleration section. We inspect the exact execution provider. On Snapdragon HP PCs, it binds to the **Qualcomm Hexagon NPU via QNN Execution Provider** for 45 TOPS of low-power tensor processing. On non-ARM systems, it demonstrates graceful CPU fallback without crashing."

### Step 2: The 1-Click Flagship Demo (0:30 - 0:50)
- Click **"⚡ Quick Demo (90s)"** in the top navigation bar.
- The Flagship Incident opens: **"Ground-floor flooding near residential block, Sector 12, Prayagraj"**.
  > "Here is our flagship emergency scenario.
  > 
  > First, our local **VisionRunner** analyzes the flood photo using YOLOv8 and PidNet, detecting standing floodwater (58% surface area), a partially submerged vehicle, an impassable roadway, and a breached residential entrance.
  > 
  > Second, our offline **SpeechRunner** transcribes an incoming distress call: *'Water has entered the ground floor. Five people are inside and one elderly resident needs assistance. The nearby road is blocked.'*
  > 
  > Third, our **Fusion Engine** cross-correlates vision, speech, and field counts to establish 96% confidence."

### Step 3: Explainable Triage Breakdown (0:50 - 1:10)
- Scroll down to the **Explainable AI Score Card**:
  > "Look at the priority rating: **HIGH PRIORITY (100 / 100)**.
  > 
  > But critically, this is NOT a black box. Look at the exact mathematical breakdown:
  > - **+30 points**: Vulnerable resident confirmed
  > - **+25 points**: Urgent medical assistance requested
  > - **+20 points**: Residential building flooded
  > - **+15 points**: Access route completely severed
  > - **+10 points**: Severe water depth & submerged vehicle
  > 
  > And below, the system automatically synthesizes targeted tactical actions: dispatching an inflatable boat for the senior, alerting the district BLS medical team, and coordinating an electrical power cut."

### Step 4: Exporting Responder Brief PDF (1:10 - 1:25)
- Click **"📄 Generate Incident Brief (PDF)"**:
  > "With a single click, the field coordinator exports a standardized, printable PDF incident brief complete with coordinates, triage breakdown, voice transcript, and commander sign-off block for immediate dispatch into the field."

---

## Closing Value Proposition (1:25 - 1:30)

> "Flood-to-Flow AI delivers **Multimodal Local AI + Explainable Triage + Offline-First Disaster Response** powered by Snapdragon HP AI PCs. Thank you!"
