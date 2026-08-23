# 📱 Get Facebook Access Token - EASY WAY 2024

## ✅ Updated Method (Working Now!)

---

## 🚀 Method 1: Facebook Graph API Explorer (EASIEST)

### Step 1: Go Here
https://developers.facebook.com/tools/explorer

### Step 2: Select Your App
1. Top left, see a dropdown
2. Click it
3. Select **"Create New App"** or select existing app

### Step 3: Get Temporary Token
1. You'll see a long token already displayed
2. **Copy this token**
3. It starts with: `EAA...` or `EAAC...`

Done! That's your token!

---

## 🚀 Method 2: Get Long-Lived Token (Better)

If temporary token expires, make it long-lived:

### Step 1: Go to Graph API Explorer
https://developers.facebook.com/tools/explorer

### Step 2: Get User Token
1. Click **"Get Token"** button
2. Select **"User Token"**
3. Check these permissions:
   - ✅ `pages_manage_posts`
   - ✅ `pages_read_user_generated_content`
4. Click **"Generate Access Token"**

### Step 3: Copy the Token
You'll see: `EAAxx...xxx`

### Step 4: Make It Long-Lived
In browser console (F12), run:
```javascript
console.log("Your token: EAAC...");
```

Copy the full token to .env

---

## 📱 Get Your Facebook Page ID

### Option 1: From Your Page URL
If your page is: `https://www.facebook.com/mypage`

Page ID is often visible, or use:

### Option 2: Use This Tool
Go to: https://lookup-id.com/

Paste your profile URL → Get ID

### Option 3: Graph API Explorer
In Graph API Explorer:
1. Left panel, find "me" endpoint
2. Click it
3. You'll see your ID in response

---

## ✅ Add to .env

Once you have token and page ID:

```env
FACEBOOK_ACCESS_TOKEN=EAACxxxxxxxxxxxxxxxx
FACEBOOK_PAGE_ID=123456789
```

Replace with your actual values.

---

## 🎯 Quick Steps Summary

1. Go to: https://developers.facebook.com/tools/explorer
2. Select/create app
3. Click "Get Token" 
4. Select "User Token"
5. Check `pages_manage_posts`
6. Click "Generate Access Token"
7. **Copy the token**
8. Find your page ID (use lookup-id.com or Graph API)
9. Add both to .env:
   ```env
   FACEBOOK_ACCESS_TOKEN=your_token
   FACEBOOK_PAGE_ID=your_page_id
   ```
10. Done! ✅

---

## 💡 Test Your Token Works

In Graph API Explorer:
1. Click on dropdown at top (select "me" or your page)
2. Change URL to: `/me`
3. Click "Submit"
4. If you see your info → Token works! ✅

---

## 📋 Your Info (from earlier)

- Phone: `9490234112`
- Email: `vlikith45@gmail.com`
- Page URL: (paste your Facebook page URL here)

Once you have token + page ID → Paste into .env → Ready to post!

---

## 🚀 After Setup

1. Add token & page ID to .env
2. Run: `python instagram_api.py`
3. Open: `http://localhost:5000/instagram.html`
4. Upload image
5. Click "Post to All"
6. ✅ Posts to Instagram + Facebook!

---

**Ready? Get your token now!** 🚀
