import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGenerateWorkout, useGenerateDiet } from "@/hooks/use-ai";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Dumbbell, Apple, Zap, Flame, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Plans() {
  const { user } = useAuth();
  const [workoutPlan, setWorkoutPlan] = useState<any>(null);
  const [dietPlan, setDietPlan] = useState<any>(null);

  const generateWorkout = useGenerateWorkout();
  const generateDiet = useGenerateDiet();

  // Goal-based personalization config
  const goalConfig: any = {
    muscleGain: {
      title: "💪 Muscle Gain Plan",
      subtitle: "High protein, calorie surplus focus",
      icon: Zap,
      tips: ["Focus on progressive overload", "Higher calorie intake", "Prioritize protein (0.8-1g per lb)"],
      color: "text-yellow-500",
      bg: "bg-yellow-500/10"
    },
    fatLoss: {
      title: "🔥 Fat Loss Plan",
      subtitle: "Calorie deficit with lean muscle preservation",
      icon: Flame,
      tips: ["Maintain calorie deficit", "High protein for satiety", "Increase cardio frequency"],
      color: "text-orange-500",
      bg: "bg-orange-500/10"
    },
    maintenance: {
      title: "⚖️ Maintenance Plan",
      subtitle: "Balanced nutrition and fitness",
      icon: Heart,
      tips: ["Balanced macronutrients", "Sustainable habits", "Focus on wellness"],
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    }
  };

  const currentGoal = goalConfig[user?.goal || "maintenance"];

  const handleGenerateWorkout = async () => {
    const result = await generateWorkout.mutateAsync();
    setWorkoutPlan(result.data);
  };

  const handleGenerateDiet = async () => {
    const result = await generateDiet.mutateAsync();
    setDietPlan(result.data);
  };

  return (
    <Layout>
      <div className="space-y-8 pb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold">
            Your AI Plans
          </h1>
          <p className="text-muted-foreground mt-1">
            Personalized workout and nutrition plans generated just for you.
          </p>
        </div>

        {/* Goal Context Card */}
        {user?.goal && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className={`${currentGoal.bg} border-transparent`}>
              <CardHeader>
                <CardTitle className={`${currentGoal.color} text-lg`}>
                  {currentGoal.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{currentGoal.subtitle}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {currentGoal.tips.map((tip: string, i: number) => (
                    <div key={i} className="text-xs bg-background/50 rounded p-2">
                      <span className={`${currentGoal.color} font-bold mr-1`}>✓</span>
                      {tip}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Workout Plan */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-primary" />
                Weekly Workout Split
              </CardTitle>
              <Button
                onClick={handleGenerateWorkout}
                disabled={generateWorkout.isPending}
                size="sm"
              >
                {generateWorkout.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Plan"
                )}
              </Button>
            </CardHeader>
            <CardContent>
              {workoutPlan ? (
                <div className="space-y-3">
                  {workoutPlan.workoutPlan.map((day: any, idx: number) => (
                    <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{day.day}</span>
                        <span className="text-sm text-muted-foreground bg-primary/20 px-2 py-1 rounded">
                          {day.split}
                        </span>
                      </div>
                      <div className="text-sm space-y-1">
                        {day.exercises.map((ex: string, i: number) => (
                          <div key={i} className="text-muted-foreground flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                            {ex}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Duration: {day.duration} min
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Click "Generate Plan" to create your personalized workout schedule.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Diet Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Apple className="w-5 h-5 text-secondary" />
                Nutrition Plan
              </CardTitle>
              <Button
                onClick={handleGenerateDiet}
                disabled={generateDiet.isPending}
                size="sm"
              >
                {generateDiet.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Plan"
                )}
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              {dietPlan ? (
                <>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold text-primary">
                        {dietPlan.dailyCalories}
                      </p>
                      <p className="text-xs text-muted-foreground">kcal/day</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">{dietPlan.macros.protein}g</p>
                      <p className="text-xs text-muted-foreground">Protein</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">{dietPlan.macros.carbs}g</p>
                      <p className="text-xs text-muted-foreground">Carbs</p>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <p className="text-2xl font-bold">{dietPlan.macros.fats}g</p>
                      <p className="text-xs text-muted-foreground">Fats</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold">Daily Meal Schedule</h3>
                    {dietPlan.mealPlan.map((meal: any, idx: number) => (
                      <div key={idx} className="p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold">{meal.time}</span>
                          <span className="text-sm text-muted-foreground">
                            {meal.calories} kcal
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{meal.example}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Click "Generate Plan" to create your personalized nutrition plan.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}
