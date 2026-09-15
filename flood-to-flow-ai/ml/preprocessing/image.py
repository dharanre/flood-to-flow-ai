"""
Image preprocessing routines for YOLOv8/11 and PidNet segmentation.
Handles letterbox resizing, normalization, and tensor formatting.
"""

import time
from typing import Tuple, Optional, Any
from PIL import Image
import numpy as np


def preprocess_image_for_yolo(
    image_input: Any,
    target_size: Tuple[int, int] = (640, 640)
) -> Tuple[np.ndarray, float, Tuple[int, int]]:
    """
    Resize with letterboxing, convert to RGB, normalize to [0, 1] and transpose to (1, 3, H, W).
    Returns: (preprocessed_tensor, preprocess_time_ms, original_dimensions)
    """
    t0 = time.perf_counter()

    if isinstance(image_input, str):
        img = Image.open(image_input).convert("RGB")
    elif isinstance(image_input, bytes):
        import io
        img = Image.open(io.BytesIO(image_input)).convert("RGB")
    elif isinstance(image_input, Image.Image):
        img = image_input.convert("RGB")
    elif isinstance(image_input, np.ndarray):
        img = Image.fromarray(image_input).convert("RGB")
    else:
        # Fallback dummy image if invalid or empty
        img = Image.new("RGB", target_size, color=(73, 109, 137))

    orig_w, orig_h = img.size

    # Maintain aspect ratio with padding
    ratio = min(target_size[0] / orig_w, target_size[1] / orig_h)
    new_w = int(orig_w * ratio)
    new_h = int(orig_h * ratio)

    resized = img.resize((new_w, new_h), Image.Resampling.BILINEAR)

    new_img = Image.new("RGB", target_size, (114, 114, 114))
    paste_x = (target_size[0] - new_w) // 2
    paste_y = (target_size[1] - new_h) // 2
    new_img.paste(resized, (paste_x, paste_y))

    # Convert to float32 normalized
    arr = np.array(new_img, dtype=np.float32) / 255.0
    # HWC to CHW -> NCHW
    arr = np.transpose(arr, (2, 0, 1))
    tensor = np.expand_dims(arr, axis=0)

    t1 = time.perf_counter()
    preprocess_ms = round((t1 - t0) * 1000.0, 2)

    return tensor, preprocess_ms, (orig_w, orig_h)
