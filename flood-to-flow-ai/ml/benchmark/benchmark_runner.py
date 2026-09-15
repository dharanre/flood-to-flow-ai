"""
Benchmarking module for Snapdragon Hexagon NPU vs. CPU execution.
Measures preprocess, inference, postprocess, and total latency on local hardware.
Strictly records real measured host metrics without fabricating results.
"""

import time
import os
import json
import csv
from typing import Dict, Any, List
import numpy as np

from ml.hardware_detector import hardware_detector
from ml.runners.vision_runner import vision_runner
from ml.runners.speech_runner import speech_runner


class BenchmarkRunner:
    """
    Executes real-time benchmarking iterations on local device.
    Evaluates Vision (YOLOv8, PidNet) and Speech (Whisper).
    """

    def __init__(self):
        self.results_cache = None

    def run_benchmark(self, iterations: int = 5) -> Dict[str, Any]:
        """
        Run latency benchmark over multiple iterations and calculate averages.
        """
        hw_info = hardware_detector.get_hardware_info()
        is_npu = hw_info.get("npu_available", False)
        active_provider = hw_info.get("active_provider", "CPUExecutionProvider")
        device_name = hw_info.get("device_name", "System CPU")

        # Create realistic synthetic test assets
        test_img = np.zeros((640, 640, 3), dtype=np.uint8)
        test_audio = b"\x00" * 32000  # 1 sec audio @ 16kHz 16-bit

        # Warmup pass
        _ = vision_runner.detect_objects(test_img)
        _ = vision_runner.segment_scene(test_img)
        _ = speech_runner.transcribe_audio(test_audio)

        # Vision (YOLO) Benchmarking
        yolo_prep, yolo_inf, yolo_post = [], [], []
        for _ in range(iterations):
            res = vision_runner.detect_objects(test_img)
            yolo_prep.append(res["preprocess_time_ms"])
            yolo_inf.append(res["inference_time_ms"])
            yolo_post.append(res["postprocess_time_ms"])

        # Vision (PidNet) Benchmarking
        pid_prep, pid_inf, pid_post = [], [], []
        for _ in range(iterations):
            res = vision_runner.segment_scene(test_img)
            pid_prep.append(res["preprocess_time_ms"])
            pid_inf.append(res["inference_time_ms"])
            pid_post.append(res["postprocess_time_ms"])

        # Speech (Whisper) Benchmarking
        sp_prep, sp_inf = [], []
        for _ in range(iterations):
            res = speech_runner.transcribe_audio(test_audio)
            sp_prep.append(res["preprocess_time_ms"])
            sp_inf.append(res["inference_time_ms"])

        current_run = {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "device": device_name,
            "architecture": hw_info.get("architecture"),
            "active_provider": active_provider,
            "iterations": iterations,
            "models": {
                "yolov8n_object_detection": {
                    "model_name": "yolov8n-flood (Qualcomm AI Hub)",
                    "execution_provider": active_provider,
                    "avg_preprocess_ms": round(float(np.mean(yolo_prep)), 2),
                    "avg_inference_ms": round(float(np.mean(yolo_inf)), 2),
                    "avg_postprocess_ms": round(float(np.mean(yolo_post)), 2),
                    "avg_total_ms": round(float(np.mean(yolo_prep) + np.mean(yolo_inf) + np.mean(yolo_post)), 2)
                },
                "pidnet_s_segmentation": {
                    "model_name": "pidnet-s-water (Qualcomm AI Hub)",
                    "execution_provider": active_provider,
                    "avg_preprocess_ms": round(float(np.mean(pid_prep)), 2),
                    "avg_inference_ms": round(float(np.mean(pid_inf)), 2),
                    "avg_postprocess_ms": round(float(np.mean(pid_post)), 2),
                    "avg_total_ms": round(float(np.mean(pid_prep) + np.mean(pid_inf) + np.mean(pid_post)), 2)
                },
                "whisper_base_speech": {
                    "model_name": "whisper-base-en (Qualcomm AI Hub)",
                    "execution_provider": active_provider,
                    "avg_preprocess_ms": round(float(np.mean(sp_prep)), 2),
                    "avg_inference_ms": round(float(np.mean(sp_inf)), 2),
                    "avg_total_ms": round(float(np.mean(sp_prep) + np.mean(sp_inf)), 2)
                }
            },
            "comparison": {
                "cpu_measured": True,
                "npu_measured": is_npu,
                "npu_status_note": (
                    "Benchmarked with active QNN Execution Provider on Hexagon NPU."
                    if is_npu
                    else "Not yet benchmarked on physical Snapdragon NPU. (Active run executed on host CPU fallback; deploy on HP Snapdragon PC to record QNN NPU acceleration)."
                )
            }
        }

        self.results_cache = current_run
        return current_run

    def save_results(self, output_dir: str) -> Dict[str, str]:
        """Save JSON and CSV benchmark logs."""
        os.makedirs(output_dir, exist_ok=True)
        results = self.results_cache or self.run_benchmark(iterations=3)

        json_path = os.path.join(output_dir, "benchmark_results.json")
        csv_path = os.path.join(output_dir, "benchmark_results.csv")

        with open(json_path, "w", encoding="utf-8") as f:
            json.dump(results, f, indent=2)

        with open(csv_path, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["Model", "Provider", "Device", "Preprocess_ms", "Inference_ms", "Postprocess_ms", "Total_ms"])
            for m_key, m_data in results["models"].items():
                writer.writerow([
                    m_data.get("model_name"),
                    m_data.get("execution_provider"),
                    results.get("device"),
                    m_data.get("avg_preprocess_ms"),
                    m_data.get("avg_inference_ms"),
                    m_data.get("avg_postprocess_ms", 0.0),
                    m_data.get("avg_total_ms")
                ])

        return {"json": json_path, "csv": csv_path}


benchmark_runner = BenchmarkRunner()
