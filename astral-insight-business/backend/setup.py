#!/usr/bin/env python
"""
AstralInsight Analytics Backend Setup Script
Automates backend setup including virtual environment and dependencies
"""

import os
import sys
import subprocess
import platform

def print_header(text):
    print("\n" + "="*60)
    print(f"  {text}")
    print("="*60)

def run_command(cmd, description):
    """Run a system command and report status"""
    print(f"\n{description}...")
    try:
        if isinstance(cmd, str):
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
        else:
            result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✓ {description} - Success")
            return True
        else:
            print(f"✗ {description} - Failed")
            if result.stderr:
                print(f"  Error: {result.stderr}")
            return False
    except Exception as e:
        print(f"✗ {description} - Error: {str(e)}")
        return False

def main():
    print_header("AstralInsight Analytics Platform - Backend Setup")
    
    # Check Python version
    print(f"\nPython version: {sys.version}")
    if sys.version_info < (3, 9):
        print("✗ Python 3.9+ required")
        sys.exit(1)
    
    # Check if in correct directory
    if not os.path.exists('app/main.py'):
        print("✗ Please run this script from the backend directory")
        sys.exit(1)
    
    print("✓ Correct directory detected")
    
    # Create virtual environment
    venv_dir = "venv"
    if not os.path.exists(venv_dir):
        run_command([sys.executable, "-m", "venv", venv_dir], "Creating virtual environment")
    else:
        print("\n✓ Virtual environment already exists")
    
    # Get the Python executable in venv
    if platform.system() == "Windows":
        python_exe = os.path.join(venv_dir, "Scripts", "python.exe")
        pip_exe = os.path.join(venv_dir, "Scripts", "pip.exe")
    else:
        python_exe = os.path.join(venv_dir, "bin", "python")
        pip_exe = os.path.join(venv_dir, "bin", "pip")
    
    # Install requirements
    if os.path.exists('requirements.txt'):
        run_command([pip_exe, "install", "-r", "requirements.txt"], "Installing dependencies")
    else:
        print("✗ requirements.txt not found")
        sys.exit(1)
    
    # Create uploads directory
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
        print("\n✓ Created uploads directory")
    else:
        print("\n✓ Uploads directory already exists")
    
    # Print next steps
    print_header("Setup Complete!")
    
    print("""
Prerequisites:
1. PostgreSQL database running (default: localhost:5432)
2. Database created: astral_insight
3. User configured: postgres

Configuration:
1. Open backend/.env file
2. Set DATABASE_URL to match your PostgreSQL setup
   Example: postgresql://postgres:password@localhost:5432/astral_insight

Starting the server:

Windows:
    .\\venv\\Scripts\\activate
    python -m uvicorn app.main:app --reload

Mac/Linux:
    source venv/bin/activate
    python -m uvicorn app.main:app --reload

Server will start at: http://localhost:8000
API Docs: http://localhost:8000/docs

Happy analytics! 🚀
""")

if __name__ == "__main__":
    main()
