import { getDepartmentSnapshot } from "@/lib/seed";

export const dynamic = "force-dynamic";

export default async function DepartmentPage() {
  const dept = await getDepartmentSnapshot();

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/60 bg-white/60 p-8 shadow-sm backdrop-blur">
        <h1 className="text-3xl font-semibold text-slate-950">E&TC Department</h1>
        <p className="mt-2 text-sm text-slate-600">Department motive, HOD, professors and student council.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-slate-950">Department Motive</div>
          <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{dept.info.motive}</p>
        </div>
        <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-slate-950">Leadership</div>
          <div className="mt-4 grid gap-3 text-sm">
            <div className="flex items-start justify-between gap-3">
              <span className="text-slate-600">HOD</span>
              <span className="font-semibold text-slate-950">{dept.info.hodName}</span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <span className="text-slate-600">Vice Principal</span>
              <span className="font-semibold text-slate-950">{dept.info.vicePrincipalName}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur">
        <div className="text-sm font-semibold text-slate-950">Department Information</div>
        <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{dept.info.info}</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-slate-950">Professors</div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {dept.faculty.map((p) => (
              <li key={p.id} className="flex items-center justify-between gap-3">
                <span className="font-semibold text-slate-950">{p.name}</span>
                <span className="text-xs text-slate-500">{p.designation}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur">
          <div className="text-sm font-semibold text-slate-950">Student Council</div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {dept.roles.map((r) => (
              <li key={r.id} className="flex items-center justify-between gap-3">
                <span className="text-slate-600">{r.label}</span>
                <span className="font-semibold text-slate-950">{r.name || "(To be updated)"}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
