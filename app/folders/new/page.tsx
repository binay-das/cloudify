"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateFolderPage() {
  const [name, setName] = useState("");
  const [parentId, setParentId] = useState<string | undefined>(undefined); // Optional, if supporting subfolders
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, parentId: parentId || null }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Unexpected error");
      } else {
        setName("");
        setParentId(undefined);
        router.refresh();
      }
    } catch (err) {
      setError("Failed to create folder. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <h1 className="text-2xl font-bold mb-6">Create New Folder</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">
            Folder Name
            <input
              className="border px-2 py-1 w-full"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              disabled={loading}
            />
          </label>
        </div>
        {/* 
        <div>
          <label className="block font-medium mb-1">
            Parent Folder ID
            <input
              className="border px-2 py-1 w-full"
              type="text"
              value={parentId || ""}
              onChange={e => setParentId(e.target.value)}
              disabled={loading}
            />
          </label>
        </div>
        */}
        {error && <p className="text-red-500">{error}</p>}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          type="submit"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Folder"}
        </button>
      </form>
    </div>
  );
}
