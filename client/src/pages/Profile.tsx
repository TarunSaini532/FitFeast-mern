import { useAuth, useUpdateProfile } from "@/hooks/use-auth";
import { Layout } from "@/components/Layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function Profile() {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();

  const form = useForm<Partial<InsertUser>>({
    resolver: zodResolver(insertUserSchema.partial()),
    defaultValues: {
      age: user?.age || undefined,
      height: user?.height || undefined,
      weight: user?.weight || undefined,
      goal: user?.goal || undefined,
      workoutLoc: user?.workoutLoc || undefined,
      dietPref: user?.dietPref || undefined,
      timeAvail: user?.timeAvail || undefined,
    },
  });

  const onSubmit = (data: Partial<InsertUser>) => {
    updateProfile.mutate(data);
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6 pb-12">
        <div>
          <h1 className="text-3xl font-display font-bold">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Physical Attributes</CardTitle>
            <CardDescription>This helps us calculate your personalized plan.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input 
                    id="age" 
                    type="number" 
                    {...form.register("age", { valueAsNumber: true })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input 
                    id="height" 
                    type="number" 
                    {...form.register("height", { valueAsNumber: true })} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input 
                    id="weight" 
                    type="number" 
                    {...form.register("weight", { valueAsNumber: true })} 
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Preferences</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Fitness Goal</Label>
                    <Select 
                      onValueChange={(val) => form.setValue("goal", val)}
                      defaultValue={user?.goal || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fatLoss">Fat Loss</SelectItem>
                        <SelectItem value="muscleGain">Muscle Gain</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Workout Location</Label>
                     <Select 
                      onValueChange={(val) => form.setValue("workoutLoc", val)}
                      defaultValue={user?.workoutLoc || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Where do you workout?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="gym">Gym</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Diet Preference</Label>
                    <Select 
                      onValueChange={(val) => form.setValue("dietPref", val)}
                      defaultValue={user?.dietPref || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Dietary restrictions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nonveg">No Restrictions</SelectItem>
                        <SelectItem value="veg">Vegetarian</SelectItem>
                        <SelectItem value="vegan">Vegan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Time Available (mins/day)</Label>
                    <Select 
                      onValueChange={(val) => form.setValue("timeAvail", parseInt(val))}
                      defaultValue={user?.timeAvail?.toString() || ""}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Time commitment" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="20">20 minutes</SelectItem>
                        <SelectItem value="40">40 minutes</SelectItem>
                        <SelectItem value="60">60 minutes</SelectItem>
                        <SelectItem value="90">90+ minutes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={updateProfile.isPending}
                  className="w-full md:w-auto min-w-[120px]"
                >
                  {updateProfile.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
