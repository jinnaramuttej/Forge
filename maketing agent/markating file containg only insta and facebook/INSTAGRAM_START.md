# 📸 Instagram AI - Just 2 Steps!

## Step 1: Add Instagram Credentials to .env

Open your `.env` file and add ONE of these:

**Option A - Session ID (Recommended):**
```env
INSTAGRAM_SESSION_ID=your_session_id_here
```

**Option B - Username & Password:**
```env
INSTAGRAM_USERNAME=your_username
INSTAGRAM_PASSWORD=your_password
```

### How to get Session ID?
1. Open Instagram.com
2. Login
3. Press F12 (DevTools)
4. Go to: Application → Cookies → instagram.com
5. Find "sessionid" cookie
6. Copy value → Paste into .env

---

## Step 2: Run the Server

### Windows:
Double-click: `RUN_INSTAGRAM.bat`

### Mac/Linux:
```bash
python instagram_api.py
```

---

## 🎉 Done!

Open browser: **http://localhost:5000/instagram.html**

---

## 📤 How to Use

1. **Drag & drop image** (or click to upload)
2. **Type caption** (optional)
3. **Click "Post to Instagram"**
4. ✅ **Posted!**

---

## 🔧 If It Doesn't Work

**Error: "No Instagram credentials"**
→ Add INSTAGRAM_SESSION_ID or INSTAGRAM_USERNAME to .env

**Error: "Instagram login failed"**
→ Check username/password is correct
→ Or use session ID instead

**Error: "Cannot reach localhost"**
→ Make sure server is running (RUN_INSTAGRAM.bat or python instagram_api.py)

---

**That's it! Start posting!** 📸
