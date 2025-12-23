// Reminder notification service
export class ReminderService {
  private checkInterval: NodeJS.Timeout | null = null;
  private lastCheckedDates: Set<string> = new Set();

  constructor(private onReminder: (mealType: string) => void) {}

  start() {
    // Check every minute for due reminders
    this.checkInterval = setInterval(() => {
      this.checkReminders();
    }, 60000); // Check every minute

    // Also check immediately
    this.checkReminders();
  }

  stop() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  async checkReminders() {
    try {
      const res = await fetch("/api/reminders/meal", { credentials: "include" });
      if (!res.ok) return;

      const data = await res.json();
      const reminders = data.data || [];
      const now = new Date();
      const currentTime = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
      const today = now.toDateString();

      reminders.forEach((reminder: any) => {
        if (!reminder.enabled) return;

        const reminderKey = `${today}-${reminder._id}`;

        // Check if reminder time matches and hasn't been shown today
        if (reminder.scheduledTime === currentTime && !this.lastCheckedDates.has(reminderKey)) {
          this.lastCheckedDates.add(reminderKey);
          this.showNotification(reminder.mealType);
          this.onReminder(reminder.mealType);
        }
      });
    } catch (err) {
      console.error("Error checking reminders:", err);
    }
  }

  private showNotification(mealType: string) {
    // Browser notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("FitFeast Meal Reminder", {
        body: `Time for ${mealType.charAt(0).toUpperCase() + mealType.slice(1)}! 🍽️`,
        icon: "/favicon.ico",
        tag: `meal-reminder-${mealType}`,
        requireInteraction: true,
      });
    }

    // Fallback: Request permission if not granted
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then(() => {
        this.showNotification(mealType);
      });
    }
  }
}

export function initReminderService(onReminder: (mealType: string) => void) {
  const service = new ReminderService(onReminder);
  service.start();
  return service;
}
