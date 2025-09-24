import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import SignIn from "./pages/SignIn";
import Reserve from "./pages/Reserve";
import { AuthProvider, useAuth } from "./hooks/useAuth";

const queryClient = new QueryClient();

function RootRoutes() {
  const { user, loading } = useAuth();
  if (loading)
    return <div className="min-h-screen grid place-items-center">Loading…</div>;
  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/reserve" replace /> : <SignIn />}
      />
      <Route path="/reserve" element={<Reserve />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <RootRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
