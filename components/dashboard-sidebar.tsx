"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  ImageIcon,
  Newspaper,
  Mail,
  Home,
  HelpCircle,
  Settings,
  KeyRound,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";

const DashboardSidebar = () => {
  const pathname = usePathname();

  const mainLinks = [
    { to: "/dashboard", icon: Home, label: "Strona główna", exact: true },
    {
      to: "/dashboard/sprawdz-zdjecie",
      icon: ImageIcon,
      label: "Wykrywacz AI Zdjęć",
    },
    {
      to: "/dashboard/sprawdz-artykul",
      icon: Newspaper,
      label: "Weryfikator Wiadomości",
    },
    { to: "/dashboard/sprawdz-email", icon: Mail, label: "Detektor Phishingu" },
    {
      to: "/dashboard/generuj-haslo",
      icon: KeyRound,
      label: "Generator Haseł",
    },
  ];

  const bottomLinks = [{ to: "#", icon: HelpCircle, label: "FAQ" }];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <aside className="w-72 bg-card border-r border-border min-h-screen flex flex-col">
      <div className="p-6">
        <Link href="/">
          <Logo className="text-foreground" />
        </Link>
      </div>

      <nav className="flex-1 px-4 gap-8">
        <div className="space-y-1">
          {mainLinks.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all",
                isActive(link.to, link.exact)
                  ? "pl-4 border-l-4 border-primary rounded-none text-foreground font-medium  "
                  : "hover:ml-1.5 hover:font-medium text-muted-foreground hover:text-foreground"
              )}
            >
              <link.icon
                className={cn("w-5 h-5 scale-125")}
                strokeWidth={isActive(link.to, link.exact) ? 1.7 : 1.5}
              />
              {link.label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="space-y-1">
          {bottomLinks.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
