import { Home, Inbox, Settings, LogOut, Loader2 } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "./ui/button";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#home",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#inbox",
    icon: Inbox,
  },
];
const footerItems = [
  {
    title: "Settings",
    url: "#settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { logout, isAuthenticated } = useAuth();
  const [isLoading, setIsloading] = useState(false);
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarFooter>
          <SidebarMenu>
            {footerItems.map((footerItem) => (
              <SidebarMenuItem key={footerItem.title}>
                <SidebarMenuButton asChild>
                  <a href={footerItem.url}>
                    <footerItem.icon />
                    <span>{footerItem.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <SidebarMenu>
            {isAuthenticated && (
              <SidebarMenuButton asChild>
                <Button
                  className="w-full gap-2"
                  onClick={() => {
                    setIsloading(true);
                    setTimeout(() => {
                      logout();
                      setIsloading(false);
                    }, 200);
                  }}
                  disabled={isLoading}
                >
                  <LogOut />
                  {isLoading ? (
                    <Loader2 className="animate-spin w-4 h-4" />
                  ) : (
                    "Sign out"
                  )}
                </Button>
              </SidebarMenuButton>
            )}
          </SidebarMenu>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}
