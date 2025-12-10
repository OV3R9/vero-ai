export type ResultStatus = "phishing" | "safe" | "suspicious";

export interface LinkAnalysis {
  url: string;
  status: "dangerous" | "suspicious" | "safe";
  reason: string;
}
