"use client";

import { Star, User, Award, Mail, Eye } from "lucide-react";
import { type ReviewWithDetails } from "@/lib/actions/review-actions";

interface ReviewCardProps {
  review: ReviewWithDetails;
  type: "created" | "received";
  onViewDetails: (review: ReviewWithDetails) => void;
}

export default function ReviewCard({
  review,
  type,
  onViewDetails,
}: ReviewCardProps) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600";
    if (rating >= 3.5) return "text-lime-600";
    if (rating >= 2.5) return "text-yellow-600";
    if (rating >= 1.5) return "text-orange-600";
    return "text-red-600";
  };

  const getRatingBgColor = (rating: number) => {
    if (rating >= 4.5) return "bg-green-100";
    if (rating >= 3.5) return "bg-lime-100";
    if (rating >= 2.5) return "bg-yellow-100";
    if (rating >= 1.5) return "bg-orange-100";
    return "bg-red-100";
  };

  const userEmail =
    type === "created"
      ? review.receiver.EMail
      : review.owner?.EMail || "Anonymous";
  const userName = userEmail.split("@")[0]; // Extract username from email

  return (
    <div
      onClick={() => onViewDetails(review)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/30 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-violet-200/50 hover:shadow-2xl hover:shadow-violet-500/10"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/20 via-transparent to-purple-50/20 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`rounded-xl p-2.5 transition-all duration-300 ${
                type === "created"
                  ? "bg-violet-100 group-hover:bg-violet-200"
                  : "bg-emerald-100 group-hover:bg-emerald-200"
              }`}
            >
              {type === "created" ? (
                <User
                  className={`h-5 w-5 ${type === "created" ? "text-violet-600" : "text-emerald-600"}`}
                />
              ) : (
                <Award className="h-5 w-5 text-emerald-600" />
              )}
            </div>
            <div>
              <h3 className="mb-1 font-semibold text-slate-900">
                {type === "created" ? "Review for" : "Review from"}
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate font-medium">{userName}</span>
                <span className="text-slate-400">•</span>
                <span
                  className="max-w-[120px] truncate text-xs"
                  title={userEmail}
                >
                  {userEmail}
                </span>
              </div>
            </div>
          </div>

          {/* Rating Badge */}
          <div
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 ${getRatingBgColor(review.averageRating)} transition-all duration-300`}
          >
            <Star
              className={`h-4 w-4 ${getRatingColor(review.averageRating)} fill-current`}
            />
            <span
              className={`text-lg font-bold ${getRatingColor(review.averageRating)}`}
            >
              {review.averageRating}
            </span>
          </div>
        </div>

        {/* Aspects Preview */}
        <div className="mb-4">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {review.ratings.slice(0, 3).map((rating, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium break-words text-slate-700 transition-colors duration-200 hover:bg-slate-200"
                title={`${rating.aspect.Name}: ${rating.aspect.Description}`}
              >
                <span className="max-w-[80px] truncate">
                  {rating.aspect.Name}
                </span>
                <span className={`text-xs ${getRatingColor(rating.Rating)}`}>
                  {rating.Rating}★
                </span>
              </span>
            ))}
            {review.ratings.length > 3 && (
              <span className="inline-flex items-center rounded-lg bg-gradient-to-r from-violet-100 to-purple-100 px-2.5 py-1 text-xs font-medium text-violet-700">
                +{review.ratings.length - 3} more
              </span>
            )}
          </div>

          {review.ratings.length === 0 && (
            <p className="text-sm text-slate-500 italic">No ratings yet</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="text-sm text-slate-500">
            <span className="font-medium">{review.totalRatings}</span> aspect
            {review.totalRatings !== 1 ? "s" : ""} rated
          </div>

          <button className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-violet-600 transition-all duration-200 group-hover:translate-x-1 hover:bg-violet-50 hover:text-violet-700">
            <Eye className="h-4 w-4" />
            View Details
          </button>
        </div>

        {/* Hover indicator */}
        <div className="absolute top-0 right-0 h-full w-1 origin-right scale-x-0 transform bg-gradient-to-b from-violet-500 to-purple-600 transition-transform duration-300 group-hover:scale-x-100" />
      </div>
    </div>
  );
}
