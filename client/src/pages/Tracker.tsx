import { Layout } from "@/components/Layout";
import { FormAnalyzer } from "@/components/FormAnalyzer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogWorkout, useLogDiet } from "@/hooks/use-progress";
import { Loader2, Activity, Utensils, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

export default function Tracker() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [workoutExercises, setWorkoutExercises] = useState<
    Array<{ name: string; sets?: number; reps?: number; weight?: number }>
  >([]);
  const [mealName, setMealName] = useState("");
  const [mealCalories, setMealCalories] = useState("");

  const logWorkout = useLogWorkout();
  const logDiet = useLogDiet();

  // Sample data for demo (in real app, fetch from API)
  const [activityLog] = useState<any>({
    [new Date().toISOString().split('T')[0]]: {
      workouts: [
        { name: "Bench Press", sets: 4, reps: 8, weight: 80 },
        { name: "Squats", sets: 4, reps: 10, weight: 120 }
      ],
      meals: [
        { name: "Breakfast", calories: 450 },
        { name: "Lunch", calories: 650 },
        { name: "Snack", calories: 200 }
      ]
    }
  });

  const changeDate = (days: number) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + days);
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const todayActivity = activityLog[selectedDate];
  const isToday = selectedDate === new Date().toISOString().split('T')[0];
  const displayDate = new Date(selectedDate).toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  const handleAddExercise = () => {
    setWorkoutExercises([
      ...workoutExercises,
      { name: "", sets: 3, reps: 10, weight: 0 },
    ]);
  };

  const handleLogWorkout = () => {
    if (workoutExercises.length === 0) return;
    logWorkout.mutate({ exercises: workoutExercises });
    setWorkoutExercises([]);
  };

  const handleLogMeal = () => {
    if (!mealName || !mealCalories) return;
    logDiet.mutate({
      meals: [{ name: mealName, calories: parseInt(mealCalories) }],
    });
    setMealName("");
    setMealCalories("");
  };

  return (
    <Layout>
      <div className="space-y-8 pb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-display font-bold">
            Track Your Progress
          </h1>
          <p className="text-muted-foreground mt-1">
            Log workouts, meals, and analyze your form in real-time.
          </p>
        </div>

        {/* Date Selector */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                {displayDate} {isToday && <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">Today</span>}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => changeDate(-1)}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}>
                  Today
                </Button>
                <Button size="sm" variant="outline" onClick={() => changeDate(1)}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
          </CardContent>
        </Card>

        {/* Activity Log for Selected Day */}
        {todayActivity && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Activities Logged</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayActivity.workouts && todayActivity.workouts.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-primary" /> Workouts
                    </h3>
                    <div className="space-y-2">
                      {todayActivity.workouts.map((w: any, i: number) => (
                        <div key={i} className="p-2 bg-background/50 rounded text-sm">
                          <p className="font-medium">{w.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {w.sets}x{w.reps} @ {w.weight}kg
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {todayActivity.meals && todayActivity.meals.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm mb-2 flex items-center gap-2">
                      <Utensils className="w-4 h-4 text-secondary" /> Meals ({todayActivity.meals.reduce((sum: number, m: any) => sum + m.calories, 0)} kcal)
                    </h3>
                    <div className="space-y-2">
                      {todayActivity.meals.map((m: any, i: number) => (
                        <div key={i} className="p-2 bg-background/50 rounded text-sm flex justify-between">
                          <span className="font-medium">{m.name}</span>
                          <span className="text-muted-foreground">{m.calories} kcal</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Workout Logger */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Log Workout
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {workoutExercises.map((ex, i) => (
                    <div key={i} className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Exercise name"
                        value={ex.name}
                        onChange={(e) => {
                          const updated = [...workoutExercises];
                          updated[i].name = e.target.value;
                          setWorkoutExercises(updated);
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Sets"
                        value={ex.sets}
                        onChange={(e) => {
                          const updated = [...workoutExercises];
                          updated[i].sets = parseInt(e.target.value);
                          setWorkoutExercises(updated);
                        }}
                      />
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleAddExercise}
                  variant="outline"
                  className="w-full"
                >
                  + Add Exercise
                </Button>

                <Button
                  onClick={handleLogWorkout}
                  disabled={workoutExercises.length === 0 || logWorkout.isPending}
                  className="w-full"
                >
                  {logWorkout.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging...
                    </>
                  ) : (
                    "Log Workout"
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Meal Logger */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-secondary" />
                  Log Meal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Meal Name</Label>
                  <Input
                    placeholder="e.g., Breakfast"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Calories</Label>
                  <Input
                    type="number"
                    placeholder="e.g., 450"
                    value={mealCalories}
                    onChange={(e) => setMealCalories(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleLogMeal}
                  disabled={!mealName || !mealCalories || logDiet.isPending}
                  className="w-full"
                >
                  {logDiet.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging...
                    </>
                  ) : (
                    "Log Meal"
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Form Analyzer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <FormAnalyzer />
        </motion.div>
      </div>
    </Layout>
  );
}
