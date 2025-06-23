"use client";

import {
  getAllUserReviews,
  getReviewDetails,
  getReviewStatistics,
  type ReviewStatistics,
  type ReviewWithDetails,
} from "@/app/actions/review-actions";
import { getAllUsers, User } from "@/app/actions/user-management-actions";
import ReviewCard from "@/components/review-card";
import ReviewDetailsModal from "@/components/review-details-modal";
import StatCard from "@/components/stat-card";
import {
  Award,
  BarChart3,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Star,
  Target,
  TrendingUp,
  User as UserIcon,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

// Haupt-Komponente
export default function TeamReviewsPage() {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<Partial<User>[]>([]);
  const [selectedUser, setSelectedUser] = useState<Partial<User> | null>(null);
  const [createdReviews, setCreatedReviews] = useState<ReviewWithDetails[]>([]);
  const [receivedReviews, setReceivedReviews] = useState<ReviewWithDetails[]>(
    [],
  );
  const [statistics, setStatistics] = useState<ReviewStatistics | null>(null);
  const [selectedReview, setSelectedReview] =
    useState<ReviewWithDetails | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [expandedSection, setExpandedSection] = useState<
    "created" | "received" | "both"
  >("both");

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user.role !== 2 && session?.user.role !== 3) {
      redirect("/");
    }
  }, [session, status]);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersResult = await getAllUsers();
      // Filter nur Team-Mitglieder (Role 1)
      const teamMembers = usersResult.filter((user) => user.Role === 1);
      setUsers(teamMembers);
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (user: Partial<User>) => {
    setLoadingUserData(true);
    try {
      const [reviewsResult, statsResult] = await Promise.all([
        getAllUserReviews(user.UserID),
        getReviewStatistics(user.UserID),
      ]);

      if (reviewsResult.success) {
        setCreatedReviews(reviewsResult.createdReviews || []);
        setReceivedReviews(reviewsResult.receivedReviews || []);
      }

      if (statsResult.success) {
        setStatistics(statsResult.statistics);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoadingUserData(false);
    }
  };

  const handleUserSelect = async (user: Partial<User>) => {
    setSelectedUser(user);
    await loadUserData(user);
  };

  const handleBackToUsers = () => {
    setSelectedUser(null);
    setCreatedReviews([]);
    setReceivedReviews([]);
    setStatistics(null);
    setExpandedSection("both");
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

  // User List View
  if (!selectedUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 px-4 py-8">
        <div className="mx-auto max-w-7xl space-y-8">
          {/* Header */}
          <div className="space-y-4 text-center">
            <h1 className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
              Team Reviews
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Select a team member to view their reviews and performance
              statistics.
            </p>
          </div>

          {/* Users Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div
                key={user.UserID}
                onClick={() => handleUserSelect(user)}
                className="group cursor-pointer rounded-2xl border border-white/20 bg-white/80 p-6 shadow-sm transition-all duration-300 hover:border-violet-200 hover:bg-white hover:shadow-lg hover:shadow-violet-100/20"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 p-3 transition-all duration-300 group-hover:from-violet-200 group-hover:to-purple-200">
                    <UserIcon className="h-6 w-6 text-violet-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900 group-hover:text-violet-700">
                      {user.EMail}
                    </h3>
                    <p className="text-sm text-slate-500">Team Member</p>
                  </div>
                  <div className="rounded-full bg-violet-100 p-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    <ChevronDown className="h-4 w-4 rotate-[-90deg] text-violet-600" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {users.length === 0 && (
            <div className="rounded-2xl border border-white/20 bg-white/50 py-16 text-center">
              <Users className="mx-auto mb-4 h-16 w-16 text-slate-400" />
              <h3 className="mb-2 text-xl font-semibold text-slate-600">
                No Team Members Found
              </h3>
              <p className="text-slate-500">
                There are no team members to display.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Selected User View
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30 px-4 py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header with Back Button */}
        <div className="space-y-4">
          <button
            onClick={handleBackToUsers}
            className="flex items-center gap-2 rounded-xl bg-white/80 px-4 py-2 font-medium text-slate-600 transition-all duration-300 hover:bg-violet-50 hover:text-violet-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Team Members
          </button>

          <div className="text-center">
            <h1 className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
              {selectedUser.EMail}
            </h1>
            <p className="mx-auto max-w-2xl text-lg text-slate-600">
              Reviews and performance statistics for this team member.
            </p>
          </div>
        </div>

        {loadingUserData ? (
          <div className="flex items-center justify-center py-16">
            <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-violet-600"></div>
          </div>
        ) : (
          <>
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
              {(expandedSection === "created" ||
                expandedSection === "both") && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-violet-100 p-2">
                      <Users className="h-5 w-5 text-violet-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Reviews Created
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
              {(expandedSection === "received" ||
                expandedSection === "both") && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-green-100 p-2">
                      <Award className="h-5 w-5 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Reviews Received
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
                        <p className="text-slate-600">
                          No reviews received yet
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
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
