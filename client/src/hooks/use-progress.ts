import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export function useProgressSummary() {
  return useQuery({
    queryKey: ["/api/progress/summary"],
    queryFn: async () => {
      const res = await fetch("/api/progress/summary", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch progress");
      const data = (await res.json()) as {
        success: boolean;
        data: {
          workoutStreak: number;
          mealStreak: number;
          consistency: number;
          totalWorkouts: number;
          totalMeals: number;
        };
      };
      return data.data;
    },
  });
}

export function useGroceryList() {
  return useQuery({
    queryKey: ["/api/progress/grocery-list"],
    queryFn: async () => {
      const res = await fetch("/api/progress/grocery-list", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch grocery list");
      const data = (await res.json()) as {
        success: boolean;
        data: {
          items: string[];
          categories: Record<string, string[]>;
        };
      };
      return data.data;
    },
  });
}

export function useLogWorkout() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      exercises: Array<{
        name: string;
        sets?: number;
        reps?: number;
        weight?: number;
        duration?: number;
        caloriesBurned?: number;
      }>;
    }) => {
      const res = await fetch("/api/workouts/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to log workout");
      return await res.json();
    },
    onSuccess: () => {
      toast({ title: "Workout logged!", description: "Great job today!" });
      queryClient.invalidateQueries({ queryKey: ["/api/progress/summary"] });
      queryClient.invalidateQueries({
        queryKey: ["/api/progress/discipline-score"],
      });
    },
  });
}

export function useLogDiet() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      meals: Array<{
        name: string;
        calories?: number;
        protein?: number;
        carbs?: number;
        fats?: number;
      }>;
    }) => {
      const res = await fetch("/api/diets/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to log meal");
      return await res.json();
    },
    onSuccess: () => {
      toast({ title: "Meal logged!", description: "Keep up the nutrition!" });
      queryClient.invalidateQueries({ queryKey: ["/api/progress/summary"] });
      queryClient.invalidateQueries({
        queryKey: ["/api/progress/discipline-score"],
      });
    },
  });
}
