"use server";

import { db } from "@/lib/db";
import { requireTeamLeader, requireUser } from "@/lib/session";

export type ReviewWithDetails = {
  ReviewID: string;
  receiver: {
    UserID: string;
    EMail: string;
  };
  owner: {
    UserID: string;
    EMail: string;
  } | null;
  ratings: {
    RatingID: string;
    Rating: number;
    aspect: {
      AspectID: string;
      Name: string;
      Description: string;
    };
  }[];
  averageRating: number;
  totalRatings: number;
  comment: string;
  IsPrivate: boolean;
};

export type ReviewStatistics = {
  totalReviews: number;
  averageRating: number;
  highestRating: number;
  lowestRating: number;
  ratingDistribution: { [key: number]: number };
  mostRatedAspect: string | null;
  leastRatedAspect: string | null;
};

export async function getAllUserReviews(targetUserId?: string): Promise<
  | {
      success: true;
      createdReviews: ReviewWithDetails[];
      receivedReviews: ReviewWithDetails[];
    }
  | {
      success: false;
      error: string;
    }
> {
  try {
    const session = await requireUser();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    let userId = session.user.id;

    // Wenn eine andere User ID angefragt wird, prüfe ob der User Team Leader ist
    if (targetUserId && targetUserId !== session.user.id) {
      const isTeamLeader = await requireTeamLeader();
      if (!isTeamLeader) {
        return { success: false, error: "Insufficient permissions" };
      }
      userId = targetUserId;
    }

    // Reviews erstellt vom User
    const createdReviews = await db.review.findMany({
      where: {
        FKOwnerId: userId,
      },
      include: {
        receiver: {
          select: {
            UserID: true,
            EMail: true,
          },
        },
        owner: {
          select: {
            UserID: true,
            EMail: true,
          },
        },
        ratings: {
          include: {
            aspect: {
              select: {
                AspectID: true,
                Name: true,
                Description: true,
              },
            },
          },
        },
      },
      orderBy: {
        ratings: {
          _count: "desc",
        },
      },
    });

    // Reviews empfangen vom User
    const receivedReviews = await db.review.findMany({
      where: {
        FKReceiverId: userId,
      },
      include: {
        receiver: {
          select: {
            UserID: true,
            EMail: true,
          },
        },
        owner: {
          select: {
            UserID: true,
            EMail: true,
          },
        },
        ratings: {
          include: {
            aspect: {
              select: {
                AspectID: true,
                Name: true,
                Description: true,
              },
            },
          },
        },
      },
      orderBy: {
        ratings: {
          _count: "desc",
        },
      },
    });

    const processReviews = (
      reviews: any[],
      currentUserId: string,
    ): ReviewWithDetails[] => {
      return reviews.map((review) => {
        const totalRating = review.ratings.reduce(
          (sum: number, rating: any) => sum + rating.Rating,
          0,
        );
        const averageRating =
          review.ratings.length > 0 ? totalRating / review.ratings.length : 0;

        const hideOwner =
          review.IsPrivate && review.FKOwnerId !== currentUserId;

        return {
          ...review,
          owner: hideOwner ? null : review.owner,
          averageRating: Math.round(averageRating * 10) / 10,
          totalRatings: review.ratings.length,
        };
      });
    };

    const processedCreatedReviews = processReviews(
      createdReviews,
      session.user.id,
    );
    const processedReceivedReviews = processReviews(
      receivedReviews,
      session.user.id,
    );

    return {
      success: true,
      createdReviews: processedCreatedReviews,
      receivedReviews: processedReceivedReviews,
    };
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return { success: false, error: "Failed to fetch reviews" };
  }
}

export async function getReviewStatistics(targetUserId?: string): Promise<
  | {
      success: true;
      statistics: ReviewStatistics;
    }
  | {
      success: false;
      error: string;
    }
> {
  try {
    const session = await requireUser();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    let userId = session.user.id;

    // Wenn eine andere User ID angefragt wird, prüfe ob der User Team Leader ist
    if (targetUserId && targetUserId !== session.user.id) {
      const isTeamLeader = await requireTeamLeader();
      if (!isTeamLeader) {
        return { success: false, error: "Insufficient permissions" };
      }
      userId = targetUserId;
    }

    // Alle Ratings für Reviews des Users (sowohl erstellt als auch empfangen)
    const allRatings = await db.rating.findMany({
      where: {
        review: {
          OR: [{ FKOwnerId: userId }, { FKReceiverId: userId }],
        },
      },
      include: {
        aspect: true,
        review: true,
      },
    });

    if (allRatings.length === 0) {
      return {
        success: true,
        statistics: {
          totalReviews: 0,
          averageRating: 0,
          highestRating: 0,
          lowestRating: 0,
          ratingDistribution: {},
          mostRatedAspect: null,
          leastRatedAspect: null,
        } as ReviewStatistics,
      };
    }

    // Statistiken berechnen
    const ratings = allRatings.map((r) => r.Rating);
    const totalRating = ratings.reduce((sum, rating) => sum + rating, 0);
    const averageRating = totalRating / ratings.length;
    const highestRating = Math.max(...ratings);
    const lowestRating = Math.min(...ratings);

    // Rating-Verteilung
    const ratingDistribution: { [key: number]: number } = {};
    ratings.forEach((rating) => {
      ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
    });

    // Aspekt-Statistiken
    const aspectCounts: { [key: string]: number } = {};
    allRatings.forEach((rating) => {
      const aspectName = rating.aspect.Name;
      aspectCounts[aspectName] = (aspectCounts[aspectName] || 0) + 1;
    });

    const aspectEntries = Object.entries(aspectCounts);
    const mostRatedAspect =
      aspectEntries.length > 0
        ? aspectEntries.reduce((a, b) => (a[1] > b[1] ? a : b))[0]
        : null;
    const leastRatedAspect =
      aspectEntries.length > 0
        ? aspectEntries.reduce((a, b) => (a[1] < b[1] ? a : b))[0]
        : null;

    // Anzahl unique Reviews
    const uniqueReviewIds = new Set(allRatings.map((r) => r.FKReviewId));
    const totalReviews = uniqueReviewIds.size;

    return {
      success: true,
      statistics: {
        totalReviews,
        averageRating: Math.round(averageRating * 10) / 10,
        highestRating,
        lowestRating,
        ratingDistribution,
        mostRatedAspect,
        leastRatedAspect,
      },
    };
  } catch (error) {
    console.error("Error fetching review statistics:", error);
    return { success: false, error: "Failed to fetch statistics" };
  }
}

export async function getReviewDetails(reviewId: string): Promise<
  | {
      success: true;
      review: ReviewWithDetails;
    }
  | {
      success: false;
      error: string;
    }
> {
  try {
    const session = await requireUser();
    if (!session) {
      return { success: false, error: "Not authenticated" };
    }

    const review = await db.review.findUnique({
      where: {
        ReviewID: reviewId,
      },
      include: {
        receiver: {
          select: {
            UserID: true,
            EMail: true,
          },
        },
        owner: {
          select: {
            UserID: true,
            EMail: true,
          },
        },
        ratings: {
          include: {
            aspect: true,
          },
          orderBy: {
            aspect: {
              Name: "asc",
            },
          },
        },
      },
    });

    if (!review) {
      return { success: false, error: "Review not found" };
    }

    const userId = session.user.id;
    const isTeamLeader = await requireTeamLeader();

    // Zugriffsberechtigung prüfen:
    // - Eigene Reviews (als Owner oder Receiver)
    // - Team Leader können alle Reviews einsehen
    const hasAccess =
      review.FKOwnerId === userId ||
      review.FKReceiverId === userId ||
      isTeamLeader;

    if (!hasAccess) {
      return { success: false, error: "Access denied" };
    }

    // Durchschnittliche Bewertung berechnen
    const totalRating = review.ratings.reduce(
      (sum, rating) => sum + rating.Rating,
      0,
    );
    const averageRating =
      review.ratings.length > 0 ? totalRating / review.ratings.length : 0;

    const hideOwner = review.IsPrivate && review.FKOwnerId !== userId;

    const sanitizedReview: ReviewWithDetails = {
      ...review,
      owner: hideOwner ? null : review.owner,
      averageRating: Math.round(averageRating * 10) / 10,
      totalRatings: review.ratings.length,
      comment: review.Comment ?? "",
    };

    return {
      success: true,
      review: sanitizedReview,
    };
  } catch (error) {
    console.error("Error fetching review details:", error);
    return { success: false, error: "Failed to fetch review details" };
  }
}
