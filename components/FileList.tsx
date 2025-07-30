"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface FileListProps {
  userId: string;
}

export default function FileList({ userId }: FileListProps) {
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [folderPath, setFolderPath] = useState<
    Array<{ id: string; name: string }>
  >([]);

  useEffect(() => {
    setLoading(true);
    let url = `/api/files?userId=${userId}`;
    if (currentFolder) url += `&parentId=${currentFolder}`;
    axios
      .get(url)
      .then((response) => {
        setFiles(response.data ?? []);
        setError(null);
      })
      .catch(() => setError("Could not load files"))
      .finally(() => setLoading(false));
  }, [userId, currentFolder]);

  const enterFolder = (file: any) => {
    setCurrentFolder(file.id);
    setFolderPath([...folderPath, { id: file.id, name: file.name }]);
  };
  const goUp = () => {
    if (!folderPath.length) return;
    const newPath = [...folderPath];
    newPath.pop();
    setFolderPath(newPath);
    setCurrentFolder(newPath.length ? newPath[newPath.length - 1].id : null);
  };

  const openImage = (file: any) => {
    if (!file.path || !file.type.startsWith("image/")) return;
    const optimizedUrl = `${process.env.NEXT_PUBLIC_IMAGE_KIT_URL_END_POINT}/${file.path}`;
    window.open(optimizedUrl, "_blank");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-2">
      <div style={{ marginBottom: 8 }}>
        {folderPath.length > 0 && (
          <button type="button" onClick={goUp} style={{ marginRight: 12 }}>
            Up one folder
          </button>
        )}
        <b>Current folder:</b>{" "}
        {folderPath.map((f, idx) => (
          <span key={f.id}>
            {idx > 0 && " / "}
            {f.name}
          </span>
        )) || "Root"}
      </div>
      <table
        border={1}
        cellPadding={6}
        style={{ width: "100%", borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Type</th>
            <th align="left">Size</th>
            <th align="left">Added</th>
            <th align="left">Folder?</th>
            <th align="left">Preview</th>
          </tr>
        </thead>
        <tbody>
          {files.length === 0 ? (
            <tr>
              <td colSpan={6} align="center" style={{ color: "#888" }}>
                No files here.
              </td>
            </tr>
          ) : (
            files.map((file) => (
              <tr key={file.id}>
                <td>
                  {file.isFolder ? (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        enterFolder(file);
                      }}
                    >
                      {file.name}
                    </a>
                  ) : (
                    file.name
                  )}
                </td>
                <td>{file.isFolder ? "Folder" : file.type || ""}</td>
                <td>
                  {file.isFolder
                    ? "-"
                    : file.size < 1024
                    ? `${file.size} B`
                    : file.size < 1024 * 1024
                    ? `${(file.size / 1024).toFixed(1)} KB`
                    : `${(file.size / (1024 * 1024)).toFixed(1)} MB`}
                </td>
                <td>
                  {file.createdAt
                    ? new Date(file.createdAt).toLocaleString()
                    : ""}
                </td>
                <td>{file.isFolder ? "Yes" : "No"}</td>
                <td>
                  {!file.isFolder &&
                  file.type &&
                  file.type.startsWith("image/") ? (
                    <button
                      onClick={() => openImage(file)}
                      style={{ fontSize: 16 }}
                    >
                      View
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
