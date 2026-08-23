#!/usr/bin/env python3
"""
Quick test script for social media posting
Run: python test_social_media.py
"""

import os
import sys
from pathlib import Path

# Add commands to path
sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv
from PIL import Image
import tempfile

# Load env
load_dotenv()

print("""
╔════════════════════════════════════════════════════════════╗
║         📱 Social Media Posting - Test Script             ║
╚════════════════════════════════════════════════════════════╝
""")

# Create test image
print("1️⃣  Creating test image...")
test_img = Image.new('RGB', (600, 600), color='red')
with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f:
    test_img.save(f.name, 'JPEG')
    test_image_path = f.name
    print(f"   ✅ Test image created: {test_image_path}")

# Check configuration
print("\n2️⃣  Checking configuration...")

ig_session = os.environ.get('INSTAGRAM_SESSION_ID')
fb_email = os.environ.get('FACEBOOK_EMAIL')
fb_pass = os.environ.get('FACEBOOK_PASSWORD')
yt_email = os.environ.get('YOUTUBE_EMAIL')
yt_pass = os.environ.get('YOUTUBE_PASSWORD')

print(f"   📸 Instagram Session ID: {'✅ SET' if ig_session else '❌ NOT SET'}")
print(f"   👥 Facebook Email: {'✅ SET' if fb_email else '❌ NOT SET'}")
print(f"   👥 Facebook Password: {'✅ SET' if fb_pass else '❌ NOT SET'}")
print(f"   🎥 YouTube Email: {'✅ SET' if yt_email else '❌ NOT SET'}")
print(f"   🎥 YouTube Password: {'✅ SET' if yt_pass else '❌ NOT SET'}")

# Test imports
print("\n3️⃣  Testing imports...")
try:
    from commands.social_media_easy import post_to_social_media_easy
    print("   ✅ social_media_easy imported successfully")
except Exception as e:
    print(f"   ❌ Failed to import: {e}")
    sys.exit(1)

# Test function
print("\n4️⃣  Testing social media posting functions...")

caption = "Test post from automation 🤖"

# Option A: Test Instagram only
if ig_session:
    print("\n   Testing Instagram...")
    success, message = post_to_social_media_easy(
        test_image_path,
        caption,
        post_instagram=True,
        post_facebook=False,
        post_youtube=False
    )
    print(f"   Result: {message}")

# Option B: Test Facebook only
if fb_email and fb_pass:
    print("\n   Testing Facebook...")
    print("   ⏳ Browser will open automatically...")
    print("   ⏳ This may take 10-15 seconds...")
    
    success, message = post_to_social_media_easy(
        test_image_path,
        caption,
        post_instagram=False,
        post_facebook=True,
        post_youtube=False
    )
    print(f"   Result: {message}")

# Option C: Test YouTube only
if yt_email and yt_pass:
    print("\n   Testing YouTube...")
    print("   ⏳ Browser will open automatically...")
    print("   ⏳ Note: YouTube Shorts require VIDEO files, not images")
    
    success, message = post_to_social_media_easy(
        test_image_path,
        caption,
        post_instagram=False,
        post_facebook=False,
        post_youtube=True
    )
    print(f"   Result: {message}")

# Cleanup
os.remove(test_image_path)
print(f"\n✅ Test complete! Temp image cleaned up.")

print("""
📋 Next Steps:
   1. Start server: python instagram_api.py
   2. Open browser: http://localhost:5000/instagram.html
   3. Upload image and post to all platforms
   4. Check your social media accounts for new posts!

📖 For more info, see: SOCIAL_MEDIA_SETUP.md
""")
