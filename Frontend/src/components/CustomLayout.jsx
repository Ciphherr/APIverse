import React, { useState, useEffect } from "react";
import { FaCode, FaPlay, FaBook, FaCog, FaPaperPlane } from "react-icons/fa";
import axios from "axios";

// Method colors matching the design system
const methodColors = {
  get: "bg-gradient-to-r from-emerald-400 to-green-400 text-black",
  post: "bg-gradient-to-r from-blue-400 to-cyan-400 text-black",
  put: "bg-gradient-to-r from-yellow-400 to-orange-400 text-black",
  delete: "bg-gradient-to-r from-red-500 to-pink-500 text-white",
  patch: "bg-gradient-to-r from-purple-400 to-indigo-400 text-black",
  options: "bg-gradient-to-r from-gray-500 to-gray-600 text-white",
  head: "bg-gradient-to-r from-indigo-400 to-blue-500 text-black",
};

export default function CustomLayout({ spec , apiId, embedded = false}) {


  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [requestBody, setRequestBody] = useState("{}");
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ 
        x: e.clientX / window.innerWidth, 
        y: e.clientY / window.innerHeight 
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

 const handleGenerateAndDownload = async () => {
  if (!apiId) {
    alert("API ID not found");
    return;
  }

  const language = "javascript";

  try {
    // 1️⃣ Generate SDK
    const genRes = await axios.post("http://localhost:3000/api/sdk/generate", { apiId, language });
    console.log("SDK Generated:", genRes.data);

    // 2️⃣ Download SDK
    const downloadUrl = `http://localhost:3000/api/sdk/download/${apiId}/${language}`;
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${apiId}-sdk.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  } catch (err) {
    console.error("Error generating/downloading SDK:", err);
    alert("Failed to generate or download SDK");
  }
};

const handleTryIt = async (event) => {
  if (event) {
    event.preventDefault(); 
  }
  if (!selectedEndpoint || !spec) return;

  const { path, method } = selectedEndpoint;
  const lowerMethod = method.toLowerCase(); // Use this for checks

  // 1️⃣ Get base URL from spec (Your logic here is mostly fine)
  let baseUrl = "https://postman-echo.com"; 
  if (spec.swagger && spec.host) {
    baseUrl = `${spec.schemes?.[0] || "https"}://${spec.host}${spec.basePath || ""}`;
  } else if (spec.openapi && spec.servers?.length) {
    baseUrl = spec.servers[0].url.replace(/\/$/, ""); 
  }

  const url = `${baseUrl}${path}`;
  console.log("Url:", url);

  setIsLoading(true);
  setResponseData(null);

  try {
    // 2️⃣ Parse request body/parameters
    // This JSON object now serves two purposes:
    // - Body for POST/PUT
    // - Query Parameters for GET/DELETE
    const parsedInput = requestBody ? JSON.parse(requestBody) : {};

    // 3️⃣ Configure axios request object
    const axiosConfig = {
      method,
      url,
      // 🟢 FIX 1: Use 'data' for methods that require a request body
      data: ["post", "put", "patch"].includes(lowerMethod)
        ? parsedInput
        : undefined,

      // 🟢 FIX 2: Use 'params' for methods that use query parameters
      // This is necessary for GET/DELETE requests
      params: ["get", "delete"].includes(lowerMethod)
        ? parsedInput // Pass the parsed JSON object to the params option
        : undefined,
    };

    // 4️⃣ Make API request
    const res = await axios(axiosConfig);

    // 5️⃣ Save response (Your logic here is fine)
    setResponseData({
      status: res.status,
      headers: res.headers,
      data: res.data,
    });
  } catch (err) {
    // ... (error handling remains the same)
    console.error("Try It Error:", err);
    setResponseData({
      status: err.response?.status || "Error",
      data: err.response?.data || err.message || "Request failed",
    });
  } finally {
    setIsLoading(false);
  }
};

function getSchemaByRef(ref, spec) {
  const parts = ref.replace(/^#\//, "").split("/"); // e.g., "#/definitions/Pet" => ["definitions","Pet"]
  return parts.reduce((obj, key) => (obj ? obj[key] : null), spec);
}

  if (!spec || !spec.paths) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-2xl flex items-center justify-center text-2xl text-black mx-auto mb-4">
            <FaBook />
          </div>
          <p className="text-white/60 text-lg">No API spec available.</p>
        </div>
      </div>
    );
  }

  const endpoints = Object.entries(spec.paths);

  return (
    <div className={`bg-black text-white ${embedded ? "" : "min-h-screen"} flex relative overflow-hidden`}>
      {!embedded && (
        <aside className="..."> {/* existing sidebar */} </aside>
      )}
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div 
          className="absolute inset-0 transition-all duration-700 ease-out"
          style={{
            background: `radial-gradient(600px circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, 
              rgba(34, 197, 94, 0.04), 
              rgba(59, 130, 246, 0.03) 40%, 
              transparent 70%)`
          }}
        />
        
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Sidebar */}
      <aside className="relative z-10 w-80 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border-r border-white/10 p-6 overflow-y-auto">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-xl flex items-center justify-center">
              <FaCode className="text-black text-lg" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              API Endpoints
            </h2>
          </div>
          <p className="text-white/60 text-sm">{endpoints.length} endpoints available</p>
        </div>

        <div className="space-y-2">
          {endpoints.map(([path, methods], i) =>
            Object.entries(methods).map(([method, details], idx) => (
              <div key={`${i}-${idx}`} className="group">
                <button
                  type="button"
                  onClick={(e) => {
                      // 🟢 NEW: STOP THE DEFAULT REDIRECT/SUBMISSION
                      if (e) e.preventDefault();
                      setSelectedEndpoint({ path, method, details });
                  }}
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 ease-in-out
                    ${
                      selectedEndpoint?.path === path &&
                      selectedEndpoint?.method === method
                        ? "bg-gradient-to-br from-emerald-400/20 to-blue-400/10 border border-emerald-400/30 shadow-lg shadow-emerald-400/10 scale-[1.02]"
                        : "bg-white/5 hover:bg-white/10 hover:scale-[1.01] border border-white/10 hover:border-white/20"
                    }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`uppercase font-bold px-3 py-1 rounded-lg text-xs shadow-lg ${
                        methodColors[method.toLowerCase()] || "bg-gray-400 text-gray-900"
                      }`}
                    >
                      {method}
                    </span>
                    {selectedEndpoint?.path === path && selectedEndpoint?.method === method && (
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    )}
                  </div>
                  <div className="text-white font-medium mb-1">{path}</div>
                  <div className="text-white/60 text-sm truncate">
                    {details.summary || "No description"}
                  </div>
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 p-8 overflow-y-auto">
        {/* If embedded, maybe show a small header bar */}
        {embedded ? (
          <div className="mb-4 flex items-center justify-between">
            <div className="font-bold text-lg">{spec.info?.title || "API Docs"}</div>
            <div className="text-sm text-white/60">Embedded view</div>
          </div>
        ) : null}
        {selectedEndpoint ? (
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Endpoint Header */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center space-x-4 mb-4">
                <span
                  className={`uppercase font-bold px-4 py-2 rounded-xl text-sm shadow-lg ${
                    methodColors[selectedEndpoint.method.toLowerCase()] || "bg-gray-400 text-gray-900"
                  }`}
                >
                  {selectedEndpoint.method}
                </span>
                <h1 className="text-3xl font-bold text-white">
                  {selectedEndpoint.path}
                </h1>
              </div>
              <p className="text-white/70 text-lg leading-relaxed">
                {selectedEndpoint.details.summary || "No summary provided."}
              </p>
            </div>

            {/* 🔽 Add Download SDK button here */}
            <div className="flex justify-end mt-4">
              <button
                onClick={handleGenerateAndDownload}
                className="bg-gradient-to-r from-emerald-400 to-blue-400 text-black px-6 py-2 rounded-xl font-semibold shadow-lg hover:scale-[1.03] transition-all"
              >
                Download SDK
              </button>
            </div>

            {/* Parameters */}
           {selectedEndpoint.details.parameters && (
            <tbody className="divide-y divide-white/10">
  {selectedEndpoint.details.parameters.map((param, idx) => {
    // If body parameter with a schema reference
    if (param.in === "body" && param.schema) {
      const schema = param.schema.$ref
        ? getSchemaByRef(param.schema.$ref, spec) // utility to dereference $ref
        : param.schema;

      return Object.entries(schema.properties || {}).map(([propName, prop], i) => (
        <tr key={`${idx}-${i}`} className="hover:bg-white/5 transition-colors">
          <td className="px-6 py-4 text-emerald-400 font-medium">{propName}</td>
          <td className="px-6 py-4 text-white/70">
            <span className="bg-blue-400/20 text-blue-400 px-2 py-1 rounded text-xs">
              body
            </span>
          </td>
          <td className="px-6 py-4">
            {schema.required?.includes(propName) ? (
              <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">Required</span>
            ) : (
              <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs">Optional</span>
            )}
          </td>
          <td className="px-6 py-4 text-white/70 font-mono text-sm">{prop.type || "N/A"}</td>
          <td className="px-6 py-4 text-white/60">{prop.description || "-"}</td>
        </tr>
      ));
    }

    // For non-body parameters
    return (
      <tr key={idx} className="hover:bg-white/5 transition-colors">
        <td className="px-6 py-4 text-emerald-400 font-medium">{param.name}</td>
        <td className="px-6 py-4 text-white/70">
          <span className="bg-blue-400/20 text-blue-400 px-2 py-1 rounded text-xs">
            {param.in}
          </span>
        </td>
        <td className="px-6 py-4">
          {param.required ? (
            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded text-xs">Required</span>
          ) : (
            <span className="bg-gray-500/20 text-gray-400 px-2 py-1 rounded text-xs">Optional</span>
          )}
        </td>
        <td className="px-6 py-4 text-white/70 font-mono text-sm">{param.schema?.type || param.type || "N/A"}</td>
        <td className="px-6 py-4 text-white/60">{param.description || "-"}</td>
      </tr>
    );
  })}
</tbody>
           )

           }



            {/* Request Body */}
            {selectedEndpoint.details.requestBody && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                    <FaCode className="text-black text-sm" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Request Body</h2>
                </div>
                <div className="bg-black/50 rounded-xl p-6 border border-white/10">
                  <pre className="text-sm text-white/80 overflow-x-auto font-mono leading-relaxed">
                    {JSON.stringify(
                      selectedEndpoint.details.requestBody.content?.["application/json"]?.schema,
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            )}

            {/* Responses */}
            {selectedEndpoint.details.responses && (
              <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-lg flex items-center justify-center">
                    <FaPlay className="text-black text-sm" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Responses</h2>
                </div>
                <div className="bg-black/30 rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead className="bg-white/10">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Status Code</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-white">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10">
                        {Object.entries(selectedEndpoint.details.responses).map(([status, resp], idx) => (
                          <tr key={idx} className="hover:bg-white/5 transition-colors">
                            <td className="px-6 py-4">
                              <span className={`px-3 py-1 rounded-lg text-sm font-bold ${
                                status.startsWith('2') ? 'bg-emerald-400/20 text-emerald-400' :
                                status.startsWith('4') ? 'bg-yellow-400/20 text-yellow-400' :
                                status.startsWith('5') ? 'bg-red-400/20 text-red-400' :
                                'bg-blue-400/20 text-blue-400'
                              }`}>
                                {status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-white/70">{resp.description || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            {/* Try It Section */}
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-6 shadow-2xl mt-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-lg flex items-center justify-center">
                  <FaPaperPlane className="text-black text-sm" />
                </div>
                <h2 className="text-2xl font-bold text-white">Try It</h2>
              </div>

              {/* Input Body */}
              {["get", "post", "put", "patch"].includes(selectedEndpoint.method.toLowerCase()) && (
                <div className="mb-4">
                  <label className="text-white/80 text-sm mb-2 block">
                    Request Body (JSON)
                  </label>
                  <textarea
                    className="w-full h-40 bg-black/40 text-white p-3 rounded-xl border border-white/20 focus:outline-none focus:border-emerald-400/50 font-mono text-sm"
                    value={requestBody}
                    onChange={(e) => setRequestBody(e.target.value)}
                  />
                </div>
              )}

              {/* Send Button */}
              <button
                onClick={(e) => handleTryIt(e)}
                disabled={isLoading}
                className="bg-gradient-to-r from-emerald-400 to-blue-400 text-black px-6 py-2 rounded-xl font-semibold shadow-lg hover:scale-[1.03] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <FaPaperPlane />
                <span>{isLoading ? "Sending..." : "Send Request"}</span>
              </button>

              {/* Response Box */}
              {responseData && (
                <div className="mt-6 bg-black/50 rounded-xl p-4 border border-white/10">
                  <h3 className="text-lg font-semibold text-emerald-400 mb-2">
                    Response ({responseData.status})
                  </h3>
                  <pre className="text-sm text-white/80 overflow-x-auto font-mono leading-relaxed">
                    {JSON.stringify(responseData.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-blue-400 rounded-3xl flex items-center justify-center text-3xl text-black mx-auto mb-6 shadow-2xl shadow-emerald-400/25">
                <FaBook />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Select an Endpoint</h3>
              <p className="text-white/60 text-lg">Choose an endpoint from the sidebar to view its documentation</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}