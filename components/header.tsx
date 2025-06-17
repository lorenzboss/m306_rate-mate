import { requireSession } from "@/lib/session";
import { BarChart3, Home, Plus, User } from "lucide-react";
import Link from "next/link";
import Logout from "./logout";

export default async function Header() {
  const session = await requireSession();

  const isAdmin = session?.user?.role === 2;
  const isLoggedIn = !!session?.user;

  return (
    <header className="relative w-full px-4 py-4 md:py-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-pink-500/5" />

      <div className="relative mx-auto max-w-7xl">
        <nav className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/70 px-6 py-4 shadow-xl shadow-black/5 backdrop-blur-xl transition-all duration-300 hover:shadow-2xl hover:shadow-black/10">
          {/* Logo und Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="group flex items-center gap-2 transition-all duration-300 hover:scale-105"
            >
              <div className="relative rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 p-2 shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:shadow-violet-500/25">
                <Home className="h-5 w-5 text-white" />
              </div>
              <span className="hidden bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-lg font-bold text-transparent sm:block">
                R8M8
              </span>
            </Link>

            {/* Admin Navigation */}
            {isAdmin && (
              <div className="hidden items-center gap-6 md:flex">
                <Link
                  href="/review/create"
                  className="group flex items-center gap-2 rounded-xl px-4 py-2 font-medium text-slate-700 transition-all duration-300 hover:bg-violet-50 hover:text-violet-600"
                >
                  <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
                  Create Review
                </Link>
                <Link
                  href="/analytics"
                  className="group flex items-center gap-2 rounded-xl px-4 py-2 font-medium text-slate-700 transition-all duration-300 hover:bg-violet-50 hover:text-violet-600"
                >
                  <BarChart3 className="h-4 w-4 transition-transform group-hover:scale-110" />
                  Analytics
                </Link>
              </div>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {isAdmin ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/users"
                  className="group rounded-xl p-2 transition-all duration-300 hover:bg-violet-50"
                  title="Manage Users"
                >
                  <User className="h-5 w-5 text-slate-600 transition-colors duration-300 group-hover:text-violet-600" />
                </Link>
                <Logout />
              </div>
            ) : isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/review/create"
                  className="hidden items-center gap-2 rounded-xl px-4 py-2 font-medium text-slate-700 transition-all duration-300 hover:bg-violet-50 hover:text-violet-600 sm:flex"
                >
                  <Plus className="h-4 w-4" />
                  Create Review
                </Link>
                <Logout />
              </div>
            ) : (
              <Link
                href="/login"
                className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-2.5 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-violet-600 hover:to-purple-700 hover:shadow-xl hover:shadow-violet-500/25"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-white/0 via-white/20 to-white/0 transition-transform duration-700 group-hover:translate-x-[100%]" />
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isAdmin && (
          <div className="mt-3 flex gap-2 md:hidden">
            <Link
              href="/review/create"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/50 px-4 py-2.5 font-medium text-slate-700 backdrop-blur-sm transition-all duration-300 hover:bg-violet-50 hover:text-violet-600"
            >
              <Plus className="h-4 w-4" />
              Create
            </Link>
            <Link
              href="/analytics"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/50 px-4 py-2.5 font-medium text-slate-700 backdrop-blur-sm transition-all duration-300 hover:bg-violet-50 hover:text-violet-600"
            >
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
