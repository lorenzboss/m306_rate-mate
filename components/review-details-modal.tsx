import { ReviewWithDetails } from "@/app/actions/review-actions";
import { MessageSquare, Shield, Star } from "lucide-react";

export default function ReviewDetailsModal({
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
              <div className="flex flex-row items-center gap-2">
                <h2 className="text-2xl font-bold">Review Details </h2>
                {review.IsPrivate && <Shield className="s h-6 w-6" />}
              </div>

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

          {/* Comment Section */}
          {review.comment && (
            <div className="mb-8">
              <div className="rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                <div className="mb-3 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-900">
                    Comment
                  </h3>
                </div>
                <div className="prose prose-sm max-w-none">
                  <p className="leading-relaxed whitespace-pre-wrap text-slate-700">
                    {review.comment}
                  </p>
                </div>
              </div>
            </div>
          )}

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
