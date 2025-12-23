import { useState, useEffect } from "react";
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
import { Loader2, Clock, X, Bell } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { initReminderService, ReminderService } from "@/services/reminderService";

export function MealReminders() {
  const [mealType, setMealType] = useState<"breakfast" | "lunch" | "dinner" | "snack">("breakfast");
  const [scheduledTime, setScheduledTime] = useState("08:00");
  const [reminderService, setReminderService] = useState<ReminderService | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Initialize reminder service on mount
  useEffect(() => {
    const service = initReminderService((mealType) => {
      toast({
        title: "Time for your meal! 🍽️",
        description: `It's time for ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}!`,
      });
    });
    setReminderService(service);

    return () => {
      service.stop();
    };
  }, [toast]);

  const { data: reminders, isLoading } = useQuery({
    queryKey: ["/api/reminders/meal"],
    queryFn: async () => {
      const res = await fetch("/api/reminders/meal", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch reminders");
      const data = await res.json();
      return data.data || [];
    },
  });

  const createReminder = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/reminders/meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ mealType, scheduledTime, enabled: true }),
      });
      if (!res.ok) throw new Error("Failed to create reminder");
      return await res.json();
    },
    onSuccess: () => {
      toast({ title: "Reminder created!", description: "You'll be reminded at the scheduled time." });
      queryClient.invalidateQueries({ queryKey: ["/api/reminders/meal"] });
      setMealType("breakfast");
      setScheduledTime("08:00");
    },
  });

  const deleteReminder = useMutation({
    mutationFn: async (reminderId: string) => {
      const res = await fetch(`/api/reminders/meal/${reminderId}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete reminder");
      return await res.json();
    },
    onSuccess: () => {
      toast({ title: "Reminder deleted" });
      queryClient.invalidateQueries({ queryKey: ["/api/reminders/meal"] });
    },
  });

  const toggleReminder = useMutation({
    mutationFn: async (reminder: any) => {
      const res = await fetch(`/api/reminders/meal/${reminder._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...reminder, enabled: !reminder.enabled }),
      });
      if (!res.ok) throw new Error("Failed to update reminder");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reminders/meal"] });
    },
  });

  // Request notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <Card className="border-secondary/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" />
            Meal Timing Reminders
          </CardTitle>
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary/10 rounded-lg">
            <Bell className="w-4 h-4 text-secondary" />
            <span className="text-xs font-medium">Notifications Active</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Create Reminder */}
        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold text-sm">Add New Reminder</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Meal Type</Label>
              <Select value={mealType} onValueChange={(v: any) => setMealType(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Time (24h format)</Label>
              <Input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={() => createReminder.mutate()}
            disabled={createReminder.isPending}
            className="w-full"
            size="sm"
          >
            {createReminder.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Reminder"
            )}
          </Button>
        </div>

        {/* Reminders List */}
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-muted rounded animate-pulse" />
            ))}
          </div>
        ) : reminders && reminders.length > 0 ? (
          <div className="space-y-2">
            {reminders.map((reminder: any) => (
              <div
                key={reminder._id}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border/50"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={reminder.enabled}
                    onChange={() => toggleReminder.mutate(reminder)}
                    className="w-4 h-4 rounded cursor-pointer"
                  />
                  <div>
                    <p className="font-semibold text-sm capitalize">{reminder.mealType}</p>
                    <p className="text-xs text-muted-foreground">{reminder.scheduledTime}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteReminder.mutate(reminder._id)}
                  className="p-1 hover:bg-destructive/10 rounded transition-colors"
                  disabled={deleteReminder.isPending}
                >
                  <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">
            No reminders yet. Add one to get started! 🔔
          </p>
        )}

        <div className="space-y-2 text-xs">
          <p className="text-muted-foreground">
            💡 Tip: Set reminders for your planned meal times to maintain consistency and build discipline!
          </p>
          <div className="bg-primary/5 border border-primary/20 rounded p-2 space-y-1">
            <p className="font-medium text-primary">🔔 How Notifications Work:</p>
            <ul className="text-muted-foreground list-disc list-inside space-y-0.5">
              <li>You'll get a browser popup notification at the scheduled time</li>
              <li>An in-app toast message will appear when you're using the app</li>
              <li>Keep the app open or in a tab to receive notifications</li>
              <li>Browser notifications require your permission (shown once)</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
