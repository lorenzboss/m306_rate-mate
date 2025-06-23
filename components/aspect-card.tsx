import { Aspect } from "@/app/(pages)/(admin)/aspects/page";
import { Edit2, Star, Target, Trash2 } from "lucide-react";
import { useState } from "react";

interface AspectCardProps {
  aspect: Aspect;
  onEdit: (aspect: Aspect) => void;
  onDelete: (aspectId: string) => void;
}

export default function AspectCard({
  aspect,
  onEdit,
  onDelete,
}: AspectCardProps) {
  const [deleting, setDeleting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  const handleDeleteRequest = () => {
    setShowDialog(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    await onDelete(aspect.AspectID);
    setDeleting(false);
    setShowDialog(false);
  };

  const cancelDelete = () => {
    setShowDialog(false);
  };

  return (
    <>
      <div className="rounded-2xl border border-white/20 bg-white/50 p-6 backdrop-blur-sm transition-all duration-300 hover:bg-white/70 hover:shadow-lg">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-violet-100 p-2">
                <Target className="h-5 w-5 text-violet-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {aspect.Name}
              </h3>
            </div>
            <p className="mb-4 text-slate-600">{aspect.Description}</p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Star className="h-4 w-4" />
              <span>{aspect._count.ratings} ratings</span>
            </div>
          </div>
          <div className="ml-4 flex gap-2">
            <button
              onClick={() => onEdit(aspect)}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              title="Edit aspect"
            >
              <Edit2 className="size-6" />
            </button>
            <button
              onClick={handleDeleteRequest}
              disabled={deleting}
              className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 className="size-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold text-gray-800">
              Confirm Deletion
            </h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete the aspect {aspect.Name}?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDelete}
                className="rounded bg-gray-200 px-4 py-2 text-gray-800 transition-all duration-300 hover:scale-95 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded bg-red-600 px-4 py-2 text-white transition-all duration-300 hover:scale-95 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
