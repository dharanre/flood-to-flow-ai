"""
Unit Tests for Snapdragon Hardware Detection & Graceful CPU Fallback.
"""

import pytest
from ml.hardware_detector import hardware_detector


def test_hardware_detection_profile():
    info = hardware_detector.get_hardware_info()
    assert isinstance(info, dict)
    assert "os" in info
    assert "architecture" in info
    assert "active_provider" in info
    assert "available_providers" in info
    assert "is_snapdragon_detected" in info
    assert "fallback_active" in info
    assert "benchmark_status" in info


def test_honest_npu_reporting():
    """Verify that NPU is never falsely reported without hardware backing."""
    info = hardware_detector.get_hardware_info()
    if not (info["is_snapdragon_detected"] and info["npu_available"]):
        assert info["fallback_active"] is True
        assert info["active_provider"] in ["CPUExecutionProvider", "DmlExecutionProvider"]
        assert "Not yet benchmarked on NPU" in info["benchmark_status"] or "fallback" in info["benchmark_status"].lower()
