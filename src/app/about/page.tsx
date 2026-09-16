import Link from "next/link";

export const dynamic = "force-dynamic";

const sections = [
  {
    title: "Achievements",
    description: "Awards, recognitions and milestones of the department.",
    href: "/about/achievements",
    icon: "🏆",
  },
  {
    title: "Faculty",
    description: "Meet our experienced and dedicated faculty members.",
    href: "/about/faculty",
    icon: "👨‍🏫",
  },
  {
    title: "Sports",
    description: "Sports events, tournaments and athletic achievements.",
    href: "/about/sports",
    icon: "⚽",
  },
  {
    title: "Events",
    description: "Photos and highlights from department events.",
    href: "/about/events",
    icon: "🎉",
  },
];

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/60 bg-white/60 p-8 shadow-sm backdrop-blur">
        <h1 className="text-3xl font-semibold text-slate-950">About ENTC Department</h1>
        <p className="mt-2 text-sm text-slate-600">
          The Department of Electronics and Telecommunication Engineering (E&amp;TC) at Dnyanshree
          Institute of Engineering and Technology is dedicated to producing skilled engineers ready
          for the industry.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="group rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur transition hover:bg-white hover:shadow-md"
          >
            <div className="text-3xl">{s.icon}</div>
            <div className="mt-3 text-lg font-semibold text-slate-950 group-hover:text-indigo-700">
              {s.title}
            </div>
            <p className="mt-1 text-sm text-slate-600">{s.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
