"use client";

import {
  Inbox,
  Star,
  Trash2,
  File,
  Settings,
  Home,
  FolderOpen,
  User,
  LogOut,
  Plus,
  Search
} from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", icon: Home, href: "/files", badge: null },
  { label: "All Files", icon: File, href: "/files", badge: null },
  { label: "Favorites", icon: Star, href: "/favorites", badge: "12" },
  { label: "Folders", icon: FolderOpen, href: "/folders", badge: null },
  { label: "Trash", icon: Trash2, href: "/trash", badge: "3" }
];

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  return (
    <aside className="h-screen w-64 border-r bg-card flex flex-col">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <File className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Cloudify</h1>
            <p className="text-xs text-muted-foreground">Secure Cloud Storage</p>
          </div>
        </Link>
      </div>

      <div className="p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {session?.user?.name || "Guest User"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {session?.user?.email || "guest@example.com"}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ label, icon: Icon, href, badge }) => (
          <Link
            key={label}
            href={href}
            className={cn(
              "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
              pathname === href 
                ? "bg-primary text-primary-foreground" 
                : "text-muted-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </div>
            {badge && (
              <Badge color="secondary" variant="flat" size="sm">
                {badge}
              </Badge>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t space-y-2">
        <Button className="w-full gap-2" size="sm">
          <Plus className="h-4 w-4" />
          New Upload
        </Button>
        <Button variant="outline" className="w-full gap-2" size="sm">
          <Search className="h-4 w-4" />
          Search Files
        </Button>
      </div>

      <div className="p-4 border-t">
        <div className="space-y-2">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-sm text-muted-foreground hover:text-destructive"
            size="sm"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
