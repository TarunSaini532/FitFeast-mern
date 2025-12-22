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
import { Loader2, Upload } from "lucide-react";
import { analyzeFormFromVideo, generateFormFeedback } from "@/utils/tfFormAnalysis";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export function FormAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [exerciseType, setExerciseType] = useState<"squat" | "pushup" | "plank">(
    "squat"
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    feedback: string[];
    keypoints: number;
  } | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: "Video selected",
        description: `${file.name} ready for analysis`,
      });
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({ title: "Error", description: "Please select a video file" });
      return;
    }

    setIsAnalyzing(true);
    try {
      const analysis = await analyzeFormFromVideo(selectedFile, exerciseType);
      setResult({
        score: analysis.score,
        feedback: analysis.feedback,
        keypoints: analysis.detectedKeypoints,
      });

      toast({
        title: "Analysis complete!",
        description: `Form score: ${analysis.score}/100`,
      });
    } catch (err) {
      toast({
        title: "Analysis failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5 text-primary" />
          Form Analyzer (TensorFlow.js)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="exercise">Exercise Type</Label>
            <Select value={exerciseType} onValueChange={(v: any) => setExerciseType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="squat">Squat</SelectItem>
                <SelectItem value="pushup">Push-up</SelectItem>
                <SelectItem value="plank">Plank</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="video">Video Upload</Label>
            <Input
              id="video"
              type="file"
              accept="video/*"
              onChange={handleFileSelect}
              disabled={isAnalyzing}
              className="cursor-pointer"
            />
          </div>
        </div>

        <Button
          onClick={handleAnalyze}
          disabled={!selectedFile || isAnalyzing}
          className="w-full h-12 text-base font-semibold"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Analyzing form...
            </>
          ) : (
            "Analyze Form"
          )}
        </Button>

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg"
          >
            <div className="flex items-baseline justify-between">
              <h3 className="font-semibold">Form Score</h3>
              <div className="text-4xl font-bold text-primary">{result.score}</div>
              <span className="text-muted-foreground">/100</span>
            </div>

            <div className="w-full bg-muted rounded-full h-3">
              <motion.div
                className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${result.score}%` }}
                transition={{ duration: 1 }}
              />
            </div>

            <p className="text-sm font-medium">
              {generateFormFeedback(result.score, exerciseType)}
            </p>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-semibold">
                Detected Keypoints: {result.keypoints}/17
              </p>
              <ul className="space-y-1 text-sm">
                {result.feedback.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary font-bold">✓</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
