import { requireSession } from "@/lib/session";
import { LogOut, User, Home, BarChart3, Plus } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Logout from "./logout";

export default async function Header() {
  const session = await requireSession();

  const isAdmin = session?.user?.role === 2;
  const isLoggedIn = !!session?.user;

  return (
    <header className="relative w-full py-4 px-4 md:py-6">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-purple-500/5 to-pink-500/5" />
      
      <div className="relative mx-auto max-w-7xl">
        <nav className="flex items-center justify-between rounded-2xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-xl shadow-black/5 px-6 py-4 transition-all duration-300 hover:shadow-2xl hover:shadow-black/10">
          
          {/* Logo und Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="group flex items-center gap-2 transition-all duration-300 hover:scale-105"
            >
              <div className="relative p-2 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg group-hover:shadow-xl group-hover:shadow-violet-500/25 transition-all duration-300">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="hidden sm:block font-bold text-lg bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                R8M8
              </span>
            </Link>
            
            {/* Admin Navigation */}
            {isAdmin && (
              <div className="hidden md:flex items-center gap-6">
                <Link
                  href="/review/create"
                  className="group flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-600 transition-all duration-300"
                >
                  <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
                  Create Review
                </Link>
                <Link
                  href="/analytics"
                  className="group flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-600 transition-all duration-300"
                >
                  <BarChart3 className="w-4 h-4 transition-transform group-hover:scale-110" />
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
                  className="group p-2 rounded-xl hover:bg-violet-50 transition-all duration-300"
                  title="Manage Users"
                >
                  <User className="w-5 h-5 text-slate-600 group-hover:text-violet-600 transition-colors duration-300" />
                </Link>
                <Logout />
              </div>
            ) : isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/review/create"
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-slate-700 hover:bg-violet-50 hover:text-violet-600 transition-all duration-300"
                >
                  <Plus className="w-4 h-4" />
                  Create Review
                </Link>
                <Logout />
              </div>
            ) : (
              <Link
                href="/login"
                className="group relative overflow-hidden px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-violet-500/25 hover:scale-105"
              >
                <span className="relative z-10">Login</span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </Link>
            )}
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isAdmin && (
          <div className="md:hidden mt-3 flex gap-2">
            <Link
              href="/review/create"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-slate-700 bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-violet-50 hover:text-violet-600 transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Create
            </Link>
            <Link
              href="/analytics"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-medium text-slate-700 bg-white/50 backdrop-blur-sm border border-white/20 hover:bg-violet-50 hover:text-violet-600 transition-all duration-300"
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}