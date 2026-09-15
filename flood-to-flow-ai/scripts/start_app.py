"""
Full Stack Launcher for Flood-to-Flow AI on Windows.
Starts the FastAPI local intelligence backend and Vite emergency command center frontend.
"""

import subprocess
import sys
import os
import time
import webbrowser

PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))


def main():
    print("=" * 65)
    print("FLOOD-TO-FLOW AI: OFFLINE DISASTER INTELLIGENCE SYSTEM")
    print("Targeted for Snapdragon-powered HP AI PCs")
    print("=" * 65)

    # 1. Start FastAPI Backend
    print("\n[1/2] Starting FastAPI Offline AI Backend on http://127.0.0.1:8000 ...")
    backend_proc = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1", "--port", "8000"],
        cwd=PROJECT_ROOT
    )

    # Wait 2 seconds for backend to bind port
    time.sleep(2)

    # 2. Start Vite Frontend
    print("[2/2] Starting Vite Emergency Command Center on http://localhost:5173 ...")
    frontend_dir = os.path.join(PROJECT_ROOT, "frontend")
    
    # Use npx / npm run dev via cmd on Windows
    npm_cmd = "npm.cmd" if os.name == "nt" else "npm"
    frontend_proc = subprocess.Popen(
        [npm_cmd, "run", "dev"],
        cwd=frontend_dir
    )

    time.sleep(2)
    print("\n" + "=" * 65)
    print("SYSTEM OPERATIONAL (OFFLINE-FIRST MODE READY)")
    print("  Dashboard UI: http://localhost:5173")
    print("  Backend API:  http://127.0.0.1:8000")
    print("  API Docs:     http://127.0.0.1:8000/docs")
    print("=" * 65)
    print("Press Ctrl+C to terminate both servers.\n")

    webbrowser.open("http://localhost:5173")

    try:
        backend_proc.wait()
    except KeyboardInterrupt:
        print("\nShutting down Flood-to-Flow AI...")
        backend_proc.terminate()
        frontend_proc.terminate()


if __name__ == "__main__":
    main()
