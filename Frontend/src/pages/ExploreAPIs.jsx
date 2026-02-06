import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaBook, FaSearch, FaClock, FaArrowRight } from "react-icons/fa";

export default function ExploreAPIs() {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    fetchSavedApis();
  }, []);

  const fetchSavedApis = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:3000/api/specs/api/saved");
      setApis(response.data.apis || []);
    } catch (err) {
      console.error("Error fetching saved APIs:", err);
      setError("Failed to load saved APIs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewApi = (apiId) => {
    navigate(`/docs?apiId=${apiId}`);
  };

  const filteredApis = apis.filter(
    (api) =>
      api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.version.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "Just now";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

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

      {/* Content */}
      <div className="relative z-10 min-h-screen p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-2xl flex items-center justify-center">
                <FaBook className="text-black text-2xl" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                Explore APIs
              </h1>
            </div>
            <p className="text-white/60 text-lg">
              Discover and explore all your saved API documentation
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-12">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search APIs by name or version..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-400/50 transition-all"
              />
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-white/20 border-t-emerald-400 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white/60 text-lg">Loading saved APIs...</p>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-6 text-red-200">
              <p className="text-lg">{error}</p>
              <button
                onClick={fetchSavedApis}
                className="mt-4 bg-red-500/30 hover:bg-red-500/40 px-6 py-2 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredApis.length === 0 && (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-3xl flex items-center justify-center text-3xl text-black mx-auto mb-6 shadow-2xl shadow-emerald-400/25">
                  <FaBook />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">No Saved APIs Yet</h2>
                <p className="text-white/60 text-lg">
                  {searchQuery
                    ? "No APIs match your search. Try a different query."
                    : "Upload and save APIs to see them here. Generate documentation and click 'Save API' to add it to your collection."}
                </p>
              </div>
            </div>
          )}

          {/* APIs Grid */}
          {!loading && !error && filteredApis.length > 0 && (
            <div>
              <p className="text-white/60 mb-6">
                Found {filteredApis.length} saved API{filteredApis.length !== 1 ? "s" : ""}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApis.map((api) => (
                  <div
                    key={api._id}
                    className="group bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:border-emerald-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-400/10 hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-xl flex items-center justify-center shadow-lg">
                        <FaBook className="text-black text-xl" />
                      </div>
                      <span className="bg-emerald-400/20 text-emerald-400 px-3 py-1 rounded-lg text-xs font-semibold">
                        v{api.version || "1.0"}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {api.name}
                    </h3>

                    {api.description && (
                      <p className="text-white/60 text-sm mb-4 line-clamp-2">
                        {api.description}
                      </p>
                    )}

                    <div className="flex items-center text-white/40 text-sm mb-6">
                      <FaClock className="mr-2" />
                      Updated {formatDate(api.updatedAt || api.savedAt)}
                    </div>

                    <button
                      onClick={() => handleViewApi(api._id)}
                      className="w-full bg-gradient-to-r from-emerald-400 to-blue-400 text-black py-2 rounded-xl font-semibold shadow-lg hover:scale-[1.03] transition-all flex items-center justify-center gap-2"
                    >
                      View Documentation
                      <FaArrowRight />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
