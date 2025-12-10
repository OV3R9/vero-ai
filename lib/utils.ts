import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { LinkAnalysis, ResultStatus } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getResultTitle = (status: ResultStatus) => {
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

export const getResultColor = (status: ResultStatus) => {
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

export const getLinkStatusColor = (status: LinkAnalysis["status"]) => {
  switch (status) {
    case "dangerous":
      return "text-destructive bg-destructive/10";
    case "suspicious":
      return "text-yellow-600 bg-yellow-500/10";
    case "safe":
      return "text-green-600 bg-green-500/10";
  }
};

export const getLinkStatusUnderline = (status: LinkAnalysis["status"]) => {
  switch (status) {
    case "dangerous":
      return "decoration-destructive bg-destructive/10";
    case "suspicious":
      return "decoration-yellow-600 bg-yellow-500/10";
    case "safe":
      return "decoration-green-600 bg-green-500/10";
  }
};

export const getLinkStatusLabel = (status: LinkAnalysis["status"]) => {
  switch (status) {
    case "dangerous":
      return "Niebezpieczny";
    case "suspicious":
      return "Podejrzany";
    case "safe":
      return "Bezpieczny";
  }
};
