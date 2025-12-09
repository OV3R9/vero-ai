"use client";

import type React from "react";

import { useState, useRef, useEffect, DragEvent } from "react";
import {
  Upload,
  ImageIcon,
  Loader2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Download,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import toast from "react-hot-toast";
import supabase from "@/lib/supabase/client";

type ResultStatus = "ai" | "real" | "uncertain" | null;

interface AnalysisResult {
  status: ResultStatus;
  confidence: number;
  explanation: string;
  indicators?: string[];
}

const ImageChecker = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Proszę wybrać plik graficzny");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Maksymalny rozmiar pliku to 10MB");
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImageUrl("");
      setResult(null);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  useEffect(() => {
    const windowPasteHandler = (event: globalThis.ClipboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      const file = event.clipboardData?.files?.[0];
      if (file && file.type.startsWith("image/")) {
        event.preventDefault();
        processFile(file);
        toast.success("Zdjęcie wklejone!");
      }
    };

    window.addEventListener("paste", windowPasteHandler);

    return () => {
      window.removeEventListener("paste", windowPasteHandler);
    };
  }, []);

  const handleUrlLoad = async () => {
    if (!imageUrl) {
      toast.error("Wprowadź URL zdjęcia");
      return;
    }

    const toastId = toast.loading("Pobieranie zdjęcia z URL...");
    try {
      let response: Response;
      try {
        response = await fetch(imageUrl);
      } catch {
        const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(
          imageUrl
        )}`;
        response = await fetch(proxyUrl);
      }

      if (!response.ok) {
        throw new Error(`Nie można pobrać zdjęcia. Status: ${response.status}`);
      }

      const blob = await response.blob();

      if (!blob.type.startsWith("image/")) {
        throw new Error("Podany URL nie prowadzi do zdjęcia");
      }

      const fileName =
        imageUrl.substring(imageUrl.lastIndexOf("/") + 1) ||
        "image-from-url.png";
      const file = new File([blob], fileName, { type: blob.type });

      processFile(file);
      toast.success("Zdjęcie załadowane z URL!", { id: toastId });
    } catch (error: any) {
      console.error("URL load error:", error);
      toast.error(error.message || "Nie można załadować zdjęcia z URL", {
        id: toastId,
      });
    }
  };

  const resetImage = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setImageUrl("");
    setResult(null);
  };

  const analyzeImage = async () => {
    if (!previewUrl) {
      toast.error("Prześlij zdjęcie lub wklej link do obrazu.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "check-ai-image",
        {
          body: {
            imageBase64: previewUrl,
          },
        }
      );

      if (error) throw error;

      let status: ResultStatus = "uncertain";
      if (data.confidence >= 70) {
        status = data.isAI ? "ai" : "real";
      }

      setResult({
        status,
        confidence: data.confidence,
        explanation: data.reasoning,
        indicators: data.indicators,
      });

      toast.success("Analiza zakończona!");
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast.error(error.message || "Błąd podczas analizy zdjęcia");
    } finally {
      setIsAnalyzing(false);
    }
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

      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        ref={fileInputRef}
      />

      {!previewUrl && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Prześlij zdjęcie</CardTitle>
            <CardDescription>
              Możesz przesłać plik lub wkleić link do zdjęcia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="file"
              className="w-full"
              onValueChange={() => setImageUrl("")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="file">Prześlij Plik</TabsTrigger>
                <TabsTrigger value="url">Wklej URL</TabsTrigger>
              </TabsList>
              <TabsContent value="file" className="pt-4">
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed p-10 transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/10"
                      : "border-border"
                  }`}
                >
                  <Upload className="w-10 h-10 text-muted-foreground" />
                  <div className="text-center space-y-2">
                    <p className="text-foreground font-medium">
                      Przeciągnij i upuść zdjęcie tutaj
                    </p>
                    <p className="text-sm text-muted-foreground">lub</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Wybierz Zdjęcie
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Możesz też wkleić (Ctrl+V) • Maks. 10MB
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="url" className="pt-4">
                <div className="space-y-4">
                  <Label htmlFor="url-input" className="block mb-2">
                    URL Zdjęcia
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="url-input"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.png"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleUrlLoad();
                        }
                      }}
                    />
                    <Button
                      onClick={handleUrlLoad}
                      disabled={isAnalyzing}
                      className="whitespace-nowrap"
                    >
                      <Download className="mr-0 h-4 w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Wczytaj</span>
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {previewUrl && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`w-full max-w-md mx-auto aspect-square overflow-hidden rounded-lg border relative transition-colors ${
                isDragging
                  ? "border-primary border-2 bg-primary/10"
                  : "border-border"
              }`}
            >
              <img
                src={previewUrl}
                alt="Podgląd"
                className="w-full h-full object-cover"
              />

              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    fileInputRef.current?.click();
                  }}
                >
                  Zmień
                </Button>
                <Button size="sm" variant="destructive" onClick={resetImage}>
                  Usuń
                </Button>
              </div>

              {isDragging && (
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center backdrop-blur-sm">
                  <div className="text-center">
                    <Upload className="h-12 w-12 mx-auto mb-2 text-primary" />
                    <p className="text-sm font-medium text-primary">
                      Upuść zdjęcie tutaj
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={analyzeImage}
              disabled={isAnalyzing || !previewUrl}
              className="w-full mt-4"
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
      )}

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
                <p className="text-foreground mb-4">{result.explanation}</p>

                {result.indicators && result.indicators.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-foreground mb-2">
                      Wykryte wskaźniki:
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {result.indicators.map((indicator, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground">
                          {indicator}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageChecker;
