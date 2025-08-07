"use client";

import { Sparkles} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileList from "@/components/FileList";
// import Sidebar from "@/components/layout/Sidebar";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // const [refreshTrigger, setRefreshTrigger] = useState(0);
  // const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  // const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // const handleFileUploadSuccess = useCallback(() => {
  //   setRefreshTrigger((prev) => prev + 1);
  //   setUploadDialogOpen(false);
  // }, []);

  // const handleFolderCreation = useCallback(() => {
  //   setRefreshTrigger((prev) => prev + 1);
  // }, []);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
          <svg
            className="absolute inset-0 w-full h-full opacity-20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M60 0H0V60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-gray-300 dark:text-gray-700"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>

          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex items-center justify-center h-screen">
          <div className="flex flex-col items-center gap-6 p-8 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-gray-200/40 dark:border-gray-700/40 shadow-2xl">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-transparent border-t-blue-500 border-r-purple-500"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                Loading your workspace
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Preparing your files...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const name = session?.user?.name;
  const userId = session?.user?.id;

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50/50 via-white to-gray-100/50 dark:from-gray-950/50 dark:via-gray-900 dark:to-gray-950/50">
      <main className="flex-1 overflow-auto relative">
        <section className="relative z-10 p-4 space-y-8">
          <Card className="border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 shadow-lg">
                  <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white">
                    Welcome back, {name?.split(" ")[0]}!
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-300">
                    Manage your files and folders with ease and security
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <FileList
                userId={userId as string}
                // onCreateFolder={handleFolderCreation}
              />
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}
