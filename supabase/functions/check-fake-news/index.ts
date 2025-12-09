import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI } from "npm:@google/genai";
import { corsHeaders } from "../_shared/cors.ts";

async function callGemini(newsContent: string, apiKey: string) {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
Przeanalizuj poniższą treść i oceń, czy jest ona fałszywą informacją (fake news) lub zawiera cechy dezinformacji. Oceń pod kątem:

1. Czy treść zawiera nieprawdziwe informacje lub manipulacje?
2. Czy występują typowe schematy dezinformacji (sensacyjny nagłówek, brak źródeł, manipulacje emocjonalne)?
3. Czy są niespójności logiczne w tekście?
4. Czy treść próbuje wywołać silne emocje (strach, gniew) bez wystarczającego uzasadnienia?
5. Czy autor/źródło są wiarygodne (jeśli informacja jest dostępna)?

Odpowiedz wyłącznie w formacie JSON:

{
  "isAI": true/false (czy to fake news/dezinformacja),
  "confidence": 0-100 (pewność oceny),
  "reasoning": "szczegółowe wyjaśnienie po polsku",
  "indicators": ["lista", "wskaźników", "po polsku"]
}

Zasady:
- Jeśli brakuje informacji do oceny, zaznacz niską pewność
- Bądź obiektywny i opieraj się na faktach
- Unikaj uprzedzeń politycznych/ideologicznych

Treść do analizy:
"${newsContent.substring(0, 8000)}"`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return response;
  } catch (error) {
    console.error("Gemini API error:", error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { newsContent } = await req.json();

    if (!newsContent || typeof newsContent !== "string") {
      return new Response(JSON.stringify({ error: "Brak treści do analizy" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("GOOGLE_API_KEY");
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY env variable is not set");
    }

    const response = await callGemini(newsContent, apiKey);
    const result = response.text;

    if (!result || result.trim().length === 0) {
      throw new Error("Pusta odpowiedź od Gemini");
    }

    let data;
    try {
      data = JSON.parse(result);

      if (
        typeof data.isAI !== "boolean" ||
        typeof data.confidence !== "number" ||
        typeof data.reasoning !== "string" ||
        !Array.isArray(data.indicators)
      ) {
        throw new Error("Nieprawidłowy format odpowiedzi");
      }

      data.confidence = Math.max(0, Math.min(100, data.confidence));
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw response:", result);

      data = {
        isAI: false,
        confidence: 50,
        reasoning:
          "Nie udało się przeprowadzić pełnej analizy. Wynik może być niepewny.",
        indicators: ["Błąd podczas analizy", "Wymagana ręczna weryfikacja"],
      };
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in check-fake-news function:", error);

    const errorMessage =
      error instanceof Error ? error.message : "Wystąpił nieoczekiwany błąd";

    return new Response(
      JSON.stringify({
        error: errorMessage,
        isAI: false,
        confidence: 0,
        reasoning: "Błąd podczas analizy: " + errorMessage,
        indicators: ["Błąd systemu", "Spróbuj ponownie"],
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
