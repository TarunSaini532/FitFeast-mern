import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterRequest } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Register() {
  const { register, isRegistering, user } = useAuth();
  const [, setLocation] = useLocation();

  const form = useForm<RegisterRequest>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      age: undefined, // Let the backend handle defaults or let users fill profile later
    },
  });

  useEffect(() => {
    if (user) setLocation("/");
  }, [user, setLocation]);

  const onSubmit = (data: RegisterRequest) => {
    register(data);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
      {/* Right: Hero Image (Swapped for Register) */}
      <div className="hidden lg:block relative bg-muted overflow-hidden order-2 lg:order-1">
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-secondary/10 mix-blend-overlay z-10" />
        
        {/* Man running outdoors sunset */}
        <img 
          src="https://pixabay.com/get/g07a1bb45d1a0948eec47c99a5bf4552087a2a32dbbc1faefd135b8c2a90ec5ae27efabf9d6ffc909ed0d80bfb18e08b4_1280.jpg" 
          alt="Runner outdoors" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        <div className="absolute bottom-12 left-12 z-20 max-w-md">
          <h2 className="text-4xl font-display font-bold mb-4">Start your journey today.</h2>
          <p className="text-xl text-muted-foreground">Join thousands of others achieving their fitness goals with AI-powered plans.</p>
        </div>
      </div>

      {/* Left: Form */}
      <div className="flex flex-col justify-center p-8 sm:p-12 md:p-16 lg:p-24 order-1 lg:order-2">
        <div className="w-full max-w-md mx-auto space-y-8">
           <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                <span className="font-bold text-black text-lg">F</span>
              </div>
              <span className="font-display font-bold text-xl">FitTrack</span>
            </div>
            
            <h1 className="text-4xl font-display font-bold mb-2 tracking-tight">Create Account</h1>
            <p className="text-muted-foreground text-lg">
              Get started with a personalized plan.
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
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="h-12 bg-muted/50 border-transparent focus:border-secondary focus:bg-background transition-all"
                {...form.register("email")}
                // Sync username with email for simple auth
                onChange={(e) => {
                  form.setValue("email", e.target.value);
                  form.setValue("username", e.target.value);
                }}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                className="h-12 bg-muted/50 border-transparent focus:border-secondary focus:bg-background transition-all"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>
              )}
            </div>
            
            {/* Hidden username field since we use email as username */}
            <input type="hidden" {...form.register("username")} />

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                <Label htmlFor="age">Age (Optional)</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  className="h-12 bg-muted/50 border-transparent focus:border-secondary focus:bg-background transition-all"
                  {...form.register("age", { valueAsNumber: true })}
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="gender">Gender (Optional)</Label>
                <select
                  id="gender"
                  className="w-full h-12 px-3 rounded-xl bg-muted/50 border border-transparent focus:border-secondary focus:bg-background focus:outline-none transition-all text-sm"
                  {...form.register("gender")}
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground" 
              disabled={isRegistering}
            >
              {isRegistering ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Get Started
                  <CheckCircle2 className="ml-2 h-5 w-5" />
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
              Already have an account?{" "}
              <Link href="/login" className="text-secondary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
