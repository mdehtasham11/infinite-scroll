import React, { useState } from "react";
import { FaDownload, FaExpand } from "react-icons/fa";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://api.studio.nebius.com/v1/",
  apiKey:
    "eyJhbGciOiJIUzI1NiIsImtpZCI6IlV6SXJWd1h0dnprLVRvdzlLZWstc0M1akptWXBvX1VaVkxUZlpnMDRlOFUiLCJ0eXAiOiJKV1QifQ.eyJzdWIiOiJnb29nbGUtb2F1dGgyfDEwNDM4MjE5NzY1NzY5ODQ1MDg5MyIsInNjb3BlIjoib3BlbmlkIG9mZmxpbmVfYWNjZXNzIiwiaXNzIjoiYXBpX2tleV9pc3N1ZXIiLCJhdWQiOlsiaHR0cHM6Ly9uZWJpdXMtaW5mZXJlbmNlLmV1LmF1dGgwLmNvbS9hcGkvdjIvIl0sImV4cCI6MTg5OTgzODMyNiwidXVpZCI6IjViZTM4ZDFkLTRlYjMtNGRjNy1hNTRmLWNjMzlkZGNlMmVmNCIsIm5hbWUiOiJpbWFnZS1nZW5lcmF0aW9uIiwiZXhwaXJlc19hdCI6IjIwMzAtMDMtMTVUMjA6NTI6MDYrMDAwMCJ9.io4jLb7ff3y5OXmNadeU9WKg66Aejr9DMn9N-tCeZHU",
  dangerouslyAllowBrowser: true,
});

const suggestions = [
  "A futuristic cityscape at sunset",
  "Magical forest with glowing mushrooms",
  "Abstract painting in vibrant colors",
  "Serene mountain lake reflection",
  "Cyberpunk street scene at night",
];

function ImageGenerator() {
  const [imageUrl, setImageUrl] = useState("");
  const [text,     setText]     = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [history,  setHistory]  = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setError(""); setImageUrl(""); setLoading(true);
    try {
      const response = await openai.images.generate({
        model: "black-forest-labs/flux-schnell",
        prompt: text,
        n: 1,
        size: "1024x1024",
      });
      const url = response.data?.[0]?.url;
      if (!url) throw new Error("No image URL returned");
      setImageUrl(url);
      setHistory((prev) => [{ prompt: text, imageUrl: url, timestamp: new Date() }, ...prev.slice(0, 4)]);
    } catch (err) {
      console.error(err);
      setError("Failed to generate image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!imageUrl) return;
    try {
      const blob = await (await fetch(imageUrl)).blob();
      const a = Object.assign(document.createElement("a"), {
        href: window.URL.createObjectURL(blob),
        download: `ai-generated-${Date.now()}.jpg`,
      });
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      window.URL.revokeObjectURL(a.href);
    } catch (err) { console.error(err); }
  };

  const lbl = {
    fontFamily: "var(--font-mono)",
    fontSize: "8px",
    letterSpacing: "3px",
    color: "var(--gold)",
    textTransform: "uppercase",
    marginBottom: "10px",
    display: "block",
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ padding: "20px 32px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "baseline", gap: "16px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontWeight: 300, fontStyle: "italic", fontSize: "28px", color: "var(--text)" }}>AI Generator</h1>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "var(--text-muted)" }}>FLUX · NEBIUS</span>
      </div>

      {/* 2-column layout */}
      <div className="grid-sidebar">

        {/* Sidebar */}
        <div className="panel-border-r" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>
          <form onSubmit={handleSubmit}>
            <label style={lbl}>Prompt</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Describe your image..."
              rows={5}
              style={{ width: "100%", background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--text)", fontFamily: "var(--font-mono)", fontSize: "10px", letterSpacing: "0.5px", lineHeight: 1.7, padding: "10px", resize: "none", outline: "none", marginBottom: "12px", transition: "border-color 0.2s" }}
              onFocus={(e) => (e.target.style.borderColor = "var(--gold)")}
              onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
            />
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="btn-gold"
              style={{ width: "100%", opacity: loading || !text.trim() ? 0.5 : 1, cursor: loading || !text.trim() ? "not-allowed" : "pointer" }}
            >
              {loading ? "Generating..." : "Generate Image"}
            </button>
          </form>

          {error && (
            <div style={{ border: "1px solid #5a2020", background: "#1a0a0a", padding: "10px 12px", fontFamily: "var(--font-mono)", fontSize: "9px", color: "#c47070", letterSpacing: "0.5px" }}>
              {error}
            </div>
          )}

          <div>
            <label style={lbl}>Suggestions</label>
            {suggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => setText(s)}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 0", background: "transparent", border: "none", borderBottom: "1px solid var(--border-light)", fontFamily: "var(--font-mono)", fontSize: "9px", color: "var(--text-muted)", cursor: "pointer", letterSpacing: "0.5px", transition: "color 0.2s" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
              >
                {s}
              </button>
            ))}
          </div>

          {history.length > 0 && (
            <div>
              <label style={lbl}>Recent</label>
              {history.slice(0, 3).map((item, i) => (
                <div
                  key={i}
                  onClick={() => { setText(item.prompt); setImageUrl(item.imageUrl); }}
                  style={{ display: "flex", gap: "10px", alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border-light)", cursor: "pointer" }}
                >
                  <img src={item.imageUrl} alt="" style={{ width: "36px", height: "36px", objectFit: "cover" }} />
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "8px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", letterSpacing: "0.5px" }}>
                    {item.prompt}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Canvas */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column" }}>
          <div style={{ flex: 1, background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", minHeight: "400px" }}>
            {loading ? (
              <div style={{ textAlign: "center" }}>
                <div style={{ width: "32px", height: "32px", border: "1px solid var(--border)", borderTop: "1px solid var(--gold)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "3px", color: "var(--text-muted)", textTransform: "uppercase" }}>Generating</div>
              </div>
            ) : imageUrl ? (
              <>
                <img src={imageUrl} alt="Generated" style={{ maxWidth: "100%", maxHeight: "600px", objectFit: "contain", display: "block" }} />
                <div style={{ position: "absolute", top: "8px", right: "8px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <button onClick={downloadImage} title="Download" style={{ width: "28px", height: "28px", background: "rgba(12,11,9,0.85)", border: "1px solid var(--border)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "11px" }}>
                    <FaDownload />
                  </button>
                  <button onClick={() => window.open(imageUrl, "_blank")} title="Full size" style={{ width: "28px", height: "28px", background: "rgba(12,11,9,0.85)", border: "1px solid var(--border)", color: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "11px" }}>
                    <FaExpand />
                  </button>
                </div>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "10px 14px", background: "rgba(12,11,9,0.8)", backdropFilter: "blur(4px)" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "1px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {text}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: "48px", color: "var(--text-dim)", marginBottom: "12px" }}>✦</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "2px", color: "var(--text-dim)", textTransform: "uppercase" }}>Awaiting prompt</div>
              </div>
            )}
          </div>

          {imageUrl && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginTop: "12px" }}>
              {[["1024×1024", "Resolution"], ["Flux Schnell", "Model"], ["AI Generated", "Type"]].map(([val, label]) => (
                <div key={label} style={{ border: "1px solid var(--border)", padding: "12px", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text)", marginBottom: "4px" }}>{val}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "8px", letterSpacing: "2px", color: "var(--text-muted)", textTransform: "uppercase" }}>{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageGenerator;
