import UserReviews from "@/components/user-reviews";
import { requireUser } from "@/lib/session";
import { SquareArrowUpRight, User } from "lucide-react";

export default async function Home() {
  const session = await requireUser();

  if (!session) {
    return (
      <div className="flex h-[45vh] items-center justify-center gap-5">
        <div className="flex text-4xl font-bold">
          Please log in to see your reviews
        </div>
        <SquareArrowUpRight className="size-10" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-violet-50/30 p-4">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header with User Info */}
        <div className="m-12 space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <div className="rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 p-3">
              <User className="h-6 w-6 text-violet-600" />
            </div>
            <div className="text-left">
              <h1 className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
                Welcome back!
              </h1>
              <p className="text-lg text-slate-600">{session.user.email}</p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-12 flex items-center justify-center gap-8">
          <div className="w-[500px] rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
            <UserReviews type="created" />
          </div>
          <div className="w-[500px] rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
            <UserReviews type="received" />
          </div>
        </div>
      </div>
    </div>
  );
}
