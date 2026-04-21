// api/checkin.js — Vercel Serverless Function
// In-memory store (resets on cold start — fine for a 1-day event on a warm instance)
// For persistence, swap this with your Google Sheets Apps Script call.

import { participants } from "./_data.js";

// Module-level store persists across warm invocations on the same instance
if (!global._mecStore) {
  global._mecStore = {};
  for (const p of participants) {
    global._mecStore[p.uid] = { ...p };
  }
}
const store = global._mecStore;

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  if (req.method === "OPTIONS") return res.status(200).end();

  const { action, uid } = req.query;

  if (action === "checkin") {
    if (!uid) return res.json({ status: "error", message: "No UID provided" });
    const p = store[String(uid)];
    if (!p) return res.json({ status: "not_found" });
    if (p.checkin_time) {
      return res.json({ status: "already", name: p.name, role: p.role, checkin_time: p.checkin_time });
    }
    p.checkin_time = new Date().toISOString();
    return res.json({ status: "ok", name: p.name, role: p.role, checkin_time: p.checkin_time });
  }

  if (action === "recent") {
    const rows = Object.values(store)
      .filter(p => p.checkin_time)
      .sort((a, b) => new Date(b.checkin_time) - new Date(a.checkin_time))
      .slice(0, 10)
      .map(p => ({ name: p.name, role: p.role, checkin_time: p.checkin_time }));
    const total = Object.values(store).filter(p => p.checkin_time).length;
    return res.json({ rows, total });
  }

  if (action === "stats") {
    const all = Object.values(store);
    return res.json({
      total: all.length,
      checked_in: all.filter(p => p.checkin_time).length,
    });
  }

  return res.json({ error: "unknown action" });
}
