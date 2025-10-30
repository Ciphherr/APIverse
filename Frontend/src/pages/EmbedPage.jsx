// src/pages/EmbedPage.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import CustomLayout from "../components/CustomLayout";

export default function EmbedPage() {
  const { apiId } = useParams();
  const [spec, setSpec] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!apiId) return;
    setLoading(true);
    axios.get(`http://localhost:3000/api/specs/${apiId}`)
      .then(res => {
        setSpec(res.data.spec);
        setLoading(false);
      })
      .catch(err => {
        console.error("Embed fetch error:", err);
        setError("Failed to load spec");
        setLoading(false);
      });
  }, [apiId]);

  if (loading) return <div style={{minHeight: 200,display: "flex",alignItems:"center",justifyContent:"center"}}>Loading...</div>;
  if (error || !spec) return <div style={{padding:20}}>Unable to load documentation.</div>;

  // Render CustomLayout with embedded prop to hide chrome
  return (
    <div style={{padding: 12, background: "transparent"}}>
      <CustomLayout spec={spec} apiId = {apiId} embedded />
    </div>
  );
}
