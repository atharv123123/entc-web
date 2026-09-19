"use client";

import { useState, useTransition } from "react";
import { deleteMediaAction } from "@/app/actions/media";

type MediaItem = {
  id: string;
  category: string;
  type: string;
  url: string;
  label: string;
  sortOrder: number;
  createdAt: Date;
};

export default function MediaGrid({ items }: { items: MediaItem[] }) {
  const [deleting, setDeleting] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    setDeleting(id);
    const formData = new FormData();
    formData.set("id", id);

    startTransition(async () => {
      await deleteMediaAction(formData);
      setDeleting(null);
      setConfirmDelete(null);
    });
  }

  if (!items.length) {
    return <div className="text-sm text-slate-600">No media uploaded yet.</div>;
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white/70"
        >
          <div className="aspect-video bg-slate-100">
            {item.type === "video" ? (
              <video src={item.url} controls className="h-full w-full object-cover" />
            ) : (
              <img
                src={item.url}
                alt={item.label}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <div className="p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-slate-950">
                  {item.label}
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                    {item.type}
                  </span>
                  <span className="text-xs text-slate-500">#{item.sortOrder}</span>
                </div>
              </div>
              {confirmDelete === item.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleting === item.id ? "..." : "Yes"}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(null)}
                    className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold hover:bg-slate-50"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(item.id)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-slate-50"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
