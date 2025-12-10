"use client";

import Header from "@/components/Header";

const FAQ = () => {
  const faqs = [
    {
      question: "Jak to działa?",
      answer: `Korzystanie z VeroAI jest proste i intuicyjne. Wystarczy kilka kliknięć, aby sprawdzić, czy treść jest bezpieczna.`,
      steps: [
        "Wybierz typ sprawdzenia — zdjęcie, artykuł lub e-mail",
        "Wklej link, prześlij plik lub wpisz treść",
        "Poczekaj kilka sekund na analizę AI",
        "Otrzymaj wynik z wyjaśnieniem",
      ],
    },
    {
      question: "Co możesz sprawdzić?",
      answer: `VeroAI pozwala analizować najpopularniejsze rodzaje treści narażonych na manipulacje i oszustwa.`,
      categories: [
        {
          title: "Zdjęcia AI",
          desc: "Wykryj obrazy wygenerowane przez sztuczną inteligencję.",
        },
        {
          title: "Fałszywe wiadomości",
          desc: "Sprawdź wiarygodność artykułów i newsów.",
        },
        {
          title: "Podejrzane e‑maile",
          desc: "Wykryj phishing i próby wyłudzenia danych.",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Często zadawane pytania
        </h1>

        <div className="space-y-10">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl shadow bg-white border border-gray-200"
            >
              <h2 className="text-2xl font-semibold mb-4">{faq.question}</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">{faq.answer}</p>

              {faq.steps && (
                <ol className="list-decimal ml-6 space-y-1 text-gray-700">
                  {faq.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              )}

              {faq.categories && (
                <div className="mt-6 space-y-4">
                  {faq.categories.map((cat, i) => (
                    <div key={i} className="p-4 rounded-xl ">
                      <h3 className="text-xl font-medium">{cat.title}</h3>
                      <p className="text-gray-600">{cat.desc}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="/dashboard"
            className="underline text-primary text-xl font-medium hover:text-primary/80 transition"
          >
            Wróć do strony głównej
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
