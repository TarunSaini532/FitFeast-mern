import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, User, LogOut, Dumbbell, Utensils, Clock } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const { logout, user } = useAuth();
  const [location] = useLocation();

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: Dumbbell, label: "Tracker", href: "/tracker" },
    { icon: Utensils, label: "Recipes", href: "/recipes" },
    { icon: LayoutDashboard, label: "Plans", href: "/plans" },
    { icon: Clock, label: "Reminders", href: "/reminders" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden border-b border-border p-4 flex justify-between items-center bg-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-green-600 flex items-center justify-center">
            <Dumbbell className="text-black w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">FitTrack</span>
        </div>
        <button 
          onClick={() => logout()}
          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card p-6 h-screen sticky top-0">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-green-600 flex items-center justify-center shadow-lg shadow-primary/20">
            <Dumbbell className="text-black w-6 h-6" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight">FitTrack</span>
        </div>

        <nav className="space-y-2 flex-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href} className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
                ${isActive 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }
              `}>
                <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : 'group-hover:text-foreground'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border pt-6">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
              {user?.email?.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Free Plan</p>
            </div>
          </div>
          <button 
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-6xl mx-auto w-full">
        {children}
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border px-6 py-3 flex justify-between items-center z-50">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1">
              <div className={`
                p-2 rounded-full transition-all
                ${isActive ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}
              `}>
                <item.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
      {/* Spacer for bottom nav on mobile */}
      <div className="h-16 md:hidden"></div>
    </div>
  );
}
