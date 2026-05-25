import { useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { uploadFile } from "../api/api";

export default function UploadForm({ onExtracted }) {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    setLoading(true);
    setError("");
    try {
      const res = await uploadFile(file);
      onExtracted(res.data);
    } catch {
      setError("Failed to parse file. Please try PDF, DOCX, or TXT.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`card border-dashed p-10 lg:p-12 text-center transition-all duration-200 cursor-pointer ${
        dragging
          ? "border-accent bg-accent/5"
          : "hover:border-slate-500"
      }`}
    >
      <input
        type="file"
        accept=".pdf,.docx,.txt"
        className="hidden"
        id="file-upload"
        onChange={(e) => handleFile(e.target.files[0])}
      />
      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
        <div
          className={`h-14 w-14 rounded-2xl border flex items-center justify-center transition-colors ${
            dragging ? "border-accent/40 bg-accent/10" : "border-surface-border bg-navy-50"
          }`}
        >
          {loading ? (
            <Loader2 className="h-6 w-6 text-accent animate-spin" />
          ) : (
            <FileUp className="h-6 w-6 text-slate-400" strokeWidth={2} />
          )}
        </div>
        <div>
          <p className="text-slate-200 font-medium text-[15px]">
            {loading ? "Extracting text from file..." : "Drop your file here or click to upload"}
          </p>
          <p className="text-slate-500 text-[14px] mt-2">Supports PDF, DOCX, and TXT</p>
        </div>
      </label>
      {error && (
        <p className="text-danger text-sm mt-4">{error}</p>
      )}
    </div>
  );
}
