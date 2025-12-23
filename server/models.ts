import mongoose from "mongoose";

// User Model
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: Number,
    gender: String,
    height: Number,
    weight: Number,
    goal: String,
    dietPref: String,
    workoutLoc: String,
    timeAvail: Number,
    disciplineScore: { type: Number, default: 0 },
    streak: {
      workouts: { type: Number, default: 0 },
      meals: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Meal Reminder Model
const mealReminderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mealType: { type: String, enum: ["breakfast", "lunch", "dinner", "snack"], required: true },
    scheduledTime: { type: String, required: true }, // HH:mm format
    enabled: { type: Boolean, default: true },
    notificationSent: { type: Boolean, default: false },
    lastNotificationDate: Date,
  },
  { timestamps: true }
);

// Workout Log Model
const workoutLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    details: [
      {
        name: String,
        sets: Number,
        reps: Number,
        weight: Number,
        duration: Number,
        caloriesBurned: Number,
      },
    ],
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Diet Log Model
const dietLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    mealDetails: [
      {
        name: String,
        calories: Number,
        protein: Number,
        carbs: Number,
        fats: Number,
      },
    ],
    calories: Number,
  },
  { timestamps: true }
);

// Plan Model
const planSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    weekStartDate: { type: Date, required: true },
    workoutPlan: mongoose.Schema.Types.Mixed,
    dietPlan: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
export const MealReminder = mongoose.model("MealReminder", mealReminderSchema);
export const WorkoutLog = mongoose.model("WorkoutLog", workoutLogSchema);
export const DietLog = mongoose.model("DietLog", dietLogSchema);
export const Plan = mongoose.model("Plan", planSchema);
