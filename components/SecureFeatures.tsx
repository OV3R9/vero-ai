import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const SecureFeatures = () => {
  const steps = [
    "Wybierz typ sprawdzenia - zdjęcie, artykuł lub e-mail",
    "Wklej link, prześlij plik lub wpisz treść",
    "Poczekaj kilka sekund na analizę AI",
    "Otrzymaj wynik z wyjaśnieniem",
  ];

  return (
    <section id="jak-dziala" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Jak to działa?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Korzystanie z VeroAI jest proste i intuicyjne. Wystarczy kilka
              kliknięć, aby sprawdzić czy treść jest bezpieczna.
            </p>
            <div className="space-y-4 mb-8">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="shrink-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                    {index + 1}
                  </div>
                  <p className="text-foreground pt-1">{step}</p>
                </div>
              ))}
            </div>
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Rozpocznij teraz
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
          <div className="bg-card rounded-2xl p-8 shadow-xl border border-border">
            <h3 className="text-xl font-semibold text-foreground mb-6">
              Co możesz sprawdzić:
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">Zdjęcia AI</h4>
                  <p className="text-sm text-muted-foreground">
                    Wykryj obrazy wygenerowane przez sztuczną inteligencję
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">
                    Fałszywe wiadomości
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Sprawdź wiarygodność artykułów i newsów
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h4 className="font-medium text-foreground">
                    Podejrzane e-maile
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Wykryj phishing i próby wyłudzenia danych
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecureFeatures;
