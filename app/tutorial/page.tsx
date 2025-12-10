"use client"
import { cn } from "@/lib/utils"
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'


interface TutorialStep {
  title: string
  description: string
  content: React.ReactNode
}

interface TutorialSection {
  id: string
  title: string
  description: string
  icon: string
  color: string
  steps: TutorialStep[]
}
//funkcja do konsturowania ścieżki obrazka
const imgUrlHelp = (name: string) => `/tutorial/${name}.png`;

const Tutorial = () => {
  const [activeSectionSteps, setActiveSectionSteps] = useState<Record<string, number>>({})
  const [stepHeights, setStepHeights] = useState<Record<string, number[]>>({})
  const stepRefs = useRef<Record<string, HTMLDivElement[]>>({})

  useEffect(() => {
    // Zbierz wysokości kroków dla każdej sekcji
    const newStepHeights: Record<string, number[]> = {}
    
    document.querySelectorAll('[data-section]').forEach((section) => {
      const sectionId = section.getAttribute('data-section')
      if (!sectionId) return
      
      const stepElements = section.querySelectorAll('[data-step]')
      const heights: number[] = []
      
      stepElements.forEach((element) => {
        const rect = element.getBoundingClientRect()
        heights.push(rect.height + 32) // dodaj space-y-8 (32px)
      })
      
      newStepHeights[sectionId] = heights
    })
    
    setStepHeights(newStepHeights)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const newActiveSectionSteps: Record<string, number> = {}

      document.querySelectorAll('[data-section]').forEach((section) => {
        const sectionId = section.getAttribute('data-section')
        const stepElements = section.querySelectorAll('[data-step]')
        let activeStep = 0

        stepElements.forEach((element, index) => {
          const rect = element.getBoundingClientRect()
          if (rect.top < window.innerHeight / 2) {
            activeStep = index
          }
        })

        if (sectionId) {
          newActiveSectionSteps[sectionId] = activeStep
        }
      })

      setActiveSectionSteps(newActiveSectionSteps)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const sections: TutorialSection[] = [
    {
      id: 'image-detector',
      title: 'Wykrywacz AI Zdjęć',
      description: 'Sprawdź czy zdjęcie zostało wygenerowane przez sztuczną inteligencję',
      icon: '🖼️',
      color: 'blue',
      steps: [
        {
          title: 'Krok 1: Wejdź do narzędzia',
          description: 'Otwórz Wykrywacz AI Zdjęć z pulpitu nawigacyjnego.',
          content: (
            <div className="space-y-4">
              <div className="relative w-full bg-muted rounded-lg overflow-hidden border border-border">
                <Image
                  src={imgUrlHelp('image-detector-step1')}
                  alt="Strona główna pulpitu nawigacyjnego z trzema narzędziami"
                  width={800}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-foreground leading-relaxed">
                Na pulpicie nawigacyjnym znajdziesz trzy główne narzędzia. Kliknij na kartę "Wykrywacz AI Zdjęć" aby otworzyć narzędzie do sprawdzania zdjęć.
              </p>
            </div>
          )
        },
        {
          title: 'Krok 2: Dodaj zdjęcie',
          description: 'Możesz przesłać plik, wkleić link lub przeciągnąć zdjęcie.',
          content: (
            <div className="space-y-4">
              <div className="relative w-full bg-muted rounded-lg overflow-hidden border border-border">
                <Image
                  src={imgUrlHelp('image-detector-step2')}
                  alt="Interfejs przesyłania zdjęcia z opcjami przeciągnij i upuść"
                  width={800}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
              <div className="space-y-2">
                <p className="text-foreground leading-relaxed">
                  Masz trzy możliwości dodania zdjęcia:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary font-semibold">1.</span>
                    <span>Kliknij "Wybierz Zdjęcie" aby otworzyć folder na komputerze</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-semibold">2.</span>
                    <span>Przeciągnij zdjęcie myszą i upuść je na szary obszar</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-semibold">3.</span>
                    <span>Wklej URL zdjęcia w pole tekstowe</span>
                  </li>
                </ul>
              </div>
            </div>
          )
        },
        {
          title: 'Krok 3: Czekaj na wynik analizy',
          description: 'System automatycznie analizuje zdjęcie.',
          content: (
            <div className="space-y-4">
              <div className="relative w-full bg-muted rounded-lg overflow-hidden border border-border">
                <Image
                  src={imgUrlHelp('image-detector-step3')}
                  alt="Ekran ładowania z komunikatem Analizuję zdjęcie"
                  width={800}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-foreground leading-relaxed">
                Analiza zwykle zajmuje 5-30 sekund. Czekaj cierpliwie na wynik. Nie zamykaj strony podczas analizy.
              </p>
            </div>
          )
        },
        {
          title: 'Krok 4: Przeczytaj wynik',
          description: 'Wynik pokazuje czy zdjęcie jest autentyczne czy wygenerowane przez AI.',
          content: (
            <div className="space-y-4">
              <div className="relative w-full bg-muted rounded-lg overflow-hidden border border-border">
                <Image
                  src={imgUrlHelp('image-detector-step4')}
                  alt="Wynik analizy pokazujący zdjęcie autentyczne ze wskaźnikiem pewności"
                  width={800}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
              <div className="space-y-3">
                <p className="text-foreground leading-relaxed">
                  System pokazuje trzy możliwe wyniki:
                </p>
                <div className="space-y-2">
                  <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-green-700 font-semibold">Autentyczne</span>
                    <span className="text-green-700">Zdjęcie wydaje się oryginalne</span>
                  </div>
                  <div className="flex gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <span className="text-yellow-700 font-semibold">Niepewne</span>
                    <span className="text-yellow-700">Wynik nie jest jednoznaczny</span>
                  </div>
                  <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <span className="text-red-700 font-semibold">Wygenerowane przez AI</span>
                    <span className="text-red-700">Zdjęcie jest podejrzane</span>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: 'article-checker',
      title: 'Weryfikator Wiadomości',
      description: 'Sprawdź czy artykuł zawiera fałszywe informacje',
      icon: '📰',
      color: 'green',
      steps: [
        {
          title: 'Krok 1: Otwórz Weryfikator',
          description: 'Przejdź do narzędzia weryfikacji artykułów.',
          content: (
            <div className="space-y-4">
              <div className="relative w-full bg-muted rounded-lg overflow-hidden border border-border">
                <Image
                  src={imgUrlHelp('fake-news-detector-step1')}
                  alt="Wybór Weryfikatora Wiadomości na pulpicie nawigacyjnym"
                  width={800}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-foreground leading-relaxed">
                Kliknij kartę "Weryfikator Wiadomości" aby otworzyć narzędzie do sprawdzania artykułów.
              </p>
            </div>
          )
        },
        {
          title: 'Krok 2: Dodaj artykuł',
          description: 'Możesz wkleić link do artykułu lub jego treść.',
          content: (
            <div className="space-y-4">
              <div className="relative w-full bg-muted rounded-lg overflow-hidden border border-border">
                <Image
                  src={imgUrlHelp('fake-news-detector-step2')}
                  alt="Formularz z wyborem pomiędzy wklejeniem linku lub treści artykułu"
                  width={800}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
              <div className="space-y-2">
                <p className="text-foreground leading-relaxed">
                  Masz dwie opcje:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary font-semibold">1.</span>
                    <span>Wklej link do artykułu ze strony internetowej</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-semibold">2.</span>
                    <span>Skopiuj i wklej treść artykułu bezpośrednio</span>
                  </li>
                </ul>
                <p className="text-sm text-muted-foreground mt-4">
                  Aby skopiować tekst: zaznacz go myszą, naciśnij Ctrl+C, a następnie wklej Ctrl+V w polu tekstowym.
                </p>
              </div>
            </div>
          )
        },
        {
          title: 'Krok 3: Sprawdź wiarygodność',
          description: 'Naciśnij przycisk aby system sprawdził artykuł.',
          content: (
            <div className="space-y-4">
              <div className="relative w-full bg-muted rounded-lg overflow-hidden border border-border">
                <Image
                  src={imgUrlHelp('fake-news-detector-step3')}
                  alt="Ekran podczas analizy artykułu z paskiem postępu"
                  width={800}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-foreground leading-relaxed">
                System analizuje artykuł w poszukiwaniu sprzeczności i fałszywych informacji. Analiza zajmuje 10-20 sekund.
              </p>
            </div>
          )
        },
        {
          title: 'Krok 4: Przeanalizuj wynik',
          description: 'Wynik zawiera szczegółową analizę artykułu.',
          content: (
            <div className="space-y-4">
              <div className="relative w-full bg-muted rounded-lg overflow-hidden border border-border">
                <Image
                  src={imgUrlHelp('fake-news-detector-step4')}
                  alt="Wynik weryfikacji artykułu z oznaczeniem wiarygodności i wskaźnikami"
                  width={800}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
              <div className="space-y-3">
                <p className="text-foreground leading-relaxed">
                  Wynik zawiera:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex gap-3">
                    <span className="text-primary font-semibold">•</span>
                    <span>Główne werdykty - czy artykuł jest prawdziwy czy fałszywy</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-semibold">•</span>
                    <span>Wskaźniki zagrożenia - fragmenty które mogą być fałszywe</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-semibold">•</span>
                    <span>Rozumowanie - wyjaśnienie decyzji systemu</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-primary font-semibold">•</span>
                    <span>Zalecenie - co powinieneś wiedzieć</span>
                  </li>
                </ul>
              </div>
            </div>
          )
        }
      ]
    },
    {
      id: 'phishing-detector',
      title: 'Detektor Phishingu',
      description: 'Sprawdź czy e-mail nie jest próbą oszustwa',
      icon: '📧',
      color: 'orange',
      steps: [
        {
          title: 'Krok 1: Otwórz Detektor',
          description: 'Przejdź do narzędzia do sprawdzania e-maili.',
          content: (
            <div className="space-y-4">
              <div className="relative w-full bg-muted rounded-lg overflow-hidden border border-border">
                <Image
                  src={imgUrlHelp('phishing-detector-step1')}
                  alt="Wybór Detektora Phishingu na pulpicie nawigacyjnym"
                  width={800}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-foreground leading-relaxed">
                Kliknij kartę "Detektor Phishingu" aby otworzyć narzędzie do analizy e-maili.
              </p>
            </div>
          )
        },
        {
          title: 'Krok 2: Dodaj adres e-maila',
          description: 'Wpisz adres nadawcy podejrzanej wiadomości.',
          content: (
            <div className="space-y-4">
              <div className="relative w-full bg-muted rounded-lg overflow-hidden border border-border">
                <Image
                  src={imgUrlHelp('phishing-detector-step2')}
                  alt="Pole do wpisania adresu e-maila nadawcy"
                  width={800}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-foreground leading-relaxed">
                Skopiuj adres e-maila nadawcy z wiadomości i wklej go w pole tekstowe. Adres powinien wyglądać tak: osoba@domena.pl
              </p>
            </div>
          )
        },
        {
          title: 'Krok 3: Wklej treść e-maila',
          description: 'Dodaj pełną zawartość podejrzanej wiadomości.',
          content: (
            <div className="space-y-4">
              <div className="relative w-full bg-muted rounded-lg overflow-hidden border border-border">
                <Image
                  src={imgUrlHelp('phishing-detector-step3')}
                  alt="Duże pole tekstowe do wklejenia treści e-maila"
                  width={800}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
              <div className="space-y-2">
                <p className="text-foreground leading-relaxed">
                  Zaznacz całą treść e-maila w programie poczty i wklej tutaj.
                </p>
                <p className="text-sm text-muted-foreground">
                  Aby skopiować: zaznacz tekst (Ctrl+A), skopiuj (Ctrl+C), wklej w pole (Ctrl+V)
                </p>
              </div>
            </div>
          )
        },
        {
          title: 'Krok 4: Sprawdź e-mail',
          description: 'Uruchom analizę bezpieczeństwa wiadomości.',
          content: (
            <div className="space-y-4">
              <div className="relative w-full bg-muted rounded-lg overflow-hidden border border-border">
                <Image
                  src={imgUrlHelp('phishing-detector-step4')}
                  alt="Ekran z informacją o trwającej analizie e-maila"
                  width={800}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-foreground leading-relaxed">
                Kliknij przycisk "Sprawdź e-mail" i czekaj na wynik. Analiza zajmuje 5-15 sekund.
              </p>
            </div>
          )
        },
        {
          title: 'Krok 5: Przeczytaj wynik',
          description: 'Wynik pokazuje czy e-mail jest bezpieczny czy podejrzany.',
          content: (
            <div className="space-y-4">
              <div className="relative w-full bg-muted rounded-lg overflow-hidden border border-border">
                <Image
                  src={imgUrlHelp('image-detector-step1')}
                  alt="Wynik analizy e-maila ze wskaźnikiem zagrożenia"
                  width={800}
                  height={450}
                  className="w-full h-auto"
                />
              </div>
              <div className="space-y-3">
                <p className="text-foreground leading-relaxed">
                  System pokazuje trzy możliwe wyniki:
                </p>
                <div className="space-y-2">
                  <div className="flex gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <span className="text-red-700 font-semibold">Niebezpieczny</span>
                    <span className="text-red-700">To jest oszustwo, usuń e-mail natychmiast</span>
                  </div>
                  <div className="flex gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <span className="text-yellow-700 font-semibold">Podejrzany</span>
                    <span className="text-yellow-700">E-mail wymaga ostrożności, nie klikaj linków</span>
                  </div>
                  <div className="flex gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <span className="text-green-700 font-semibold">Bezpieczny</span>
                    <span className="text-green-700">E-mail wydaje się autentyczny</span>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      ]
    }
  ]

  const tableOfContents = [
    { id: 'image-detector', label: 'Wykrywacz AI Zdjęć' },
    { id: 'article-checker', label: 'Weryfikator Wiadomości' },
    { id: 'phishing-detector', label: 'Detektor Phishingu' }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-12" role="main">
        {/* Nagłówek */}
        <div className="max-w-3xl mx-auto mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Poradnik użytkownika
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Krok po kroku wyjaśniamy jak korzystać z każdego narzędzia VeroAI. Każdy krok zawiera zrzuty ekranu i szczegółowe instrukcje.
          </p>
        </div>

        {/* Spis treści */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Zawartość poradnika
            </h2>
            <nav className="space-y-2">
              {tableOfContents.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="block px-4 py-2 text-primary hover:bg-muted rounded-md transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Sekcje */}
        <div className="max-w-3xl mx-auto space-y-16">
          {sections.map((section) => (
            <section 
              key={section.id} 
              id={section.id} 
              className="scroll-mt-8"
              data-section={section.id}
            >
              {/* Nagłówek sekcji */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{section.icon}</span>
                  <div>
                    <h2 className="text-3xl font-bold text-foreground">
                      {section.title}
                    </h2>
                    <p className="text-muted-foreground">
                      {section.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Kroki */}
              <div className="space-y-8">
                {section.steps.map((step, stepIndex) => {
                  const stepHeight = stepHeights[section.id]?.[stepIndex] || 0
                  const isActive = activeSectionSteps[section.id] === stepIndex
                  const isNextActive = activeSectionSteps[section.id] === stepIndex + 1

                  return (
                    <div 
                      key={stepIndex} 
                      className="relative"
                      data-step={`${section.id}-${stepIndex}`}
                    >
                      {/* Krok */}
                      <div className="flex gap-6">
                        {/* Numer kroku - STICKY z linią czasu */}
                        <div className="flex flex-col items-center sticky top-[75px] h-12 z-10">
                          {/* Linia czasu pionowa - dynamiczna wysokość */}
                          {stepIndex < section.steps.length - 1 && (
                            <div 
                              className="absolute left-1/2 transform -translate-x-1/2 w-0.5 pointer-events-none transition-opacity duration-300"
                              style={{
                                top: '100%',
                                height: `${stepHeight}px`,
                                background: isActive || isNextActive 
                                  ? 'linear-gradient(to bottom, rgba(59, 130, 246, 0.3), rgb(59, 130, 246))'
                                  : 'linear-gradient(to bottom, rgba(156, 163, 175, 0.2), rgba(156, 163, 175, 0.5))',
                                opacity: isActive || isNextActive ? 1 : 0.5
                              }}
                            />
                          )}
                          
                          {/* Sam numer */}
                          <div 
                            className={cn(
                              "flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg shrink-0 transition-all duration-300 relative z-20 bg-background",
                              isActive
                                ? 'bg-primary text-white scale-110 shadow-lg' 
                                : 'bg-muted text-muted-foreground'
                            )}
                          >
                            {stepIndex + 1}
                          </div>
                        </div>

                        {/* Zawartość kroku */}
                        <div className="flex-1 pt-1">
                          <Card 
                            className={cn(
                              "border-border transition-all duration-300",
                              isActive
                                ? 'border-primary shadow-md' 
                                : 'border-border'
                            )}
                          >
                            <CardHeader>
                              <CardTitle className="text-xl">
                                {step.title}
                              </CardTitle>
                              <CardDescription className="text-base">
                                {step.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              {step.content}
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto mt-16 pt-12 border-t border-border">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Gotów do rozpoczęcia?
            </h2>
            <p className="text-muted-foreground mb-6">
              Przejdź do pulpitu nawigacyjnego i zacznij sprawdzać zawartość.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="gap-2">
                Przejdź do narzędzi
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default Tutorial