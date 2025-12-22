import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginRequest } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Login() {
  const { login, isLoggingIn, user } = useAuth();
  const [, setLocation] = useLocation();

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "", // mapped to email in backend schema
      password: "",
    },
  });

  useEffect(() => {
    if (user) setLocation("/");
  }, [user, setLocation]);

  const onSubmit = (data: LoginRequest) => {
    login(data);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Left: Form */}
      <div className="flex flex-col justify-center p-8 sm:p-12 md:p-16 lg:p-24">
        <div className="w-full max-w-md mx-auto space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="font-bold text-black text-lg">F</span>
              </div>
              <span className="font-display font-bold text-xl">FitTrack</span>
            </div>
            
            <h1 className="text-4xl font-display font-bold mb-2 tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground text-lg">
              Enter your credentials to access your workout plan.
            </p>
          </motion.div>

          <motion.form 
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="space-y-2">
              <Label htmlFor="username">Email</Label>
              <Input
                id="username"
                type="email"
                placeholder="you@example.com"
                className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                {...form.register("username")}
              />
              {form.formState.errors.username && (
                <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="h-12 bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold" 
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </motion.form>

          <motion.div 
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Create account
              </Link>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right: Hero Image */}
      <div className="hidden lg:block relative bg-muted overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10" />
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] opacity-30" />
        
        {/* Fitness Gym Dark Ambience */}
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop" 
          alt="Fitness gym atmosphere" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="absolute bottom-12 left-12 z-20 max-w-md">
          <blockquote className="text-2xl font-display font-medium leading-relaxed mb-4">
            "The only bad workout is the one that didn't happen."
          </blockquote>
          <div className="flex items-center gap-4">
            <div className="h-1 w-12 bg-primary rounded-full" />
            <p className="text-muted-foreground font-medium">FitTrack Daily Motivation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
