# 🔧 Troubleshooting Guide

## ❌ Error: "This version of ChromeDriver only supports Chrome version 150"

### Problem
Your Chrome is version 149 but ChromeDriver expects 150.

### Solution A: Update Chrome (Recommended)
1. Open Google Chrome
2. Click ☰ (Menu) → Settings
3. Click "About Chrome"
4. Chrome automatically checks for updates
5. Click "Update" if available
6. Restart Chrome

### Solution B: Manual Chrome Download
Download Chrome 150 from: https://www.google.com/chrome

### Solution C: Check Your Chrome Version
1. Open Chrome
2. Click ☰ (Menu) → Help → About Google Chrome
3. Note the version number

---

## ❌ Error: "No module named 'moviepy.video.io.ImageClip'"

### Problem
MoviePy import path is wrong (old API vs new API)

### Solution (Already Fixed ✅)
The code has been updated to use:
```python
from moviepy.editor import ImageClip  # Correct way
```

Just restart Python:
```bash
python instagram_api.py
```

---

## ❌ Error: "FACEBOOK_EMAIL and FACEBOOK_PASSWORD not set"

### Problem
Credentials missing from `.env` file

### Solution
Edit `.env` and add:
```env
FACEBOOK_EMAIL=your_email@gmail.com
FACEBOOK_PASSWORD=your_password
```

Then restart server.

---

## ❌ Error: "INSTAGRAM_SESSION_ID not set"

### Problem
Instagram session ID missing

### Solution
Edit `.env` and add:
```env
INSTAGRAM_SESSION_ID=45480774434%3AJQL7e1xBNWa9rQ%3A23%3AAYgFklD5Z99t4ZHodE6yKQOxGD8WV-qnDMTQbWs9Jg
```

---

## ⚠️ Browser won't open / Selenium errors

### Check 1: Chrome is installed
```bash
# Windows
"C:\Program Files\Google\Chrome\Application\chrome.exe" --version
```

Should show version like: `Google Chrome 150.0.7827.201`

### Check 2: Clear cache
```bash
python fix_chromedriver.py
```

### Check 3: Reinstall selenium
```bash
pip uninstall -y selenium webdriver-manager
pip install selenium webdriver-manager
```

---

## 🐌 YouTube conversion is slow (30+ seconds)

### Expected Behavior ✅
- Image to MP4 conversion: 10-20 seconds
- YouTube upload: 10-15 seconds
- **Total: 20-35 seconds**

This is normal! Grab some coffee ☕

### If it takes longer than 1 minute
1. Check your internet speed (upload speed matters)
2. Reduce image resolution (large images take longer)
3. Make sure YouTube Studio page is loading

---

## ❌ "Could not find Create button" or "Could not find Upload button"

### Problem
YouTube Studio UI changes or loads slowly

### Solution
1. Wait longer for page to load:
   - Edit `social_media_easy.py`
   - Change `time.sleep(3)` to `time.sleep(5)`

2. Try again later (YouTube UI can be inconsistent)

3. Verify you're logged into YouTube:
   - Open https://studio.youtube.com manually
   - Make sure you can access it

---

## ❌ Facebook login fails

### Problem
Credentials incorrect or 2FA enabled

### Solution A: Verify Credentials
1. Log into Facebook manually with your email/password
2. Make sure login works
3. Check for typos in `.env`

### Solution B: Disable 2FA (If Enabled)
Browser automation can't handle 2FA prompts.

1. Go to https://www.facebook.com/settings
2. Click "Security and login"
3. Find "Two-factor authentication"
4. Disable it temporarily for automation
5. Re-enable after testing

### Solution C: Use App Password
If Facebook requires special app password:
1. Generate app password in Facebook settings
2. Use that instead of regular password

---

## ❌ Instagram session expired

### Problem
"INSTAGRAM_SESSION_ID" error or "Session ID not valid"

### Solution A: Get New Session ID
1. Go to Instagram: https://www.instagram.com
2. Open DevTools (F12)
3. Go to Application → Cookies
4. Find cookie named `sessionid`
5. Copy the value
6. Paste into `.env`:
```env
INSTAGRAM_SESSION_ID=your_new_session_id
```

### Solution B: Use Username/Password Instead
Edit `.env`:
```env
INSTAGRAM_USERNAME=your_username
INSTAGRAM_PASSWORD=your_password
```

---

## 📊 Status: Still not working?

### Debug Mode
1. Edit `social_media_easy.py`
2. Find: `logger=None`
3. Change to: `logger='bar'`

This will show video conversion progress.

### Check Logs
When you post, the logs show:
```
INFO:jarvis:Posting to Instagram...
INFO:jarvis:Converting image to video: image.jpg
INFO:jarvis:Writing video to: /tmp/xyz.mp4
INFO:jarvis:Opening Facebook...
INFO:jarvis:Logging in as email@gmail.com
```

Look for ❌ errors after each step.

---

## 🔍 Common Issues Summary

| Error | Cause | Fix |
|-------|-------|-----|
| ChromeDriver version mismatch | Chrome 149, driver 150 | Update Chrome to 150 |
| No module named moviepy | Wrong import path | Restart Python |
| Email/password not set | Missing `.env` credentials | Add to `.env` |
| "Could not find button" | YouTube UI loading slow | Wait longer |
| Facebook login fails | Wrong credentials or 2FA | Verify or disable 2FA |
| Instagram session expired | Session ID old | Get new session ID |
| Video conversion timeout | Large image or slow internet | Use smaller image |

---

## 🚀 Quick Restart Steps

If everything breaks:

```bash
# 1. Stop server (Ctrl+C in terminal)

# 2. Clear cached drivers
python fix_chromedriver.py

# 3. Update Chrome to version 150
# (Menu → Settings → About Chrome → Update)

# 4. Restart
python instagram_api.py

# 5. Test
# Open: http://localhost:5000/instagram.html
# Upload image and post
```

---

## 📞 Still Need Help?

Check these files:
- `SOCIAL_MEDIA_SETUP.md` - Setup guide
- `YOUTUBE_SHORTS_README.md` - YouTube specific
- `test_social_media.py` - Test script
- `.env` - Configuration

Or run the test script:
```bash
python test_social_media.py
```

---

**Last Updated:** July 2026  
**Status:** ✅ Most issues resolved
