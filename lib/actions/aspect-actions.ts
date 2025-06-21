"use server";

import { db } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema für die Validierung
const createAspectSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name must be less than 100 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .max(500, "Description must be less than 500 characters"),
});

export async function createAspect(data: {
  name: string;
  description: string;
}) {
  try {
    const session = await requireSession();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Validierung der Eingabedaten
    const validationResult = createAspectSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: "Invalid data",
        details: validationResult.error.format(),
      };
    }

    const { name, description } = validationResult.data;

    // Prüfen ob ein Aspect mit diesem Namen bereits existiert
    const existingAspect = await db.aspect.findFirst({
      where: {
        Name: {
          equals: name,
          mode: "insensitive", // Case-insensitive Vergleich
        },
      },
    });

    if (existingAspect) {
      return {
        success: false,
        error: "An aspect with this name already exists",
      };
    }

    // Aspect erstellen
    const aspect = await db.aspect.create({
      data: {
        Name: name.trim(),
        Description: description.trim(),
      },
    });

    // Cache invalidieren
    revalidatePath("/aspects");
    revalidatePath("/reviews");

    return {
      success: true,
      message: "Aspect created successfully",
      aspectId: aspect.AspectID,
    };
  } catch (error) {
    console.error("Error creating aspect:", error);
    return { success: false, error: "Failed to create aspect" };
  }
}

export async function getAllAspects() {
  try {
    const aspects = await db.aspect.findMany({
      orderBy: {
        Name: "asc",
      },
      include: {
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });

    return { success: true, aspects };
  } catch (error) {
    console.error("Error fetching aspects:", error);
    return { success: false, error: "Failed to fetch aspects" };
  }
}

export async function deleteAspect(aspectId: string) {
  try {
    const session = await requireSession();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Prüfen ob der Aspect existiert
    const aspect = await db.aspect.findUnique({
      where: { AspectID: aspectId },
      include: {
        _count: {
          select: {
            ratings: true,
          },
        },
      },
    });

    if (!aspect) {
      return { success: false, error: "Aspect not found" };
    }

    // Prüfen ob der Aspect bereits in Ratings verwendet wird
    if (aspect._count.ratings > 0) {
      return {
        success: false,
        error: "Cannot delete aspect that is already used in ratings",
      };
    }

    // Aspect löschen
    await db.aspect.delete({
      where: { AspectID: aspectId },
    });

    // Cache invalidieren
    revalidatePath("/aspects");
    revalidatePath("/reviews");

    return {
      success: true,
      message: "Aspect deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting aspect:", error);
    return { success: false, error: "Failed to delete aspect" };
  }
}

export async function editAspect(
  aspectId: string,
  data: {
    name: string;
    description: string;
  },
) {
  try {
    const session = await requireSession();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    // Validierung der Eingabedaten
    const validationResult = createAspectSchema.safeParse(data);
    if (!validationResult.success) {
      return {
        success: false,
        error: "Invalid data",
        details: validationResult.error.format(),
      };
    }

    const { name, description } = validationResult.data;

    // Prüfen, ob der neue Name bereits von einem anderen Aspect verwendet wird
    const existingAspect = await db.aspect.findFirst({
      where: {
        Name: {
          equals: name,
          mode: "insensitive",
        },
        NOT: {
          AspectID: aspectId,
        },
      },
    });

    if (existingAspect) {
      return {
        success: false,
        error: "Another aspect with this name already exists",
      };
    }

    // Aspect aktualisieren
    const updatedAspect = await db.aspect.update({
      where: { AspectID: aspectId },
      data: {
        Name: name.trim(),
        Description: description.trim(),
      },
    });

    // Cache invalidieren
    revalidatePath("/aspects");
    revalidatePath("/reviews");

    return {
      success: true,
      message: "Aspect updated successfully",
      aspectId: updatedAspect.AspectID,
    };
  } catch (error) {
    console.error("Error updating aspect:", error);
    return { success: false, error: "Failed to update aspect" };
  }
}
