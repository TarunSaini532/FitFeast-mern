import { useProgressSummary } from "@/hooks/use-progress";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProgressCharts() {
  const { data: progress, isLoading } = useProgressSummary();

  // Generate mock chart data based on progress
  const weightData = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    weight: 75 - (i * 0.1 + Math.random() * 0.5),
  }));

  const calorieData = Array.from({ length: 7 }, (_, i) => ({
    date: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
    in: 2000 + Math.random() * 500,
    out: 2200 + Math.random() * 600,
  }));

  const streakData = Array.from({ length: 5 }, (_, i) => ({
    week: `W${i + 1}`,
    workouts: progress?.totalWorkouts ? Math.ceil(progress.totalWorkouts / 5) + i : 3 + i,
    meals: progress?.totalMeals ? Math.ceil(progress.totalMeals / 5) + i : 5 + i,
  }));

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-48 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Weight Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weight Trend (30 days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--primary))"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Calorie In/Out */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Weekly Calories</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={calorieData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Bar dataKey="in" fill="hsl(var(--primary))" name="Consumed" />
              <Bar dataKey="out" fill="hsl(var(--secondary))" name="Burned" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Streak Data */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Activity Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={streakData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Area
                type="monotone"
                dataKey="workouts"
                stackId="1"
                stroke="hsl(var(--primary))"
                fill="hsl(var(--primary) / 0.5)"
                name="Workouts"
              />
              <Area
                type="monotone"
                dataKey="meals"
                stackId="1"
                stroke="hsl(var(--secondary))"
                fill="hsl(var(--secondary) / 0.5)"
                name="Meals Logged"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
