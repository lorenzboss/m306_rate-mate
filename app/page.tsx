import UserReviews from "@/components/user-reviews";
import { requireSession } from "@/lib/session";
import { SquareArrowUpRight } from "lucide-react";

export default async function Home() {
  const session = await requireSession();

  if (!session?.user?.id) {
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
    <div className="flex h-[80vh] items-center justify-center gap-20 p-4">
      <div className="w-[500px] rounded-2xl bg-white p-6 shadow-lg">
        <UserReviews type="created" />
      </div>
      <div className="w-[500px] rounded-2xl bg-white p-6 shadow-lg">
        <UserReviews type="received" />
      </div>
    </div>
  );
}
