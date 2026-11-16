import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import type { AuthSession } from "@/lib/auth";
import { persistAuth, readStoredAuth } from "@/lib/auth";
import Index from "./pages/Index";
import AccountPage from "./pages/Account";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    setSession(readStoredAuth());
    setAuthLoaded(true);
  }, []);

  useEffect(() => {
    if (!authLoaded) {
      return;
    }

    persistAuth(session);
  }, [authLoaded, session]);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route
                path="/"
                element={
                  <Index
                    session={session}
                    onAuthenticated={setSession}
                    onSignOut={() => setSession(null)}
                  />
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute session={session}>
                    <AccountPage session={session} onSignOut={() => setSession(null)} />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
