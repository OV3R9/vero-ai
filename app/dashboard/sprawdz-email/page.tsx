"use client";

import { useState } from "react";
import {
  Mail,
  Loader2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Link as LinkIcon,
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
import { toast } from "react-hot-toast";
import supabase from "@/lib/supabase/client";
import {
  cn,
  getLinkStatusColor,
  getLinkStatusLabel,
  getLinkStatusUnderline,
  getResultColor,
  getResultTitle,
} from "@/lib/utils";
import { LinkAnalysis, ResultStatus } from "@/lib/types";

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

const EmailChecker = () => {
  const [senderEmail, setSenderEmail] = useState("");
  const [emailContent, setEmailContent] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const saveSuspiciousEmail = async (analysisResult: AnalysisResult) => {
    try {
      if (
        analysisResult.status === "suspicious" ||
        analysisResult.status === "phishing"
      ) {
        const { error } = await supabase.from("suspicious_emails").insert({
          sender_email: senderEmail,
          email_content: emailContent,
          confidence: analysisResult.confidence,
          status: analysisResult.status,
          sender_analysis: analysisResult.senderAnalysis,
          link_analysis: analysisResult.linkAnalysis,
        });

        if (error) {
          return false;
        }

        if (analysisResult.status === "phishing") {
          toast.success(
            "E-mail został oznaczony jako phishing i zapisany w bazie danych."
          );
        } else if (analysisResult.status === "suspicious") {
          toast.success(
            "E-mail został oznaczony jako podejrzany i zapisany w bazie danych."
          );
        }

        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const analyzeEmail = async () => {
    if (!senderEmail || !emailContent) {
      toast.error("Wpisz adres nadawcy i treść e-maila.");
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "check-phishing",
        {
          body: { senderEmail, emailContent },
        }
      );

      if (error) {
        throw error;
      }

      setResult(data);

      const isSaved = await saveSuspiciousEmail(data);
      if (!isSaved) {
        toast.error("Błąd podczas zapisywania e-maila.");
      }
    } catch (e: any) {
      toast.error(e.message || "Błąd podczas analizy wiadomości.");
    }

    setIsAnalyzing(false);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Detektor Phishingu
        </h1>
        <p className="text-muted-foreground">
          Sprawdź czy e-mail nie jest próbą wyłudzenia Twoich danych
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
              Wskazówka: Wklej całą treść e-maila - nasze AI przeanalizuje
              również wszystkie linki
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
                Analizuję e-mail...
              </>
            ) : (
              <>Sprawdź e-mail</>
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
              <div className="p-4 bg-background rounded-lg border border-border">
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

              {result.contentWarnings.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    Ostrzeżenia dotyczące treści:
                  </h4>
                  <ul className="space-y-3">
                    {result.contentWarnings.map((warning, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm text-muted-foreground bg-background p-2 border-border border rounded-md"
                      >
                        <AlertTriangle className="m-1 w-4 h-4 text-destructive shrink-0" />
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.linkAnalysis.length > 0 && (
                <div>
                  <h4 className="font-medium text-foreground mb-2">
                    Analiza linków:
                  </h4>
                  <div className="space-y-2">
                    {result.linkAnalysis.map((link, index) => (
                      <div
                        key={index}
                        className="p-3 bg-background rounded-lg border-border border"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <LinkIcon className="w-4 h-4 text-muted-foreground" />
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "text-sm text-foreground truncate underline inline-block",
                              getLinkStatusUnderline(link.status)
                            )}
                          >
                            {link.url}
                          </a>
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

              <div
                className={`p-4 rounded-lg border-border border bg-background`}
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
