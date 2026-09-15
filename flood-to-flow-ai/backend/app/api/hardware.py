"""
Hardware & NPU Acceleration API Endpoint.
Exposes Qualcomm Hexagon NPU, QNN Execution Provider, DirectML, and CPU fallback status.
"""

from fastapi import APIRouter
from ml.hardware_detector import hardware_detector
from backend.app.schemas import HardwareStatusResponse

router = APIRouter(prefix="/api/hardware", tags=["Hardware Acceleration"])


@router.get("/status", response_model=HardwareStatusResponse)
def get_hardware_acceleration_status():
    """
    Returns real-time hardware profile, active execution provider,
    chipset architecture, and NPU availability.
    """
    info = hardware_detector.get_hardware_info()
    return HardwareStatusResponse(
        os=f"{info.get('os')} {info.get('os_release', '')}".strip(),
        architecture=info.get("architecture", "Unknown"),
        processor=info.get("processor", "Unknown"),
        device_name=info.get("device_name", "System CPU"),
        is_snapdragon_detected=info.get("is_snapdragon_detected", False),
        npu_available=info.get("npu_available", False),
        npu_tops=info.get("npu_tops"),
        active_provider=info.get("active_provider", "CPUExecutionProvider"),
        available_providers=info.get("available_providers", []),
        fallback_active=info.get("fallback_active", True),
        fallback_reason=info.get("fallback_reason"),
        benchmark_status=info.get("benchmark_status", "Not benchmarked"),
        recommended_target=info.get("recommended_target", "Snapdragon X Elite / Plus")
    )
