import { useGetDisciplineScore } from "@/hooks/use-ai";
import { Card, CardContent } from "@/components/ui/card";
import { Flame, Trophy } from "lucide-react";
import { motion } from "framer-motion";

export function StreakTracker() {
  const { data: scoreData, isLoading } = useGetDisciplineScore();

  if (isLoading || !scoreData) return null;

  const score = scoreData.score;
  const isOnFire = score >= 75;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Discipline Score</p>
              <div className="text-4xl font-bold mt-2">{score}</div>
              <p className="text-xs text-muted-foreground mt-1">/100</p>
            </div>
            <Trophy className="w-12 h-12 text-primary opacity-20" />
          </div>
          <div className="mt-4 w-full bg-muted rounded-full h-2">
            <motion.div
              className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary"
              initial={{ width: 0 }}
              animate={{ width: `${score}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </CardContent>
      </Card>

      <Card
        className={`border-2 transition ${
          isOnFire
            ? "bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30"
            : "bg-muted/30 border-muted"
        }`}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground font-medium">Current Streak</p>
              <div className="text-3xl font-bold mt-2 flex items-baseline gap-1">
                {Math.max(
                  scoreData.breakdown.workoutStreak,
                  scoreData.breakdown.mealStreak
                )}{" "}
                <span className="text-sm text-muted-foreground">days</span>
              </div>
            </div>
            {isOnFire && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
              >
                <Flame className="w-12 h-12 text-orange-500" />
              </motion.div>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            {isOnFire
              ? "Keep crushing it! You're on fire! 🔥"
              : "Build consistency for higher scores"}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
