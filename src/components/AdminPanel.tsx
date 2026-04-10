import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { X, Upload, LogOut } from "lucide-react";

interface AdminPanelProps {
  onClose: () => void;
  onMantraAdded: () => void;
}

const AdminPanel = ({ onClose, onMantraAdded }: AdminPanelProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [category, setCategory] = useState("general");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const uploadFile = async (file: File, bucket: string) => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Введите название мантры");
      return;
    }
    setLoading(true);
    try {
      let image_url: string | null = null;
      let audio_url: string | null = null;

      if (imageFile) {
        image_url = await uploadFile(imageFile, "mantra-images");
      }
      if (audioFile) {
        audio_url = await uploadFile(audioFile, "mantra-audio");
      }

      const { error } = await supabase.from("mantras").insert({
        title: title.trim(),
        description: description.trim() || null,
        instructions: instructions.trim() || null,
        category: category.trim() || "general",
        image_url,
        audio_url,
      });

      if (error) throw error;

      toast.success("Мантра добавлена!");
      setTitle("");
      setDescription("");
      setInstructions("");
      setCategory("general");
      setImageFile(null);
      setAudioFile(null);
      onMantraAdded();
    } catch (err: any) {
      toast.error(err.message || "Ошибка при добавлении");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm overflow-y-auto">
      <div className="max-w-xl mx-auto p-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-primary gold-glow">Добавить мантру</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Выйти">
              <LogOut className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Название *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ом Мани Падме Хум"
              className="bg-muted/50 border-border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Описание</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Мантра сострадания и мудрости..."
              className="bg-muted/50 border-border min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Инструкция</label>
            <Textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Повторяйте 108 раз на рассвете..."
              className="bg-muted/50 border-border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Категория</label>
            <Input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="защита, любовь, здоровье..."
              className="bg-muted/50 border-border"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Изображение</label>
            <label className="flex items-center gap-2 cursor-pointer bg-muted/50 border border-border rounded-md px-3 py-2 hover:bg-muted transition-colors">
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {imageFile ? imageFile.name : "Выберите файл"}
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Аудиозапись</label>
            <label className="flex items-center gap-2 cursor-pointer bg-muted/50 border border-border rounded-md px-3 py-2 hover:bg-muted transition-colors">
              <Upload className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {audioFile ? audioFile.name : "Выберите файл"}
              </span>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? "Загрузка..." : "Добавить мантру"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminPanel;
