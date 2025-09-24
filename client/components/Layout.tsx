import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white text-slate-800">
      <header className="backdrop-blur supports-[backdrop-filter]:bg-white/60 bg-white/80 sticky top-0 z-40 border-b border-purple-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to={user ? "/reserve" : "/"} className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-600 to-fuchsia-500 grid place-items-center text-white font-extrabold">N</div>
            <div className="leading-tight">
              <div className="font-bold">Namma Metro</div>
              <div className="text-xs text-slate-500">Women Priority Coach</div>
            </div>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {user ? (
              <>
                <span className="hidden sm:inline text-slate-600">{user.email}</span>
                <button
                  onClick={() => signOut()}
                  className="px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                to="/"
                className="px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      <footer className="border-t border-purple-100 py-6 text-center text-sm text-slate-500">
        Bengaluru Metro • Women Priority Coach Reservation
      </footer>
    </div>
  );
}
