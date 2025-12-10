"use client";

import { useState } from "react";
import {
  Mail,
  Link2,
  Loader2,
  AlertTriangle,
  ExternalLink,
  Calendar,
  Shield,
  TrendingUp,
  ChevronUp,
  LinkIcon,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import supabase from "@/lib/supabase/client";
import {
  cn,
  getLinkStatusColor,
  getLinkStatusLabel,
  getLinkStatusUnderline,
} from "@/lib/utils";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface SuspiciousEmail {
  id: string;
  sender_email: string;
  email_content: string;
  confidence: number;
  status: string;
  sender_analysis: any;
  link_analysis: any[];
  created_at: string;
}

interface FakeNewsArticle {
  id: string;
  article_url: string;
  confidence: number;
  reasoning: string;
  created_at: string;
}

interface DatabaseData {
  emails: SuspiciousEmail[];
  articles: FakeNewsArticle[];
}

export default function DatabaseRecords() {
  const [activeTab, setActiveTab] = useState<"emails" | "articles">("emails");
  const [expandedEmails, setExpandedEmails] = useState<Set<string>>(new Set());
  const [expandedArticles, setExpandedArticles] = useState<Set<string>>(
    new Set()
  );

  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: databaseData,
    isLoading,
    error,
  } = useQuery<DatabaseData>({
    queryKey: ["database-records"],
    queryFn: fetchDatabaseData,
    staleTime: 10 * 60 * 1000,
  });

  const suspiciousEmails = databaseData?.emails || [];
  const fakeNewsArticles = databaseData?.articles || [];

  async function fetchDatabaseData(): Promise<DatabaseData> {
    const [emailsResponse, articlesResponse] = await Promise.all([
      supabase
        .from("suspicious_emails")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("fake_news_articles")
        .select("*")
        .order("created_at", { ascending: false }),
    ]);

    if (emailsResponse.error) throw emailsResponse.error;
    if (articlesResponse.error) throw articlesResponse.error;

    return {
      emails: emailsResponse.data || [],
      articles: articlesResponse.data || [],
    };
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "phishing":
        return "text-red-600 bg-red-500/10";
      case "suspicious":
        return "text-yellow-600 bg-yellow-500/10";
      default:
        return "text-slate-600 bg-slate-500/10";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "phishing":
        return "Phishing";
      case "suspicious":
        return "Podejrzany";
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleEmailExpansion = (id: string) => {
    setExpandedEmails((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleArticleExpansion = (id: string) => {
    setExpandedArticles((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getEmailSummary = (email: SuspiciousEmail) => {
    const lines = email.email_content.split("\n");
    const firstLine = lines[0] || "";
    const maxLength = 100;
    return firstLine.length > maxLength
      ? `${firstLine.substring(0, maxLength)}...`
      : firstLine;
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["database-records"] });
  };

  const handleReport = () => {};

  return (
    <div className="max-w-6xl mx-auto py-10 px-8 xl:px-0">
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="text-foreground cursor-pointer flex items-center gap-1 mb-6"
        >
          <ArrowLeft />
          <span className="ml-2 underline">Powrót</span>
        </button>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Baza wykrytych zagrożeń
        </h1>
        <p className="text-muted-foreground">
          Przegląd wszystkich wykrytych phishingowych e-maili i fałszywych
          wiadomości
        </p>
      </div>

      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === "emails" ? "default" : "outline"}
          onClick={() => setActiveTab("emails")}
          className="flex-1"
        >
          <Mail className="w-4 h-4 mr-2" />
          Podejrzane e-maile ({suspiciousEmails.length})
        </Button>
        <Button
          variant={activeTab === "articles" ? "default" : "outline"}
          onClick={() => setActiveTab("articles")}
          className="flex-1"
        >
          <Link2 className="w-4 h-4 mr-2" />
          Fake news ({fakeNewsArticles.length})
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <Card>
          <CardContent className="py-12 text-center">
            <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
            <p className="text-muted-foreground mb-4">
              Błąd podczas ładowania danych
            </p>
            <Button onClick={handleRefresh} variant="outline">
              Spróbuj ponownie
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {activeTab === "emails" && (
            <div className="space-y-4">
              {suspiciousEmails.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Brak wykrytych podejrzanych e-maili
                    </p>
                  </CardContent>
                </Card>
              ) : (
                suspiciousEmails.map((email) => {
                  const isExpanded = expandedEmails.has(email.id);
                  return (
                    <Card key={email.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <CardTitle className="text-lg break-all">
                                {email.sender_email}
                              </CardTitle>
                              <span
                                className={cn(
                                  "text-xs px-2 py-1 rounded-full font-medium",
                                  getStatusColor(email.status)
                                )}
                              >
                                {getStatusLabel(email.status)}
                              </span>
                            </div>
                            <CardDescription className="flex flex-wrap items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(email.created_at)}
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Pewność: {email.confidence}%
                              </span>
                            </CardDescription>
                            <button
                              className="flex cursor-pointer items-center text-sm text-foreground mt-6 gap-1"
                              onClick={() => toggleEmailExpansion(email.id)}
                            >
                              <ChevronUp
                                className={cn(
                                  "w-4 h-4 transition",
                                  isExpanded ? "rotate-180" : ""
                                )}
                              />
                              <span>
                                {isExpanded
                                  ? "Kliknij aby zwinąć"
                                  : "Kliknij aby rozwinąć"}
                              </span>
                            </button>
                          </div>
                          {email.status === "phishing" && (
                            <AlertTriangle
                              className="w-6 h-6 text-red-600 shrink-0"
                              onClick={handleReport}
                            />
                          )}
                          {email.status === "suspicious" && (
                            <AlertTriangle
                              className="w-6 h-6 text-yellow-600 shrink-0"
                              onClick={handleReport}
                            />
                          )}
                        </div>
                      </CardHeader>
                      {isExpanded && (
                        <CardContent className="space-y-4 border-t pt-4">
                          {email.sender_analysis && (
                            <div>
                              <h4 className="text-base font-semibold text-foreground mb-1">
                                Analiza nadawcy:
                              </h4>
                              <p className="text-muted-foreground">
                                {email.sender_analysis.reason}
                              </p>
                            </div>
                          )}

                          {email.link_analysis &&
                            email.link_analysis.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium text-foreground mb-2">
                                  Wykryte linki: {email.link_analysis.length}
                                </h4>
                                <div className="space-y-2">
                                  {email.link_analysis.map((link, index) => (
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
                        </CardContent>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          )}

          {activeTab === "articles" && (
            <div className="space-y-4">
              {fakeNewsArticles.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      Brak wykrytych fałszywych wiadomości
                    </p>
                  </CardContent>
                </Card>
              ) : (
                fakeNewsArticles.map((article) => {
                  const isExpanded = expandedArticles.has(article.id);
                  return (
                    <Card key={article.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Link2 className="w-4 h-4 text-muted-foreground" />
                              <CardTitle className="text-lg break-all">
                                {new URL(article.article_url).hostname}
                              </CardTitle>
                              <span className="text-xs px-2 py-1 rounded-full font-medium bg-red-500/10 text-red-600">
                                Fake News
                              </span>
                            </div>
                            <CardDescription className="flex flex-wrap items-center gap-4">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {formatDate(article.created_at)}
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" />
                                Pewność: {article.confidence}%
                              </span>
                            </CardDescription>
                            <div className="mt-4">
                              <a
                                href={article.article_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-sm text-primary hover:underline mb-3 break-all"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <ExternalLink className="w-4 h-4 shrink-0" />
                                <span className="break-all">
                                  {article.article_url}
                                </span>
                              </a>
                            </div>
                            <button
                              className="flex cursor-pointer items-center text-sm text-foreground mt-6 gap-1"
                              onClick={() => toggleArticleExpansion(article.id)}
                            >
                              <ChevronUp
                                className={cn(
                                  "w-4 h-4 transition",
                                  isExpanded ? "rotate-180" : ""
                                )}
                              />
                              <span>
                                {isExpanded
                                  ? "Kliknij aby zwinąć"
                                  : "Kliknij aby rozwinąć"}
                              </span>
                            </button>
                          </div>
                          <AlertTriangle className="w-6 h-6 text-red-600 shrink-0" />
                        </div>
                      </CardHeader>
                      {isExpanded && (
                        <CardContent className="space-y-4 border-t pt-4">
                          <div className="py-2 px-1">
                            <h4 className="text font-semibold text-foreground mb-2">
                              Uzasadnienie:
                            </h4>
                            <div className="text-sm text-muted-foreground prose prose-sm max-w-none">
                              <Markdown remarkPlugins={[remarkGfm]}>
                                {article.reasoning}
                              </Markdown>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  );
                })
              )}
            </div>
          )}
        </>
      )}

      <div className="mt-6">
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="w-full bg-white"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className={cn("w-4 h-4 mr-2 animate-spin")} />}
          {isLoading ? "Ładowanie..." : "Odśwież dane"}
        </Button>
      </div>
    </div>
  );
}
