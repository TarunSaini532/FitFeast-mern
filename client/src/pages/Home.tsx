import { useAuth } from "@/hooks/use-auth";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Trophy, Flame, Calendar, Activity, 
  ArrowRight, Plus, Dumbbell, PlayCircle 
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { user } = useAuth();
  
  // Dummy data for visuals until we have backend data
  const stats = [
    { label: "Workouts", value: "12", icon: Dumbbell, color: "text-primary" },
    { label: "Calories", value: "8,400", icon: Flame, color: "text-secondary" },
    { label: "Streak", value: "5 days", icon: Trophy, color: "text-yellow-500" },
    { label: "Active Time", value: "4.5h", icon: Activity, color: "text-blue-500" },
  ];

  return (
    <Layout>
      <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold">
              Hello, <span className="text-primary">{user?.email?.split('@')[0]}</span>
            </h1>
            <p className="text-muted-foreground mt-1">Ready to crush your goals today?</p>
          </div>
          <Button className="md:w-auto w-full gap-2 shadow-lg shadow-primary/25">
            <Plus className="w-4 h-4" /> Log Workout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="hover:border-primary/50 transition-colors duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">Week</span>
                  </div>
                  <div className="text-2xl font-bold font-display">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Today's Plan */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> Today's Schedule
            </h2>
            
            {/* Workout Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="overflow-hidden border-primary/20">
                <div className="h-32 bg-muted relative">
                  {/* Gym weights background */}
                  <img 
                    src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1470&auto=format&fit=crop" 
                    alt="Gym Weights" 
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <span className="px-2 py-1 bg-primary text-black text-xs font-bold rounded mb-2 inline-block">Upper Body</span>
                    <h3 className="text-2xl font-display font-bold">Push Day Strength</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center font-bold text-muted-foreground">1</div>
                        <div>
                          <p className="font-semibold">Bench Press</p>
                          <p className="text-xs text-muted-foreground">4 sets × 8-10 reps</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <PlayCircle className="w-5 h-5" />
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center font-bold text-muted-foreground">2</div>
                        <div>
                          <p className="font-semibold">Overhead Press</p>
                          <p className="text-xs text-muted-foreground">3 sets × 10-12 reps</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <PlayCircle className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center font-bold text-muted-foreground">3</div>
                        <div>
                          <p className="font-semibold">Incline Dumbbell Press</p>
                          <p className="text-xs text-muted-foreground">3 sets × 12 reps</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <PlayCircle className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="w-full h-12 text-base font-semibold">Start Workout</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-6">
            {/* Diet Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nutrition Goal</CardTitle>
                <CardDescription>Daily target: 2400 kcal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-40 h-40 mx-auto mb-6">
                  {/* Simple Circular Progress using SVG */}
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      className="text-muted" 
                    />
                    <circle 
                      cx="50" cy="50" r="45" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="8" 
                      strokeDasharray="283"
                      strokeDashoffset="70" // 75% filled approx
                      className="text-secondary" 
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold font-display">1650</span>
                    <span className="text-xs text-muted-foreground">Consumed</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Protein</span>
                    <span className="font-semibold">140g / 180g</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }} />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Carbs</span>
                    <span className="font-semibold">180g / 220g</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: "80%" }} />
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Fats</span>
                    <span className="font-semibold">45g / 65g</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "65%" }} />
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-6">Log Meal</Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                    <Activity className="w-4 h-4 mr-2" /> Update Body Stats
                  </Button>
                  <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                    <Calendar className="w-4 h-4 mr-2" /> Change Schedule
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
