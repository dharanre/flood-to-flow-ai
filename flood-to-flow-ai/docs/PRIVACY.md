# Privacy Policy & Local-First Architecture

**Flood-to-Flow AI: Offline Disaster Intelligence for Snapdragon-powered HP AI PCs**

---

## 1. Local-First Processing Guarantee

In disaster zones, emergency photographs and voice calls frequently capture distressed citizens, private residences, and sensitive infrastructure. Sending such media to third-party cloud servers raises severe privacy vulnerabilities, bandwidth consumption, and data sovereignty violations.

### Core Privacy Commitments:
1. **Default: Process Locally**:
   All computer vision inference, speech-to-text processing, multimodal fusion, and triage calculations occur **100% on the local Snapdragon HP AI PC**.
2. **Zero Unconsented Telemetry**:
   No incident media (photographs, audio recordings, GPS coordinates, or field notes) are transmitted to external servers or cloud APIs without explicit user authorization.
3. **Prominent In-App Notice**:
   The user interface prominently features the privacy badge:
   > *"Your incident evidence is processed locally on this device unless synchronization is enabled."*
4. **Data Minimization**:
   The system intentionally excludes personally identifiable information (PII) such as Aadhaar numbers, private phone numbers, or facial biometric indices from triage records. Fictional identifiers and anonymized incident IDs are utilized for demonstration.
5. **Local Storage Sovereignty**:
   All database records reside in a localized SQLite store (`data/flood_to_flow.db`) directly accessible and deletable by the field operator at any time.
