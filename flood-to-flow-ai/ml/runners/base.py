"""
Abstract Base Class for Multimodal Model Runners.
Provides vendor-agnostic interface for Vision (YOLO/PidNet) and Speech (Whisper).
Supports Qualcomm QNN (Snapdragon Hexagon NPU), DirectML, and CPU fallback.
"""

from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
import time


class BaseModelRunner(ABC):
    """
    Abstract ModelRunner interface decoupling application logic from
    vendor-specific runtime details (Qualcomm QNN / DirectML / CPU).
    """

    def __init__(self, preferred_provider: Optional[str] = None):
        self.preferred_provider = preferred_provider
        self.active_provider = "CPUExecutionProvider"
        self.device_name = "System CPU"
        self.is_fallback = False
        self.fallback_reason = None
        self._initialize_provider()

    @abstractmethod
    def _initialize_provider(self) -> None:
        """Initialize and validate target execution provider."""
        pass

    @abstractmethod
    def detect_objects(self, image_data: Any) -> Dict[str, Any]:
        """
        Execute YOLO object detection.
        Returns:
            {
                "detections": List[Dict],
                "inference_time_ms": float,
                "preprocess_time_ms": float,
                "postprocess_time_ms": float,
                "provider": str,
                "model": str
            }
        """
        pass

    @abstractmethod
    def segment_scene(self, image_data: Any) -> Dict[str, Any]:
        """
        Execute PidNet flood / road segmentation.
        Returns:
            {
                "water_coverage_ratio": float,
                "road_submerged": bool,
                "building_entrance_flooded": bool,
                "inference_time_ms": float,
                "provider": str,
                "model": str
            }
        """
        pass

    @abstractmethod
    def transcribe_audio(self, audio_data: Any) -> Dict[str, Any]:
        """
        Execute Whisper speech transcription & entity extraction.
        Returns:
            {
                "transcript": str,
                "entities": Dict[str, Any],
                "confidence": float,
                "inference_time_ms": float,
                "provider": str,
                "model": str
            }
        """
        pass

    def get_status(self) -> Dict[str, Any]:
        """Return operational profile of this runner."""
        return {
            "active_provider": self.active_provider,
            "device_name": self.device_name,
            "fallback_active": self.is_fallback,
            "fallback_reason": self.fallback_reason,
        }
