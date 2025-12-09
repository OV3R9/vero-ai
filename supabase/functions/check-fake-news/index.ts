import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI } from "npm:@google/genai";
import { corsHeaders } from "../_shared/cors.ts";

async function callGemini(content: string, isUrl: boolean, apiKey: string) {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = isUrl
    ? `
Analizuj ten link: "${content}"

Oceń, czy treść pod tym linkiem zawiera fałszywe informacje (fake news) lub cechy dezinformacji. 
Rozważ następujące aspekty:

1. Wiarygodność domeny/źródła
2. Typowy charakter treści na tej stronie
3. Reputacja źródła w internecie
4. Czy strona jest znana z publikowania dezinformacji?

Jeśli masz wiedzę na temat tej strony/źródła, uwzględnij to w ocenie.

Odpowiedz wyłącznie w formacie JSON:

{
  "isAI": true/false (czy to prawdopodobnie fake news/dezinformacja),
  "confidence": 0-100 (pewność oceny),
  "reasoning": "szczegółowe wyjaśnienie po polsku, możesz używać formatu Markdown",
  "indicators": ["lista", "wskaźników", "po polsku"]
}

Zasady:
- Jeśli nie znasz źródła, zaznacz niską pewność
- Bądź obiektywny i opieraj się na faktach
- Jeśli oceniasz tylko URL, zaznacz to w reasoning`
    : `
Przeanalizuj poniższą treść i oceń, czy jest ona fałszywą informacją (fake news) lub zawiera cechy dezinformacji. Oceń pod kątem:

1. Czy treść zawiera nieprawdziwe informacje lub manipulacje?
2. Czy występują typowe schematy dezinformacji (sensacyjny nagłówek, brak źródeł, manipulacje emocjonalne)?
3. Czy są niespójności logiczne w tekście?
4. Czy treść próbuje wywołać silne emocje (strach, gniew) bez wystarczającego uzasadnienia?

Treść do analizy:
"${content}"

ODPOWIEDŹ WYŁĄCZNIE W FORMACIE JSON:

{
  "isAI": true/false,
  "confidence": 0-100,
  "reasoning": "wyjaśnienie po polsku",
  "indicators": ["lista", "wskaźników", "po polsku"]
}`;

  const groundingTool = {
    googleSearch: {},
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [groundingTool],
        temperature: 0.1, // Lower temperature for more consistent JSON
      },
    });

    const result = response.text;

    if (!result || result.trim().length === 0) {
      throw new Error("Pusta odpowiedź od Gemini API");
    }

    // Extract JSON from response (in case there's extra text)
    let jsonStr = result.trim();

    // Try to extract JSON if there's extra text
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }

    // Parse JSON
    const parsed = JSON.parse(jsonStr);

    // Validate and sanitize response
    return {
      isAI: Boolean(parsed.isAI),
      confidence: Math.min(100, Math.max(0, Number(parsed.confidence) || 50)),
      reasoning: String(parsed.reasoning || "Brak szczegółowego wyjaśnienia"),
      indicators: Array.isArray(parsed.indicators)
        ? parsed.indicators.filter((item) => item).map(String)
        : ["Brak szczegółowych wskaźników"],
    };
  } catch (error) {
    console.error("Gemini API error:", error);

    // Return fallback response
    return {
      isAI: false,
      confidence: 50,
      reasoning:
        "Błąd podczas analizy treści. Nie udało się uzyskać wiarygodnej oceny.",
      indicators: ["Błąd systemu analizy", "Wymagana ręczna weryfikacja"],
    };
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { content, isUrl = false } = await req.json();

    if (!content || typeof content !== "string") {
      return new Response(
        JSON.stringify({
          error: "Brak treści do analizy",
          isAI: false,
          confidence: 0,
          reasoning: "Nie przekazano treści do analizy",
          indicators: ["Błąd wejścia", "Brak danych"],
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const apiKey = Deno.env.get("GOOGLE_API_KEY");
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY env variable is not set");
    }

    const analysisResult = await callGemini(content, isUrl, apiKey);

    if (
      typeof analysisResult.isAI !== "boolean" ||
      typeof analysisResult.confidence !== "number" ||
      typeof analysisResult.reasoning !== "string" ||
      !Array.isArray(analysisResult.indicators)
    ) {
      throw new Error("Nieprawidłowy format odpowiedzi z analizy");
    }

    analysisResult.confidence = Math.max(
      0,
      Math.min(100, analysisResult.confidence)
    );

    return new Response(JSON.stringify(analysisResult), {
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
