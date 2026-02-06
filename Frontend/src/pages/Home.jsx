import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import UploadSpec from "../components/UploadSpec";
import CustomLayout from "../components/CustomLayout";
import axios from "axios";

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [apiId, setApiId] = useState(null); // Single state, no duplication
  const [spec, setSpec] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Background animation effect
  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Fetch spec when apiId changes
  useEffect(() => {
    if (!apiId) return;

    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:3000/api/specs/${apiId}`)
      .then((res) => {
        // Make sure to extract only the spec
        setSpec(res.data.spec || res.data);
        setApiId(res.data._id);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching spec:", err);
        setError("Failed to load API spec. Please try again.");
        setLoading(false);
      });
  }, [apiId]);

  return (
    <div className="relative bg-black text-white min-h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-4">
          <Link to="/" className="flex items-center space-x-3">
            <span className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Apiverse
              </span>
            </span>
          </Link>
          <Link to="/explore-apis" className="text-white/80 hover:text-emerald-400 font-semibold transition-colors">
            Explore APIs
          </Link>
        </div>
      </nav>

      {/* Dynamic animated background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 transition-all duration-700 ease-out"
          style={{
            background: `radial-gradient(600px circle at ${
              mousePosition.x * 100
            }% ${mousePosition.y * 100}%, 
              rgba(34, 197, 94, 0.06), 
              rgba(59, 130, 246, 0.04) 40%, 
              transparent 70%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Main content */}
      <div
        className={`relative z-10 flex flex-col items-center justify-start min-h-screen p-6 transition-all duration-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Hero Section */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          <h1 className="text-5xl lg:text-6xl font-bold mb-8 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent leading-tight">
            Generate Your ApiDoc
          </h1>

          <p className="text-xl text-white/80 mb-12 leading-relaxed max-w-xl mx-auto">
            Upload your OpenAPI specification and instantly generate beautiful,
            interactive documentation right here.
          </p>

          {/* Upload Spec Component */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl p-10 shadow-2xl hover:shadow-emerald-400/10 transition-all duration-500">
            <UploadSpec setApiId={setApiId} />
          </div>
        </div>

        {/* Documentation Section */}
        <div className="w-full max-w-6xl mt-10">
          {loading && (
            <p className="text-gray-400 text-center">Loading documentation...</p>
          )}

          {error && (
            <p className="text-red-400 text-center">{error}</p>
          )}

          {spec && !loading && (
            <div className="bg-gray-900 rounded-xl shadow-lg p-4">
              <CustomLayout spec={spec}  apiId = {apiId} />
{/* Embed Code Box */}
<div className="bg-black/40 border border-emerald-500/40 rounded-xl p-4 mt-6 relative">
  <h2 className="text-xl font-semibold text-emerald-400 mb-2">Embed This API Doc</h2>
  <p className="text-sm text-gray-400 mb-3">
    Copy and paste this iframe code into your website to embed the generated documentation.
  </p>

  <textarea
    id="embedCode"
    className="w-full bg-gray-800 text-emerald-300 text-sm font-mono rounded-lg p-3 resize-none border border-emerald-700/40"
    rows="3"
    readOnly
    value={`<iframe src="http://localhost:5173/embed/${apiId}" width="100%" height="800" style="border:none;"></iframe>`}
  ></textarea>

  <button
    className="mt-3 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm transition"
    onClick={async (e) => {
      e.preventDefault();
      const embedCode = document.getElementById("embedCode").value;

      try {
        //  Use Clipboard API if available
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(embedCode);
        } else {
          //  Fallback for HTTP/localfile
          const textarea = document.createElement("textarea");
          textarea.value = embedCode;
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          textarea.remove();
        }

        // Show success message non-blocking
        const toast = document.createElement("div");
        toast.textContent = "✅ Embed code copied!";
        toast.className =
          "fixed bottom-5 right-5 bg-emerald-500 text-black px-4 py-2 rounded-lg shadow-lg text-sm animate-fade";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
      } catch (err) {
        console.error("Copy failed:", err);
        const toast = document.createElement("div");
        toast.textContent = "❌ Failed to copy. Please copy manually.";
        toast.className =
          "fixed bottom-5 right-5 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2500);
      }
    }}
  >
    Copy Embed Code
  </button>

  <style>{`
    @keyframes fade {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade {
      animation: fade 0.3s ease-in-out;
    }
  `}</style>
</div>

            </div>
          )}

          {!loading && !spec && !error && (
            <p className="text-gray-500 text-center">
              Upload a spec file to view your API documentation here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
