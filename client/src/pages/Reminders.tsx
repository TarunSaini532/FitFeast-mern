import { Layout } from "@/components/Layout";
import { MealReminders } from "@/components/MealReminders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, AlertCircle } from "lucide-react";

export default function Reminders() {
  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6 pb-12">
        <div>
          <h1 className="text-3xl font-display font-bold flex items-center gap-2">
            <Clock className="w-8 h-8 text-primary" />
            Meal Timing Reminders
          </h1>
          <p className="text-muted-foreground mt-2">Stay on track with your nutrition schedule</p>
        </div>

        {/* Info Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              How Reminders Work
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <strong>Set Your Schedule:</strong> Choose the meal type and time you want to be reminded.
            </p>
            <p>
              <strong>Stay Consistent:</strong> Regular meal timing helps regulate metabolism and builds discipline.
            </p>
            <p>
              <strong>Enable/Disable:</strong> Toggle reminders on or off based on your daily needs.
            </p>
            <p className="text-xs text-muted-foreground pt-2">
              💡 Pro tip: Set reminders 30 minutes before your planned meal time to prepare in advance!
            </p>
          </CardContent>
        </Card>

        {/* Meal Reminders Component */}
        <MealReminders />

        {/* Benefits Card */}
        <Card>
          <CardHeader>
            <CardTitle>Benefits of Meal Reminders</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Maintains consistent meal timing for better metabolism</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Helps build discipline and track your nutrition goals</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Prevents skipping meals and maintains energy levels</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary font-bold">✓</span>
                <span>Supports your fitness goals (muscle gain, fat loss, etc.)</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
