import { Layout } from "@/components/Layout";
import { FormAnalyzer } from "@/components/FormAnalyzer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogWorkout, useLogDiet } from "@/hooks/use-progress";
import { Loader2, Activity, Utensils } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Tracker() {
  const [workoutExercises, setWorkoutExercises] = useState<
    Array<{ name: string; sets?: number; reps?: number; weight?: number }>
  >([]);
  const [mealName, setMealName] = useState("");
  const [mealCalories, setMealCalories] = useState("");

  const logWorkout = useLogWorkout();
  const logDiet = useLogDiet();

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
