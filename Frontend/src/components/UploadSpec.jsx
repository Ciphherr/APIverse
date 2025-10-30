import React, { useState } from "react";
import { FaUpload, FaFileCode, FaCloudUploadAlt } from "react-icons/fa";
import axios from "axios";

export default function UploadSpec({ setApiId }) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a spec file.");

    const form = new FormData();
    form.append("specfile", file);
    form.append("providerId", "demo-provider");

    try {
      const res = await axios.post("http://localhost:3000/api/specs/upload", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setApiId(res.data.apiId);
      alert("API uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Upload failed: " + (err.response?.data?.error || err.message));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Upload OpenAPI Spec</h2>
        <p className="text-white/60">Drop your specification file or click to browse</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Drag & Drop Area */}
        <div
          className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
            isDragging
              ? 'border-emerald-400 bg-emerald-400/10 scale-[1.02]'
              : file
              ? 'border-emerald-400/50 bg-emerald-400/5'
              : 'border-white/30 hover:border-white/50 hover:bg-white/5'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            id="file-upload"
            type="file"
            accept=".yaml,.yml,.json"
            onChange={(e) => setFile(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="text-center space-y-4">
            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300 ${
              file 
                ? 'bg-gradient-to-br from-emerald-400 to-blue-400 text-black scale-110' 
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}>
              {file ? <FaFileCode className="text-2xl" /> : <FaCloudUploadAlt className="text-2xl" />}
            </div>
            
            {file ? (
              <div className="space-y-2">
                <p className="text-emerald-400 font-semibold">{file.name}</p>
                <p className="text-white/60 text-sm">Ready to upload</p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-white font-medium">
                  {isDragging ? 'Drop your file here' : 'Choose a spec file'}
                </p>
                <p className="text-white/60 text-sm">
                  Supports .yaml, .yml, .json formats
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Button */}
        <button
          type="submit"
          disabled={!file}
          className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
            file
              ? 'bg-gradient-to-r from-emerald-400 to-blue-400 hover:from-emerald-300 hover:to-blue-300 text-black shadow-lg hover:shadow-2xl hover:shadow-emerald-400/25 hover:scale-[1.02]'
              : 'bg-white/10 text-white/40 cursor-not-allowed'
          }`}
        >
          <FaUpload className={`${file ? '' : 'opacity-40'}`} />
          <span>{file ? 'Generate Documentation' : 'Select File First'}</span>
        </button>
      </form>
    </div>
  );
}