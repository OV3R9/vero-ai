"use client";

import { useState } from "react";
import {
  Link as LinkIcon,
  Loader2,
  CheckCircle,
  AlertTriangle,
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
import { toast } from "react-hot-toast";

type ResultStatus = "fake" | "credible" | "uncertain" | null;

interface AnalysisResult {
  status: ResultStatus;
  confidence: number;
  title: string;
  source: string;
  reasons: string[];
  recommendation: string;
}

const ArticleChecker = () => {
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

  const analyzeArticle = async () => {
    if (!articleUrl) {
      toast.error("Wklej link do artykułu, który chcesz sprawdzić.");
      return;
    }

    if (!isValidUrl(articleUrl)) {
      toast.error("Upewnij się, że wklejony link jest poprawny.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    // Simulate API call - replace with actual AI analysis
    await new Promise((resolve) => setTimeout(resolve, 2500));

    // Mock results - in production this would come from an AI API
    const mockResults: AnalysisResult[] = [
      {
        status: "fake",
        confidence: 78,
        title: "Analiza artykułu",
        source: new URL(articleUrl).hostname,
        reasons: [
          "Artykuł zawiera sensacyjny nagłówek bez poparcia w treści",
          "Brak odnośników do wiarygodnych źródeł",
          "Strona nie posiada informacji o autorze",
        ],
        recommendation:
          "Zalecamy sprawdzenie tej informacji w innych, wiarygodnych źródłach przed jej udostępnieniem.",
      },
      {
        status: "credible",
        confidence: 89,
        title: "Analiza artykułu",
        source: new URL(articleUrl).hostname,
        reasons: [
          "Artykuł pochodzi z uznanego źródła informacji",
          "Zawiera odnośniki do źródeł i cytatów",
          "Autor jest podpisany i możliwy do zweryfikowania",
        ],
        recommendation:
          "Artykuł wydaje się wiarygodny, ale zawsze warto porównać informacje z innymi źródłami.",
      },
      {
        status: "uncertain",
        confidence: 52,
        title: "Analiza artykułu",
        source: new URL(articleUrl).hostname,
        reasons: [
          "Źródło nie jest powszechnie znane",
          "Artykuł zawiera zarówno fakty jak i opinie bez wyraźnego rozróżnienia",
          "Trudno zweryfikować niektóre podane informacje",
        ],
        recommendation:
          "Zalecamy ostrożność. Sprawdź informacje w co najmniej dwóch innych źródłach.",
      },
    ];

    setResult(mockResults[Math.floor(Math.random() * mockResults.length)]);
    setIsAnalyzing(false);
  };

  const getResultIcon = (status: ResultStatus) => {
    switch (status) {
      case "fake":
        return <XCircle className="w-8 h-8 text-destructive" />;
      case "credible":
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case "uncertain":
        return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getResultTitle = (status: ResultStatus) => {
    switch (status) {
      case "fake":
        return "Prawdopodobnie fałszywa informacja";
      case "credible":
        return "Prawdopodobnie wiarygodny artykuł";
      case "uncertain":
        return "Wiarygodność niepewna";
      default:
        return "";
    }
  };

  const getResultColor = (status: ResultStatus) => {
    switch (status) {
      case "fake":
        return "border-destructive/50 bg-destructive/5";
      case "credible":
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
          Weryfikator Wiadomości
        </h1>
        <p className="text-muted-foreground">
          Sprawdź czy artykuł zawiera prawdziwe informacje czy to fake news
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Wklej link do artykułu</CardTitle>
          <CardDescription>
            Skopiuj adres URL artykułu, który chcesz zweryfikować
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
            />
          </div>

          {articleUrl && isValidUrl(articleUrl) && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <ExternalLink className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground truncate">
                {new URL(articleUrl).hostname}
              </span>
            </div>
          )}

          <Button
            onClick={analyzeArticle}
            disabled={isAnalyzing || !articleUrl}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analizuję artykuł...
              </>
            ) : (
              <>
                <LinkIcon className="w-5 h-5 mr-2" />
                Sprawdź artykuł
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className={`${getResultColor(result.status)} border-2`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-4 mb-6">
              {getResultIcon(result.status)}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-foreground mb-1">
                  {getResultTitle(result.status)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Pewność analizy: {result.confidence}% • Źródło:{" "}
                  {result.source}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-foreground mb-2">
                  Powody oceny:
                </h4>
                <ul className="space-y-2">
                  {result.reasons.map((reason, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <span className="w-1.5 h-1.5 bg-current rounded-full mt-2 flex-shrink-0" />
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-background rounded-lg">
                <h4 className="font-medium text-foreground mb-1">Zalecenie:</h4>
                <p className="text-sm text-muted-foreground">
                  {result.recommendation}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ArticleChecker;
