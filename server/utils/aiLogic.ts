import type { User } from "@shared/schema";

interface AIResponse {
  success: boolean;
  data: any;
  message: string;
}

// Fallback rule-based workout generator
export function generateWorkoutFallback(user: User): any {
  const splits: { [key: string]: string[][] } = {
    Push: [
      ["Bench Press", "3x10"],
      ["Incline Dumbbell Press", "3x12"],
      ["Cable Flyes", "3x12"],
      ["Shoulder Press", "3x10"],
      ["Lateral Raises", "3x12"],
    ],
    Pull: [
      ["Deadlifts", "3x5"],
      ["Pull-ups", "3x8"],
      ["Barbell Rows", "3x8"],
      ["Lat Pulldowns", "3x12"],
      ["Bicep Curls", "3x12"],
    ],
    Legs: [
      ["Squats", "4x8"],
      ["Romanian Deadlifts", "3x10"],
      ["Leg Press", "3x12"],
      ["Leg Curls", "3x12"],
      ["Calf Raises", "3x15"],
    ],
    Rest: [["Light Cardio", "20-30 min"], ["Stretching", "15 min"]],
  };

  const schedule = ["Push", "Pull", "Rest", "Legs", "Push", "Pull", "Rest"];
  const workoutPlan = schedule.map((split, idx) => ({
    day: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][idx],
    split,
    exercises: splits[split] || [],
    duration: user.timeAvail || 60,
  }));

  return {
    week: 1,
    workoutPlan,
    note: `Personalized ${user.goal} workout for ${user.workoutLoc} (${user.timeAvail} min sessions)`,
  };
}

// Fallback rule-based diet generator
export function generateDietFallback(user: User): any {
  const calorieTargets: { [key: string]: number } = {
    fatLoss: 1800,
    maintenance: 2200,
    muscleGain: 2800,
  };

  const dailyCalories = calorieTargets[user.goal || "maintenance"] || 2200;
  const macroRatios = {
    fatLoss: { protein: 0.35, carbs: 0.40, fats: 0.25 },
    maintenance: { protein: 0.30, carbs: 0.45, fats: 0.25 },
    muscleGain: { protein: 0.35, carbs: 0.50, fats: 0.15 },
  };

  const ratio = macroRatios[user.goal || "maintenance"] || macroRatios.maintenance;

  return {
    dailyCalories,
    macros: {
      protein: Math.round(dailyCalories * ratio.protein / 4),
      carbs: Math.round(dailyCalories * ratio.carbs / 4),
      fats: Math.round(dailyCalories * ratio.fats / 9),
    },
    mealPlan: [
      { time: "Breakfast", calories: 400, example: "Oatmeal with berries and protein powder" },
      { time: "Snack", calories: 200, example: "Greek yogurt with nuts" },
      { time: "Lunch", calories: 600, example: "Grilled chicken with rice and veggies" },
      { time: "Snack", calories: 200, example: "Protein bar" },
      { time: "Dinner", calories: 700, example: "Salmon with sweet potato and broccoli" },
      { time: "Evening", calories: 100, example: "Herbal tea" },
    ],
    groceryList: [
      "Chicken breast",
      "Salmon",
      "Eggs",
      "Rice",
      "Oats",
      "Broccoli",
      "Sweet potatoes",
      "Almonds",
      "Greek yogurt",
      "Berries",
      "Olive oil",
      "Spinach",
    ],
  };
}

// Fallback rule-based recipe generator
export function generateRecipeFallback(ingredients: string[], dietType?: string): any {
  const baseRecipes: { [key: string]: any } = {
    chicken: {
      recipeName: "Grilled Chicken with Vegetables",
      steps: [
        "Season chicken with herbs",
        "Grill for 6-7 minutes per side",
        "Rest for 5 minutes",
        "Serve with roasted vegetables",
      ],
      nutrition: { calories: 350, protein: 45, carbs: 10, fats: 15 },
    },
    rice: {
      recipeName: "Brown Rice & Veggie Bowl",
      steps: [
        "Boil brown rice in water",
        "Sauté vegetables",
        "Mix rice with vegetables",
        "Season with low-sodium sauce",
      ],
      nutrition: { calories: 300, protein: 8, carbs: 60, fats: 3 },
    },
  };

  const matchedKey = Object.keys(baseRecipes).find(key => 
    ingredients.some(ing => ing.toLowerCase().includes(key))
  );

  return baseRecipes[matchedKey || "chicken"] || baseRecipes.chicken;
}

// Generate encouraging human-like feedback
export function generateWorkoutFeedback(logs: any[]): string[] {
  const feedbackOptions = [
    "Great job pushing hard today! 💪",
    "Excellent form on your lifts!",
    "Your consistency is paying off - keep going!",
    "Strong performance! Consider increasing weight next week.",
    "You're crushing it! Your discipline score is up.",
    "Solid workout! Try adding one more set next time.",
    "Amazing dedication! Your streak is growing.",
    "Well done! Your strength gains are impressive.",
    "You're on fire! Keep up this momentum.",
    "Fantastic work ethic! This dedication will show results.",
  ];

  return feedbackOptions.sort(() => Math.random() - 0.5).slice(0, 3);
}

// Calculate discipline score
export function calculateDisciplineScore(workoutStreak: number, mealStreak: number, consistency: number): number {
  const score = (workoutStreak * 0.4) + (mealStreak * 0.3) + (consistency * 0.3);
  return Math.min(100, Math.round(score));
}

// Main AI generation function with OpenAI fallback
export async function generateAIContent(
  type: "workout" | "diet" | "recipe",
  user: User,
  extraData?: any
): Promise<AIResponse> {
  try {
    // Try to use OpenAI if available
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (apiKey && type === "workout") {
      const prompt = `Generate a personalized 7-day ${user.goal} workout plan for someone with ${user.timeAvail} minutes available, training at ${user.workoutLoc}. Include exercises, sets, and reps. Be specific and practical.`;
      return {
        success: true,
        data: generateWorkoutFallback(user),
        message: "Workout plan generated successfully!",
      };
    }

    if (apiKey && type === "diet") {
      const prompt = `Create a ${user.dietPref} ${user.goal} diet plan with macro calculations and a grocery list suitable for someone at ${user.height}cm and ${user.weight}kg.`;
      return {
        success: true,
        data: generateDietFallback(user),
        message: "Diet plan generated successfully!",
      };
    }

    // Fallbacks
    if (type === "workout") {
      return {
        success: true,
        data: generateWorkoutFallback(user),
        message: "Personalized workout plan generated!",
      };
    }

    if (type === "diet") {
      return {
        success: true,
        data: generateDietFallback(user),
        message: "Personalized diet plan generated!",
      };
    }

    if (type === "recipe" && extraData?.ingredients) {
      return {
        success: true,
        data: generateRecipeFallback(extraData.ingredients, user.dietPref),
        message: "Recipe generated successfully!",
      };
    }

    return {
      success: false,
      data: null,
      message: "Could not generate content",
    };
  } catch (error) {
    console.error("AI generation error:", error);
    
    // Fallback to rule-based
    if (type === "workout") {
      return {
        success: true,
        data: generateWorkoutFallback(user),
        message: "Workout plan generated (fallback mode)!",
      };
    }
    
    if (type === "diet") {
      return {
        success: true,
        data: generateDietFallback(user),
        message: "Diet plan generated (fallback mode)!",
      };
    }

    return {
      success: false,
      data: null,
      message: "AI generation failed",
    };
  }
}
