import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface WorkoutPlan {
  week: number;
  workoutPlan: Array<{
    day: string;
    split: string;
    exercises: string[];
    duration: number;
  }>;
}

interface DietPlan {
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  mealPlan: Array<{
    time: string;
    calories: number;
    example: string;
  }>;
  groceryList: string[];
}

interface Recipe {
  recipeName: string;
  steps: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

export function useGenerateWorkout() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/ai/generate-workout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to generate workout");
      return (await res.json()) as { success: boolean; data: WorkoutPlan };
    },
    onSuccess: () => {
      toast({ title: "Workout Generated", description: "New plan created!" });
      queryClient.invalidateQueries({ queryKey: ["/api/progress/summary"] });
    },
  });
}

export function useGenerateDiet() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/ai/generate-diet", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to generate diet");
      return (await res.json()) as { success: boolean; data: DietPlan };
    },
    onSuccess: () => {
      toast({ title: "Diet Plan Generated", description: "New plan created!" });
    },
  });
}

export function useGenerateRecipe() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: {
      ingredients: string[];
      caloriesRange?: { min: number; max: number };
      dietType?: string;
    }) => {
      const res = await fetch("/api/ai/generate-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to generate recipe");
      return (await res.json()) as { success: boolean; data: Recipe };
    },
    onSuccess: () => {
      toast({ title: "Recipe Generated", description: "Check it out!" });
    },
  });
}

export function useGetDisciplineScore() {
  return useQuery({
    queryKey: ["/api/progress/discipline-score"],
    queryFn: async () => {
      const res = await fetch("/api/progress/discipline-score", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch score");
      const data = (await res.json()) as {
        success: boolean;
        data: {
          score: number;
          breakdown: {
            workoutStreak: number;
            mealStreak: number;
            consistency: number;
          };
        };
      };
      return data.data;
    },
  });
}
