"use server";

import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema für die Validierung
const createReviewSchema = z.object({
  receiverId: z.string().uuid("Invalid receiver ID"),
  aspectRatings: z
    .array(
      z.object({
        aspectId: z.string().uuid("Invalid aspect ID"),
        rating: z.number().min(1).max(5, "Rating must be between 1 and 5"),
      }),
    )
    .min(1, "At least one aspect must be rated"),
  isPrivate: z.boolean(),
});

export async function getAspects() {
  try {
    const aspects = await db.aspect.findMany({
      orderBy: {
        Name: "asc",
      },
    });

    return { success: true, aspects };
  } catch (error) {
    console.error("Error fetching aspects:", error);
    return { success: false, error: "Failed to fetch aspects" };
  }
}

export async function getUsers() {
  try {
    const session = await requireSession();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Alle Benutzer außer dem aktuellen Benutzer abrufen
    const users = await db.user.findMany({
      where: {
        UserID: {
          not: session.user.id,
        },
      },
      select: {
        UserID: true,
        EMail: true,
      },
      orderBy: {
        EMail: "asc",
      },
    });

    return { success: true, users };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: "Failed to fetch users" };
  }
}

export async function createReview(data: {
  receiverId: string;
  aspectRatings: Array<{
    aspectId: string;
    rating: number;
  }>;
  isPrivate: boolean;
}) {
  try {
    const session = await requireSession();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Validierung der Eingabedaten
    const validationResult = createReviewSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: "Invalid data",
        details: validationResult.error.format(),
      };
    }

    const { receiverId, aspectRatings, isPrivate } = validationResult.data;

    // Prüfen ob der Empfänger existiert
    const receiver = await db.user.findUnique({
      where: { UserID: receiverId },
    });

    if (!receiver) {
      return { success: false, error: "Receiver not found" };
    }

    // Prüfen ob alle Aspects existieren
    const aspectIds = aspectRatings.map((ar) => ar.aspectId);
    const aspects = await db.aspect.findMany({
      where: { AspectID: { in: aspectIds } },
    });

    if (aspects.length !== aspectIds.length) {
      return { success: false, error: "One or more aspects not found" };
    }

    // Transaction für die Erstellung des Reviews und der Ratings
    const result = await db.$transaction(async (tx) => {
      // Review erstellen
      const review = await tx.review.create({
        data: {
          FKReceiverId: receiverId,
          FKOwnerId: session.user.id,
          // Hier könnten Sie ein isPrivate Feld hinzufügen, falls gewünscht
        },
      });

      // Ratings erstellen
      const ratings = await Promise.all(
        aspectRatings.map((ar) =>
          tx.rating.create({
            data: {
              Rating: ar.rating,
              FKReviewId: review.ReviewID,
              FKAspectId: ar.aspectId,
            },
          }),
        ),
      );

      return { review, ratings };
    });

    revalidatePath("/reviews");

    return {
      success: true,
      message: "Review created successfully",
      reviewId: result.review.ReviewID,
    };
  } catch (error) {
    console.error("Error creating review:", error);
    return { success: false, error: "Failed to create review" };
  }
}

export async function getUserReviews(userId: string) {
  try {
    const reviews = await db.review.findMany({
      where: {
        FKReceiverId: userId,
      },
      include: {
        owner: {
          select: {
            EMail: true,
          },
        },
        ratings: {
          include: {
            aspect: true,
          },
        },
      },
      orderBy: {
        ReviewID: "desc",
      },
    });

    return { success: true, reviews };
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    return { success: false, error: "Failed to fetch reviews" };
  }
}
