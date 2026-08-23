#!/usr/bin/env python3
"""
Fix ChromeDriver version mismatch
This script removes the cached ChromeDriver so webdriver-manager downloads the correct version
"""

import os
import shutil
import subprocess
from pathlib import Path

print("🔧 Fixing ChromeDriver version mismatch...")

# Get Chrome version
try:
    result = subprocess.run(
        ['powershell', '-Command', 
         '(Get-Item "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe").VersionInfo.ProductVersion'],
        capture_output=True, text=True
    )
    chrome_version = result.stdout.strip().split('.')[0]
    print(f"✅ Chrome version: {chrome_version}")
except:
    print("❌ Could not detect Chrome version")
    chrome_version = "149"

# Remove cached ChromeDriver
wdm_path = Path.home() / ".wdm" / "drivers" / "chromedriver"
if wdm_path.exists():
    print(f"🗑️  Removing cached chromedriver from: {wdm_path}")
    shutil.rmtree(wdm_path)
    print("✅ Cached chromedriver removed")
else:
    print("✅ No cached chromedriver found")

# Download correct version
print(f"📥 Downloading ChromeDriver version {chrome_version}...")
try:
    from webdriver_manager.chrome import ChromeDriverManager
    driver_path = ChromeDriverManager(version=chrome_version).install()
    print(f"✅ ChromeDriver installed: {driver_path}")
except:
    print("⏳ Let webdriver-manager auto-detect version...")
    from webdriver_manager.chrome import ChromeDriverManager
    driver_path = ChromeDriverManager().install()
    print(f"✅ ChromeDriver installed: {driver_path}")

print("\n✅ ChromeDriver fixed! You can now run the social media posting.")
