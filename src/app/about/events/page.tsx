import Link from "next/link";

export const dynamic = "force-dynamic";

const eventsMedia = [
  { src: "/media/events/WhatsApp Video 2026-09-16 at 2.21.15 PM.mp4", label: "Event Video 1" },
  { src: "/media/events/WhatsApp Video 2026-09-16 at 2.21.30 PM.mp4", label: "Event Video 2" },
  { src: "/media/events/WhatsApp Video 2026-09-16 at 2.21.31 PM (1).mp4", label: "Event Video 3" },
  { src: "/media/events/WhatsApp Video 2026-09-16 at 2.21.31 PM.mp4", label: "Event Video 4" },
];

export default function AboutEventsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Events</h1>
          <p className="mt-2 text-sm text-slate-600">Photos and highlights from department events.</p>
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
          {eventsMedia.map((item) => (
            <div key={item.src} className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100/50">
              <video
                src={item.src}
                controls
                className="aspect-video w-full object-cover"
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
