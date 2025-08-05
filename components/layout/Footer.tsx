"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FolderKanban,
  Send,
  Heart,
  Sparkles,
  Shield,
  Zap,
  Github,
  ExternalLink,
  Star,
  Code,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Subscription failed.");
        return;
      }

      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-t border-gray-200/30 dark:border-gray-800/30">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-white/50 to-purple-50/30 dark:from-blue-950/10 dark:via-gray-950/50 dark:to-purple-950/10"></div>

      <div className="relative border-b border-gray-200/30 dark:border-gray-800/30">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-blue-500" />
              <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                Stay Updated
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Get notifications about new features and improvements to this
              open-source project.
            </p>

            <form
              onSubmit={handleNewsletterSubmit}
              className="flex gap-3 max-w-md mx-auto"
            >
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-full border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isSubscribed || isLoading}
                className="rounded-full px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : isSubscribed ? (
                  <>
                    <Heart className="w-4 h-4 mr-2 fill-current animate-pulse" />
                    Subscribed!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Subscribe
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="relative ">
        <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3 group">
              <div className="relative p-2 rounded-2xl bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
                <FolderKanban className="h-8 w-8 text-white" />
                <div className="absolute inset-0 rounded-2xl bg-white/20 group-hover:bg-white/30 transition-all duration-300"></div>
              </div>
              <div>
                <h2 className="text-2xl font-black bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent">
                  Cloudify
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Open Source Cloud Storage
                </p>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              A modern cloud storage solution built with Next.js, featuring
              secure file uploads, organization tools, and a beautiful UI.
            </p>

            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Secure Storage
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Fast Upload
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Code className="w-3 h-3" />
                Open Source
              </Badge>
            </div>

            <div className="pt-4">
              <Link
                href="https://github.com/binay-das"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-100 dark:to-gray-200 text-white dark:text-gray-900 hover:from-gray-800 hover:to-gray-700 dark:hover:from-gray-200 dark:hover:to-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Github className="w-6 h-6" />
                <div>
                  <p className="font-semibold">Visit My GitHub</p>
                  <p className="text-xs opacity-80">
                    Check out my other projects
                  </p>
                </div>
                <ExternalLink className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Github className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              Project
            </h3>

            <div className="p-4 rounded-2xl bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 space-y-3">
              <Link
                href="https://github.com/binay-das/cloudify"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
                    <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      Star on GitHub
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      GitHub
                    </p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="relative border-t border-gray-200/30 dark:border-gray-800/30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              © {currentYear} Cloudify
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4  text-red-500 fill-current animate-pulse" />

              <span>by</span>
              <Link
                href="https://github.com/binay-das"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <Github className="w-4 h-4" />
                <span className="font-medium">@binay-das</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
