# 📱 How to Get Instagram Session ID - Step by Step

## ✅ Method 1: From Browser (Easiest - 5 minutes)

### Step 1: Open Instagram
1. Go to: **https://instagram.com**
2. **Login** with your account:
   - Email: `vlikith123456@gmail.com`
   - Password: `komal@12`

### Step 2: Open Developer Tools
Press **F12** on your keyboard

You should see a console panel at bottom of screen

### Step 3: Go to Application Tab
In DevTools, find tabs at top:
- Console
- Elements
- **Application** ← Click this
- Storage
- Network

Click **Application**

### Step 4: Find Cookies
In left sidebar under Application, find:
- Storage
  - Cookies ← Click this
    - https://www.instagram.com ← Click this

### Step 5: Find sessionid Cookie
You'll see a list of cookies. Look for one named:
**sessionid**

Click on it. You'll see:
- Name: `sessionid`
- Value: `YOUR_LONG_SESSION_ID_HERE` (very long string)

### Step 6: Copy the Value
1. **Right-click** on the Value
2. **Copy**

It looks like:
```
1234567890%3A1234567890%3AABCD1234abcd5678efgh
```

---

## 📝 Step 7: Add to .env File

1. Open your `.env` file (in project root)
2. Find or add this line:
```env
INSTAGRAM_SESSION_ID=1234567890%3A1234567890%3AABCD1234abcd5678efgh
```

Replace the part after `=` with YOUR session ID

### Example .env:
```env
# Instagram
INSTAGRAM_SESSION_ID=1234567890%3A1234567890%3AABCD1234abcd5678efgh

# Or alternative:
# INSTAGRAM_USERNAME=vlikith123456@gmail.com
# INSTAGRAM_PASSWORD=komal@12
```

---

## 🚀 Step 8: Restart Server

1. Close the server if running (Ctrl+C)
2. Run: `RUN_INSTAGRAM.bat` (Windows)
3. Or: `python instagram_api.py` (Mac/Linux)

---

## ⚡ Quick Visual Guide

```
1. Open instagram.com → Login
2. Press F12 (DevTools opens)
3. Click "Application" tab
4. Click "Cookies" in left sidebar
5. Click "https://www.instagram.com"
6. Find "sessionid" row
7. Copy the long Value string
8. Paste into .env: INSTAGRAM_SESSION_ID=value
9. Save .env
10. Run server
11. Done! ✅
```

---

## ✅ Checklist

- [ ] Logged into Instagram.com
- [ ] Opened DevTools (F12)
- [ ] Went to Application tab
- [ ] Found Cookies → instagram.com
- [ ] Found "sessionid" cookie
- [ ] Copied the Value
- [ ] Pasted into .env file
- [ ] Saved .env
- [ ] Restarted server
- [ ] Ready to post! ✅

---

## 🖼️ Screenshot Locations

### DevTools Tabs (Top of DevTools):
```
┌─────────────────────────────────────────────┐
│ Console │ Elements │ Application │ ...     │
│                                             │
│ Click "Application" ←─────────────────────┘
└─────────────────────────────────────────────┘
```

### Application Left Sidebar:
```
┌────────────────────┐
│ Storage            │
│ ├─ Cookies         │ ← Click this
│ │ ├─ instagram.com │ ← Click this
│ │ │  ├─ sessionid  │ ← Find this
│ │ │  ├─ mid        │
│ │ │  └─ ...        │
│ └─ ...             │
└────────────────────┘
```

### Cookies List:
```
┌─────────────────────────────────────┐
│ Name        │ Value                 │
├─────────────┼──────────────────────┤
│ sessionid   │ 1234567890%3A12345..  │ ← Copy this
│ mid         │ ABC1234DEF...         │
│ ds_user_id  │ 123456789             │
│ ...         │ ...                   │
└─────────────────────────────────────┘
```

---

## ❓ Troubleshooting

### "I can't find sessionid cookie"
- Make sure you're on **instagram.com** (not instagra.m or any fake site)
- Make sure you **logged in** (not just visiting home page)
- Try clearing cookies and logging in again
- Try incognito mode: Ctrl+Shift+N

### "Session ID doesn't work"
- Session IDs expire after ~90 days
- Need to get a fresh one if old one stops working
- Use username/password method instead (see below)

### "I prefer username/password"
Instead of INSTAGRAM_SESSION_ID, add this to .env:
```env
INSTAGRAM_USERNAME=vlikith123456@gmail.com
INSTAGRAM_PASSWORD=komal@12
```

---

## ✨ That's It!

Once you have the session ID in .env:
1. Run the server
2. Go to http://localhost:5000/instagram.html
3. Upload image
4. Post to Instagram! 📸

---

## 📧 Your Instagram Account
- Email: `vlikith123456@gmail.com`
- Password: `komal@12`

**Keep session ID private!** Don't share .env file.

---

**Got it? Get your session ID now!** 🚀
