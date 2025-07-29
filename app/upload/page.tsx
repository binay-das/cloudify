"use client";
import { Image } from "@imagekit/next";

import { useState } from "react";

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  async function uploadFile(file: File, parentId?: string) {
    const formData = new FormData();
    formData.append("file", file);
    if (parentId) {
      formData.append("parentId", parentId);
    }

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Failed to upload file");
    }

    const data = await res.json();
    return data;
  }

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);

    try {
      const result = await uploadFile(file);
      console.log("Upload success:", result);
      setUploadedUrl(result.fileUrl);
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <input
        type="file"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setFile(file);
        }}
      />
      <button onClick={handleUpload} disabled={!file || loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {uploadedUrl && (
        <div>
          <p>Uploaded:</p>
          <Image
            src={uploadedUrl}
            width={300}
            height={300}
            alt="Uploaded file"
            className="max-w-xs"
          />
        </div>
      )}
    </div>
  );
}
