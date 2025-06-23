"use client";
import {
  getAllUserReviews,
  getReviewDetails,
  ReviewWithDetails,
} from "@/app/actions/review-actions";
import { useEffect, useState } from "react";
import ReviewCard from "./review-card";
import ReviewDetailsModal from "./review-details-modal";

interface UserReviewsProps {
  type: "created" | "received";
}

export default function UserReviews({ type }: UserReviewsProps) {
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);

  const [selectedReview, setSelectedReview] =
    useState<ReviewWithDetails | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [headerText, setHeaderText] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [reviewsResult] = await Promise.all([getAllUserReviews()]);

        if (reviewsResult.success) {
          if (type === "received") {
            setReviews(reviewsResult.receivedReviews || []);
            setHeaderText("Reviews Received");
          } else if (type === "created") {
            setReviews(reviewsResult.createdReviews || []);
            setHeaderText("Reviews Created");
          }
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [type]);

  const handleViewDetails = async (review: ReviewWithDetails) => {
    const detailsResult = await getReviewDetails(review.ReviewID);
    if (detailsResult.success) {
      setSelectedReview(detailsResult.review);
      setShowModal(true);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="self-center text-2xl font-bold">{headerText}</div>
      <div className="h-[435px] overflow-y-auto p-2">
        {reviews.map((review) => (
          <div className="mb-4" key={review.ReviewID}>
            <ReviewCard
              review={review}
              type="created"
              onViewDetails={handleViewDetails}
            />
          </div>
        ))}
      </div>

      <ReviewDetailsModal
        review={selectedReview}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
