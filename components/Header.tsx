import { Button } from "@/components/ui/button";
import Link from "next/link";
import Logo from "./Logo";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/#funkcje"
              className="text-foreground hover:text-primary transition-colors"
            >
              Funkcje
            </Link>
            <Link
              href="/#jak-dziala"
              className="text-foreground hover:text-primary transition-colors"
            >
              Jak działa
            </Link>
            <Link
              href="/bezpieczenstwo"
              className="text-foreground hover:text-primary transition-colors"
            >
              Bezpieczeństwo
            </Link>
            <Link
              href="/tutorial"
              className="text-foreground hover:text-primary transition-colors"
            >
              Poradnik
            </Link>
          </div>

          <Link href="/dashboard">
            <Button>Przejdź dalej</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Header;
