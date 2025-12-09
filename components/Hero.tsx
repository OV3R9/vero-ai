import { Button } from "@/components/ui/button";
import { Shield, Image, Newspaper, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-hero-from to-hero-to py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Ochrona przed oszustwami online
          </div>
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
              Rozpocznij sprawdzanie
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-scale-in">
          <Link href="/dashboard/sprawdz-zdjecie" className="group">
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Image className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Wykrywacz AI Zdjęć
              </h3>
              <p className="text-muted-foreground">
                Sprawdź czy zdjęcie zostało wygenerowane przez sztuczną
                inteligencję
              </p>
            </div>
          </Link>

          <Link href="/dashboard/sprawdz-artykul" className="group">
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Newspaper className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Weryfikator Wiadomości
              </h3>
              <p className="text-muted-foreground">
                Sprawdź wiarygodność artykułu i wykryj fałszywe informacje
              </p>
            </div>
          </Link>

          <Link href="/dashboard/sprawdz-email" className="group">
            <div className="bg-card rounded-2xl p-8 shadow-lg border border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300">
              <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Mail className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Detektor Phishingu
              </h3>
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
