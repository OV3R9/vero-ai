import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI } from "npm:@google/genai";
import { corsHeaders } from "../_shared/cors.ts";

function base64ToGenerativePart(image: string) {
  const match = image.match(/^data:(image\/.+);base64,(.+)$/);
  if (!match) {
    throw new Error("Nieprawidłowy format obrazu base64.");
  }
  return {
    mimeType: match[1],
    data: match[2],
  };
}

async function callGemini(image: string, apiKey: string) {
  const ai = new GoogleGenAI({ apiKey });
  const prompt = `Jesteś ekspertem w wykrywaniu obrazów wygenerowanych przez AI. Analizujesz obrazy i określasz, czy zostały stworzone przez sztuczną inteligencję czy są prawdziwe.

Odpowiedź w formacie JSON:
{
  "summary": "krótkie podsumowanie 50-100 znaków po polsku",
  "isAI": true/false,
  "confidence": 0-100,
  "reasoning": ["szczegółowe punkty analizy po polsku", "jeden punkt na element"],
  "indicators": ["lista wskaźników po polsku"],
  "details": {
    "artifacts": ["lista artefaktów AI jeśli wykryto"],
    "strengths": ["mocne strony obrazu"],
    "weaknesses": ["słabe strony/wady obrazu"]
  }
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

Twórz krótkie podsumowanie (50-100 znaków) w stylu:
- "Obraz prawdopodobnie wygenerowany przez AI z powodu..."
- "Wygląda na autentyczny, brak typowych artefaktów AI"
- "Mieszane cechy, wymaga dalszej analizy"

Przeanalizuj ten obraz i określ, czy został wygenerowany przez AI. Odpowiedz po polsku.`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        parts: [
          { text: prompt },
          { inlineData: base64ToGenerativePart(image) },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
    },
  });

  return response;
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

    const response = await callGemini(imageBase64, GOOGLE_API_KEY);
    const result = response.text;

    if (!result || result.trim().length === 0) {
      throw new Error("Empty response from Gemini");
    }

    let data;
    try {
      data = JSON.parse(result);

      if (!data.summary && data.reasoning) {
        data.summary =
          data.reasoning[0]?.substring(0, 100) || "Analiza obrazu wykonana";
      }

      if (data.reasoning && !Array.isArray(data.reasoning)) {
        data.reasoning = [data.reasoning];
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Result:", result);

      data = {
        summary: "Analiza AI: Wykryto możliwe artefakty generowania",
        isAI: null,
        confidence: 0,
        reasoning: ["Nie udało się przetworzyć pełnej analizy"],
        indicators: ["błąd parsowania odpowiedzi"],
        details: {
          artifacts: [],
          strengths: [],
          weaknesses: ["błąd techniczny analizy"],
        },
        _error: "Parse error",
      };
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in check-ai-image function:", error);
    return new Response(
      JSON.stringify({
        summary: "Błąd analizy obrazu",
        isAI: null,
        confidence: 0,
        reasoning: ["Wystąpił błąd podczas przetwarzania"],
        indicators: ["błąd systemu"],
        details: {
          artifacts: [],
          strengths: [],
          weaknesses: [
            error instanceof Error ? error.message : "Nieznany błąd",
          ],
        },
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
