import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import Link from "next/link";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">VeroAI</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#funkcje"
              className="text-foreground hover:text-primary transition-colors"
            >
              Funkcje
            </a>
            <a
              href="#jak-dziala"
              className="text-foreground hover:text-primary transition-colors"
            >
              Jak działa
            </a>
            <a
              href="#bezpieczenstwo"
              className="text-foreground hover:text-primary transition-colors"
            >
              Bezpieczeństwo
            </a>
          </div>

          <Link href="/dashboard">
            <Button>Wypróbuj za darmo</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
