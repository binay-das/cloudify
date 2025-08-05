"use client";

import {
  Home,
  File,
  Star,
  FolderOpen,
  Trash2,
  Plus,
  Search,
  Settings,
  LogOut,
  Cloud,
  User,
  Mail,
  ChevronUp,
  FolderKanban,
} from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Home", icon: Home, href: "/files" },
  { label: "All Files", icon: File, href: "/files" },
  { label: "Favorites", icon: Star, href: "/favorites", badge: "12" },
  { label: "Folders", icon: FolderOpen, href: "/folders" },
  { label: "Trash", icon: Trash2, href: "/trash", badge: "3" },
];

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <aside className="h-screen w-72 shrink-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-r border-gray-200/40 dark:border-gray-700/40 flex flex-col shadow-lg">
      <div className="px-6 py-7 border-b border-gray-200/40 dark:border-gray-700/40 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30">
        <Link
          href="/"
          className="flex items-center gap-4 group transition-all duration-300 hover:scale-[1.02]"
        >
          <div className="relative">
            <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 shadow-lg group-hover:shadow-xl transition-all duration-300">
              <FolderKanban className="h-6 w-6 text-white" />
            </div>
            <div className="absolute inset-0 rounded-2xl bg-white/20 group-hover:bg-white/30 transition-all duration-300" />
          </div>
          <div>
            <h1 className="text-xl font-black bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Cloudify
            </h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Secure Cloud Storage
            </p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
        {navItems.map(({ label, icon: Icon, href, badge }) => {
          const active = pathname === href;
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                "group flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
                active
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100/60 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={cn(
                    "h-5 w-5 transition-colors",
                    active && "text-white"
                  )}
                />
                <span>{label}</span>
              </div>
              {badge && (
                <Badge
                  variant={active ? "secondary" : "outline"}
                  className={cn(
                    "px-2 py-0.5 text-xs",
                    active 
                      ? "bg-white/20 text-white border-0" 
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                  )}
                >
                  {badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="px-6 py-5 border-t border-gray-200/40 dark:border-gray-700/40">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full h-auto p-3 rounded-xl hover:bg-gray-100/60 dark:hover:bg-gray-800/60 transition-all duration-200 group"
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
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                <Link href="/profile" className="flex items-center px-3 py-2">
                  <User className="mr-3 h-4 w-4 text-blue-500" />
                  <span className="font-medium">Profile Settings</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild className="rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-200">
                <Link href="/settings" className="flex items-center px-3 py-2">
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
    </aside>
  );
}
