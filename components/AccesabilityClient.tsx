"use client";

import { useEffect } from "react";

const labels = {
  resetTitle: "Resetuj",
  closeTitle: "Zamknij",
  menuTitle: "Menu dostępności",
  increaseText: "Zwiększ rozmiar tekstu",
  decreaseText: "Zmniejsz rozmiar tekstu",
  increaseTextSpacing: "Zwiększ odstępy między literami",
  decreaseTextSpacing: "Zmniejsz odstępy między literami",
  increaseLineHeight: "Zwiększ interlinię",
  decreaseLineHeight: "Zmniejsz interlinię",
  invertColors: "Odwróć kolory",
  grayHues: "Odcienie szarości",
  underlineLinks: "Podkreśl linki",
  bigCursor: "Powiększony kursor",
  readingGuide: "Linijka czytania",
  textToSpeech: "Czytanie na głos",
  speechToText: "Mowa na tekst",
  disableAnimations: "Wyłącz animacje",
  hotkeyPrefix: "Skrót klawiszowy: ",
};

var options = {
  labels: labels,
};

export default function AccessibilityClient() {
  useEffect(() => {
    import("accessibility").then(({ Accessibility }) => {
      new Accessibility(options);
    });
  }, []);

  return null;
}
