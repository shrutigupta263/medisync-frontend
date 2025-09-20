import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  Upload,
  Users,
  Heart,
  Stethoscope,
  User,
  Zap
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserDisplayName, getUserInitials } from "@/lib/user-utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Family Profiles", url: "/family", icon: Users },
];


export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const { user } = useAuth();

  const isActive = (path: string) => currentPath === path;
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary/10 text-primary border-r-2 border-primary font-medium" 
      : "text-muted-foreground hover:bg-muted hover:text-foreground";

  return (
    <Sidebar className={state === "collapsed" ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card border-r">
        {/* Logo Section */}
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-primary-foreground" />
            </div>
            {state === "expanded" && (
              <span className="font-bold text-lg text-primary">MediSync</span>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup className="p-4">
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
            {state === "expanded" && "Main Menu"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="w-full">
                    <NavLink to={item.url} end className={getNavClass}>
                      <item.icon className="h-4 w-4" />
                      {state === "expanded" && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        {/* User Profile Section */}
        {state === "expanded" && (
          <div className="p-4 border-t mt-auto">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {getUserInitials(user)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">{getUserDisplayName(user)}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {user?.email || 'No email'}
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}