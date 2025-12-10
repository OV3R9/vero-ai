"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const slideLeft = {
  hidden: { opacity: 0, x: -80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const slideRight = {
  hidden: { opacity: 0, x: 80 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
};

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-hero-from to-hero-to py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Chroń siebie i bliskich
            <br />
            <span className="text-primary">przed internetowymi oszustami</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            VeroAI wykorzystuje sztuczną inteligencję, aby pomóc seniorom i
            dzieciom wykrywać fałszywe zdjęcia, nieprawdziwe wiadomości i
            podejrzane e-maile. Prosty i bezpieczny.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="gap-2 text-base px-8 py-6">
              Sprawdź teraz
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        <div className="w-full flex flex-col gap-12">
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideRight}
            className="bg-white w-full rounded-2xl"
          >
            <div className="mx-auto max-w-6xl px-4 md:px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
                  🖼️ Weryfikator zdjęć AI
                </h1>
                <p className="text-base md:text-lg text-black/70 mb-6">
                  Dowiedz się, czy zdjęcie zostało stworzone przez sztuczną
                  inteligencję. Nasz system identyfikuje artefakty typowe dla
                  generatywnych modeli, analizuje szczegóły obrazu i wykrywa
                  nienaturalne wzorce.
                </p>

                <Link
                  href="#"
                  className="inline-block bg-[#0056d2] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0041a0] transition"
                >
                  Wypróbuj weryfikator zdjęć
                </Link>
              </div>

              <div className="w-full flex justify-center">
                <Image
                  src="/Screen1.png"
                  alt="Hero Image"
                  width={500}
                  height={350}
                  className="rounded-xl shadow-md w-full h-auto"
                />
              </div>
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideLeft}
            className="bg-white w-full rounded-2xl"
          >
            <div className="mx-auto max-w-6xl px-4 md:px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
              <div className="w-full flex justify-center">
                <Image
                  src="/Screen2.png"
                  alt="Hero Image"
                  width={500}
                  height={350}
                  className="rounded-xl shadow-md w-full h-auto"
                />
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
                  📰 Weryfikator newsów
                </h1>
                <p className="text-base md:text-lg text-black/70 mb-6">
                  Sprawdzaj szybko, czy wiadomość pochodzi z wiarygodnego
                  źródła. Analizujemy treść i wykrywamy typowe sygnały
                  dezinformacji.
                </p>

                <Link
                  href="#"
                  className="inline-block bg-[#0056d2] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0041a0] transition"
                >
                  Wypróbuj weryfikator newsów
                </Link>
              </div>
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideRight}
            className="bg-white w-full rounded-2xl"
          >
            <div className="mx-auto max-w-6xl px-4 md:px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
                  📧 Weryfikator e-mail
                </h1>
                <p className="text-base md:text-lg text-black/70 mb-6">
                  Sprawdź, czy adres e-mail jest prawidłowy, aktywny i gotowy do
                  użycia. Weryfikator analizuje strukturę adresu, dostępność
                  domeny oraz potencjalne błędy.
                </p>

                <Link
                  href="#"
                  className="inline-block bg-[#0056d2] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0041a0] transition"
                >
                  Wypróbuj weryfikator e-mail
                </Link>
              </div>

              <div className="w-full flex justify-center">
                <Image
                  src="/Screen3.png"
                  alt="Hero Image"
                  width={500}
                  height={350}
                  className="rounded-xl shadow-md w-full h-auto"
                />
              </div>
            </div>
          </motion.section>

          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={slideLeft}
            className="bg-white w-full rounded-2xl"
          >
            <div className="mx-auto max-w-6xl px-4 md:px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-center">
              <div className="w-full flex justify-center">
                <Image
                  src="/Screen4.png"
                  alt="Hero Image"
                  width={500}
                  height={350}
                  className="rounded-xl shadow-md w-full h-auto"
                />
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">
                  🔐 Generator haseł
                </h1>
                <p className="text-base md:text-lg text-black/70 mb-6">
                  Twórz w kilka sekund bezpieczne, unikalne hasła dopasowane do
                  Twoich potrzeb. Wybierz długość hasła i stopień
                  skomplikowania.
                </p>

                <Link
                  href="#"
                  className="inline-block bg-[#0056d2] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0041a0] transition"
                >
                  Wypróbuj generator haseł
                </Link>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </section>
  );
};

export default Hero;
