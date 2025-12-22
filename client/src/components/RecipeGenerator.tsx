import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Utensils } from "lucide-react";
import { useGenerateRecipe } from "@/hooks/use-ai";
import { motion } from "framer-motion";

export function RecipeGenerator() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [minCals, setMinCals] = useState("300");
  const [maxCals, setMaxCals] = useState("600");
  const [dietType, setDietType] = useState("nonveg");

  const generateRecipe = useGenerateRecipe();

  const addIngredient = () => {
    if (currentIngredient.trim()) {
      setIngredients([...ingredients, currentIngredient]);
      setCurrentIngredient("");
    }
  };

  const removeIngredient = (idx: number) => {
    setIngredients(ingredients.filter((_, i) => i !== idx));
  };

  const handleGenerate = () => {
    if (ingredients.length === 0) return;
    generateRecipe.mutate({
      ingredients,
      caloriesRange: { min: parseInt(minCals), max: parseInt(maxCals) },
      dietType,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Utensils className="w-5 h-5 text-secondary" />
          AI Recipe Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Add Ingredients</Label>
              <Input
                placeholder="e.g., chicken, rice"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addIngredient()}
              />
            </div>
            <Button
              onClick={addIngredient}
              variant="outline"
              size="sm"
              className="self-end"
            >
              Add
            </Button>
          </div>

          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {ingredients.map((ing, idx) => (
                <button
                  key={idx}
                  onClick={() => removeIngredient(idx)}
                  className="px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80 transition"
                >
                  {ing} ✕
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs">Min Calories</Label>
            <Input
              type="number"
              value={minCals}
              onChange={(e) => setMinCals(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Max Calories</Label>
            <Input
              type="number"
              value={maxCals}
              onChange={(e) => setMaxCals(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Diet Type</Label>
            <Select value={dietType} onValueChange={setDietType}>
              <SelectTrigger className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nonveg">Non-Veg</SelectItem>
                <SelectItem value="veg">Vegetarian</SelectItem>
                <SelectItem value="vegan">Vegan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={ingredients.length === 0 || generateRecipe.isPending}
          className="w-full h-11 text-base font-semibold"
        >
          {generateRecipe.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Recipe"
          )}
        </Button>

        {generateRecipe.data && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 p-4 bg-secondary/5 rounded-lg"
          >
            <h3 className="text-lg font-bold text-secondary">
              {generateRecipe.data.data.recipeName}
            </h3>

            <div className="grid grid-cols-4 gap-2 text-center text-sm">
              <div>
                <p className="font-semibold text-primary">
                  {generateRecipe.data.data.nutrition.calories}
                </p>
                <p className="text-xs text-muted-foreground">kcal</p>
              </div>
              <div>
                <p className="font-semibold">
                  {generateRecipe.data.data.nutrition.protein}g
                </p>
                <p className="text-xs text-muted-foreground">Protein</p>
              </div>
              <div>
                <p className="font-semibold">
                  {generateRecipe.data.data.nutrition.carbs}g
                </p>
                <p className="text-xs text-muted-foreground">Carbs</p>
              </div>
              <div>
                <p className="font-semibold">
                  {generateRecipe.data.data.nutrition.fats}g
                </p>
                <p className="text-xs text-muted-foreground">Fats</p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Steps</h4>
              <ol className="space-y-1 text-sm">
                {generateRecipe.data.data.steps.map((step, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="font-bold text-primary">{i + 1}.</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
