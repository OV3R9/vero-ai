"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ImageIcon,
  Newspaper,
  Mail,
  Home,
  HelpCircle,
  KeyRound,
  Menu,
  X,
  ShieldX,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import { useState } from "react";

const DashboardSidebar = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const mainLinks = [
    { to: "/dashboard", icon: Home, label: "Strona główna", exact: true },
    {
      to: "/dashboard/sprawdz-zdjecie",
      icon: ImageIcon,
      label: "Wykrywacz Zdjęć AI",
    },
    {
      to: "/dashboard/sprawdz-artykul",
      icon: Newspaper,
      label: "Weryfikator Newsów",
    },
    { to: "/dashboard/sprawdz-email", icon: Mail, label: "Detektor Phishingu" },
    {
      to: "/dashboard/generuj-haslo",
      icon: KeyRound,
      label: "Generator Haseł",
    },
  ];

  const bottomLinks = [
    { to: "/baza-zagrozen", icon: ShieldX, label: "Baza zagrożeń" },
    { to: "/faq", icon: HelpCircle, label: "FAQ" },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <>
      <button
        className="md:hidden fixed top-4 left-4 z-60 bg-card border border-border p-2 rounded-lg shadow-sm"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "w-72 bg-card border-r border-border min-h-screen flex flex-col fixed md:static z-50 transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6">
          <Link href="/" onClick={() => setOpen(false)}>
            <Logo className="text-foreground" />
          </Link>
        </div>

        <nav className="flex-1 px-4 gap-8">
          <div className="space-y-1">
            {mainLinks.map((link, index) => (
              <div key={link.to}>
                <Link
                  href={link.to}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all",
                    isActive(link.to, link.exact)
                      ? "pl-4 rounded-none text-foreground font-medium"
                      : "hover:ml-1.5 hover:font-medium text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive(link.to, link.exact) && (
                    <span className="w-1 h-8 bg-primary rounded-full" />
                  )}
                  <link.icon
                    className="w-5 h-5 scale-125"
                    strokeWidth={isActive(link.to, link.exact) ? 1.7 : 1.5}
                  />
                  {link.label}
                </Link>

                {index === 0 ? (
                  <div className="h-px bg-border m-3.5"></div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="h-px bg-border m-3.5" />

          <div className="space-y-1 mt-4 pb-4">
            {bottomLinks.map((link) => (
              <Link
                key={link.label}
                href={link.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all hover:ml-1.5 hover:font-medium text-muted-foreground hover:text-foreground"
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default DashboardSidebar;
