import React from "react";
import DocsViewer from "../components/DocsViewer";

export default function Docs({ apiId }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">API Documentation</h2>
      <DocsViewer apiId={apiId} />
    </div>
  );
}
