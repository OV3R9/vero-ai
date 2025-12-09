import { Button } from "@/components/ui/button";
import { Shield, Image, Newspaper, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-hero-from to-hero-to py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Chroń siebie i bliskich
            <br />
            <span className="text-primary">przed internetowymi oszustami</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            VeroAI wykorzystuje sztuczną inteligencję, aby pomóc seniorom i
            dzieciom wykrywać fałszywe zdjęcia, nieprawdziwe wiadomości i
            podejrzane e-maile. Prosty i bezpieczny.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 text-base px-8 py-6">
              Sprawdź teraz
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-scale-in relative">
          {/* Animowana strzałka wskazująca na karty */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 hidden md:block">
            <div className="relative w-8 h-12">
              <svg
                className="w-full h-full text-primary animate-bounce"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
              </svg>
            </div>
          </div>

          <Link href="/dashboard/sprawdz-zdjecie" className="group">
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4 gap-4">
                <div className="h-14 items-center flex justify-center">
                  <Image className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Wykrywacz AI Zdjęć
                </h3>
              </div>
              <p className="text-muted-foreground">
                Sprawdź czy zdjęcie zostało wygenerowane przez sztuczną
                inteligencję
              </p>
            </div>
          </Link>

          <Link href="/dashboard/sprawdz-artykul" className="group">
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4 gap-4">
                <div className="h-14 flex items-center justify-center">
                  <Newspaper className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-xl font-semibold text-foreground">
                  Weryfikator Wiadomości
                </h3>
              </div>
              <p className="text-muted-foreground">
                Sprawdź wiarygodność artykułu i wykryj fałszywe informacje
              </p>
            </div>
          </Link>

          <Link href="/dashboard/sprawdz-email" className="group">
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center mb-4 gap-4">
                <div className="h-14 flex items-center justify-center ">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  Detektor Phishingu
                </h3>
              </div>
              <p className="text-muted-foreground">
                Sprawdź czy e-mail nie jest próbą wyłudzenia danych
              </p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
