"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Folder,
  File,
  Image as ImageIcon,
  ArrowUp,
  ChevronRight,
  FolderOpen,
  FolderPlus,
  Plus,
  Upload,
  Image,
} from "lucide-react";
import FileUploadForm from "./FileUploadForm";

interface FileListProps {
  userId: string;
  onCreateFolder?: () => void;
}

interface FileItem {
  id: string;
  name: string;
  type?: string;
  size?: number;
  createdAt?: string;
  isFolder: boolean;
  path?: string;
}

export default function FileList({ userId, onCreateFolder }: FileListProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const handleFileUploadSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    setUploadDialogOpen(false);
  }, []);

  const [folderPath, setFolderPath] = useState<
    Array<{ id: string; name: string }>
  >([]);

  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [creatingFolder, setCreatingFolder] = useState(false);

  const [imgDialogOpen, setImgDialogOpen] = useState<boolean>(false);
  const [dialogImgUrl, setDialogImgUrl] = useState<string | null>(null);
  const [dialogImgName, setDialogImgName] = useState<string | null>(null);

  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());

  useEffect(() => {
    setLoading(true);
    let url = `/api/files?userId=${userId}`;
    if (currentFolder) url += `&parentId=${currentFolder}`;
    axios
      .get(url)
      .then((response) => {
        console.log(response.data);
        setFiles(response.data ?? []);
        setError(null);
      })
      .catch(() => setError("Could not load files"))
      .finally(() => setLoading(false));
  }, [userId, currentFolder, refreshTrigger]);

  const enterFolder = (file: FileItem) => {
    setCurrentFolder(file.id);
    setFolderPath([...folderPath, { id: file.id, name: file.name }]);
    setSelectedFiles(new Set());
  };

  const viewImage = (file: FileItem) => {
    if (!file.path || !file.type?.startsWith("image/")) {
      return;
    }

    const optimizedUrl = `${process.env.NEXT_PUBLIC_IMAGE_KIT_URL_END_POINT}/${file.path}`;
    setDialogImgUrl(optimizedUrl);
    setDialogImgName(file.name);
    setImgDialogOpen(true);
  };

  const goUp = () => {
    if (!folderPath.length) {
      return;
    }

    const newPath = [...folderPath];
    newPath.pop();
    setFolderPath(newPath);
    setCurrentFolder(newPath.length ? newPath[newPath.length - 1].id : null);
    setSelectedFiles(new Set());
  };

  const getFileIcon = (file: FileItem) => {
    if (file.isFolder) {
      return <Folder className="h-8 w-8 text-blue-500" />;
    }
    if (file.type?.startsWith("image/")) {
      return <ImageIcon className="h-8 w-8 text-green-500" />;
    }

    return <File className="h-8 w-8 text-gray-500" />;
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }
    setCreatingFolder(true);
    try {
      console.log("Creating folder in:", currentFolder || "root");
      await axios.post("/api/folders", {
        name: folderName.trim(),
        userId: userId,
        parentId: currentFolder,
      });

      toast.success(`Folder "${folderName}" has been created successfully.`);
      setFolderName("");
      setFolderModalOpen(false);
      setRefreshTrigger((prev) => prev + 1);
      if (onCreateFolder) onCreateFolder();
    } catch (error) {
      toast.error("Folder Creation Failed");
    } finally {
      setCreatingFolder(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading files...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-2">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Button
            variant="ghost"
            size="sm"
            onClick={goUp}
            disabled={folderPath.length === 0}
            className="h-6 px-2"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
          <span className="font-medium">Root</span>
          {folderPath.map((folder, idx) => (
            <div key={folder.id} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium">{folder.name}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Upload className="h-5 w-5 mr-2" />
                New File
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload Files
                </DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <FileUploadForm
                  userId={userId as string}
                  onUploadSuccess={handleFileUploadSuccess}
                  currentFolder={currentFolder}
                />
              </div>
            </DialogContent>
          </Dialog>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFolderModalOpen(true)}
            className="gap-2"
          >
            <FolderPlus className="h-4 w-4" />
            New Folder
          </Button>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <FolderOpen className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No files here</h3>
          <p className="text-muted-foreground max-w-sm">
            This folder is empty. Upload files or create a new folder to get
            started.
          </p>
        </div>
      ) : (
        <>
          {(() => {
            const sortedFolders = files.filter((file) => file.isFolder);
            const sortedFiles = files.filter((file) => !file.isFolder);

            return (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sortedFolders.map((file) => (
                    <Card
                      key={file.id}
                      className="group relative cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] py-2 rounded-lg"
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        enterFolder(file);
                      }}
                    >
                      <CardContent className="flex gap-2 items-center">
                        <Folder className="h-5 w-5" />
                        <h3 className="font-medium text-s truncate">
                          {file.name}
                        </h3>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {sortedFiles.map((file) => (
                    <Card
                      key={file.id}
                      className="group relative cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02]"
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        if (file.type?.startsWith("image/")) {
                          viewImage(file);
                        }
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0">
                            {getFileIcon(file)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm truncate">
                              {file.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                              {file.type && (
                                <Badge variant="outline" className="text-xs">
                                  {file.type.split("/")[1]?.toUpperCase() ||
                                    "FILE"}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })()}
        </>
      )}

      <Dialog open={folderModalOpen} onOpenChange={setFolderModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-primary" />
              <span>Create New Folder</span>
            </DialogTitle>
            <DialogDescription>
              Enter a name for your new folder. This will help you organize your
              files better.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              type="text"
              placeholder="My Images"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && folderName.trim()) {
                  handleCreateFolder();
                }
              }}
              autoFocus
              className="h-12"
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setFolderModalOpen(false)}
              disabled={creatingFolder}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={!folderName.trim() || creatingFolder}
              className="gap-2"
            >
              {creatingFolder ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Folder
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={imgDialogOpen} onOpenChange={setImgDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Image className="h-5 w-5 text-primary" />
              <span>{dialogImgName}</span>
            </DialogTitle>
          </DialogHeader>
          {dialogImgUrl && (
            <img
              src={dialogImgUrl}
              alt={dialogImgName || "image"}
              className="max-w-full max-h-[60vh] rounded shadow"
              style={{ objectFit: "contain" }}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setImgDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
