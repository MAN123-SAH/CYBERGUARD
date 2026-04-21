import {
  LayoutDashboard, Fish, Bell, Wifi, Network, KeyRound,
  FileText, Settings, Shield, ChevronLeft,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Phishing Detection", url: "/phishing", icon: Fish },
  { title: "IDS Alerts (Snort)", url: "/ids-alerts", icon: Bell },
  { title: "Network Scanner", url: "/network-scanner", icon: Wifi },
  { title: "Packet Analyzer", url: "/packet-analyzer", icon: Network },
  { title: "Password Checker", url: "/password-checker", icon: KeyRound },
  { title: "Logs & Reports", url: "/logs", icon: FileText },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center animate-pulse-green">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-sm text-foreground font-mono tracking-wider">CYBERGUARD</span>
              <span className="text-[10px] text-muted-foreground">Security Platform</span>
            </div>
          )}
          {!collapsed && (
            <button onClick={toggleSidebar} className="ml-auto text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      activeClassName="bg-primary/10 text-primary font-medium cyber-border"
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {!collapsed && (
          <div className="cyber-card p-3 text-xs">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary font-mono text-[10px]">SYSTEM ONLINE</span>
            </div>
            <p className="text-muted-foreground">All modules active</p>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
