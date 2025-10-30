import React, { useState, useEffect } from "react";
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
