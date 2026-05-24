import { useState } from "react";
import { uploadFile } from "../api/api";

export default function UploadForm({ onExtracted }) {
  const [dragging, setDragging]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const res = await uploadFile(file);
      onExtracted(res.data);
    } catch (err) {
      setError("Failed to parse file. Please try PDF, DOCX, or TXT.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer
        ${dragging ? "border-blue-500 bg-blue-900/20" : "border-gray-700 hover:border-gray-500"}`}
    >
      <input
        type="file"
        accept=".pdf,.docx,.txt"
        className="hidden"
        id="file-upload"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3">
        <span className="text-4xl">📄</span>
        <p className="text-gray-300 font-medium">
          {loading ? "Extracting text..." : "Drop your file here or click to upload"}
        </p>
        <p className="text-gray-500 text-sm">Supports PDF, DOCX, TXT</p>
      </label>
      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
    </div>
  );
}