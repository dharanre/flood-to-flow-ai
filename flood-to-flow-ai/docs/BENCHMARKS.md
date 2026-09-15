# Benchmarking & Performance Methodology

**Flood-to-Flow AI: Offline Disaster Intelligence for Snapdragon-powered HP AI PCs**

---

## 1. Zero Fabrication Policy

In strict accordance with competition rules:
> **Never fabricate benchmark numbers.**
> If performance has not been measured on physical Snapdragon hardware, label it as "not yet benchmarked."

Flood-to-Flow AI enforces honest hardware detection and real-time execution timing. The application never outputs hardcoded mock numbers disguised as benchmark measurements.

When executed on a host development machine without Qualcomm Hexagon NPU hardware:
- The execution provider displays: `CPUExecutionProvider` (or `DmlExecutionProvider`).
- The device name displays the actual host CPU (e.g., `AMD Ryzen 5 7535HS with Radeon Graphics` or `Intel Core i7`).
- The NPU latency displays: `Not yet benchmarked on physical Snapdragon NPU. (Active run executed on host CPU fallback; deploy on HP Snapdragon PC to record QNN NPU acceleration).`

---

## 2. Benchmark Measurement Pipeline

The benchmarking suite (`benchmarks/run_benchmark.py` and `ml/benchmark/benchmark_runner.py`) records millisecond latencies across three distinct pipeline stages:

1. **Preprocessing Latency ($T_{\text{prep}}$)**:
   - For Vision: Aspect-ratio letterbox resizing (640x640), RGB conversion, normalization, and tensor transposition ($N \times C \times H \times W$).
   - For Speech: Audio decoding, 16kHz resample, and log-mel filterbank extraction.
2. **Inference Latency ($T_{\text{infer}}$)**:
   - Pure model tensor execution time on active Execution Provider (`QNNExecutionProvider` / `DmlExecutionProvider` / `CPUExecutionProvider`).
3. **Postprocessing Latency ($T_{\text{post}}$)**:
   - For Vision: Confidence thresholding, Non-Maximum Suppression (NMS), bounding box coordinate scaling, and semantic hazard mapping.
   - For Speech: Greedy token decoding and regex disaster entity extraction.
4. **Total Latency ($T_{\text{total}} = T_{\text{prep}} + T_{\text{infer}} + T_{\text{post}}$)**.

---

## 3. How to Run Benchmarks on Physical HP Snapdragon AI PCs

When deploying to a Snapdragon X Elite or Snapdragon X Plus HP PC (e.g., HP OmniBook X or HP EliteBook Ultra):

### Prerequisites
1. Windows 11 on ARM64.
2. Qualcomm Neural Processing SDK / QNN Execution Provider for ONNX Runtime installed:
   ```bash
   pip install onnxruntime-qnn
   ```
3. Verify Hexagon NPU driver in Windows Device Manager -> System Devices -> Qualcomm Hexagon NPU.

### Execution
Run the automated benchmark suite from the repository root:
```bash
python benchmarks/run_benchmark.py
```

### Output
The script executes 1 warmup cycle followed by 5 timed inference iterations for each model, logging outputs to:
- `benchmarks/benchmark_results.json`
- `benchmarks/benchmark_results.csv`

---

## 4. Models Targeted for Snapdragon Optimization

| Component | Target Model Architecture | Format | Target Accelerator |
|:---|:---|:---|:---|
| **Object Detection** | YOLOv8n / YOLOv11n Flood Custom | ONNX (INT8/FP16) | Qualcomm Hexagon NPU (QNN EP) |
| **Water Segmentation** | PidNet-S Water Segmentation | ONNX (INT8/FP16) | Qualcomm Hexagon NPU (QNN EP) |
| **Speech Transcription** | Whisper-Base Encoder/Decoder | ONNX (INT8) | Qualcomm Hexagon NPU (QNN EP) |
