"use client";

import { useState } from "react";
import {
  Link,
  Loader2,
  CheckCircle,
  XCircle,
  ExternalLink,
  FileText,
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
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import supabase from "@/lib/supabase/client";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ArticleChecker() {
  const [articleUrl, setArticleUrl] = useState("");
  const [articleContent, setArticleContent] = useState("");
  const [activeTab, setActiveTab] = useState("url");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{
    isAI: boolean;
    confidence: number;
    reasoning: string;
    indicators: string[];
  } | null>(null);

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const analyzeArticle = async () => {
    let contentToAnalyze = "";

    if (activeTab === "url") {
      if (!articleUrl) {
        alert("Wklej link do artykułu, który chcesz sprawdzić.");
        return;
      }

      if (!isValidUrl(articleUrl)) {
        alert("Upewnij się, że wklejony link jest poprawny.");
        return;
      }
      contentToAnalyze = articleUrl; // Send URL directly
    } else {
      if (!articleContent || articleContent.trim().length < 50) {
        alert("Wklej treść artykułu (minimum 50 znaków).");
        return;
      }
      contentToAnalyze = articleContent;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "check-fake-news",
        {
          body: {
            content: contentToAnalyze,
            isUrl: activeTab === "url",
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      setResult(data);
    } catch (error) {
      console.error("Error analyzing article:", error);
      alert("Wystąpił błąd podczas analizy. Spróbuj ponownie.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getResultIcon = (isAI: boolean) => {
    if (isAI) {
      return <XCircle className="w-8 h-8 text-red-600" />;
    } else {
      return <CheckCircle className="w-8 h-8 text-green-600" />;
    }
  };

  const getResultTitle = (isAI: boolean) => {
    if (isAI) {
      return "Prawdopodobnie fałszywa informacja";
    } else {
      return "Prawdopodobnie wiarygodny artykuł";
    }
  };

  const getResultColor = (isAI: boolean) => {
    if (isAI) {
      return "border-red-500/50 bg-red-500/5";
    } else {
      return "border-green-500/50 bg-green-500/5";
    }
  };

  const getResultDescription = (isAI: boolean, confidence: number) => {
    if (isAI) {
      return `System wykrył cechy fałszywej informacji (pewność: ${confidence}%)`;
    } else {
      return `Artykuł wydaje się wiarygodny (pewność: ${confidence}%)`;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
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
            <CardDescription>
              Wklej link lub treść artykułu, który chcesz sprawdzić
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="url" className="gap-2">
                  <Link className="w-4 h-4" />
                  Link URL
                </TabsTrigger>
                <TabsTrigger value="content" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Treść artykułu
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-6 mt-0">
                <div className="space-y-2">
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
                    onBlur={() => {
                      if (articleUrl && isValidUrl(articleUrl)) {
                        setResult(null);
                      }
                    }}
                  />
                </div>

                {articleUrl && isValidUrl(articleUrl) && (
                  <a
                    href={articleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg"
                  >
                    <ExternalLink className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    <span className="text-sm text-slate-600 underline decoration-primary dark:text-slate-400 truncate">
                      {new URL(articleUrl).hostname}
                    </span>
                  </a>
                )}
              </TabsContent>

              <TabsContent value="content" className="space-y-6 mt-0">
                <div className="space-y-2">
                  <Label htmlFor="articleContent">Treść artykułu</Label>
                  <Textarea
                    id="articleContent"
                    placeholder="Wklej tutaj pełną treść artykułu, który chcesz zweryfikować..."
                    value={articleContent}
                    onChange={(e) => {
                      setArticleContent(e.target.value);
                      setResult(null);
                    }}
                    rows={10}
                    className="resize-none"
                  />
                </div>

                {articleContent && (
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Liczba znaków: {articleContent.length}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <Button
              onClick={analyzeArticle}
              disabled={
                isAnalyzing ||
                (activeTab === "url" && !articleUrl) ||
                (activeTab === "content" && !articleContent)
              }
              className="w-full mt-6"
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
          </CardContent>
        </Card>

        {result && (
          <Card className={`${getResultColor(result.isAI)} border-2`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4 mb-6">
                {getResultIcon(result.isAI)}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    {getResultTitle(result.isAI)}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {getResultDescription(result.isAI, result.confidence)}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Wyjaśnienie:
                  </h4>
                  <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {result.reasoning}
                    </Markdown>
                  </div>

                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Kluczowe wskaźniki:
                  </h4>
                  <ul className="space-y-2">
                    {result.indicators.map((indicator, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                      >
                        <span className="w-1.5 h-1.5 bg-current rounded-full mt-2 shrink-0" />
                        {indicator}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-border">
                  <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                    Zalecenie:
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {result.isAI
                      ? "Zalecamy ostrożność i weryfikację informacji w innych, wiarygodnych źródłach przed ich udostępnieniem."
                      : "Artykuł wydaje się wiarygodny, ale zawsze warto porównać informacje z innymi źródłami."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
