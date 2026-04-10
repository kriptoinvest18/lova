import HeroSection from "@/components/HeroSection";
import MantraCard from "@/components/MantraCard";
import mantrasData, { type Mantra } from "@/data/mantras";

const Index = () => {
  // Group mantras by category
  const grouped = mantrasData.reduce<Record<string, Mantra[]>>((acc, m) => {
    const cat = m.category || "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(m);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background relative">
      <HeroSection />

      <main className="max-w-5xl mx-auto px-6 pb-20 space-y-16">
        {mantrasData.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Мантры ещё не добавлены</p>
            <p className="text-muted-foreground/50 text-sm mt-2">
              Добавьте мантру в файл src/data/mantras.ts
            </p>
          </div>
        )}

        {Object.entries(grouped).map(([category, items]) => (
          <section key={category} className="space-y-6">
            {Object.keys(grouped).length > 1 && (
              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
                <h2 className="text-lg font-semibold text-primary/70 tracking-wider uppercase">
                  {category}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.map((mantra) => (
                <MantraCard key={mantra.id} mantra={mantra} />
              ))}
            </div>
          </section>
        ))}
      </main>

      <footer className="text-center py-8 border-t border-border">
        <p className="text-muted-foreground/50 text-sm">✦ Мантры Силы ✦</p>
      </footer>

    </div>
  );
};

export default Index;
