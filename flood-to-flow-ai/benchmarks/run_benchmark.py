"""
Command-line Benchmark Tool for Flood-to-Flow AI on Snapdragon HP AI PCs.
Run this script directly on the Snapdragon X Elite / Plus PC to benchmark
Qualcomm Hexagon NPU QNN Execution Provider latency vs. CPU fallback.
"""

import sys
import os

# Add project root to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.hardware_detector import hardware_detector
from ml.benchmark.benchmark_runner import benchmark_runner


def main():
    print("=" * 65)
    print("FLOOD-TO-FLOW AI: HARDWARE & LATENCY BENCHMARK SUITE")
    print("Optimized for Snapdragon-Powered HP AI PCs")
    print("=" * 65)

    hw = hardware_detector.get_hardware_info()
    print(f"\n[Hardware Profile]")
    print(f"  OS:              {hw['os']} {hw['os_release']} ({hw['architecture']})")
    print(f"  Processor:       {hw['processor']}")
    print(f"  Detected Device: {hw['device_name']}")
    print(f"  Snapdragon NPU:  {'DETECTED (45 TOPS Hexagon)' if hw['is_snapdragon_detected'] and hw['npu_available'] else 'CPU Fallback'}")
    print(f"  Active Provider: {hw['active_provider']}")
    print(f"  Available EPs:   {', '.join(hw['available_providers'])}")

    if hw['fallback_active']:
        print(f"\n[Notice] {hw['fallback_reason']}")

    print("\nRunning inference benchmark iterations (Warmup + 5 timed cycles)...")
    res = benchmark_runner.run_benchmark(iterations=5)

    print("\n" + "-" * 65)
    print(f"{'MODEL':<28} | {'PROVIDER':<20} | {'LATENCY (ms)':<12}")
    print("-" * 65)
    for k, v in res["models"].items():
        print(f"{v['model_name']:<28} | {v['execution_provider']:<20} | {v['avg_total_ms']} ms")
    print("-" * 65)

    out_dir = os.path.dirname(__file__)
    files = benchmark_runner.save_results(out_dir)
    print(f"\nResults saved successfully:")
    print(f"  JSON: {files['json']}")
    print(f"  CSV:  {files['csv']}")
    print(f"\nStatus: {res['comparison']['npu_status_note']}\n")


if __name__ == "__main__":
    main()
