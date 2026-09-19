import Link from "next/link";
import { getMediaByCategory } from "@/app/actions/media";

export const dynamic = "force-dynamic";

export default async function AchievementsPage() {
  const mediaItems = await getMediaByCategory("achievements");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Achievements</h1>
          <p className="mt-2 text-sm text-slate-600">Awards, recognitions and milestones of the department.</p>
        </div>
        <Link
          href="/about"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          ← Back
        </Link>
      </div>

      <section className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="text-sm font-semibold text-slate-950">Gallery</div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {mediaItems.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100/50">
              {item.type === "video" ? (
                <video
                  src={item.url}
                  controls
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <img
                  src={item.url}
                  alt={item.label}
                  className="aspect-video w-full object-cover"
                />
              )}

            </div>
          ))}
          {!mediaItems.length && (
            <div className="col-span-full text-center text-sm text-slate-600 py-8">
              No media uploaded yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
