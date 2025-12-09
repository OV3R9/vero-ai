"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Shield, ImageIcon, Newspaper, Mail, Home, HelpCircle, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const DashboardSidebar = () => {
  const pathname = usePathname()

  const mainLinks = [
    { to: "/dashboard", icon: Home, label: "Strona główna", exact: true },
    { to: "/dashboard/sprawdz-zdjecie", icon: ImageIcon, label: "Wykrywacz AI Zdjęć" },
    { to: "/dashboard/sprawdz-artykul", icon: Newspaper, label: "Weryfikator Wiadomości" },
    { to: "/dashboard/sprawdz-email", icon: Mail, label: "Detektor Phishingu" },
  ]

  const bottomLinks = [
    { to: "#", icon: HelpCircle, label: "FAQ" },
    { to: "#", icon: Settings, label: "Ustawienia" },
  ]

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return pathname === path
    }
    return pathname.startsWith(path)
  }

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Shield className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">VeroAI</span>
        </Link>
      </div>

      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {mainLinks.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive(link.to, link.exact)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
            >
              <link.icon className="w-5 h-5" />
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
  )
}

export default DashboardSidebar
