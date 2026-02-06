import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomLayout from "./CustomLayout";

// DocsViewer now accepts optional `specProp` and `metaProp`. If provided, it will render directly
// otherwise it fetches from backend using `apiId`.
export default function DocsViewer({ apiId, specProp = null, metaProp = null, embedded = false }) {
  const [spec, setSpec] = useState(specProp);
  const [apiDbId, setApiDbId] = useState(apiId);
  const [apiMeta, setApiMeta] = useState(metaProp);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If specProp provided, use it and skip fetching
    if (specProp) return;
    if (!apiId) return;

    setLoading(true);
    axios
      .get(`http://localhost:3000/api/specs/${apiId}`)
      .then((res) => {
        setSpec(res.data.spec);
        setApiDbId(res.data._id || apiId);
        setApiMeta({
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
        console.error("Error fetching API spec:", err);
        setLoading(false);
      });
  }, [apiId, specProp]);

  if (!spec && !specProp) return <p className="text-gray-500">Enter an API ID to view documentation.</p>;
  if (loading) return <p>Loading documentation...</p>;
  if (!spec) return <p className="text-red-500">Failed to load API spec.</p>;

  return <CustomLayout spec={spec} apiId={apiDbId} apiMeta={apiMeta} embedded={embedded} />;
}
