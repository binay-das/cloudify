"use client";

import { FileUp } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import FileUploadForm from "@/components/FileUploadForm";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  const handleFileUploadSuccess = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return null;
  }

  const name = session?.user?.name;
  const userId = session?.user?.id;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-default-900">Hi, {name}!</h2>
        <p className="text-default-600 mt-2 text-lg">
          Your images are waiting for you.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border border-default-200 bg-default-50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex gap-3">
            <FileUp className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold">Upload</h2>
          </CardHeader>
          <CardContent>
            <FileUploadForm
              userId={userId as string}
              onUploadSuccess={handleFileUploadSuccess}
              currentFolder={currentFolder}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
