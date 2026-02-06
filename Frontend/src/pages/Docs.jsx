import React, { useEffect, useState } from "react";
import { useSearchParams, useLocation } from "react-router-dom";
import axios from "axios";
import DocsViewer from "../components/DocsViewer";

export default function Docs({ apiId: propApiId }) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [apiId, setApiId] = useState(propApiId);

  const [spec, setSpec] = useState(null);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Priority: query params > location state > props
    const queryApiId = searchParams.get("apiId");
    const stateApiId = location.state?.apiId;
    
    if (queryApiId) {
      setApiId(queryApiId);
    } else if (stateApiId) {
      setApiId(stateApiId);
    }
  }, [searchParams, location.state]);

  useEffect(() => {
    if (!apiId) return;
    setLoading(true);
    setError(null);
    axios.get(`http://localhost:3000/api/specs/${apiId}`)
      .then((res) => {
        setSpec(res.data.spec);
        setMeta({
          name: res.data.name,
          version: res.data.version,
          providerId: res.data.providerId,
          providerName: res.data.providerName,
          providerWebsite: res.data.providerWebsite,
          description: res.data.description,
          isSaved: res.data.isSaved,
          savedAt: res.data.savedAt,
          updatedAt: res.data.updatedAt,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load API metadata");
        setLoading(false);
      });
  }, [apiId]);


  // Save functionality moved to CustomLayout


  if (!apiId) return <p className="text-gray-500">Enter an API ID to view documentation.</p>;
  if (loading) return <p>Loading documentation...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with API name and description */}
      <div className="bg-gradient-to-b from-white/10 to-transparent border-b border-white/10 p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-extrabold mb-3 text-emerald-300">{meta?.name || spec?.info?.title || 'API Documentation'}</h1>
          <p className="text-gray-300 text-lg leading-relaxed max-w-3xl">{meta?.description || spec?.info?.description || 'No description provided.'}</p>
        </div>
      </div>

      {/* Main content area */}
      <div className="p-6 md:p-12">
        <div className="max-w-6xl mx-auto">
          {/* Document viewer in a card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl mb-8">
            <DocsViewer specProp={spec} metaProp={meta} apiId={apiId} embedded={true} />
          </div>

          {/* API Details card below the document */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold mb-6 text-emerald-300">API Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-400 font-semibold min-w-[100px]">Provider:</span>
                  <span className="text-gray-300">{meta?.providerName || meta?.providerId || 'Unknown'}</span>
                </div>
                {meta?.providerWebsite && (
                  <div className="flex items-start gap-3">
                    <span className="text-emerald-400 font-semibold min-w-[100px]">Website:</span>
                    <a href={meta.providerWebsite} className="text-emerald-400 underline hover:text-emerald-300 transition-colors" target="_blank" rel="noreferrer">{meta.providerWebsite}</a>
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-emerald-400 font-semibold min-w-[100px]">Status:</span>
                  <span className={`px-3 py-1 rounded-lg text-sm font-semibold ${meta?.isSaved ? 'bg-emerald-400/20 text-emerald-400' : 'bg-gray-500/20 text-gray-300'}`}>
                    {meta?.isSaved ? 'Saved' : 'Unsaved'}
                  </span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-emerald-400 font-semibold min-w-[100px]">Updated:</span>
                  <span className="text-gray-300">{meta?.updatedAt ? new Date(meta.updatedAt).toLocaleString() : (meta?.savedAt ? new Date(meta.savedAt).toLocaleString() : 'Never')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
