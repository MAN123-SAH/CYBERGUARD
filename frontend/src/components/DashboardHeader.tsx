import { Bell, Moon, Sun, Search, Shield, User } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";

interface Props {
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export function DashboardHeader({ darkMode, onToggleDarkMode }: Props) {
  const [notifications] = useState(3);

  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-card/50 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="hidden sm:flex items-center gap-2 bg-secondary rounded-lg px-3 py-1.5">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            placeholder="Search threats, logs..."
            className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-48"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 cyber-border">
          <Shield className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-mono text-primary">SECURE</span>
        </div>

        <button onClick={onToggleDarkMode} className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <button className="p-2 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell className="w-4 h-4" />
          {notifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive rounded-full text-[10px] flex items-center justify-center text-destructive-foreground font-bold">
              {notifications}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div className="hidden sm:block">
            <p className="text-xs font-medium text-foreground">Admin</p>
            <p className="text-[10px] text-muted-foreground">root@cyberguard</p>
          </div>
        </div>
      </div>
    </header>
  );
}
