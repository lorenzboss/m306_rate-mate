import UserReviews from "@/components/user-reviews";

export default function Home() {
  return (
    <div className="flex h-[80vh] items-center justify-center gap-10">
      <div className="size-96 rounded-xl border-4 border-slate-200">
        My created reviews
      </div>
      <UserReviews />
    </div>
  );
}
