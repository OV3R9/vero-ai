"use client";

import { useState } from "react";
import { Loader2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast";

const PasswordGenerator = () => {
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(
    null
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePassword = () => {
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let characters = "";
    if (includeUppercase) characters += upper;
    if (includeLowercase) characters += lower;
    if (includeNumbers) characters += numbers;
    if (includeSymbols) characters += symbols;

    if (!characters) {
      toast.error("Wybierz przynajmniej jeden rodzaj znaków.");
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      let password = "";
      for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
      }
      setGeneratedPassword(password);
      setIsGenerating(false);
    }, 500);
  };

  const copyToClipboard = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      toast.success("Skopiowano do schowka!");
    }
  };

  const getPasswordStrength = () => {
    if (!generatedPassword) return { label: "" };

    const length = generatedPassword.length;

    if (length >= 16 && includeUppercase && includeNumbers && includeSymbols) {
      return { label: "Bardzo silne" };
    }

    if (length >= 12) {
      return { label: "Średnie" };
    }

    return { label: "Słabe" };
  };

  const resetGenerator = () => {
    setGeneratedPassword(null);
  };

  const strength = getPasswordStrength();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Generator Silnych Haseł
        </h1>
        <p className="text-muted-foreground">
          Twórz bezpieczne hasła o wybranej długości i typach znaków
        </p>
      </div>

      {!generatedPassword && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Ustawienia hasła</CardTitle>
            <CardDescription>Wybierz długość i rodzaje znaków</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="passwordLength">Długość hasła</Label>
              <Input
                id="passwordLength"
                type="number"
                min={8}
                max={64}
                value={passwordLength}
                onChange={(e) => setPasswordLength(Number(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label>Rodzaje znaków</Label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeUppercase}
                    onChange={(e) => setIncludeUppercase(e.target.checked)}
                  />
                  Wielkie litery (A-Z)
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeLowercase}
                    onChange={(e) => setIncludeLowercase(e.target.checked)}
                  />
                  Małe litery (a-z)
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeNumbers}
                    onChange={(e) => setIncludeNumbers(e.target.checked)}
                  />
                  Cyfry (0-9)
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                  />
                  Symbole (!@#$%)
                </label>
              </div>
            </div>

            <Button
              onClick={generatePassword}
              disabled={isGenerating}
              className="w-full"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generuję hasło...
                </>
              ) : (
                <>Generuj hasło</>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {generatedPassword && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                Twoje hasło
              </h3>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-1" /> Kopiuj
              </Button>
            </div>
            <p className="font-mono text-2xl break-all">{generatedPassword}</p>
            <p className="text-xs text-muted-foreground">
              Siła hasła: {strength.label}
            </p>
            <Button onClick={resetGenerator} className="w-full mt-4" size="lg">
              Generuj nowe hasło
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PasswordGenerator;
