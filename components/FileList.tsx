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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
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
  Search,
  Grid3X3,
  List,
  SortAsc,
  MoreVertical,
  Eye,
  Info,
  AlertTriangle,
  FolderKanban,
  ChevronUp,
  Mail,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import FileUploadForm from "./FileUploadForm";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const handleFileUploadSuccess = useCallback(() => {
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

  const [activeTab, setActiveTab] = useState<"all" | "starred" | "trash">(
    "all"
  );

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

  const enterFolder = (file: FileItem) => {
    setCurrentFolder(file.id);
    setFolderPath([...folderPath, { id: file.id, name: file.name }]);
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
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) {
      toast.error("Please enter a folder name");
      return;
    }
    setCreatingFolder(true);
    try {
      await axios.post("/api/folders", {
        name: folderName.trim(),
        userId: userId,
        parentId: currentFolder,
      });

      toast.success(`Folder "${folderName}" has been created successfully.`);
      setFolderName("");
      setFolderModalOpen(false);
      if (onCreateFolder) onCreateFolder();
    } catch (error) {
      toast.error("Folder Creation Failed");
    } finally {
      setCreatingFolder(false);
    }
  };

  const handleDelete = async (file: FileItem) => {
    if (
      !window.confirm(
        `Are you sure you want to delete '${file.name}'? This action cannot be undone.`
      )
    )
      return;
    try {
      await axios.delete(`/api/files/${file.id}/delete`);
      toast.success(`'${file.name}' deleted successfully.`);
    } catch (error) {
      toast.error(`Failed to delete '${file.name}'.`);
    }
  };

  const handleTrash = async (file: FileItem) => {
    try {
      await axios.put(`/api/files/${file.id}/trash`);
      toast.success(`'${file.name}' moved to trash.`);
    } catch (error) {
      toast.error(`Failed to move '${file.name}' to trash.`);
    }
  };

  const handleStar = async (file: FileItem) => {
    try {
      await axios.put(`/api/files/${file.id}/star`);
      toast.success(
        `'${file.name}' ${file.isFav ? "removed from favorites" : "starred"}.`
      );
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
    } catch (error) {
      toast.error(`Failed to recover '${file.name}'.`);
    }
  };

  const handleRecoverAll = async () => {
    try {
      await Promise.all(
        filteredFiles.map((file) => axios.put(`/api/files/${file.id}/trash`))
      );
      toast.success("All files recovered from trash.");
    } catch (error) {
      toast.error("Failed to recover all files.");
    }
  };

  const handleEmptyTrash = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete all trashed files? This action cannot be undone."
      )
    )
      return;
    try {
      await axios.delete("/api/files/empty-trash");
      toast.success("Trash emptied successfully.");
    } catch (error) {
      toast.error("Failed to empty trash.");
    }
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    if (activeTab === "all") return !file.isTrash && matchesSearch;
    if (activeTab === "starred")
      return file.isFav && !file.isTrash && matchesSearch;
    if (activeTab === "trash") return file.isTrash && matchesSearch;
    return true;
  });

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "Unknown size";
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${Math.round((bytes / Math.pow(1024, i)) * 10) / 10} ${sizes[i]}`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  function getInitials(name?: string | null) {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  const { data: session } = useSession();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 backdrop-blur-2xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl"
        >
          <div className="relative">
            <div className="animate-spin rounded-full h-8 w-8 border-3 border-transparent border-t-blue-500 border-r-purple-500"></div>
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 font-medium text-sm">
            Loading files...
          </p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-6 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 dark:from-red-900/20 dark:to-red-800/20 border border-red-200 dark:border-red-800 shadow-lg"
        >
          <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 w-fit mx-auto mb-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-bold text-red-800 dark:text-red-300 mb-2">
            Something went wrong
          </h3>
          <p className="text-red-600 dark:text-red-400 mb-4 font-medium text-sm">
            {error}
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white shadow-lg text-sm"
          >
            Try Again
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 min-h-screen p-4 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <motion.nav
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-52 h-screen flex flex-col justify-between bg-white/90 dark:bg-gray-900/90 rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl p-4 sticky top-4"
      >
        <div className="space-y-1">
          <h2 className="text-base font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
              <FolderKanban className="h-6 w-6 text-white" />
            </div>
            Cloudify
          </h2>

          {[
            {
              key: "all",
              icon: FolderOpen,
              label: "All Files",
              gradient: "from-blue-600 to-purple-600",
            },
            {
              key: "starred",
              icon: Star,
              label: "Starred",
              gradient: "from-yellow-500 to-orange-500",
            },
            {
              key: "trash",
              icon: Trash,
              label: "Trash",
              gradient: "from-red-500 to-pink-500",
            },
          ].map(({ key, icon: Icon, label, gradient }) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={activeTab === key ? "default" : "ghost"}
                onClick={() => setActiveTab(key as any)}
                className={`justify-start gap-2 w-full h-9 rounded-lg transition-all duration-200 text-sm ${
                  activeTab === key
                    ? `bg-gradient-to-r ${gradient} text-white shadow-md hover:shadow-lg`
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Button>
            </motion.div>
          ))}
        </div>

        <div>
          <Separator className="my-4" />

          <div className="border-gray-200/40 dark:border-gray-700/40">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full h-auto p- rounded-xl hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3 w-full">
                    <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-gray-800 group-hover:ring-blue-200 dark:group-hover:ring-blue-700 transition-all duration-200">
                      <AvatarImage
                        src={session?.user?.image || ""}
                        alt={session?.user?.name || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 text-white text-sm font-bold">
                        {getInitials(session?.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {session?.user?.name || "Guest User"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        View profile
                      </p>
                    </div>
                    <ChevronUp className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 mb-2 ml-6 rounded-2xl border-0 shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"
                align="start"
                side="top"
              >
                <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-t-2xl">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-12 w-12 ring-2 ring-white dark:ring-gray-700">
                      <AvatarImage
                        src={session?.user?.image || ""}
                        alt={session?.user?.name || "User"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 text-white font-bold">
                        {getInitials(session?.user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">
                        {session?.user?.name || "Guest User"}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        <Mail className="w-3 h-3 text-gray-400" />
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {session?.user?.email || "guest@example.com"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <DropdownMenuItem
                    asChild
                    className="rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                  >
                    <Link
                      href="/profile"
                      className="flex items-center px-3 py-2"
                    >
                      <User className="mr-3 h-4 w-4 text-blue-500" />
                      <span className="font-medium">Profile Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    asChild
                    className="rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200"
                  >
                    <Link
                      href="/settings"
                      className="flex items-center px-3 py-2"
                    >
                      <Settings className="mr-3 h-4 w-4 text-gray-500" />
                      <span className="font-medium">Account Settings</span>
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="my-2" />

                  <DropdownMenuItem
                    className="rounded-lg cursor-pointer text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all duration-200 px-3 py-2"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-medium">Sign Out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.nav>

      <section className="flex-1 space-y-4">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl p-2 backdrop-blur-sm">
              <Button
                variant="ghost"
                size="sm"
                onClick={goUp}
                disabled={folderPath.length === 0}
                className="h-7 px-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all duration-200 text-xs"
              >
                <ArrowUp className="h-3 w-3 mr-1" />
                Up
              </Button>
              <Separator orientation="vertical" className="h-5" />
              <div className="flex items-center gap-1 text-xs font-medium">
                <Home className="h-3 w-3 text-blue-500" />
                <span className="text-gray-900 dark:text-white">Root</span>
                {folderPath.map((folder, index) => (
                  <div key={folder.id} className="flex items-center gap-1">
                    <ChevronRight className="h-3 w-3 text-gray-400" />
                    <Button
                      variant="ghost"
                      className="p-0 h-auto font-medium text-xs text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                      onClick={() => {
                        const newPath = folderPath.slice(0, index + 1);
                        setFolderPath(newPath);
                        setCurrentFolder(newPath[newPath.length - 1].id);
                      }}
                    >
                      {folder.name}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Dialog
                open={uploadDialogOpen}
                onOpenChange={setUploadDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-200 rounded-lg h-9 px-4 text-sm">
                    <Upload className="h-3 w-3" />
                    Upload
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl rounded-2xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-lg">
                      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
                        <Upload className="h-4 w-4 text-white" />
                      </div>
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
                onClick={() => setFolderModalOpen(true)}
                className="gap-2 border-2 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-200 rounded-lg h-9 px-4 text-sm"
              >
                <FolderPlus className="h-3 w-3" />
                New Folder
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 h-8 rounded-lg border-2 focus:ring-2 focus:ring-blue-500/20 text-sm"
              />
            </div>

            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-7 px-2 rounded-md"
                  >
                    <Grid3X3 className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Grid View</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-7 px-2 rounded-md"
                  >
                    <List className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>List View</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {activeTab === "trash" && filteredFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <Info className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-900 dark:text-orange-300 text-sm">
                      Trash ({filteredFiles.length} items)
                    </h3>
                    <p className="text-xs text-orange-700 dark:text-orange-400">
                      Items deleted after 30 days
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRecoverAll}
                    className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20 h-8 text-xs"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Recover All
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleEmptyTrash}
                    className="bg-red-600 hover:bg-red-700 h-8 text-xs"
                  >
                    <Trash className="h-3 w-3 mr-1" />
                    Empty
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-4 min-h-[45vh]"
        >
          {filteredFiles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200/50 dark:from-gray-800 dark:to-gray-700/50 mb-4">
                {searchQuery ? (
                  <Search className="h-12 w-12 text-gray-400" />
                ) : (
                  <FolderOpen className="h-12 w-12 text-gray-400" />
                )}
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                {searchQuery ? "No results found" : "No files here"}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md leading-relaxed text-sm">
                {searchQuery
                  ? `No files match "${searchQuery}".`
                  : "Upload files or create folders to get started."}
              </p>
              {!searchQuery && (
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    onClick={() => setUploadDialogOpen(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs"
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Upload Files
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFolderModalOpen(true)}
                    className="text-xs"
                  >
                    <FolderPlus className="h-3 w-3 mr-1" />
                    New Folder
                  </Button>
                </div>
              )}
            </motion.div>
          ) : (
            <div className="space-y-6">
              {(() => {
                const sortedFolders = filteredFiles.filter(
                  (file) => file.isFolder
                );
                const sortedFiles = filteredFiles.filter(
                  (file) => !file.isFolder
                );

                return (
                  <AnimatePresence mode="wait">
                    {sortedFolders.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <div className="p-1 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                            <Folder className="h-4 w-4 text-blue-600" />
                          </div>
                          Folders ({sortedFolders.length})
                        </h3>

                        {viewMode === "grid" ? (
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-3">
                            {sortedFolders.map((file, index) => (
                              <motion.div
                                key={file.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Card
                                  className="px-1 py-0 group cursor-pointer transition-all duration-300 rounded-xl border- bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 shadow-md hover:shadow-lg backdrop-blur-sm"
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    enterFolder(file);
                                  }}
                                >
                                  <CardContent className="p-3 borde">
                                    <div className="flex flex-col items-center text-center space-y-2">
                                      <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 group-hover:from-blue-200 dark:group-hover:from-blue-800/50 transition-all duration-300">
                                        <Folder className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                      </div>
                                      <h3 className="font-semibold text-gray-900 dark:text-white text-xs leading-tight truncate w-full">
                                        {file.name}
                                      </h3>
                                    </div>

                                    <div className="flex items-center justify-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className={`h-6 w-6 rounded-md ${
                                              file.isFav
                                                ? "text-yellow-500"
                                                : "text-gray-400"
                                            } hover:bg-yellow-100 dark:hover:bg-yellow-900/30`}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleStar(file);
                                            }}
                                            disabled={file.isTrash}
                                          >
                                            {file.isFav ? (
                                              <Star className="h-3 w-3 fill-current" />
                                            ) : (
                                              <StarOff className="h-3 w-3" />
                                            )}
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                          {file.isFav ? "Unstar" : "Star"}
                                        </TooltipContent>
                                      </Tooltip>

                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                                          >
                                            <MoreVertical className="h-3 w-3" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                          align="end"
                                          className="w-40 rounded-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl"
                                        >
                                          {activeTab === "trash" ? (
                                            <>
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  handleRecover(file)
                                                }
                                                className="gap-2 rounded-lg text-xs"
                                              >
                                                <RotateCcw className="h-3 w-3 text-green-500" />
                                                Recover
                                              </DropdownMenuItem>
                                              <DropdownMenuSeparator />
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  handleDelete(file)
                                                }
                                                className="gap-2 text-red-600 focus:text-red-600 rounded-lg text-xs"
                                              >
                                                <Trash className="h-3 w-3" />
                                                Delete
                                              </DropdownMenuItem>
                                            </>
                                          ) : (
                                            <DropdownMenuItem
                                              onClick={() => handleTrash(file)}
                                              className="gap-2 text-red-600 focus:text-red-600 rounded-lg text-xs"
                                            >
                                              <Trash className="h-3 w-3" />
                                              Move to Trash
                                            </DropdownMenuItem>
                                          )}
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {sortedFolders.map((file, index) => (
                              <motion.div
                                key={file.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Card
                                  className="group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 rounded-lg border-0"
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    enterFolder(file);
                                  }}
                                >
                                  <CardContent className="flex items-center gap-3 p-3">
                                    <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                                      <Folder className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                                        {file.name}
                                      </h3>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Folder • {formatDate(file.createdAt)}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`h-6 w-6 ${
                                          file.isFav
                                            ? "text-yellow-500"
                                            : "text-gray-400"
                                        }`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleStar(file);
                                        }}
                                        disabled={file.isTrash}
                                      >
                                        {file.isFav ? (
                                          <Star className="h-3 w-3 fill-current" />
                                        ) : (
                                          <StarOff className="h-3 w-3" />
                                        )}
                                      </Button>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-gray-500"
                                          >
                                            <MoreVertical className="h-3 w-3" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                          align="end"
                                          className="w-40 rounded-xl text-xs"
                                        >
                                          {activeTab === "trash" ? (
                                            <>
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  handleRecover(file)
                                                }
                                              >
                                                <RotateCcw className="h-3 w-3 mr-2 text-green-500" />
                                                Recover
                                              </DropdownMenuItem>
                                              <DropdownMenuSeparator />
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  handleDelete(file)
                                                }
                                                className="text-red-600"
                                              >
                                                <Trash className="h-3 w-3 mr-2" />
                                                Delete
                                              </DropdownMenuItem>
                                            </>
                                          ) : (
                                            <DropdownMenuItem
                                              onClick={() => handleTrash(file)}
                                              className="text-red-600"
                                            >
                                              <Trash className="h-3 w-3 mr-2" />
                                              Move to Trash
                                            </DropdownMenuItem>
                                          )}
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}

                    {sortedFiles.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                          <div className="p-1 rounded-lg bg-green-100 dark:bg-green-900/30">
                            <File className="h-4 w-4 text-green-600" />
                          </div>
                          Files ({sortedFiles.length})
                        </h3>

                        {viewMode === "grid" ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                            {sortedFiles.map((file, index) => (
                              <motion.div
                                key={file.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Card
                                  className="p-0 group cursor-pointer transition-all duration-300 rounded-xl bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-800 dark:to-gray-900/50 shadow-md hover:shadow-lg overflow-hidden backdrop-blur-sm"
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    if (file.type?.startsWith("image/")) {
                                      viewImage(file);
                                    }
                                  }}
                                >
                                  <CardContent className="p-0">
                                    <div className="relative h-32 border">
                                      {file.type?.startsWith("image/") &&
                                      file.path ? (
                                        <>
                                          <img
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_KIT_URL_END_POINT}/${file.path}`}
                                            alt={file.name}
                                            className="w-full h-full object-cover"
                                          />
                                          {/* <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" /> */}
                                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <Button
                                              size="icon"
                                              className="h-6 w-6 bg-white/90 hover:bg-white text-gray-900 shadow-lg"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                viewImage(file);
                                              }}
                                            >
                                              <Eye className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        </>
                                      ) : (
                                        <div className="h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200/50 dark:from-gray-700 dark:to-gray-800/50">
                                          <div className="text-center">
                                            <File className="h-10 w-10 text-gray-400 mx-auto mb-1" />
                                            {file.type && (
                                              <Badge className="text-xs bg-gray-600 text-white px-1 py-0">
                                                {file.type
                                                  .split("/")[1]
                                                  ?.toUpperCase()
                                                  .slice(0, 3) || "FILE"}
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    <div className="p-3">
                                      <div className="space-y-2">
                                        <div className="flex items-start justify-between gap-1">
                                          <h3 className="font-semibold text-gray-900 dark:text-white text-xs leading-tight truncate flex-1">
                                            {file.name}
                                          </h3>
                                          {file.type && (
                                            <Badge className="text-xs bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shrink-0 px-1 py-0">
                                              {file.type
                                                .split("/")[1]
                                                ?.toUpperCase()
                                                .slice(0, 3) || "FILE"}
                                            </Badge>
                                          )}
                                        </div>

                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                          <div>{formatFileSize(file.size)}</div>
                                        </div>

                                        <div className="flex items-center justify-between pt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                          <div className="flex gap-1">
                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-6 w-6 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDownload(file);
                                                  }}
                                                  disabled={file.isTrash}
                                                >
                                                  <Download className="h-3 w-3" />
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                Download
                                              </TooltipContent>
                                            </Tooltip>

                                            <Tooltip>
                                              <TooltipTrigger asChild>
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className={`h-6 w-6 rounded-md ${
                                                    file.isFav
                                                      ? "text-yellow-500"
                                                      : "text-gray-400"
                                                  } hover:bg-yellow-100 dark:hover:bg-yellow-900/30`}
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleStar(file);
                                                  }}
                                                  disabled={file.isTrash}
                                                >
                                                  {file.isFav ? (
                                                    <Star className="h-3 w-3 fill-current" />
                                                  ) : (
                                                    <StarOff className="h-3 w-3" />
                                                  )}
                                                </Button>
                                              </TooltipTrigger>
                                              <TooltipContent>
                                                {file.isFav ? "Unstar" : "Star"}
                                              </TooltipContent>
                                            </Tooltip>
                                          </div>

                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                                              >
                                                <MoreVertical className="h-3 w-3" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                              align="end"
                                              className="w-40 rounded-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl"
                                            >
                                              {activeTab === "trash" ? (
                                                <>
                                                  <DropdownMenuItem
                                                    onClick={() =>
                                                      handleRecover(file)
                                                    }
                                                    className="gap-2 rounded-lg text-xs"
                                                  >
                                                    <RotateCcw className="h-3 w-3 text-green-500" />
                                                    Recover
                                                  </DropdownMenuItem>
                                                  <DropdownMenuSeparator />
                                                  <DropdownMenuItem
                                                    onClick={() =>
                                                      handleDelete(file)
                                                    }
                                                    className="gap-2 text-red-600 focus:text-red-600 rounded-lg text-xs"
                                                  >
                                                    <Trash className="h-3 w-3" />
                                                    Delete
                                                  </DropdownMenuItem>
                                                </>
                                              ) : (
                                                <>
                                                  <DropdownMenuItem
                                                    onClick={() =>
                                                      handleDownload(file)
                                                    }
                                                    className="gap-2 rounded-lg text-xs"
                                                  >
                                                    <Download className="h-3 w-3 text-blue-500" />
                                                    Download
                                                  </DropdownMenuItem>
                                                  {file.type?.startsWith(
                                                    "image/"
                                                  ) && (
                                                    <DropdownMenuItem
                                                      onClick={() =>
                                                        viewImage(file)
                                                      }
                                                      className="gap-2 rounded-lg text-xs"
                                                    >
                                                      <Eye className="h-3 w-3 text-green-500" />
                                                      View
                                                    </DropdownMenuItem>
                                                  )}
                                                  <DropdownMenuSeparator />
                                                  <DropdownMenuItem
                                                    onClick={() =>
                                                      handleTrash(file)
                                                    }
                                                    className="gap-2 text-red-600 focus:text-red-600 rounded-lg text-xs"
                                                  >
                                                    <Trash className="h-3 w-3" />
                                                    Trash
                                                  </DropdownMenuItem>
                                                </>
                                              )}
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="space-y-1">
                            {sortedFiles.map((file, index) => (
                              <motion.div
                                key={file.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                              >
                                <Card
                                  className="group cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200 rounded-lg border-0"
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    if (file.type?.startsWith("image/")) {
                                      viewImage(file);
                                    }
                                  }}
                                >
                                  <CardContent className="flex items-center gap-3 p-3">
                                    <div className="shrink-0">
                                      {file.type?.startsWith("image/") &&
                                      file.path ? (
                                        <div className="w-10 h-10 rounded-lg overflow-hidden">
                                          <img
                                            src={`${process.env.NEXT_PUBLIC_IMAGE_KIT_URL_END_POINT}/${file.path}`}
                                            alt={file.name}
                                            className="w-full h-full object-cover"
                                          />
                                        </div>
                                      ) : (
                                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                          <File className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                                        </div>
                                      )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm">
                                          {file.name}
                                        </h3>
                                        {file.type && (
                                          <Badge className="text-xs bg-green-500 text-white px-1 py-0">
                                            {file.type
                                              .split("/")[1]
                                              ?.toUpperCase()
                                              .slice(0, 3) || "FILE"}
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formatFileSize(file.size)} •{" "}
                                        {formatDate(file.createdAt)}
                                      </p>
                                    </div>

                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleDownload(file);
                                        }}
                                        disabled={file.isTrash}
                                      >
                                        <Download className="h-3 w-3" />
                                      </Button>

                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`h-6 w-6 ${
                                          file.isFav
                                            ? "text-yellow-500"
                                            : "text-gray-400"
                                        } hover:bg-yellow-100 dark:hover:bg-yellow-900/30`}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleStar(file);
                                        }}
                                        disabled={file.isTrash}
                                      >
                                        {file.isFav ? (
                                          <Star className="h-3 w-3 fill-current" />
                                        ) : (
                                          <StarOff className="h-3 w-3" />
                                        )}
                                      </Button>

                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                          <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-gray-500"
                                          >
                                            <MoreVertical className="h-3 w-3" />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent
                                          align="end"
                                          className="w-40 rounded-xl text-xs"
                                        >
                                          {activeTab === "trash" ? (
                                            <>
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  handleRecover(file)
                                                }
                                              >
                                                <RotateCcw className="h-3 w-3 mr-2 text-green-500" />
                                                Recover
                                              </DropdownMenuItem>
                                              <DropdownMenuSeparator />
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  handleDelete(file)
                                                }
                                                className="text-red-600"
                                              >
                                                <Trash className="h-3 w-3 mr-2" />
                                                Delete
                                              </DropdownMenuItem>
                                            </>
                                          ) : (
                                            <>
                                              {file.type?.startsWith(
                                                "image/"
                                              ) && (
                                                <DropdownMenuItem
                                                  onClick={() =>
                                                    viewImage(file)
                                                  }
                                                >
                                                  <Eye className="h-3 w-3 mr-2 text-green-500" />
                                                  View
                                                </DropdownMenuItem>
                                              )}
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  handleDownload(file)
                                                }
                                              >
                                                <Download className="h-3 w-3 mr-2 text-blue-500" />
                                                Download
                                              </DropdownMenuItem>
                                              <DropdownMenuSeparator />
                                              <DropdownMenuItem
                                                onClick={() =>
                                                  handleTrash(file)
                                                }
                                                className="text-red-600"
                                              >
                                                <Trash className="h-3 w-3 mr-2" />
                                                Trash
                                              </DropdownMenuItem>
                                            </>
                                          )}
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </CardContent>
                                </Card>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                );
              })()}
            </div>
          )}
        </motion.div>

        <Dialog open={folderModalOpen} onOpenChange={setFolderModalOpen}>
          <DialogContent className="sm:max-w-md rounded-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600">
                  <FolderPlus className="h-4 w-4 text-white" />
                </div>
                Create New Folder
              </DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400 text-sm">
                Enter a name for your new folder.
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
                className="h-10 rounded-lg border-2 focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setFolderModalOpen(false)}
                disabled={creatingFolder}
                className="rounded-lg text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateFolder}
                disabled={!folderName.trim() || creatingFolder}
                className="gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm"
              >
                {creatingFolder ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="h-3 w-3" />
                    Create
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={imgDialogOpen} onOpenChange={setImgDialogOpen}>
          <DialogContent className="sm:max-w-4xl rounded-xl border-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl shadow-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-lg">
                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600">
                  <Image className="h-4 w-4 text-white" />
                </div>
                {dialogImgName}
              </DialogTitle>
            </DialogHeader>
            {dialogImgUrl && (
              <div className="py-4">
                <ScrollArea className="max-h-[70vh]">
                  <img
                    src={dialogImgUrl}
                    alt={dialogImgName || "image"}
                    className="max-w-full h-auto rounded-xl shadow-lg mx-auto"
                    style={{ objectFit: "contain" }}
                  />
                </ScrollArea>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setImgDialogOpen(false)}
                className="rounded-lg text-sm"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
