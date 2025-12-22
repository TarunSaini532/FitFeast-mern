import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      {/* Protected Routes */}
      <ProtectedRoute path="/" component={Home} />
      <ProtectedRoute path="/profile" component={Profile} />

      {/* Placeholders for future routes, redirect to home for now */}
      <ProtectedRoute path="/workouts" component={Home} />
      <ProtectedRoute path="/nutrition" component={Home} />

      {/* Fallback */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
