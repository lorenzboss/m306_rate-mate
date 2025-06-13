"use client";

import { Star, User, Award, Mail, Eye } from "lucide-react";
import { type ReviewWithDetails } from "@/lib/actions/review-actions";

interface ReviewCardProps {
  review: ReviewWithDetails;
  type: "created" | "received";
  onViewDetails: (review: ReviewWithDetails) => void;
}

export default function ReviewCard({ review, type, onViewDetails }: ReviewCardProps) {
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

  const userEmail = type === "created" ? review.receiver.EMail : review.owner?.EMail || "Anonymous";
  const userName = userEmail.split("@")[0]; // Extract username from email

  return (
    <div 
      onClick={() => onViewDetails(review)}
      className="group cursor-pointer relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-2xl hover:shadow-violet-500/10 transition-all duration-300 hover:scale-[1.02] hover:border-violet-200/50"
    >
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-50/20 via-transparent to-purple-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl transition-all duration-300 ${
              type === "created" 
                ? "bg-violet-100 group-hover:bg-violet-200" 
                : "bg-emerald-100 group-hover:bg-emerald-200"
            }`}>
              {type === "created" ? (
                <User className={`w-5 h-5 ${type === "created" ? "text-violet-600" : "text-emerald-600"}`} />
              ) : (
                <Award className="w-5 h-5 text-emerald-600" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">
                {type === "created" ? "Review for" : "Review from"}
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="font-medium truncate">{userName}</span>
                <span className="text-slate-400">•</span>
                <span className="text-xs truncate max-w-[120px]" title={userEmail}>{userEmail}</span>
              </div>
            </div>
          </div>
          
          {/* Rating Badge */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${getRatingBgColor(review.averageRating)} transition-all duration-300`}>
            <Star className={`w-4 h-4 ${getRatingColor(review.averageRating)} fill-current`} />
            <span className={`text-lg font-bold ${getRatingColor(review.averageRating)}`}>
              {review.averageRating.toFixed(1)}
            </span>
          </div>
        </div>

        {/* Aspects Preview */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {review.ratings.slice(0, 3).map((rating, index) => (
              <span 
                key={index}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors duration-200 break-words"
                title={`${rating.aspect.Name}: ${rating.aspect.Description}`}
              >
                <span className="truncate max-w-[80px]">{rating.aspect.Name}</span>
                <span className={`text-xs ${getRatingColor(rating.Rating)}`}>
                  {rating.Rating}★
                </span>
              </span>
            ))}
            {review.ratings.length > 3 && (
              <span className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-violet-100 to-purple-100 text-violet-700 text-xs font-medium rounded-lg">
                +{review.ratings.length - 3} more
              </span>
            )}
          </div>
          
          {review.ratings.length === 0 && (
            <p className="text-sm text-slate-500 italic">No ratings yet</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="text-sm text-slate-500">
            <span className="font-medium">{review.totalRatings}</span> aspect{review.totalRatings !== 1 ? 's' : ''} rated
          </div>
          
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-violet-600 hover:text-violet-700 hover:bg-violet-50 text-sm font-medium transition-all duration-200 group-hover:translate-x-1">
            <Eye className="w-4 h-4" />
            View Details
          </button>
        </div>

        {/* Hover indicator */}
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-violet-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-right" />
      </div>
    </div>
  );
}