// src/components/EmbedCodeBox.jsx
import React from "react";

export default function EmbedCodeBox({ apiId }) {
  if (!apiId) return null;

  const embedUrl = `${window.location.origin}/embed/${apiId}`;

  const iframeCode = `<iframe
  src="${embedUrl}"
  width="100%"
  height="800"
  style="border:0;border-radius:12px;overflow:hidden;"
  title="API Documentation"
></iframe>`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(iframeCode);
    alert("Embed code copied!");
  };

  return (
    <div className="bg-black/30 border border-white/10 rounded-xl p-5 mt-8">
      <h2 className="text-xl font-semibold text-white mb-3">Embed this Documentation</h2>
      <p className="text-white/70 mb-3 text-sm">
        Copy and paste this code into your website to embed the live documentation.
      </p>
      <pre className="bg-black/50 text-emerald-400 p-4 rounded-md overflow-x-auto text-sm">
        {iframeCode}
      </pre>
      <button
        onClick={copyToClipboard}
        className="mt-3 px-4 py-2 bg-emerald-500 text-black rounded-lg font-medium hover:bg-emerald-400 transition"
      >
        Copy Embed Code
      </button>
    </div>
  );
}
