import { Search, Bell, User, Settings, CreditCard, Languages, LogOut, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function TopBar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleMenuClick = (action: string) => {
    setDropdownOpen(false); // Close dropdown when navigating
    switch (action) {
      case 'profile':
        // Navigate to settings page (profile section)
        navigate('/settings');
        break;
      case 'subscription':
        // Navigate to settings page (subscription section)
        navigate('/settings');
        break;
      case 'settings':
        navigate('/settings');
        break;
      case 'language':
        // Navigate to settings page (language section)
        navigate('/settings');
        break;
      case 'logout':
        // Handle logout - clear any stored auth data and redirect to login
        localStorage.removeItem('authToken');
        sessionStorage.clear();
        navigate('/login');
        break;
      default:
        break;
    }
  };

  return (
    <header className="h-16 border-b bg-card px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
        <div className="hidden md:block text-sm text-muted-foreground">
          Welcome back to your health dashboard
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search reports, family..."
            className="pl-10 w-64 bg-muted/50 border-muted focus:bg-background"
          />
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full text-xs text-primary-foreground flex items-center justify-center">
            2
          </span>
        </Button>

        {/* User Menu */}
        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  JD
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 p-0" align="end" forceMount>
            {/* Header */}
            <div className="px-6 py-4 border-b bg-card">
              <h3 className="text-lg font-semibold text-foreground">My Account</h3>
            </div>
            
            {/* Menu Items */}
            <div className="py-2">
              <DropdownMenuItem 
                className="px-6 py-3 cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
                onClick={() => handleMenuClick('profile')}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Profile</span>
                  </div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                className="px-6 py-3 cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
                onClick={() => handleMenuClick('subscription')}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Subscription</span>
                  </div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                className="px-6 py-3 cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
                onClick={() => handleMenuClick('settings')}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Settings</span>
                  </div>
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuItem 
                className="px-6 py-3 cursor-pointer hover:bg-muted/50 focus:bg-muted/50"
                onClick={() => handleMenuClick('language')}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <Languages className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm font-medium">Language</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </DropdownMenuItem>
              
              <DropdownMenuSeparator className="my-2" />
              
              <DropdownMenuItem 
                className="px-6 py-3 cursor-pointer hover:bg-muted/50 focus:bg-muted/50 text-red-600 focus:text-red-600"
                onClick={() => handleMenuClick('logout')}
              >
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5" />
                  <span className="text-sm font-medium">Logout</span>
                </div>
              </DropdownMenuItem>
            </div>
            
            {/* User Info Section */}
            <div className="px-6 py-4 border-t bg-muted/30">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-medium">
                    JD
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-foreground">John Doe</div>
                  <div className="text-xs text-muted-foreground truncate">john@example.com</div>
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}