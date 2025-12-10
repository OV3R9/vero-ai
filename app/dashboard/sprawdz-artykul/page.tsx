"use client";

import { useState } from "react";
import {
  Link,
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink,
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
import supabase from "@/lib/supabase/client";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import toast from "react-hot-toast";

type AnalysisResult = {
  isAI: boolean;
  confidence: number;
  reasoning: string;
  indicators: string[];
};

export default function ArticleChecker() {
  const [articleUrl, setArticleUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const saveFakeNews = async (analysisResult: AnalysisResult) => {
    try {
      const { error } = await supabase.from("fake_news_articles").insert({
        article_url: articleUrl,
        confidence: analysisResult.confidence,
        reasoning: analysisResult.reasoning,
      });

      if (error) {
        return false;
      }

      if (analysisResult.isAI && analysisResult.confidence >= 0.5) {
        toast.success(
          "Artykuł został oznaczony jako fałszywy i zapisany w bazie danych."
        );
      }

      return true;
    } catch (error) {
      return false;
    }
  };

  const analyzeArticle = async () => {
    if (!articleUrl) {
      alert("Wklej link do artykułu, który chcesz sprawdzić.");
      return;
    }

    if (!isValidUrl(articleUrl)) {
      alert("Upewnij się, że wklejony link jest poprawny.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "check-fake-news",
        {
          body: {
            content: articleUrl,
            isUrl: true,
          },
        }
      );

      if (error) throw new Error(error.message);
      setResult(data);

      if (data.isAI && data.confidence >= 0.5) {
        await saveFakeNews(data);
      }
    } catch (error) {
      console.error("Error analyzing article:", error);
      alert("Wystąpił błąd podczas analizy. Spróbuj ponownie.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getResultIcon = (isAI: boolean) =>
    isAI ? (
      <XCircle className="w-8 h-8 text-red-600" />
    ) : (
      <CheckCircle className="w-8 h-8 text-green-600" />
    );

  const getResultTitle = (isAI: boolean) =>
    isAI
      ? "Prawdopodobnie fałszywa informacja"
      : "Prawdopodobnie wiarygodny artykuł";

  const getResultColor = (isAI: boolean) =>
    isAI
      ? "border-red-500/50 bg-red-500/5"
      : "border-green-500/50 bg-green-500/5";

  const getResultDescription = (isAI: boolean, confidence: number) =>
    isAI
      ? `System wykrył cechy fałszywej informacji (pewność: ${confidence}%)`
      : `Artykuł wydaje się wiarygodny (pewność: ${confidence}%)`;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
          Weryfikator Wiadomości
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Sprawdź czy artykuł zawiera prawdziwe informacje czy to fake news
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Dodaj artykuł do weryfikacji</CardTitle>
          <CardDescription>Wklej link artykułu</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="space-y-4">
            <Label htmlFor="articleUrl">Link do artykułu</Label>
            <Input
              id="articleUrl"
              type="url"
              placeholder="https://example.com/artykul"
              value={articleUrl}
              onChange={(e) => {
                setArticleUrl(e.target.value);
                setResult(null);
              }}
            />

            {articleUrl && isValidUrl(articleUrl) && (
              <a
                href={articleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg"
              >
                <ExternalLink className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <span className="text-sm underline decoration-primary truncate">
                  {new URL(articleUrl).hostname}
                </span>
              </a>
            )}

            <Button
              onClick={analyzeArticle}
              disabled={isAnalyzing || !articleUrl}
              className="w-full mt-4"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analizuję artykuł...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Sprawdź wiarygodność
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className={`${getResultColor(result.isAI)} border-2`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-6">
              {getResultIcon(result.isAI)}
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-1">
                  {getResultTitle(result.isAI)}
                </h3>
                <p className="text-sm">
                  {getResultDescription(result.isAI, result.confidence)}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Wyjaśnienie:</h4>
                <div className="text-sm mb-4">
                  <Markdown remarkPlugins={[remarkGfm]}>
                    {result.reasoning}
                  </Markdown>
                </div>

                <h4 className="font-medium mb-2">Kluczowe wskaźniki:</h4>
                <ul className="space-y-2">
                  {result.indicators.map((indicator, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 bg-current rounded-full mt-2" />
                      {indicator}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border">
                <h4 className="font-medium mb-1">Zalecenie:</h4>
                <p className="text-sm">
                  {result.isAI
                    ? "Zalecamy ostrożność i weryfikację informacji w innych źródłach."
                    : "Artykuł wydaje się wiarygodny, ale warto porównać informacje z innymi źródłami."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
