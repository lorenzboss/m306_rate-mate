import { Aspect } from "@/app/(pages)/(admin)/aspects/page";
import { useEffect, useState } from "react";

interface EditModalProps {
  aspect: Aspect | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    aspectId: string,
    data: { name: string; description: string },
  ) => void;
}

export default function EditModal({
  aspect,
  isOpen,
  onClose,
  onSave,
}: EditModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (aspect) {
      setName(aspect.Name);
      setDescription(aspect.Description);
    }
  }, [aspect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aspect) return;

    setLoading(true);
    await onSave(aspect.AspectID, { name, description });
    setLoading(false);
    onClose();
  };

  if (!isOpen || !aspect) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <h3 className="mb-4 text-xl font-bold text-slate-900">Edit Aspect</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 focus:outline-none"
              required
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-violet-600 px-4 py-2 font-medium text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
