# 📱 Get Facebook Access Token - Super Easy!

## ✅ Instead of Username/Password, Use Token!

Just like Instagram Session ID, Facebook has a **Graph API Token** that's much easier.

---

## 🚀 Step 1: Go to Facebook Developers

Go to: **https://developers.facebook.com/tools/accesstoken**

---

## 📋 Step 2: Create App (If You Don't Have One)

1. Go to: https://developers.facebook.com/apps
2. Click **"Create App"**
3. Choose **"Consumer"**
4. Fill in:
   - App Name: `HEY Social Media`
   - Contact Email: `vlikith45@gmail.com`
   - App Purpose: Select any
5. Click **"Create App"**

---

## 🔑 Step 3: Get Your Token

1. Left sidebar → **"Tools"** → **"Access Token Tool"**
2. Or go directly: https://developers.facebook.com/tools/accesstoken
3. You'll see your token at the top

It looks like:
```
EAA... (very long string)
```

---

## ✅ Step 4: Copy & Add to .env

Copy the token and add to your `.env`:

```env
FACEBOOK_ACCESS_TOKEN=EAA1234567890...
FACEBOOK_PAGE_ID=YOUR_PAGE_ID
```

---

## 🆔 Get Your Facebook Page ID

1. Go to: https://www.facebook.com/your-page
2. Click **"About"** section
3. Look for **"Page ID"** (usually looks like: 123456789)
4. Copy it

Or simpler: Go to https://findmyfbid.com and paste your profile URL

---

## 📝 Example .env

```env
# Facebook Graph API (easier than browser!)
FACEBOOK_ACCESS_TOKEN=EAA1234567890abcdefgh
FACEBOOK_PAGE_ID=123456789

# Or if posting to personal profile:
FACEBOOK_PROFILE_ID=987654321
```

---

## 📞 Using Your Phone Number

If you want to use phone number `9490234112`:

1. Go to your Facebook profile settings
2. Add phone number to your profile (if not already there)
3. Use above steps to get token
4. Token works with phone number too

---

## ✅ What Token Do

- ✅ Post to your Facebook profile
- ✅ Post to your Facebook page
- ✅ Post photos with captions
- ✅ Works automatically (no browser!)
- ✅ No login popup!

---

## 🎯 Why This Is Better

**Before (Browser Automation):**
- ❌ Asks for login each time
- ❌ Opens browser window
- ❌ Slow and buggy

**After (Graph API Token):**
- ✅ No login needed
- ✅ Instant posting
- ✅ Like Instagram Session ID

---

## 🚀 Then Just Use It!

Once you have token:
1. Add to `.env`:
   ```env
   FACEBOOK_ACCESS_TOKEN=your_token_here
   FACEBOOK_PAGE_ID=your_page_id_here
   ```
2. Run: `python instagram_api.py`
3. Upload image
4. Click "Post to All"
5. ✅ Posts instantly to Facebook!

---

## 💡 Which ID to Use?

- **FACEBOOK_PAGE_ID**: If you have a Facebook page (business, blog, etc.)
- **FACEBOOK_PROFILE_ID**: If posting to personal profile

Most people use: **FACEBOOK_PAGE_ID**

---

## ⏱️ Takes 5 Minutes!

1. Go to developers.facebook.com/tools/accesstoken (2 min)
2. Copy token (30 sec)
3. Add to .env (1 min)
4. Done! (1.5 min)

---

**Get your token now!** 🚀
