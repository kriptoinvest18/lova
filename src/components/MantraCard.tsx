import { Play, Pause, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { Mantra } from "@/data/mantras";

interface MantraCardProps {
  mantra: Mantra;
}

const MantraCard = ({ mantra }: MantraCardProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current || !mantra.audio_url) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
    setProgress(pct || 0);
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="card-mystical rounded-xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_hsl(43_80%_55%/0.15)]">
      {mantra.image_url && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={mantra.image_url}
            alt={mantra.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
        </div>
      )}

      <div className="p-5 space-y-3">
        <h3 className="text-xl font-semibold text-primary gold-glow">{mantra.title}</h3>

        {mantra.description && (
          <p className="text-muted-foreground text-base leading-relaxed">{mantra.description}</p>
        )}

        {mantra.instructions && (
          <div className="bg-muted/50 rounded-lg p-3 border border-border">
            <p className="text-sm text-foreground/80 italic">{mantra.instructions}</p>
          </div>
        )}

        {mantra.audio_url && (
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/80 transition-colors shrink-0"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <audio
              ref={audioRef}
              src={mantra.audio_url}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleEnded}
              preload="metadata"
            />
          </div>
        )}

        <Link
          to={`/mantra/${mantra.id}`}
          className="inline-flex items-center gap-1 text-sm text-primary/70 hover:text-primary transition-colors pt-1"
        >
          Подробнее <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};

export default MantraCard;
