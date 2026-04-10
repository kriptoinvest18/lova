import { useParams, Link } from "react-router-dom";
import mantrasData from "@/data/mantras";
import mantraDetails from "@/data/mantraDetails";
import { ArrowLeft } from "lucide-react";

const MantraPage = () => {
  const { id } = useParams<{ id: string }>();
  const mantra = mantrasData.find((m) => m.id === id);

  if (!mantra) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-2xl text-primary">Мантра не найдена</p>
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors underline">
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  const detail = mantraDetails[mantra.id];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Все мантры
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        {/* Image */}
        {mantra.image_url && (
          <div className="rounded-xl overflow-hidden aspect-video">
            <img
              src={mantra.image_url}
              alt={mantra.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title & Category */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-primary/60 tracking-widest uppercase">
            {mantra.category}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-primary gold-glow leading-tight">
            {mantra.title}
          </h1>
        </div>

        {/* Short description */}
        {mantra.description && (
          <p className="text-lg text-foreground/90 leading-relaxed">
            {mantra.description}
          </p>
        )}

        {/* Detailed description */}
        {detail && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Подробнее о мантре</h2>
            {detail.split("\n\n").map((paragraph, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed text-base">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {/* Instructions */}
        {mantra.instructions && (
          <div className="bg-muted/50 rounded-xl p-6 border border-border space-y-2">
            <h2 className="text-lg font-semibold text-foreground">Как практиковать</h2>
            <p className="text-foreground/80 leading-relaxed">{mantra.instructions}</p>
          </div>
        )}

        {/* Audio */}
        {mantra.audio_url && (
          <div className="pt-2">
            <audio controls className="w-full" src={mantra.audio_url} preload="metadata" />
          </div>
        )}
      </main>

      <footer className="text-center py-8 border-t border-border">
        <p className="text-muted-foreground/50 text-sm">✦ Мантры Силы ✦</p>
      </footer>
    </div>
  );
};

export default MantraPage;
