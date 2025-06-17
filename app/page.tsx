import UserReviews from "@/components/user-reviews";

export default function Home() {
  return (
    <div className="flex h-[80vh] items-center justify-center gap-10">
      <UserReviews type="created" />
      <UserReviews type="received" />
    </div>
  );
}
