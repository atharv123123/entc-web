import Link from "next/link";

export const dynamic = "force-dynamic";

const achievementsMedia = [
  { type: "image" as const, src: "/media/achievements/WhatsApp Image 2026-09-16 at 2.21.32 PM (1).jpeg", label: "Achievement" },
  { type: "image" as const, src: "/media/achievements/WhatsApp Image 2026-09-16 at 2.21.32 PM.jpeg", label: "Achievement" },
  { type: "image" as const, src: "/media/achievements/WhatsApp Image 2026-09-16 at 2.21.33 PM (1).jpeg", label: "Achievement" },
  { type: "image" as const, src: "/media/achievements/WhatsApp Image 2026-09-16 at 2.21.33 PM (2).jpeg", label: "Achievement" },
  { type: "image" as const, src: "/media/achievements/WhatsApp Image 2026-09-16 at 2.21.33 PM.jpeg", label: "Achievement" },
  { type: "image" as const, src: "/media/achievements/WhatsApp Image 2026-09-16 at 2.21.34 PM.jpeg", label: "Achievement" },
  { type: "image" as const, src: "/media/achievements/WhatsApp Image 2026-09-16 at 2.21.35 PM (1).jpeg", label: "Achievement" },
  { type: "image" as const, src: "/media/achievements/WhatsApp Image 2026-09-16 at 2.21.35 PM.jpeg", label: "Achievement" },
  { type: "image" as const, src: "/media/achievements/WhatsApp Image 2026-09-16 at 2.21.36 PM.jpeg", label: "Achievement" },
  { type: "video" as const, src: "/media/achievements/WhatsApp Video 2026-09-16 at 2.21.36 PM.mp4", label: "Technical Event" },
  { type: "video" as const, src: "/media/achievements/WhatsApp Video 2026-09-16 at 2.21.37 PM.mp4", label: "Technical Event" },
];

export default function AchievementsPage() {
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
          {achievementsMedia.map((item) => (
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
