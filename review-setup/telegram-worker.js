// Cloudflare Worker: receives survey answers and forwards them to a Telegram chat.
// Set these in the Worker settings (Variables and Secrets):
//   BOT_TOKEN    your Telegram bot token (as a Secret)
//   CHAT_ID      the chat or group that should receive answers
//   ALLOW_ORIGIN your site address, e.g. https://your-username.github.io
export default {
  async fetch(req, env) {
    const cors = {
      "Access-Control-Allow-Origin": env.ALLOW_ORIGIN || "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (req.method !== "POST") return new Response("Not allowed", { status: 405, headers: cors });
    let body;
    try { body = await req.json(); } catch { return new Response("Bad request", { status: 400, headers: cors }); }
    const text = String(body.text || "").slice(0, 15000);
    if (!text) return new Response("Empty", { status: 400, headers: cors });
    // Telegram allows 4096 characters per message, so split long answers.
    const parts = text.match(/[\s\S]{1,3800}/g) || [];
    for (const part of parts) {
      const r = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: env.CHAT_ID, text: part }),
      });
      if (!r.ok) return new Response("Telegram error", { status: 502, headers: cors });
    }
    return new Response("ok", { status: 200, headers: cors });
  },
};
