#!/usr/bin/env python3
"""
Get a fresh Instagram Session ID
Run this if your current session is expired
"""

import os
from dotenv import load_dotenv

load_dotenv()

print("""
═══════════════════════════════════════════════════════════════════════════════
                    GET INSTAGRAM SESSION ID
═══════════════════════════════════════════════════════════════════════════════

Your Instagram Session ID has expired. Let's get a new one!

Method 1: Manual (Recommended) - Takes 2 minutes
───────────────────────────────────────────────────────────────────────────────

1. Open Instagram in Chrome: https://www.instagram.com
2. Log in with your account
3. Press F12 to open DevTools
4. Go to Application tab
5. In the left sidebar, click "Cookies"
6. Click "https://www.instagram.com"
7. Find the cookie named "sessionid"
8. Copy its VALUE (long string starting with numbers)
9. Paste it below

Method 2: Browser Automation
───────────────────────────────────────────────────────────────────────────────

Try running this (may require browser interaction):
  python -c "from instagrapi import Client; cl = Client(); cl.login('your_username', 'your_password'); print(cl.get_session())"

Method 3: Direct Instagram Login
───────────────────────────────────────────────────────────────────────────────

Use this code in Python:

  from instagrapi import Client
  cl = Client()
  cl.login('your_username', 'your_password')
  print(cl.get_session())

═══════════════════════════════════════════════════════════════════════════════

After getting your session ID:

1. Open .env file
2. Find: INSTAGRAM_SESSION_ID=
3. Replace with your new session ID
4. Save
5. Restart server: python instagram_api.py

═══════════════════════════════════════════════════════════════════════════════
""")

ig_user = os.environ.get("INSTAGRAM_USERNAME")
ig_pass = os.environ.get("INSTAGRAM_PASSWORD")

if ig_user and ig_pass:
    print(f"\n✅ Found Instagram credentials in .env:")
    print(f"   Username: {ig_user}")
    print(f"\n   Would you like to auto-login? (y/n): ", end="")
    
    response = input().lower()
    
    if response == 'y':
        try:
            from instagrapi import Client
            
            print("\n⏳ Logging into Instagram...")
            cl = Client()
            cl.login(ig_user, ig_pass)
            
            session_data = cl.get_session()
            print(f"\n✅ Login successful!")
            print(f"\n📋 Your Session ID:")
            print(f"   {session_data}")
            
            print(f"\n📝 Update your .env file:")
            print(f"   INSTAGRAM_SESSION_ID={session_data}")
            
        except Exception as e:
            print(f"\n❌ Login failed: {e}")
            print("\nTry Method 1 (Manual) instead")
else:
    print("\n⚠️  Instagram credentials not found in .env")
    print("\nAdd them first:")
    print("   INSTAGRAM_USERNAME=your_username")
    print("   INSTAGRAM_PASSWORD=your_password")
