"use client";

import {
  deleteAspect,
  editAspect,
  getAllAspects,
} from "@/app/actions/aspect-actions";
import AspectCard from "@/components/aspect-card";
import EditModal from "@/components/edit-modal";
import { Plus, Settings, Star, Target, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export interface Aspect {
  AspectID: string;
  Name: string;
  Description: string;
  _count: {
    ratings: number;
  };
}

export default function AspectsPage() {
  const { data: session, status } = useSession();
  const [aspects, setAspects] = useState<Aspect[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAspect, setEditingAspect] = useState<Aspect | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    loadAspects();
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (session?.user.role == 2 || session?.user.role == 3) {
    } else {
      redirect("/");
    }
  }, [session, status]);

  const loadAspects = async () => {
    setLoading(true);
    try {
      const result = await getAllAspects();
      if (result.success) {
        setAspects(result.aspects || []);
      }
    } catch (error) {
      console.error("Error loading aspects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (aspect: Aspect) => {
    setEditingAspect(aspect);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (
    aspectId: string,
    data: { name: string; description: string },
  ) => {
    const result = await editAspect(aspectId, data);
    if (result.success) {
      await loadAspects(); // Reload aspects to get updated data
    } else {
      alert(result.error || "Failed to update aspect");
    }
  };

  const handleDelete = async (aspectId: string) => {
    const result = await deleteAspect(aspectId);
    if (result.success) {
      await loadAspects(); // Reload aspects to remove deleted aspect
    } else {
      alert(result.error || "Failed to delete aspect");
    }
  };

  const totalRatings = aspects.reduce(
    (sum, aspect) => sum + aspect._count.ratings,
    0,
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-violet-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            Aspects Dashboard
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            Manage your review aspects and track their usage across all reviews.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-white/20 bg-white/50 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-100 p-2">
                <Settings className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Aspects</p>
                <p className="text-2xl font-bold text-slate-900">
                  {aspects.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/50 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-green-100 p-2">
                <Star className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Total Ratings</p>
                <p className="text-2xl font-bold text-slate-900">
                  {totalRatings}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/20 bg-white/50 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Avg. Ratings/Aspect</p>
                <p className="text-2xl font-bold text-slate-900">
                  {aspects.length > 0
                    ? (totalRatings / aspects.length).toFixed(1)
                    : "0"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-violet-100 p-2">
              <Target className="h-5 w-5 text-violet-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Your Aspects ({aspects.length})
            </h2>
          </div>
          <Link
            href="/aspects/create"
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 font-medium text-white transition-colors hover:bg-violet-700"
          >
            <Plus className="h-4 w-4" />
            Create Aspect
          </Link>
        </div>

        {/* Aspects List */}
        <div className="space-y-4">
          {aspects.length > 0 ? (
            aspects.map((aspect) => (
              <AspectCard
                key={aspect.AspectID}
                aspect={aspect}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-white/20 bg-white/50 py-12 text-center">
              <Target className="mx-auto mb-4 h-12 w-12 text-slate-400" />
              <p className="mb-4 text-slate-600">No aspects created yet</p>
              <Link
                href="/aspects/create"
                className="inline-flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 font-medium text-white transition-colors hover:bg-violet-700"
              >
                <Plus className="h-4 w-4" />
                Create Your First Aspect
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal
        aspect={editingAspect}
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingAspect(null);
        }}
        onSave={handleSaveEdit}
      />
    </div>
  );
}
