import { requireSession } from "@/lib/session";
import { LogOut, User } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Logout from "./logout";

export default async function Header() {
  const session = await requireSession();

  const isAdmin = session?.user?.role === 2; // Replace with logic
  const isLoggedIn = !!session?.user;
  return (
    <header className="flex h-20 items-center justify-center">
      <div
        className={`${isAdmin ? "w-1/3" : "w-1/5"} flex h-14 items-center justify-between rounded-full border-2 border-slate-200 px-5 shadow-md`}
      >
        <div className="flex items-center gap-5">
          <Link
            href="/"
            className="size-18 transition-all duration-300 hover:scale-110"
          >
            <img src="icons/home.png" alt="R8M8 Logo" />
          </Link>
          {isAdmin && (
            <Link
              href="/review/create"
              className="font-semibold transition-all duration-300 hover:scale-105 hover:text-violet-500"
            >
              Create Review
            </Link>
          )}
          {isAdmin && (
            <Link
              href="/analytics"
              className="font-semibold transition-all duration-300 hover:scale-105 hover:text-violet-500"
            >
              Analytics
            </Link>
          )}
        </div>
        <div className="mr-2 flex items-center">
          {isAdmin ? (
            <div className="flex items-center gap-5">
              <Link
                href="/users"
                className="transition-all duration-300 hover:scale-115"
              >
                <User className="hover:text-violet-500" />
              </Link>
              <Logout />
            </div>
          ) : isLoggedIn ? (
            <div className="flex items-center gap-5">
              <Link
                href="/review/create"
                className="font-semibold transition-all duration-300 hover:scale-105 hover:text-violet-500"
              >
                Create Review
              </Link>
              <Logout />
            </div>
          ) : (
            <Link
              href="/login"
              className="font-semibold transition-all duration-300 hover:scale-105 hover:text-violet-500"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
