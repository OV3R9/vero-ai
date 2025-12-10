import { cn } from "@/lib/utils";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Mail,
  Image as ImageIcon,
  Lock,
} from "lucide-react";

interface Article {
  id: string;
  bg: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  content: string[];
  color: string;
  cta: {
    text: string;
    link: string;
  };
}

const Articles = () => {
  const articles: Article[] = [
    {
      bg: "bg-orange-600 text-white",
      id: "phishing",
      title: "Phishing - Oszustwa przez E-mail",
      description: "Jak rozpoznać podejrzane e-maile i chronić swoje dane",
      icon: <Mail className="w-8 h-8 text-orange-500" />,
      color: "from-orange-50 to-orange-100",
      content: [
        "Phishing to rodzaj oszustwa, gdzie oszuści wysyłają fałszywe e-maile, które wyglądają jak od banku, poczty lub popularnej strony.",
        "Te e-maile proszą Cię o kliknięcie linku lub wprowadzenie hasła. Jeśli zrobisz to, oszuści mogą ukraść Twoje pieniądze lub dane.",
        "Jak się chronić:",
        "• Nigdy nie klikaj linków z podejrzanych e-maili",
        "• Bank nigdy nie prosi o hasło przez e-mail",
        "• Sprawdź adres e-maila - prawdziwe są: nazwa@domena.pl",
        "• Jeśli coś wygląda dziwnie, zadzwoń do banku lub instytucji",
        "• Zawsze sprawdzaj czy strona to https:// (zielona kłódka)",
        "Pamiętaj: prawdziwe instytucje nigdy nie proszą o hasło przez e-mail!",
      ],
      cta: {
        text: "Sprawdź e-mail za pomocą naszego detektora",
        link: "/dashboard/sprawdz-email",
      },
    },
    {
      bg: "text-white",
      id: "ai-images",
      title: "Zdjęcia Generowane przez AI",
      description: "Jak odkryć sztuczne zdjęcia i nieprawdziwe zdjęcia",
      icon: <ImageIcon className="w-8 h-8 text-primary" />,
      color: "from-blue-50 to-blue-100",
      content: [
        "Sztuczna inteligencja może tworzyć bardzo realistyczne zdjęcia, które nigdy nie istniały. Oszuści używają ich do oszustw.",
        "Mogą pokazywać Ci fałszywe osoby, produkty lub sytuacje, aby Cię oszukać.",
        "Jak rozpoznać sztuczne zdjęcie:",
        "• Szukaj dziwnych detali - np. krzywe ręce, niemożliwe odbicia",
        "• Tekst na zdjęciu często jest rozmyty lub dziwny",
        "• Oczy mogą wyglądać nienaturalnie",
        "• Tło może mieć dziwne anomalie",
        "• Jeśli zdjęcie pochodzi z nieznanego źródła, bądź ostrożny",
        "Jeśli ktoś wysyła Ci podejrzane zdjęcie - zawsze je zweryfikuj!",
        "Najlepiej użyć naszego narzędzia, które automatycznie sprawdzi czy zdjęcie jest prawdziwe.",
      ],
      cta: {
        text: "Sprawdź zdjęcie za pomocą naszego detektora AI",
        link: "/dashboard/sprawdz-zdjecie",
      },
    },
    {
      bg: "bg-red-600 text-white",
      id: "deepfakes",
      title: "Deepfakes i Fałszywe Wideo",
      description: "Oszustwa przy użyciu fałszywych filmów i głosów",
      icon: <ImageIcon className="w-8 h-8 text-red-600" />,
      color: "from-red-50 to-red-100",
      content: [
        "Deepfake to fałszywe wideo lub nagranie audio, które wygląda na prawdziwe. AI może stworzyć wideo, gdzie osoba mówi coś, czego nigdy nie powiedziała.",
        "Oszuści używają deepfake'ów do: włamań się na konta, wyłudzania pieniędzy, rozpowszechniania fałszywych informacji.",
        "Jak się chronić:",
        "• Jeśli ktoś wysyła Ci wideo od bliskiej osoby - zadzwoń do niej",
        "• Bądź ostrożny wobec filmów z nieznanych źródeł",
        "• Nie wierz wszystkim wiadomościom w mediach społecznościowych",
        "• Jeśli ktoś prosi Cię o pieniądze przez wideo - zawsze sprawdź czy to prawda",
        "• Nigdy nie udostępniaj swoich zdjęć nieznajomym",
        "Pamiętaj: jeśli wideo wygląda zbyt dobrze aby być prawdziwe - pewnie nie jest!",
      ],
      cta: {
        text: "Czytaj więcej o weryfikacji wiadomości",
        link: "/dashboard/sprawdz-artykul",
      },
    },
    {
      bg: "bg-green-600 text-white",
      id: "passwords",
      title: "Silne Hasła - Klucz do Bezpieczeństwa",
      description: "Jak tworzyć hasła, które będą trudne do złamania",
      icon: <Lock className="w-8 h-8 text-green-600" />,
      color: "from-green-50 to-green-100",
      content: [
        "Silne hasło to Twoja pierwsza linia obrony przed oszustami. Słabe hasło można złamać w kilka sekund.",
        "Jakie hasło jest słabe:",
        '• "123456" - zbyt proste',
        '• "haslo" - zbyt krótkie',
        "• Imiona lub daty urodzenia - łatwe do zgadnięcia",
        "• Tego samego hasła na wszędzie - jeśli jedna strona zostanie zhakowana, wszystkie są zagrożone",
        "Jakie hasło jest silne:",
        "• Minimum 12 znaków",
        "• Zawiera duże litery: A, B, C",
        "• Zawiera małe litery: a, b, c",
        "• Zawiera cyfry: 1, 2, 3",
        "• Zawiera znaki specjalne: !, @, #, $, %",
        "• Przykład: Koty2024!Bezpieczne",
        "Porady:",
        "• Nie zapisuj hasła w notatniku lub pliku",
        "• Używaj menedżera haseł (np. LastPass, Bitwarden)",
        "• Zmień hasło co pół roku",
        "• Jeśli myślisz, że ktoś je zna - zmień je natychmiast!",
        "Silne hasło = bezpieczny email i konto bankowe!",
      ],
      cta: {
        text: "Generuj silne hasła",
        link: "/dashboard/generuj-haslo",
      },
    },
    {
      bg: "bg-purple-500 text-white",
      id: "scams",
      title: "Oszustwa Online - Jak Się Chronić",
      description: "Najczęstsze oszustwa i jak ich uniknąć",
      icon: <Shield className="w-8 h-8 text-purple-500" />,
      color: "from-purple-50 to-purple-100",
      content: [
        "Oszuści są kreatywni i wymyślają coraz nowe sposoby, aby Cię okłamać. Oto najczęstsze oszustwa:",
        'Oszustwo 1: "Wygranąłeś nagrodę!"',
        "• Nigdy nie wygrywasz niczego bez udziału w konkursie",
        "• Nie klikaj linków z takich wiadomości",
        "• Nie podawaj swoich danych",
        'Oszustwo 2: "Twoje konto jest zagrożone"',
        "• Banki nigdy nie proszą o hasło przez e-mail",
        "• Zawsze idź na stronę banku sam, nie przez link",
        "• Jeśli masz wątpliwości - zadzwoń do banku",
        'Oszustwo 3: "Poznajmy się" - Oszustwa miłosne',
        "• Nie wysyłaj pieniędzy osobom, które poznałeś online",
        "• Jeśli osoba prosi Cię o pieniądze - to oszust",
        "• Prawdziwi znajomi nigdy nie proszą o pieniądze przez internet",
        "Ogólne reguły bezpieczeństwa:",
        "• Bądź sceptyczny - jeśli coś brzmi dziwnie, pewnie jest",
        "• Nie klikaj linków z nieznanych źródeł",
        "• Zawsze sprawdzaj adres strony (patrz na pasek adresu)",
        "• Używaj antywirusowe oprogramowanie",
        "• Aktualizuj swój system operacyjny",
        "Pamiętaj: najlepszą obroną jest Twoja czujność!",
      ],
      cta: {
        text: "Przejdź do poradnika",
        link: "/tutorial",
      },
    },
  ];

  return (
    <div>
      <Header />
      <main
        className={cn(
          "flex flex-col items-center justify-center mt-20 px-4 pb-16"
        )}
      >
        <div className="max-w-4xl mx-auto mb-16 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Edukacja i Bezpieczeństwo Online
          </h1>
          <p className="text-lg text-muted-foreground">
            Artykuły edukacyjne o tym, jak chronić się przed oszustami
            internetowymi. Pisane prostym językiem dla każdego.
          </p>
        </div>

        <div className="max-w-4xl mx-auto w-full space-y-8">
          {articles.map((article) => (
            <article
              key={article.id}
              className={cn(
                "rounded-2xl bg-linear-to-br",
                article.color,
                "border border-border overflow-hidden"
              )}
            >
              <div className="bg-white/50 backdrop-blur-sm border-b border-border p-6 sm:p-8">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3">{article.icon}</div>
                  <div className="flex-1">
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                      {article.title}
                    </h2>
                    <p className="text-muted-foreground">
                      {article.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <div className="space-y-3 text-foreground leading-relaxed mb-8">
                  {article.content.map((paragraph, index) => (
                    <p
                      key={index}
                      className={cn(
                        "text-base",
                        paragraph.startsWith("•") &&
                          "ml-4 text-muted-foreground",
                        (paragraph.endsWith(":") ||
                          paragraph.match(/^\d+\./)) &&
                          "font-semibold mt-4 text-foreground"
                      )}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="pt-6 border-t border-border/50">
                  <Link href={article.cta.link}>
                    <Button
                      className={cn(
                        "gap-2 w-full sm:w-auto text-foreground",
                        article.bg
                      )}
                    >
                      {article.cta.text}
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="max-w-4xl mx-auto w-full mt-16 p-8 bg-primary/5 border border-primary/20 rounded-2xl text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            Potrzebujesz więcej pomocy?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Sprawdź nasz poradnik krok po kroku, który wyjaśnia dokładnie jak
            korzystać z każdego narzędzia VeroAI.
          </p>
          <Link href="/tutorial">
            <Button size="lg" className="gap-2">
              Przejdź do poradnika
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Articles;
