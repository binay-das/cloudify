"use client";

import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Home,
  Trash,
  Star,
  StarOff,
  Download,
  RotateCcw,
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
  isFav?: boolean;
  isTrash?: boolean;
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
  const [activeTab, setActiveTab] = useState<'all' | 'starred' | 'trash'>('all');

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

  const handleDelete = async (file: FileItem) => {
    if (!window.confirm(`Are you sure you want to delete '${file.name}'? This action cannot be undone.`)) return;
    try {
      await axios.delete(`/api/files/${file.id}/delete`);
      toast.success(`'${file.name}' deleted successfully.`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      toast.error(`Failed to delete '${file.name}'.`);
    }
  };

  const handleTrash = async (file: FileItem) => {
    try {
      await axios.put(`/api/files/${file.id}/trash`);
      toast.success(`'${file.name}' moved to trash.`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      toast.error(`Failed to move '${file.name}' to trash.`);
    }
  };
  const handleStar = async (file: FileItem) => {
    try {
      await axios.put(`/api/files/${file.id}/star`);
      toast.success(`'${file.name}' ${file.isFav ? "removed from favorites" : "starred"}.`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      toast.error(`Failed to update star for '${file.name}'.`);
    }
  };

  const handleDownload = (file: FileItem) => {
    if (!file.path) {
      toast.error("No file path available for download.");
      return;
    }
    const url = `${process.env.NEXT_PUBLIC_IMAGE_KIT_URL_END_POINT}/${file.path}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRecover = async (file: FileItem) => {
    try {
      await axios.put(`/api/files/${file.id}/trash`);
      toast.success(`'${file.name}' recovered.`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      toast.error(`Failed to recover '${file.name}'.`);
    }
  };
  const handleRecoverAll = async () => {
    try {
      await Promise.all(filteredFiles.map((file) => axios.put(`/api/files/${file.id}/trash`)));
      toast.success('All files recovered from trash.');
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      toast.error('Failed to recover all files.');
    }
  };
  const handleEmptyTrash = async () => {
    if (!window.confirm('Are you sure you want to permanently delete all trashed files? This action cannot be undone.')) return;
    try {
      await axios.delete('/api/files/empty-trash');
      toast.success('Trash emptied successfully.');
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      toast.error('Failed to empty trash.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl border border-gray-200/40 dark:border-gray-700/40">
          <div className="relative">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-transparent border-t-blue-500 border-r-purple-500"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Loading your files...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center p-8 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-red-600 dark:text-red-400 mb-4 font-medium">
            {error}
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const filteredFiles = files.filter((file) => {
    if (activeTab === 'all') return !file.isTrash;
    if (activeTab === 'starred') return file.isFav && !file.isTrash;
    if (activeTab === 'trash') return file.isTrash;
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl p-2 border border-gray-200/40 dark:border-gray-700/40 shadow-sm">
          <Button
            variant="ghost"
            size="sm"
            onClick={goUp}
            disabled={folderPath.length === 0}
            className="h-8 px-2 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg"
          >
            <ArrowUp className="h-4 w-4" />
            Up
          </Button>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Home className="h-4 w-4 text-blue-500" />
            <span className="text-gray-900 dark:text-white">Root</span>
            {folderPath.map((folder, idx) => (
              <div key={folder.id} className="flex items-center gap-2">
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700 dark:text-gray-300">
                  {folder.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <Upload className="h-4 w-4" />
                Upload Files
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl rounded-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                    <Upload className="h-5 w-5 text-white" />
                  </div>
                  Upload Files
                </DialogTitle>
              </DialogHeader>
              <div className="py-6">
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
            onClick={() => setFolderModalOpen(true)}
            className="gap-2 border-2 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200"
          >
            <FolderPlus className="h-4 w-4" />
            New Folder
          </Button>
        </div>
      </div>

      {/* Tab UI */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={activeTab === 'all' ? 'default' : 'outline'}
          onClick={() => setActiveTab('all')}
          className="flex items-center gap-2"
        >
          <FolderOpen className="h-4 w-4" /> All Files
        </Button>
        <Button
          variant={activeTab === 'starred' ? 'default' : 'outline'}
          onClick={() => setActiveTab('starred')}
          className="flex items-center gap-2"
        >
          <Star className="h-4 w-4" /> Starred
        </Button>
        <Button
          variant={activeTab === 'trash' ? 'default' : 'outline'}
          onClick={() => setActiveTab('trash')}
          className="flex items-center gap-2"
        >
          <Trash className="h-4 w-4" /> Trash
        </Button>
      </div>

      {activeTab === 'trash' && filteredFiles.length > 0 && (
        <div className="flex gap-2 mb-4">
          <Button variant="destructive" onClick={handleEmptyTrash} className="flex items-center gap-2">
            <Trash className="h-4 w-4" /> Empty Trash
          </Button>
          <Button variant="outline" onClick={handleRecoverAll} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" /> Recover All
          </Button>
        </div>
      )}

      {filteredFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center p-8 rounded-xl bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 dark:border-gray-700/50">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 mb-6">
            <FolderOpen className="h-16 w-16 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            No files here yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            This folder is empty. Upload your first files or create a new folder
            to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {(() => {
            const sortedFolders = filteredFiles.filter((file) => file.isFolder);
            const sortedFiles = filteredFiles.filter((file) => !file.isFolder);

            return (
              <>
                {sortedFolders.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Folder className="h-5 w-5 text-blue-500" />
                      Folders ({sortedFolders.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {sortedFolders.map((file) => (
                        <Card
                          key={file.id}
                          className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] rounded-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-sm relative"
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            enterFolder(file);
                          }}
                        >
                          <CardContent className="flex items-center gap-2">
                            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                              <Folder className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate flex-grow">
                              {file.name}
                            </h3>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900 rounded-full ml-2 ${file.isFav ? "" : "opacity-60"}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStar(file);
                              }}
                              aria-label={file.isFav ? `Unstar ${file.name}` : `Star ${file.name}`}
                              disabled={file.isTrash}
                            >
                              {file.isFav ? <Star className="h-4 w-4 fill-yellow-400" /> : <StarOff className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-full ml-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTrash(file);
                              }}
                              aria-label={`Move ${file.isFolder ? "folder" : "file"} ${file.name} to trash`}
                              disabled={file.isTrash}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                            {activeTab === 'trash' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-green-500 hover:bg-green-100 dark:hover:bg-green-900 rounded-full ml-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRecover(file);
                                }}
                                aria-label={`Recover ${file.isFolder ? "folder" : "file"} ${file.name}`}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {sortedFiles.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <File className="h-5 w-5 text-green-500" />
                      Files ({sortedFiles.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {sortedFiles.map((file) => (
                        <Card
                          key={file.id}
                          className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-[1.02] rounded-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-sm overflow-hidden relative"
                          onDoubleClick={(e) => {
                            e.stopPropagation();
                            if (file.type?.startsWith("image/")) {
                              viewImage(file);
                            }
                          }}
                        >
                          <CardContent className="p-0">
                            {file.type?.startsWith("image/") && file.path ? (
                              <div className="relative">
                                <img
                                  src={`${process.env.NEXT_PUBLIC_IMAGE_KIT_URL_END_POINT}/${file.path}`}
                                  alt={file.name}
                                  className="w-full h-48 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                              </div>
                            ) : (
                              <div className="h-48 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                                <File className="h-12 w-12 text-gray-400" />
                              </div>
                            )}

                            <div className="p-4">
                              <div className="flex items-center justify-between gap-2">
                                <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate flex-grow">
                                  {file.name}
                                </h3>
                                {file.type && (
                                  <Badge className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                                    {file.type.split("/")[1]?.toUpperCase() ||
                                      "FILE"}
                                  </Badge>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full ml-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDownload(file);
                                  }}
                                  aria-label={`Download file ${file.name}`}
                                  disabled={file.isTrash}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className={`text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900 rounded-full ml-2 ${file.isFav ? "" : "opacity-60"}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStar(file);
                                  }}
                                  aria-label={file.isFav ? `Unstar ${file.name}` : `Star ${file.name}`}
                                  disabled={file.isTrash}
                                >
                                  {file.isFav ? <Star className="h-4 w-4 fill-yellow-400" /> : <StarOff className="h-4 w-4" />}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-red-500 hover:bg-red-100 dark:hover:bg-red-900 rounded-full ml-2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleTrash(file);
                                  }}
                                  aria-label={`Move file ${file.name} to trash`}
                                  disabled={file.isTrash}
                                >
                                  <Trash className="h-4 w-4" />
                                </Button>
                                {activeTab === 'trash' && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-green-500 hover:bg-green-100 dark:hover:bg-green-900 rounded-full ml-2"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRecover(file);
                                    }}
                                    aria-label={`Recover ${file.isFolder ? "folder" : "file"} ${file.name}`}
                                  >
                                    <RotateCcw className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      )}

      <Dialog open={folderModalOpen} onOpenChange={setFolderModalOpen}>
        <DialogContent className="sm:max-w-md rounded-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                <FolderPlus className="h-5 w-5 text-white" />
              </div>
              Create New Folder
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Enter a name for your new folder. This will help you organize your
              files better.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
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
              className="h-12 rounded-xl border-2 focus:ring-4 focus:ring-purple-500/20"
            />
          </div>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setFolderModalOpen(false)}
              disabled={creatingFolder}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={!folderName.trim() || creatingFolder}
              className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl"
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
        <DialogContent className="sm:max-w-4xl rounded-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                <Image className="h-5 w-5 text-white" />
              </div>
              {dialogImgName}
            </DialogTitle>
          </DialogHeader>
          {dialogImgUrl && (
            <div className="py-4">
              <img
                src={dialogImgUrl}
                alt={dialogImgName || "image"}
                className="max-w-full max-h-[70vh] rounded-2xl shadow-lg mx-auto"
                style={{ objectFit: "contain" }}
              />
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setImgDialogOpen(false)}
              className="rounded-xl"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
