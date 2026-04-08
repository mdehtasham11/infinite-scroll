export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }

  const { prompt, model } = body || {};
  if (!prompt?.trim()) return res.status(400).json({ error: "Prompt is required" });

  const HF_MODEL =
    model === "flux"
      ? "black-forest-labs/FLUX.1-schnell"          // FLUX Schnell — free on HF
      : "stabilityai/stable-diffusion-xl-base-1.0"; // Stable Diffusion XL

  try {
    const r = await fetch(
      `https://router.huggingface.co/hf-inference/models/${HF_MODEL}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json",
          "x-wait-for-model": "true",
        },
        body: JSON.stringify({ inputs: prompt.trim() }),
      }
    );

    if (!r.ok) {
      const errText = await r.text();
      throw new Error(`HuggingFace ${r.status}: ${errText.slice(0, 200)}`);
    }

    const buf    = await r.arrayBuffer();
    const base64 = Buffer.from(buf).toString("base64");
    return res.status(200).json({ imageUrl: `data:image/jpeg;base64,${base64}` });

  } catch (err) {
    console.error("[generate]", err.message);
    return res.status(500).json({ error: err.message || "Generation failed" });
  }
}
