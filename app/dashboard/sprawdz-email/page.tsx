"use client";

import { useState } from "react";
import {
  Mail,
  Loader2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Link2,
  Shield,
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
import toast from "react-hot-toast";

type ResultStatus = "phishing" | "safe" | "suspicious" | null;

interface LinkAnalysis {
  url: string;
  status: "dangerous" | "suspicious" | "safe";
  reason: string;
}

interface AnalysisResult {
  status: ResultStatus;
  confidence: number;
  senderAnalysis: {
    email: string;
    trustLevel: "low" | "medium" | "high";
    reason: string;
  };
  contentWarnings: string[];
  linkAnalysis: LinkAnalysis[];
  recommendation: string;
}

const EmailChecker = () => {
  const [senderEmail, setSenderEmail] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyzeEmail = async () => {
    if (!senderEmail || !emailContent) {
      toast.error("Wpisz adres nadawcy i treść e-maila.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const SUPABASE_URL =
        process.env.NEXT_PUBLIC_SUPABASE_URL || "YOUR_SUPABASE_URL";
      const SUPABASE_ANON_KEY =
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "YOUR_SUPABASE_ANON_KEY";

      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/analyze-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            senderEmail,
            emailContent,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);

      if (data.status === "phishing") {
        toast.error("Uwaga! Wykryto potencjalny phishing!");
      } else if (data.status === "safe") {
        toast.success("E-mail wydaje się bezpieczny");
      } else {
        toast("Wykryto podejrzane elementy", { icon: "⚠️" });
      }
    } catch (error: any) {
      console.error("Analysis error:", error);
      toast.error(
        error.message || "Błąd podczas analizy. Sprawdź konfigurację API."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getResultIcon = (status: ResultStatus) => {
    switch (status) {
      case "phishing":
        return <XCircle className="w-8 h-8 text-destructive" />;
      case "safe":
        return <CheckCircle className="w-8 h-8 text-green-600" />;
      case "suspicious":
        return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getResultTitle = (status: ResultStatus) => {
    switch (status) {
      case "phishing":
        return "UWAGA: Prawdopodobnie phishing!";
      case "safe":
        return "E-mail wydaje się bezpieczny";
      case "suspicious":
        return "Podejrzany e-mail - zachowaj ostrożność";
      default:
        return "";
    }
  };

  const getResultColor = (status: ResultStatus) => {
    switch (status) {
      case "phishing":
        return "border-destructive/50 bg-destructive/5";
      case "safe":
        return "border-green-500/50 bg-green-500/5";
      case "suspicious":
        return "border-yellow-500/50 bg-yellow-500/5";
      default:
        return "";
    }
  };

  const getLinkStatusColor = (status: LinkAnalysis["status"]) => {
    switch (status) {
      case "dangerous":
        return "text-destructive bg-destructive/10";
      case "suspicious":
        return "text-yellow-600 bg-yellow-500/10";
      case "safe":
        return "text-green-600 bg-green-500/10";
    }
  };

  const getLinkStatusLabel = (status: LinkAnalysis["status"]) => {
    switch (status) {
      case "dangerous":
        return "Niebezpieczny";
      case "suspicious":
        return "Podejrzany";
      case "safe":
        return "Bezpieczny";
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Detektor Phishingu AI
        </h1>
        <p className="text-muted-foreground">
          Wykorzystuje Gemini AI do analizy e-maili pod kątem zagrożeń
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Dane e-maila</CardTitle>
          <CardDescription>
            Wklej adres nadawcy i treść wiadomości do sprawdzenia
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="senderEmail">Adres nadawcy</Label>
            <Input
              id="senderEmail"
              type="email"
              placeholder="nadawca@example.com"
              value={senderEmail}
              onChange={(e) => {
                setSenderEmail(e.target.value);
                setResult(null);
              }}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="emailContent">Treść e-maila</Label>
            <Textarea
              id="emailContent"
              placeholder="Wklej tutaj całą treść e-maila, łącznie z linkami..."
              value={emailContent}
              onChange={(e) => {
                setEmailContent(e.target.value);
                setResult(null);
              }}
              rows={8}
            />
            <p className="text-xs text-muted-foreground">
              Gemini AI przeanalizuje treść, nadawcę i wszystkie linki
            </p>
          </div>

          <Button
            onClick={analyzeEmail}
            disabled={isAnalyzing || !senderEmail || !emailContent}
            className="w-full"
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analizuję z Gemini AI...
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 mr-2" />
                Sprawdź e-mail
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
                  Pewność analizy: {result.confidence}%
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Sender Analysis */}
              <div className="p-4 bg-background rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <h4 className="font-medium text-foreground">
                    Analiza nadawcy
                  </h4>
                </div>
                <p className="text-sm text-foreground mb-1">
                  {result.senderAnalysis.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  {result.senderAnalysis.reason}
                </p>
              </div>

              {/* Content Warnings */}
              {result.contentWarnings.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    Ostrzeżenia dotyczące treści:
                  </h4>
                  <ul className="space-y-2">
                    {result.contentWarnings.map((warning, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Link Analysis */}
              {result.linkAnalysis.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    Analiza linków:
                  </h4>
                  <div className="space-y-2">
                    {result.linkAnalysis.map((link, index) => (
                      <div key={index} className="p-3 bg-background rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Link2 className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-foreground truncate flex-1">
                            {link.url}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getLinkStatusColor(
                              link.status
                            )}`}
                          >
                            {getLinkStatusLabel(link.status)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground ml-6">
                          {link.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendation */}
              <div
                className={`p-4 rounded-lg ${
                  result.status === "phishing"
                    ? "bg-destructive/10"
                    : "bg-background"
                }`}
              >
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

export default EmailChecker;
