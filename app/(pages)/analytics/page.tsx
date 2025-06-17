"use client";

import ReviewCard from "@/components/review-card";
import {
  getAllUserReviews,
  getReviewDetails,
  getReviewStatistics,
  type ReviewStatistics,
  type ReviewWithDetails,
} from "@/lib/actions/review-actions";
import {
  ArrowDownRight,
  ArrowUpRight,
  Award,
  BarChart3,
  ChevronDown,
  ChevronUp,
  Star,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

// Statistik-Karte Komponente
function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "violet",
}: {
  title: string;
  value: string | number;
  icon: any;
  trend?: "up" | "down" | "neutral";
  color?: "violet" | "green" | "blue" | "orange";
}) {
  const colorClasses = {
    violet: "from-violet-500 to-purple-600",
    green: "from-green-500 to-emerald-600",
    blue: "from-blue-500 to-cyan-600",
    orange: "from-orange-500 to-red-500",
  };

  const trendIcon =
    trend === "up" ? ArrowUpRight : trend === "down" ? ArrowDownRight : null;
  const TrendIcon = trendIcon;

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/20 bg-white/70 p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900">{value}</p>
        </div>
        <div
          className={`rounded-xl bg-gradient-to-br p-3 ${colorClasses[color]} shadow-lg`}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
      {TrendIcon && (
        <div className="absolute top-4 right-4">
          <TrendIcon
            className={`h-4 w-4 ${trend === "up" ? "text-green-500" : "text-red-500"}`}
          />
        </div>
      )}
    </div>
  );
}

// Review-Details Modal
function ReviewDetailsModal({
  review,
  isOpen,
  onClose,
}: {
  review: ReviewWithDetails | null;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen || !review) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-violet-500 to-purple-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Review Details</h2>
              <p className="text-violet-100">
                {review.owner ? `From ${review.owner.EMail}` : "Anonymous"} →{" "}
                {review.receiver.EMail}
              </p>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 transition-colors hover:bg-white/20"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-120px)] overflow-y-auto p-6">
          {/* Overall Rating */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-violet-100 to-purple-100 px-6 py-3">
              <Star className="h-8 w-8 fill-current text-violet-600" />
              <span className="text-3xl font-bold text-violet-600">
                {review.averageRating.toFixed(1)}
              </span>
              <span className="text-slate-600">/ 5.0</span>
            </div>
            <p className="mt-2 text-slate-600">
              Average from {review.totalRatings} aspects
            </p>
          </div>

          {/* Aspect Ratings */}
          <div className="space-y-4">
            <h3 className="mb-4 text-xl font-semibold text-slate-900">
              Aspect Ratings
            </h3>

            {review.ratings.map((rating) => (
              <div key={rating.RatingID} className="rounded-xl bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {rating.aspect.Name}
                    </h4>
                    <p className="text-sm text-slate-600">
                      {rating.aspect.Description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-current text-violet-600" />
                    <span className="text-xl font-bold text-violet-600">
                      {rating.Rating}
                    </span>
                  </div>
                </div>

                {/* Rating Bar */}
                <div className="h-2 w-full rounded-full bg-slate-200">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500"
                    style={{ width: `${(rating.Rating / 5) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Haupt-Komponente
export default function ReviewsPage() {
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
