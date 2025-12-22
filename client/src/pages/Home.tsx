import { useAuth } from "@/hooks/use-auth";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressCharts } from "@/components/ProgressCharts";
import { StreakTracker } from "@/components/StreakTracker";
import { GroceryList } from "@/components/GroceryList";
import { 
  Trophy, Flame, Calendar, Activity, 
  ArrowRight, Plus, Dumbbell, PlayCircle, TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Home() {
  const { user } = useAuth();
  
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
          <Link href="/tracker">
            <Button className="md:w-auto w-full gap-2 shadow-lg shadow-primary/25">
              <Plus className="w-4 h-4" /> Log Activity
            </Button>
          </Link>
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

        {/* Streak Tracker */}
        <StreakTracker />

        {/* Progress Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold">Your Progress</h2>
          </div>
          <ProgressCharts />
        </motion.div>

        {/* Grocery List & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GroceryList />
          </div>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/tracker">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                  <Activity className="w-4 h-4 mr-2" /> Track Workout
                </Button>
              </Link>
              <Link href="/plans">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                  <Dumbbell className="w-4 h-4 mr-2" /> View Plans
                </Button>
              </Link>
              <Link href="/recipes">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground">
                  <Calendar className="w-4 h-4 mr-2" /> Find Recipes
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
