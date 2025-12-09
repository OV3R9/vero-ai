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
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Result:", result);
      throw new Error("Failed to parse JSON response from Gemini");
    }

    return new Response(JSON.stringify(data), {
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
