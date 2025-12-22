// Basal Metabolic Rate using Mifflin-St Jeor equation
export function calculateBMR(age: number, gender: string, height: number, weight: number): number {
  if (gender.toLowerCase() === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

// Total Daily Energy Expenditure
export function calculateTDEE(bmr: number, activityLevel: number = 1.5): number {
  return Math.round(bmr * activityLevel);
}

// Macro calculations for different goals
export function calculateMacros(
  tdee: number,
  goal: string
): { protein: number; carbs: number; fats: number } {
  let proteinRatio = 0.3;
  let carbRatio = 0.45;
  let fatRatio = 0.25;

  if (goal === "muscleGain") {
    proteinRatio = 0.35;
    carbRatio = 0.50;
    fatRatio = 0.15;
  } else if (goal === "fatLoss") {
    proteinRatio = 0.35;
    carbRatio = 0.40;
    fatRatio = 0.25;
  }

  return {
    protein: Math.round((tdee * proteinRatio) / 4), // 4 cal/g
    carbs: Math.round((tdee * carbRatio) / 4), // 4 cal/g
    fats: Math.round((tdee * fatRatio) / 9), // 9 cal/g
  };
}

// Calorie burn estimation for exercises
export function estimateCaloriesBurned(
  exercise: string,
  duration: number,
  weight: number
): number {
  const mets: { [key: string]: number } = {
    running: 9.8,
    walking: 3.5,
    cycling: 7.5,
    swimming: 8.0,
    weightlifting: 6.0,
    hiit: 12.0,
    yoga: 2.5,
    stretching: 2.3,
    cardio: 5.5,
  };

  const exercise_lower = exercise.toLowerCase();
  const met = mets[exercise_lower] || 5.0; // Default MET value

  // Calories = (MET × weight in kg × duration in hours)
  return Math.round(met * (weight / 2.2) * (duration / 60));
}

// Macro breakdown from meal
export function parseMacrosFromCalories(calories: number): { protein: number; carbs: number; fats: number } {
  return {
    protein: Math.round(calories * 0.25 / 4),
    carbs: Math.round(calories * 0.50 / 4),
    fats: Math.round(calories * 0.25 / 9),
  };
}
