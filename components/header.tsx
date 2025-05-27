import Link from "next/link";

export default function Header() {
  const isAdmin = true; // Replace with logic
  return (
    <header className="m-4 flex h-16 items-center justify-between rounded-full border-2 border-slate-200 px-5 shadow-md">
      <div className="flex items-center gap-5">
        <Link
          href="/"
          className="size-18 transition-all duration-300 hover:scale-110"
        >
          <img src="icons/home.png" alt="R8M8 Logo" />
        </Link>
        <Link
          href="/review/create"
          className="font-semibold transition-all duration-300 hover:scale-105"
        >
          Create Review
        </Link>
        <Link
          href="/analytics"
          className={`${!isAdmin && "hidden"} font-semibold transition-all duration-300 hover:scale-105`}
        >
          Analytics (Admin only)
        </Link>
      </div>
      <div className="flex items-center">
        <Link
          href="/users"
          className={`${!isAdmin && "hidden"} font-semibold transition-all duration-300 hover:scale-105`}
        >
          User Management (Admin only)
        </Link>
      </div>
    </header>
  );
}
