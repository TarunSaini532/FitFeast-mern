import { Layout } from "@/components/Layout";
import { RecipeGenerator } from "@/components/RecipeGenerator";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Recipes() {
  const { user } = useAuth();

  const dietPrefLabels: any = {
    veg: "🥗 Vegetarian",
    nonveg: "🥩 Non-Vegetarian",
    vegan: "🌱 Vegan"
  };

  const dietPrefDescription: any = {
    veg: "Plant-based proteins and dairy",
    nonveg: "Includes all protein sources",
    vegan: "Completely plant-based"
  };

  return (
    <Layout>
      <div className="space-y-8 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-4xl font-display font-bold">
            Recipe Explorer
          </h1>
          <p className="text-muted-foreground mt-1">
            Discover AI-generated recipes tailored to your preferences.
          </p>
        </motion.div>

        {/* Profile Context Card */}
        {user?.dietPref && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="bg-secondary/5 border-secondary/20">
              <CardHeader>
                <CardTitle className="text-lg">Your Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-background/50 rounded-lg">
                    <p className="text-sm font-medium">{dietPrefLabels[user.dietPref]}</p>
                    <p className="text-xs text-muted-foreground">{dietPrefDescription[user.dietPref]}</p>
                  </div>
                  {user.goal && (
                    <div className="p-3 bg-background/50 rounded-lg">
                      <p className="text-sm font-medium">Goal: {user.goal === "muscleGain" ? "💪 Muscle Gain" : user.goal === "fatLoss" ? "🔥 Fat Loss" : "⚖️ Maintenance"}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.goal === "muscleGain" ? "High-protein recipes" : user.goal === "fatLoss" ? "Lower-calorie options" : "Balanced nutrition"}
                      </p>
                    </div>
                  )}
                  {user.weight && user.height && (
                    <div className="p-3 bg-background/50 rounded-lg">
                      <p className="text-sm font-medium">Your Stats</p>
                      <p className="text-xs text-muted-foreground">{user.height}cm, {user.weight}kg</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <RecipeGenerator />
        </motion.div>
      </div>
    </Layout>
  );
}
