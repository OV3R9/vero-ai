import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI } from "npm:@google/genai";

import { corsHeaders } from "../_shared/cors.ts";

function base64ToGenerativePart(base64Data: string) {
  const base64 = base64Data.replace(/^data:image\/\w+;base64,/, "");

  return {
    inlineData: {
      data: base64,
      mimeType: "image/jpeg",
    },
  };
}

async function callGemini(image: string, apiKey: string) {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Jesteś ekspertem w wykrywaniu obrazów wygenerowanych przez AI. Analizujesz obrazy i określasz, czy zostały stworzone przez sztuczną inteligencję czy są prawdziwe.

Odpowiedz w formacie JSON:
{
  "isAI": true/false,
  "confidence": 0-100,
  "reasoning": "szczegółowe wyjaśnienie po polsku",
  "indicators": ["lista wskaźników po polsku"]
}

Szukaj następujących wskaźników AI:
- Nienaturalne tekstury skóry lub włosów
- Dziwne tła lub rozmyte szczegóły
- Nieprawidłowe odbicia lub cienie
- Zniekształcone dłonie, palce lub zęby
- Nierówne lub asymetryczne twarze
- Artefakty w oczach
- Niespójne oświetlenie
- Powtarzające się wzory
- Zbyt gładkie lub idealne powierzchnie

Przeanalizuj ten obraz i określ, czy został wygenerowany przez AI. Odpowiedz po polsku.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp",
    contents: [
      {
        parts: [{ text: prompt }, base64ToGenerativePart(image)],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
    },
  });

  const text = response.response.text();
  return JSON.parse(text);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "Brak obrazu do analizy" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const GOOGLE_API_KEY = Deno.env.get("GOOGLE_API_KEY");
    if (!GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not configured");
    }

    const result = await callGemini(imageBase64, GOOGLE_API_KEY);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in check-ai-image function:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "Wystąpił nieoczekiwany błąd",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
