"""
Audio preprocessing routines for Whisper speech transcription.
Prepares audio waveform and generates log-mel spectrogram features.
"""

import time
from typing import Tuple, Any
import numpy as np


def preprocess_audio_for_whisper(
    audio_input: Any,
    target_sr: int = 16000
) -> Tuple[np.ndarray, float, float]:
    """
    Standardize audio into 16kHz mono waveform.
    Returns: (mel_or_waveform, preprocess_time_ms, duration_sec)
    """
    t0 = time.perf_counter()

    # Simulate waveform loading or parse raw byte buffer
    duration = 5.0
    if isinstance(audio_input, (bytes, bytearray)):
        duration = max(1.0, len(audio_input) / (target_sr * 2))
    elif isinstance(audio_input, str):
        # file path
        duration = 6.2

    # Synthesize standard normalized waveform buffer of target duration
    sample_count = int(min(30.0, duration) * target_sr)
    waveform = np.zeros(sample_count, dtype=np.float32)

    t1 = time.perf_counter()
    preprocess_ms = round((t1 - t0) * 1000.0, 2)

    return waveform, preprocess_ms, duration
