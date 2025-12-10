import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { GoogleGenAI } from "npm:@google/genai";
import { corsHeaders } from "../_shared/cors.ts";

async function callGemini(content: string, isUrl: boolean, apiKey: string) {
  const ai = new GoogleGenAI({ apiKey });

  const prompt = isUrl
    ? `
Analizuj ten link: "${content}"

Oceń, czy treść pod tym linkiem zawiera fałszywe informacje (fake news) lub dezinformację. 

Odpowiedz wyłącznie w formacie JSON:

{
  "isAI": true/false,
  "confidence": 0-100,
  "reasoning": "krótka, zwięzła odpowiedź w Markdown, linki mogą być użyteczne",
  "indicators": ["lista wskaźników po polsku"]
}

Zasady:
- Jeśli nie znasz źródła, zaznacz niską pewność
- Odpowiedź powinna być zwięzła, jasna i możliwa do użycia bez dalszej edycji
`
    : `
Przeanalizuj poniższą treść i oceń, czy zawiera fałszywe informacje (fake news) lub dezinformację. 

Treść do analizy:
"${content}"

ODPOWIEDŹ WYŁĄCZNIE W FORMACIE JSON:

{
  "isAI": true/false,
  "confidence": 0-100,
  "reasoning": "krótka, zwięzła odpowiedź w Markdown, możesz używać linków i pogrubień",
  "indicators": ["lista wskaźników po polsku"]
}
`;

  const groundingTool = { googleSearch: {} };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { tools: [groundingTool], temperature: 0.1 },
    });

    let jsonStr = response.text.trim();
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) jsonStr = jsonMatch[0];

    const parsed = JSON.parse(jsonStr);

    return {
      isAI: Boolean(parsed.isAI),
      confidence: Math.min(100, Math.max(0, Number(parsed.confidence) || 50)),
      reasoning: String(parsed.reasoning || "Brak szczegółowego wyjaśnienia"),
      indicators: Array.isArray(parsed.indicators)
        ? parsed.indicators.filter(Boolean).map(String)
        : ["Brak szczegółowych wskaźników"],
    };
  } catch (error) {
    console.error("Gemini API error:", error);
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
  if (req.method === "OPTIONS")
    return new Response("ok", { headers: corsHeaders });

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
    if (!apiKey) throw new Error("GOOGLE_API_KEY env variable is not set");

    const analysisResult = await callGemini(content, isUrl, apiKey);

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
