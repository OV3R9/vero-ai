import { Shield, Eye, Lock, Zap, Users, Heart } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Shield,
      title: "Ochrona przed oszustami",
      description:
        "Nasza AI wykrywa podejrzane treści i ostrzega przed potencjalnymi zagrożeniami",
    },
    {
      icon: Eye,
      title: "Łatwa obsługa",
      description:
        "Prosty interfejs zaprojektowany z myślą o seniorach i dzieciach",
    },
    {
      icon: Lock,
      title: "Prywatność danych",
      description:
        "Twoje dane są bezpieczne - nie przechowujemy sprawdzanych treści",
    },
    {
      icon: Zap,
      title: "Szybka analiza",
      description: "Wyniki sprawdzenia otrzymasz w kilka sekund",
    },
    {
      icon: Users,
      title: "Dla całej rodziny",
      description:
        "Idealne narzędzie do ochrony bliskich przed internetowymi oszustami",
    },
    {
      icon: Heart,
      title: "Bezpłatne użytkowanie",
      description: "Podstawowe funkcje dostępne za darmo dla wszystkich",
    },
  ];

  return (
    <section id="funkcje" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Dlaczego VeroAI?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stworzyliśmy narzędzie, które pomoże Ci bezpiecznie korzystać z
            internetu
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-12 flex items-center mb-4 gap-4">
                <div className="h-12 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
              </div>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
