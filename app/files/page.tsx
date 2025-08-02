"use client";

import { FileUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/Badge";
import FileList from "@/components/FileList";
import Sidebar from "@/components/layout/Sidebar";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  const handleFileUploadSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
    setUploadDialogOpen(false);
  }, []);

  const handleFolderCreation = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const name = session?.user?.name;
  const userId = session?.user?.id;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto relative">
        <div className="p-8 space-y-2">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {name?.split(" ")[0]}!
            </h1>
            <p className="text-muted-foreground">
              Manage your files and folders with ease
            </p>
          </div>

          <Card className="border-border/50 shadow-sm border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Your Files</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Browse and manage your files
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge color="secondary" variant="flat">
                    {refreshTrigger} files
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <FileList
                userId={userId as string}
                onCreateFolder={handleFolderCreation}
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
