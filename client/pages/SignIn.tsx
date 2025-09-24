import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
      }
      navigate("/reserve", { replace: true });
    } catch (err: any) {
      setError(err.message ?? "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div className="order-2 lg:order-1">
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-fuchsia-600 bg-clip-text text-transparent">
            Bangalore Metro Women Priority Coach
          </h1>
          <p className="mt-4 text-slate-600 max-w-prose">
            Reserve seats exclusively for women, pregnant women, elderly
            passengers, and women with large luggage. Secure, fast, and
            convenient.
          </p>
          <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
              Priority seating coach (50×2)
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-purple-500"></span>
              Real-time availability
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-fuchsia-500"></span>
              Digital ticket
            </li>
            <li className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span>
              Secure authentication
            </li>
          </ul>
        </div>
        <div className="order-1 lg:order-2">
          <form
            onSubmit={onSubmit}
            className="bg-white/80 backdrop-blur rounded-2xl border border-purple-100 p-6 shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {mode === "in" ? "Sign in" : "Create account"}
              </h2>
              <button
                type="button"
                onClick={() => setMode(mode === "in" ? "up" : "in")}
                className="text-purple-700 hover:text-purple-900 text-sm"
              >
                {mode === "in"
                  ? "New here? Sign up"
                  : "Have an account? Sign in"}
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="••••••••"
                />
              </div>
              {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white py-3 font-semibold hover:from-purple-700 hover:to-fuchsia-700 disabled:opacity-70"
              >
                {loading
                  ? "Please wait…"
                  : mode === "in"
                    ? "Sign in"
                    : "Sign up"}
              </button>
            </div>
            <p className="mt-4 text-xs text-slate-500">
              By continuing, you agree to the Terms and Privacy Policy.
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
}
