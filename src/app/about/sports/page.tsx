import Link from "next/link";

export const dynamic = "force-dynamic";

const sportsMedia = [
  { type: "image" as const, src: "/media/sports/WhatsApp Image 2026-09-16 at 2.24.10 PM.jpeg", label: "Sports Photo" },
  { type: "video" as const, src: "/media/sports/WhatsApp Video 2026-09-16 at 2.23.54 PM.mp4", label: "Sports Video 1" },
  { type: "video" as const, src: "/media/sports/WhatsApp Video 2026-09-16 at 2.23.59 PM.mp4", label: "Sports Video 2" },
];

export default function SportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Sports</h1>
          <p className="mt-2 text-sm text-slate-600">Sports events, tournaments and athletic achievements.</p>
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
          {sportsMedia.map((item) => (
            <div key={item.src} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100/50">
              {item.type === "video" ? (
                <video
                  src={item.src}
                  controls
                  className="aspect-video w-full object-cover"
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.label}
                  className="aspect-video w-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
