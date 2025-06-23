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
    <div className="h-[80vh]">
      <div className="m-12 flex items-center justify-center gap-3">
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
      <div className="flex items-center justify-center gap-20 p-4">
        <div className="w-[500px] rounded-2xl bg-white p-6 shadow-lg">
          <UserReviews type="created" />
        </div>
        <div className="w-[500px] rounded-2xl bg-white p-6 shadow-lg">
          <UserReviews type="received" />
        </div>
      </div>
    </div>
  );
}
