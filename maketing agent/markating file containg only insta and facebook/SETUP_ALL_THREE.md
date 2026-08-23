# 📱 Setup All Three Platforms - Instagram, Facebook, YouTube

## ✅ What's Configured

### Instagram ✅
```env
INSTAGRAM_SESSION_ID=45480774434%3AJQL7e1xBNWa9rQ%3A23%3AAYgFklD5Z99t4ZHodE6yKQOxGD8WV-qnDMTQbWs9Jg
INSTAGRAM_USERNAME=rhino.7438167
INSTAGRAM_PASSWORD=komal@12
```

### Facebook ✅
```env
FACEBOOK_USERNAME=vlikith45@gmail.com
FACEBOOK_PASSWORD=komal@12
```

### YouTube ⏳ (Optional)
For YouTube Shorts, add to .env:
```env
YOUTUBE_ACCESS_TOKEN=your_youtube_oauth_token
```

---

## 🚀 To Enable Facebook Posting

Facebook posting uses **Playwright** (browser automation). Install it:

```bash
pip install playwright
playwright install chromium
```

That's it! Facebook is already configured in your .env

---

## 🎥 To Enable YouTube Posting (Optional)

YouTube posts images as Shorts (auto-converted to video). To enable:

1. Install YouTube libraries:
```bash
pip install google-auth-oauthlib google-auth-httplib2 google-api-python-client opencv-python
```

2. Get YouTube OAuth token:
   - Go to: https://myaccount.google.com/permissions
   - Add app: "HEY Social Media AI"
   - Copy token to .env

3. Add to .env:
```env
YOUTUBE_ACCESS_TOKEN=ya29.your_youtube_token_here
```

---

## 🚀 Run Multi-Platform Posting

1. Install dependencies:
```bash
pip install flask flask-cors instagrapi playwright google-auth-oauthlib google-api-python-client opencv-python
playwright install chromium
```

2. Run:
```bash
python instagram_api.py
```

Or double-click: `RUN_INSTAGRAM.bat`

3. Open: `http://localhost:5000/instagram.html`

4. Upload image and click **"📱 Post to All 3"**

---

## 📊 Features

- ✅ Instagram: Posts image directly
- ✅ Facebook: Posts image to personal profile
- ✅ YouTube: Converts image to Shorts video (3 sec)
- ✅ All platforms: Parallel posting (posts simultaneously)
- ✅ All platforms: Support for captions

---

## 🔧 Troubleshooting

### Facebook Not Working
- Install Playwright: `pip install playwright && playwright install chromium`
- Check credentials in .env

### YouTube Not Working
- Install dependencies: `pip install google-auth-oauthlib google-api-python-client opencv-python`
- Add YOUTUBE_ACCESS_TOKEN to .env

### Need OpenCV?
```bash
pip install opencv-python
```

---

## 📱 Platform Selection

On upload page:
- [ ✓ ] 📸 Instagram (default: checked)
- [ ✓ ] 👥 Facebook (default: checked)
- [ ✓ ] 🎥 YouTube (default: checked)

Uncheck any platform you don't want to use.

---

## 🎉 One Upload = Three Platforms!

Upload once → Posts to Instagram + Facebook + YouTube automatically!

---

**Ready? Install dependencies and start!** 🚀
