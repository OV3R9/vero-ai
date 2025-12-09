import { Shield } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">VeroAI</span>
            </Link>
            <p className="text-background/70 text-sm">
              Chronimy seniorów i dzieci przed oszustwami internetowymi
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Narzędzia</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <Link
                  href="/dashboard/sprawdz-zdjecie"
                  className="hover:text-background transition-colors"
                >
                  Wykrywacz AI Zdjęć
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/sprawdz-artykul"
                  className="hover:text-background transition-colors"
                >
                  Weryfikator Wiadomości
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/sprawdz-email"
                  className="hover:text-background transition-colors"
                >
                  Detektor Phishingu
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Pomoc</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Jak korzystać
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Kontakt
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Informacje</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  O nas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Polityka prywatności
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-background transition-colors">
                  Regulamin
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 pt-8 text-center text-sm text-background/70">
          <p>&copy; 2025 VeroAI. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
