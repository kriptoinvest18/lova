const HeroSection = () => {
  return (
    <section className="relative min-h-[60vh] flex flex-col items-center justify-center text-center px-6 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(270_30%_15%/0.4),transparent_70%)]" />
      <div className="relative z-10 max-w-3xl space-y-6">
        <p className="text-primary/70 text-sm tracking-[0.3em] uppercase">Сакральные звуки</p>
        <h1 className="text-4xl md:text-6xl font-bold text-primary gold-glow leading-tight">
          Мантры Силы
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Древние вибрации для трансформации сознания. Каждая мантра — ключ к внутренней энергии.
        </p>
        <div className="w-24 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto" />
      </div>
    </section>
  );
};

export default HeroSection;
