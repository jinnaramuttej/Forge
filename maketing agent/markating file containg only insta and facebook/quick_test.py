#!/usr/bin/env python3
"""Quick test for Instagram & Facebook only"""

import os
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))

from dotenv import load_dotenv
from PIL import Image
import tempfile

load_dotenv()

print("🧪 Quick Test: Instagram + Facebook\n")

# Create test image
test_img = Image.new('RGB', (600, 600), color='blue')
with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as f:
    test_img.save(f.name, 'JPEG')
    test_image_path = f.name
    print(f"✅ Test image created\n")

# Check credentials
ig_session = os.environ.get('INSTAGRAM_SESSION_ID')
fb_email = os.environ.get('FACEBOOK_EMAIL')
fb_pass = os.environ.get('FACEBOOK_PASSWORD')

print("📋 Credentials Check:")
print(f"  Instagram: {'✅' if ig_session else '❌'}")
print(f"  Facebook:  {'✅' if fb_email and fb_pass else '❌'}\n")

# Test Instagram only
print("🧪 Testing Instagram...")
try:
    from commands.social_media_easy import post_to_social_media_easy
    
    success, message = post_to_social_media_easy(
        test_image_path,
        "Test post 📸",
        post_instagram=True,
        post_facebook=False,
        post_youtube=False
    )
    print(f"Result: {message}\n")
except Exception as e:
    print(f"Error: {e}\n")

# Test Facebook only (will open browser)
if fb_email and fb_pass:
    print("🧪 Testing Facebook...")
    print("⏳ Browser will open - watch it post!\n")
    try:
        success, message = post_to_social_media_easy(
            test_image_path,
            "Test from auto 🤖",
            post_instagram=False,
            post_facebook=True,
            post_youtube=False
        )
        print(f"Result: {message}\n")
    except Exception as e:
        print(f"Error: {e}\n")

# Cleanup
os.remove(test_image_path)
print("✅ Test complete!")
