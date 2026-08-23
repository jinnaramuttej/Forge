# 🎥 YouTube Shorts Auto-Posting

## What's New

Now you can post to **YouTube Shorts directly from images**! 🎉

The system automatically:
1. ✅ Converts your image to a 5-second MP4 video
2. ✅ Logs into YouTube Studio
3. ✅ Uploads the video as a Short
4. ✅ Adds title and description

---

## How It Works

### Image → Video Conversion
- Image is resized to YouTube Shorts format (1080x1920 vertical)
- Video duration: 5 seconds
- Automatically saved as MP4

### Browser Automation
- Opens Chrome automatically
- Logs in with your YouTube email/password
- Navigates to YouTube Studio
- Uploads the video
- Sets title and description from your caption

---

## Setup

### 1. Add YouTube Credentials to `.env`
```env
YOUTUBE_EMAIL=your_email@gmail.com
YOUTUBE_PASSWORD=your_password
```

### 2. Dependencies Already Installed
```
✅ moviepy        - Video creation
✅ imageio        - Image handling
✅ pillow         - Image processing
✅ selenium       - Browser automation
✅ webdriver-manager - Chrome driver
```

---

## Usage

### From Web UI
1. Open `http://localhost:5000/instagram.html`
2. Upload an image
3. Add caption
4. **Check the YouTube checkbox** ✅
5. Click **"📱 Post to All"**
6. Browser opens and uploads automatically

### From Python
```python
from commands.social_media_easy import post_to_social_media_easy

result = post_to_social_media_easy(
    image_path="my_image.jpg",
    caption="Check this out!",
    post_instagram=False,
    post_facebook=False,
    post_youtube=True  # Enable YouTube
)

print(result)
# Output: (True, "✅ YouTube (video uploaded - monitor in studio)")
```

---

## Quality

- **Resolution:** 1080x1920 (vertical, perfect for Shorts)
- **Duration:** 5 seconds (customizable)
- **Format:** MP4 (H.264 codec)
- **Audio:** None (background music added in YouTube Studio)

---

## Troubleshooting

### Issue: "YouTube: Email/password not set in .env"
**Solution:** Add credentials:
```env
YOUTUBE_EMAIL=your_email@gmail.com
YOUTUBE_PASSWORD=your_password
```

### Issue: Video conversion is slow
**Solution:** This is normal! Converting images to video takes 10-30 seconds depending on image size. Grab some coffee ☕

### Issue: YouTube login fails
**Solution:**
- Check credentials are correct
- Try logging in manually first to verify
- **Important:** Disable 2FA on your YouTube account (it breaks automation)
- Use a Google account (usually works better)

### Issue: Upload hangs
**Solution:** 
- YouTube Studio sometimes takes time to load
- Monitor the Chrome window that opens
- If stuck after 2 minutes, close and try again

---

## All Platforms Now Supported!

| Platform | Status | Method |
|----------|--------|--------|
| 📸 **Instagram** | ✅ | Session ID (fast) |
| 👥 **Facebook** | ✅ | Browser automation |
| 🎥 **YouTube** | ✅ | Image → Video + Browser automation |

---

## API Response Examples

### Success
```json
{
  "success": true,
  "message": "✅ Instagram | ✅ Facebook | ✅ YouTube (video uploaded - monitor in studio)"
}
```

### Partial Success
```json
{
  "success": true,
  "message": "✅ Instagram | ❌ Facebook: Timeout | ✅ YouTube"
}
```

### Failure
```json
{
  "success": false,
  "message": "❌ Instagram: Session expired | ❌ Facebook: Wrong password | ❌ YouTube: Email not set"
}
```

---

## Performance Tips

1. **First time:** Will take longer (Chrome setup) - 30-45 seconds total
2. **Subsequent:** Faster (Chrome cached) - 15-30 seconds
3. **YouTube login:** Fastest if already logged in browser
4. **Video creation:** Largest time component - unavoidable

---

## FAQ

**Q: Can I customize video duration?**
A: Yes! Edit `social_media_easy.py`, line `_image_to_video(image_path, duration=10)` → duration=10 for 10 seconds

**Q: Can I add music/background to video?**
A: Not automatically. Add music in YouTube Studio after upload (they have great music library)

**Q: What if my image is landscape?**
A: Automatically converted to vertical format for Shorts (1080x1920)

**Q: Can I batch upload multiple images?**
A: Currently one at a time. Can extend in future if needed.

**Q: Is it safe to use my real credentials?**
A: Yes! Stored in `.env` (never committed to Git), used locally only for automation.

---

## Code Example

```python
# Post image to all 3 platforms with one command
from commands.social_media_easy import post_to_social_media_easy

success, message = post_to_social_media_easy(
    image_path="photo.jpg",
    caption="Amazing view! 🌅 #travel #photography",
    post_instagram=True,
    post_facebook=True,
    post_youtube=True
)

if success:
    print(f"✅ Posted to all platforms: {message}")
else:
    print(f"❌ Some platforms failed: {message}")
```

---

## Next Steps

1. **Test:** Open web UI and upload an image
2. **Monitor:** Watch browser automate the process
3. **Share:** Your content is now on all platforms!
4. **Track:** Check YouTube Studio for upload status

---

**Version:** 2.0 - YouTube Support Added
**Status:** ✅ All 3 platforms working
**Last Updated:** July 2026
