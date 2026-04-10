import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import Index from "./pages/Index.tsx";
import MantraPage from "./pages/MantraPage.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminPanel from "@/components/AdminPanel.tsx";
import AuthForm from "@/components/AuthForm.tsx";

const queryClient = new QueryClient();

// Компонент-обёртка для защищённой админки
const AdminRoute = () => {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [mantras, setMantras] = useState<any[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchMantras = async () => {
    const { data } = await supabase.from("mantras").select("*").order("created_at", { ascending: false });
    if (data) setMantras(data);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Загрузка...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-primary">Доступ запрещён</h1>
            <button
              onClick={() => setShowAuth(true)}
              className="text-muted-foreground hover:text-primary transition-colors underline"
            >
              Войти как администратор
            </button>
          </div>
        </div>
        {showAuth && (
          <AuthForm
            onClose={() => setShowAuth(false)}
            onSuccess={() => {
              setShowAuth(false);
              window.location.reload();
            }}
          />
        )}
      </>
    );
  }

  return (
    <AdminPanel
      onClose={() => {}}
      onMantraAdded={fetchMantras}
    />
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/mantra/:id" element={<MantraPage />} />
          <Route path="/admin" element={<AdminRoute />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
