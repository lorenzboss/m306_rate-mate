"use client";

import ReviewCard from "@/components/review-card";
import ReviewDetailsModal from "@/components/review-details-modal";
import StatCard from "@/components/stat-card";
import {
  getAllUserReviews,
  getReviewDetails,
  getReviewStatistics,
  type ReviewStatistics,
  type ReviewWithDetails,
} from "@/lib/actions/review-actions";
import {
  Award,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

// Haupt-Komponente
export default function ReviewsPage() {
  const { data: session, status } = useSession();
  const [createdReviews, setCreatedReviews] = useState<ReviewWithDetails[]>([]);
  const [receivedReviews, setReceivedReviews] = useState<ReviewWithDetails[]>(
    [],
  );
  const [statistics, setStatistics] = useState<ReviewStatistics | null>(null);
  const [selectedReview, setSelectedReview] =
    useState<ReviewWithDetails | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState<
    "created" | "received" | "both"
  >("both");

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      redirect("/");
    }
  }, [session, status]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [reviewsResult, statsResult] = await Promise.all([
        getAllUserReviews(),
        getReviewStatistics(),
      ]);

      if (reviewsResult.success) {
        setCreatedReviews(reviewsResult.createdReviews || []);
        setReceivedReviews(reviewsResult.receivedReviews || []);
      }

      if (statsResult.success) {
        setStatistics(statsResult.statistics);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            Analytics
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Track your created reviews and received feedback with detailed
            insights and statistics.
          </p>
        </div>

        {/* Statistics */}
        {statistics && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Reviews"
              value={statistics.totalReviews}
              icon={BarChart3}
              color="violet"
            />
            <StatCard
              title="Average Rating"
              value={statistics.averageRating.toFixed(1)}
              icon={Star}
              color="green"
            />
            <StatCard
              title="Highest Rating"
              value={statistics.highestRating}
              icon={TrendingUp}
              color="blue"
              trend="up"
            />
            <StatCard
              title="Most Rated Aspect"
              value={statistics.mostRatedAspect || "None"}
              icon={Target}
              color="orange"
            />
          </div>
        )}

        {/* Section Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() =>
              setExpandedSection(
                expandedSection === "created" ? "both" : "created",
              )
            }
            className={`rounded-xl px-6 py-2 font-medium transition-all duration-300 ${
              expandedSection === "created" || expandedSection === "both"
                ? "bg-violet-100 text-violet-700"
                : "bg-white/50 text-slate-600 hover:bg-violet-50"
            }`}
          >
            Created Reviews ({createdReviews.length})
            {expandedSection === "created" ? (
              <ChevronUp className="ml-1 inline h-4 w-4" />
            ) : (
              <ChevronDown className="ml-1 inline h-4 w-4" />
            )}
          </button>
          <button
            onClick={() =>
              setExpandedSection(
                expandedSection === "received" ? "both" : "received",
              )
            }
            className={`rounded-xl px-6 py-2 font-medium transition-all duration-300 ${
              expandedSection === "received" || expandedSection === "both"
                ? "bg-violet-100 text-violet-700"
                : "bg-white/50 text-slate-600 hover:bg-violet-50"
            }`}
          >
            Received Reviews ({receivedReviews.length})
            {expandedSection === "received" ? (
              <ChevronUp className="ml-1 inline h-4 w-4" />
            ) : (
              <ChevronDown className="ml-1 inline h-4 w-4" />
            )}
          </button>
        </div>

        {/* Reviews Lists */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-2">
          {/* Created Reviews */}
          {(expandedSection === "created" || expandedSection === "both") && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-violet-100 p-2">
                  <Users className="h-5 w-5 text-violet-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Reviews You Created
                </h2>
              </div>

              <div className="space-y-4">
                {createdReviews.length > 0 ? (
                  createdReviews.map((review) => (
                    <ReviewCard
                      key={review.ReviewID}
                      review={review}
                      type="created"
                      onViewDetails={handleViewDetails}
                    />
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/20 bg-white/50 py-12 text-center">
                    <Users className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                    <p className="text-slate-600">No reviews created yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Received Reviews */}
          {(expandedSection === "received" || expandedSection === "both") && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <Award className="h-5 w-5 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Reviews You Received
                </h2>
              </div>

              <div className="space-y-4">
                {receivedReviews.length > 0 ? (
                  receivedReviews.map((review) => (
                    <ReviewCard
                      key={review.ReviewID}
                      review={review}
                      type="received"
                      onViewDetails={handleViewDetails}
                    />
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/20 bg-white/50 py-12 text-center">
                    <Award className="mx-auto mb-4 h-12 w-12 text-slate-400" />
                    <p className="text-slate-600">No reviews received yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Review Details Modal */}
      <ReviewDetailsModal
        review={selectedReview}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
}
