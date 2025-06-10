import React from "react";
import { Review } from "@/lib/definitions/review-definitions";

type ReviewProps = {
  review: Review;
};

export default function ReviewCard({ review }: ReviewProps) {
  return (
    <div className="mb-4 rounded-lg border-2 border-slate-200 p-4 shadow-md">
      <h3>{review.owner.EMail}</h3>
      <ul>
        {review.ratings.map((rating) => (
          <li key={rating.RatingID}>
            {rating.aspect.Name}: {rating.Rating} - {rating.aspect.Description}
          </li>
        ))}
      </ul>
    </div>
  );
}
