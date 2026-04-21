# CMU MEC 2026 — NFC Check-in System

> 23rd Medical Ethics Camp · Chiang Mai University · 14–18 May 2026

---

## Project Structure

```
mec-checkin/
├── public/
│   └── index.html        ← Check-in web app (iPad-facing)
├── api/
│   ├── checkin.js        ← Vercel serverless API
│   └── _data.js          ← Participant data (swap before event)
├── vercel.json
└── package.json
```

---

## Deploy to Vercel (5 minutes)

### Option A — Vercel CLI (recommended)

```bash
npm install -g vercel
cd mec-checkin
vercel
```

Follow the prompts. Your app will be live at `https://mec-checkin.vercel.app` (or similar).

### Option B — GitHub + Vercel Dashboard

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
3. Leave all settings as default → Deploy
4. Done — Vercel auto-deploys on every push

---

## Swap in Real Participant Data

Edit `api/_data.js`:

```js
export const participants = [
  { uid: "10001", name: "Dr. Somchai Panyarat", role: "Staff",   checkin_time: null },
  { uid: "10002", name: "Nattaya Wongkham",     role: "Visitor", checkin_time: null },
  // ... add all participants
];
```

Roles available: `Staff` | `Visitor` | `Speaker`

The `uid` must match exactly what your NFC reader types (the string programmed on the tag).

---

## Connect to Google Sheets (optional upgrade)

If you want check-in data to persist in Google Sheets instead of memory:

1. Set up Google Apps Script as described in the setup guide
2. In `api/checkin.js`, replace the in-memory logic with:

```js
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/YOUR_ID/exec";

// In the checkin action:
const res  = await fetch(`${APPS_SCRIPT_URL}?action=checkin&uid=${uid}`);
const data = await res.json();
return res2.json(data);
```

---

## iPad Setup

1. Open Safari → navigate to your Vercel URL
2. Settings → Accessibility → Guided Access → Enable
3. Open the page → triple-click Home/Side button → start Guided Access
4. Connect NFC reader via USB/Bluetooth — it works as a keyboard automatically

---

## NFC Tag Programming

Program each tag with plain text only, e.g.: `10001`

The reader will type this string + Enter when scanned. No special driver needed.
