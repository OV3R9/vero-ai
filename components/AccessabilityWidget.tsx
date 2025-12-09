"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Accessibility as AccessibilityIcon,
  Type,
  Contrast,
  MousePointer,
  Minus,
  Plus,
  Underline,
  Highlighter,
  Volume2,
  Mic,
  Ban,
} from "lucide-react";

import { Accessibility } from "accessibility";

export function AccessibilityButton() {
  const instanceRef = useRef<Accessibility | null>(null);
  const [open, setOpen] = useState(false);

  const [invertColors, setInvertColors] = useState(false);
  const [grayHues, setGrayHues] = useState(false);
  const [underlineLinks, setUnderlineLinks] = useState(false);
  const [bigCursor, setBigCursor] = useState(false);
  const [readingGuide, setReadingGuide] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [speechToText, setSpeechToText] = useState(false);
  const [disableAnimations, setDisableAnimations] = useState(false);

  const labels = {
    resetTitle: "Resetuj",
    closeTitle: "Zamknij",
    menuTitle: "Ustawienia dostępności",
    increaseText: "Zwiększ rozmiar tekstu",
    decreaseText: "Zmniejsz rozmiar tekstu",
    increaseTextSpacing: "Zwiększ odstępy między literami",
    decreaseTextSpacing: "Zmniejsz odstępy między literami",
    increaseLineHeight: "Zwiększ interlinię",
    decreaseLineHeight: "Zmniejsz interlinię",
    invertColors: "Odwróć kolory",
    grayHues: "Odcienie szarości",
    underlineLinks: "Podkreśl linki",
    bigCursor: "Duży kursor",
    readingGuide: "Linijka czytania",
    textToSpeech: "Czytanie na głos",
    speechToText: "Mowa na tekst",
    disableAnimations: "Wyłącz animacje",
    hotkeyPrefix: "Skrót klawiszowy: ",
  };

  useEffect(() => {
    instanceRef.current = new Accessibility({
      labels: labels,
      textPixelMode: false,
    });
  }, []);

  const instance = instanceRef.current;

  const handleSwitch = (
    toggleFn: () => void,
    stateSetter: (v: boolean) => void,
    current: boolean
  ) => {
    toggleFn();
    stateSetter(!current);
  };

  const handleReset = () => {
    instance?.resetAll();
    setInvertColors(false);
    setGrayHues(false);
    setUnderlineLinks(false);
    setBigCursor(false);
    setReadingGuide(false);
    setTextToSpeech(false);
    setSpeechToText(false);
    setDisableAnimations(false);
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="icon"
        variant="outline"
        className="fixed bottom-4 bg-primary right-4 z-50 size-14 border-0 rounded-full shadow-lg"
        aria-label="Otwórz ustawienia dostępności"
      >
        <AccessibilityIcon className="size-6 text-white" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg md:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg md:text-xl">
              <AccessibilityIcon className="size-5" />
              Ustawienia dostępności
            </DialogTitle>
            <DialogDescription className="text-sm">
              Dostosuj wygląd strony tak, aby była wygodniejsza w użytkowaniu.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-10 py-4">
            <div className="space-y-4">
              <div className="flex items-center h-8 justify-between">
                <Label className="flex items-center gap-2">
                  <Type className="size-4" />
                  Rozmiar tekstu
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-8"
                    onClick={() => instance?.menuInterface.decreaseText()}
                  >
                    <Minus className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-8"
                    onClick={() => instance?.menuInterface.increaseText()}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center h-8 justify-between">
                <Label className="flex items-center gap-2">
                  <Highlighter className="size-4" />
                  Odstępy liter
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-8"
                    onClick={() =>
                      instance?.menuInterface.decreaseTextSpacing()
                    }
                  >
                    <Minus className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-8"
                    onClick={() =>
                      instance?.menuInterface.increaseTextSpacing()
                    }
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center h-8 justify-between">
                <Label className="flex items-center gap-2">
                  <Type className="size-4" />
                  Interlinia
                </Label>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-8"
                    onClick={() => instance?.menuInterface.decreaseLineHeight()}
                  >
                    <Minus className="size-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    className="size-8"
                    onClick={() => instance?.menuInterface.increaseLineHeight()}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center h-8 justify-between">
                <Label className="flex items-center gap-2">
                  <Underline className="size-4" />
                  Podkreśl linki
                </Label>
                <Switch
                  checked={underlineLinks}
                  onCheckedChange={() =>
                    handleSwitch(
                      () => instance?.menuInterface.underlineLinks(),
                      setUnderlineLinks,
                      underlineLinks
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between h-8">
                <Label className="flex items-center gap-2">
                  <Contrast className="size-4" />
                  Odwróć kolory
                </Label>
                <Switch
                  checked={invertColors}
                  onCheckedChange={() =>
                    handleSwitch(
                      () => instance?.menuInterface.invertColors(),
                      setInvertColors,
                      invertColors
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between h-8">
                <Label className="flex items-center gap-2">
                  <Contrast className="size-4" />
                  Odcienie szarości
                </Label>
                <Switch
                  checked={grayHues}
                  onCheckedChange={() =>
                    handleSwitch(
                      () => instance?.menuInterface.grayHues(),
                      setGrayHues,
                      grayHues
                    )
                  }
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between h-8">
                <Label className="flex items-center gap-2">
                  <MousePointer className="size-4" />
                  Duży kursor
                </Label>
                <Switch
                  checked={bigCursor}
                  onCheckedChange={() =>
                    handleSwitch(
                      () => instance?.menuInterface.bigCursor(),
                      setBigCursor,
                      bigCursor
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between h-8">
                <Label className="flex items-center gap-2">
                  <Highlighter className="size-4" />
                  Linijka czytania
                </Label>
                <Switch
                  checked={readingGuide}
                  onCheckedChange={() =>
                    handleSwitch(
                      () => instance?.menuInterface.readingGuide(),
                      setReadingGuide,
                      readingGuide
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between h-8">
                <Label className="flex items-center gap-2">
                  <Volume2 className="size-4" />
                  Czytanie na głos
                </Label>
                <Switch
                  checked={textToSpeech}
                  onCheckedChange={() =>
                    handleSwitch(
                      () => instance?.menuInterface.textToSpeech(),
                      setTextToSpeech,
                      textToSpeech
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between h-8">
                <Label className="flex items-center gap-2">
                  <Mic className="size-4" />
                  Mowa na tekst
                </Label>
                <Switch
                  checked={speechToText}
                  onCheckedChange={() =>
                    handleSwitch(
                      () => instance?.menuInterface.speechToText(),
                      setSpeechToText,
                      speechToText
                    )
                  }
                />
              </div>

              <div className="flex items-center justify-between h-8">
                <Label className="flex items-center gap-2">
                  <Ban className="size-4" />
                  Wyłącz animacje
                </Label>
                <Switch
                  checked={disableAnimations}
                  onCheckedChange={() =>
                    handleSwitch(
                      () => instance?.menuInterface.disableAnimations(),
                      setDisableAnimations,
                      disableAnimations
                    )
                  }
                />
              </div>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={handleReset}>
            Resetuj ustawienia
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
