import React, { useEffect, useState } from "react";
import axios from "axios";
import CustomLayout from "./CustomLayout";

export default function DocsViewer({ apiId }) {
  const [spec, setSpec] = useState(null);
  const [apiDbId, setApiDbId] = useState(null); // NEW: store DB ID
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!apiId) return;

    setLoading(true);
    axios
      .get(`http://localhost:3000/api/specs/${apiId}`)
      .then((res) => {
        setSpec(res.data.spec);     // OpenAPI spec
        setApiDbId(res.data._id);  // MongoDB ID
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching API spec:", err);
        setLoading(false);
      });
  }, [apiId]);

  if (!apiId) return <p className="text-gray-500">Enter an API ID to view documentation.</p>;
  if (loading) return <p>Loading documentation...</p>;
  if (!spec) return <p className="text-red-500">Failed to load API spec.</p>;

  return <CustomLayout spec={spec} apiId={apiDbId} />; // Pass DB ID
}
