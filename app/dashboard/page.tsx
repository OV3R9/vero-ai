"use client";

import Link from "next/link";
import { ImageIcon, Newspaper, Mail, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Dashboard = () => {
  const tools = [
    {
      to: "/dashboard/sprawdz-zdjecie",
      icon: ImageIcon,
      title: "Wykrywacz AI Zdjęć",
      description:
        "Sprawdź czy zdjęcie zostało wygenerowane przez sztuczną inteligencję",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      to: "/dashboard/sprawdz-artykul",
      icon: Newspaper,
      title: "Weryfikator Wiadomości",
      description: "Sprawdź wiarygodność artykułu i wykryj fałszywe informacje",
      color: "bg-green-500/10 text-green-600",
    },
    {
      to: "/dashboard/sprawdz-email",
      icon: Mail,
      title: "Detektor Phishingu",
      description: "Sprawdź czy e-mail nie jest próbą wyłudzenia danych",
      color: "bg-orange-500/10 text-orange-600",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Co chcesz dziś sprawdzić?
        </h1>
        <p className="text-lg text-muted-foreground">
          Wybierz narzędzie, które pomoże Ci zweryfikować treść
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link key={tool.to} href={tool.to} className="group">
            <Card className="h-full border-border min-w-[305px] hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${tool.color}`}
                >
                  <tool.icon className="w-7 h-7" />
                </div>
                <CardTitle className="text-xl">{tool.title}</CardTitle>
                <CardDescription>{tool.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                  Rozpocznij <ArrowRight className="w-4 h-4" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-muted rounded-2xl p-8 text-center">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Potrzebujesz pomocy?
        </h2>
        <p className="text-muted-foreground mb-4">
          Jeśli nie wiesz jak korzystać z narzędzi, sprawdź naszą sekcję FAQ lub
          skontaktuj się z nami.
        </p>
        <div className="flex justify-center gap-4">
          <a href="#" className="text-primary hover:underline font-medium">
            FAQ
          </a>
          <span className="text-muted-foreground">•</span>
          <a href="#" className="text-primary hover:underline font-medium">
            Kontakt
          </a>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
