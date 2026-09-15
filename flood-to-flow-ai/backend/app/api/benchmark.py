"""
Benchmarking API Endpoint for Flood-to-Flow AI.
Allows measuring local inference latencies across Vision and Speech models.
"""

import os
from fastapi import APIRouter
from ml.benchmark.benchmark_runner import benchmark_runner

router = APIRouter(prefix="/api/benchmark", tags=["Benchmarking"])


@router.post("/run")
def trigger_benchmark(iterations: int = 5):
    """
    Execute timed inference cycles on local hardware and record measured latencies.
    """
    res = benchmark_runner.run_benchmark(iterations=iterations)
    out_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", "benchmarks"))
    benchmark_runner.save_results(out_dir)
    return res


@router.get("/results")
def get_latest_benchmark_results():
    """
    Retrieve latest measured benchmark results or run a quick benchmark if empty.
    """
    if not benchmark_runner.results_cache:
        return benchmark_runner.run_benchmark(iterations=3)
    return benchmark_runner.results_cache
