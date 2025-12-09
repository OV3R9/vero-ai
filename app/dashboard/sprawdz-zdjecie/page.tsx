"use client";

import type React from "react";

import { useState, useRef } from "react";
import {
  Upload,
  ImageIcon,
  Loader2,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

type ResultStatus = "ai" | "real" | "uncertain" | null;

interface AnalysisResult {
  status: ResultStatus;
  confidence: number;
  explanation: string;
}

const ImageChecker = () => {
  const [imageUrl, setImageUrl] = useState("");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Plik za duży. Maksymalny rozmiar pliku to 10MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string);
        setImageUrl("");
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    setUploadedImage(null);
    setResult(null);
  };

  const analyzeImage = async () => {
    if (!uploadedImage && !imageUrl) {
      toast.error("Prześlij zdjęcie lub wklej link do obrazu.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    // Simulate API call - replace with actual AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Mock result - in production this would come from an AI API
    const mockResults: AnalysisResult[] = [
      {
        status: "ai",
        confidence: 87,
        explanation:
          "Wykryto charakterystyczne artefakty generowane przez AI, w tym nienaturalne tekstury i niespójności w oświetleniu.",
      },
      {
        status: "real",
        confidence: 92,
        explanation:
          "Zdjęcie wydaje się być autentyczne. Nie wykryto typowych oznak generowania przez AI.",
      },
      {
        status: "uncertain",
        confidence: 54,
        explanation:
          "Nie można jednoznacznie określić pochodzenia zdjęcia. Niektóre elementy sugerują możliwą edycję.",
      },
    ];

    setResult(mockResults[Math.floor(Math.random() * mockResults.length)]);
    setIsAnalyzing(false);
  };

  const getResultIcon = (status: ResultStatus) => {
    switch (status) {
      case "ai":
        return <XCircle className="w-8 h-8 text-destructive" />;
      case "real":
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case "uncertain":
        return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getResultTitle = (status: ResultStatus) => {
    switch (status) {
      case "ai":
        return "Prawdopodobnie wygenerowane przez AI";
      case "real":
        return "Prawdopodobnie autentyczne zdjęcie";
      case "uncertain":
        return "Wynik niepewny";
      default:
        return "";
    }
  };

  const getResultColor = (status: ResultStatus) => {
    switch (status) {
      case "ai":
        return "border-destructive/50 bg-destructive/5";
      case "real":
        return "border-green-500/50 bg-green-500/5";
      case "uncertain":
        return "border-yellow-500/50 bg-yellow-500/5";
      default:
        return "";
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Wykrywacz AI Zdjęć
        </h1>
        <p className="text-muted-foreground">
          Sprawdź czy zdjęcie zostało wygenerowane przez sztuczną inteligencję
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Prześlij zdjęcie</CardTitle>
          <CardDescription>
            Możesz przesłać plik lub wkleić link do zdjęcia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
            >
              {uploadedImage ? (
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Przesłane zdjęcie"
                  className="max-h-64 mx-auto rounded-lg"
                />
              ) : (
                <div className="space-y-2">
                  <Upload className="w-10 h-10 text-muted-foreground mx-auto" />
                  <p className="text-foreground font-medium">
                    Kliknij aby przesłać zdjęcie
                  </p>
                  <p className="text-sm text-muted-foreground">
                    lub przeciągnij i upuść plik tutaj
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Maks. 10MB • JPG, PNG, WEBP
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-sm text-muted-foreground">lub</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">Link do zdjęcia</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => handleUrlChange(e.target.value)}
            />
          </div>

          {imageUrl && (
            <div className="rounded-xl overflow-hidden bg-muted p-4">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="Podgląd zdjęcia"
                className="max-h-64 mx-auto rounded-lg"
                onError={() => {
                  toast.error("Błąd ładowania zdjęcia. Sprawdź link.");
                  setImageUrl("");
                }}
              />
            </div>
          )}

          <Button
            onClick={analyzeImage}
            disabled={isAnalyzing || (!uploadedImage && !imageUrl)}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analizuję zdjęcie...
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5 mr-2" />
                Sprawdź zdjęcie
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className={`${getResultColor(result.status)} border-2`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              {getResultIcon(result.status)}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {getResultTitle(result.status)}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Pewność analizy: {result.confidence}%
                </p>
                <p className="text-foreground">{result.explanation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageChecker;
