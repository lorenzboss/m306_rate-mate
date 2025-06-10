import { getUserReviews } from "@/lib/actions/wizard-actions";
import { requireSession } from "@/lib/session";
import { Review } from "@/lib/definitions/review-definitions";
import ReviewCard from "./review-card";

export default async function UserReviews() {
  const session = await requireSession();
  if (!session?.user?.id) {
    return <div>Please log in to see your reviews.</div>;
  }
  const result = await getUserReviews(session?.user?.id);

  if (!result.success) {
    return <div>Fehler beim Laden der Bewertungen: {result.error}</div>;
  }

  if (!result.reviews) {
    return <div>Keine Bewertungen gefunden.</div>;
  }
  const reviews: Review[] = result.reviews;

  console.log("User Reviews:", reviews);

  return (
    <div>
      {reviews.map((review) => (
        <ReviewCard key={review.ReviewID} review={review} />
      ))}
    </div>
  );
}
