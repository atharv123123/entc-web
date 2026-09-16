import Link from "next/link";
import { db } from "@/db";
import { faculty } from "@/db/schema";

export const dynamic = "force-dynamic";

const photoMap: Record<string, string> = {
  "A.D. Jadhav": "/media/faculty/A.D.Jadhav.jpeg",
  "A.S. Jamdade": "/media/faculty/A.S.Jamdade.jpeg",
  "P.S. Jawale": "/media/faculty/P.S.Jawale.jpeg",
  "P.S. Patil": "/media/faculty/P.S.Patil.jpeg",
  "S.D. Mali": "/media/faculty/S.D.Mali.jpeg",
  "S.M. Patil": "/media/faculty/S.M.Patil.jpeg",
  "S.M. Pawar": "/media/faculty/S.M.Pawar.jpeg",
  "S.S. Mulla": "/media/faculty/S.S. Mulla.jpeg",
  "U.R. More": "/media/faculty/U.R. More.jpeg",
};

const phoneMap: Record<string, string> = {
  "S.M. Pawar": "+91 84240 39316",
  "S.M. Patil": "+91 94238 65051",
};

function normalizeName(value: string): string {
  return value
    .replace(/^(Dr|Mr|Mrs|Ms|Prof|Professor)\.?\s+/i, "")
    .replace(/[.]/g, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function getPhotoUrl(name: string): string | null {
  const normalizedName = normalizeName(name);
  if (!normalizedName) return null;

  const exactMatch = Object.entries(photoMap).find(
    ([key]) => normalizeName(key) === normalizedName,
  );
  if (exactMatch) return exactMatch[1];

  const lastName = normalizedName.split(" ").at(-1) ?? "";
  const lastNameMatches = Object.entries(photoMap)
    .filter(([key]) => normalizeName(key).endsWith(` ${lastName}`))
    .map(([, value]) => value);

  return lastNameMatches.length === 1 ? lastNameMatches[0] : null;
}

export default async function FacultyPage() {
  const rows = await db.select().from(faculty);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold text-slate-950">Faculty</h1>
          <p className="mt-2 text-sm text-slate-600">Meet our experienced and dedicated faculty members.</p>
        </div>
        <Link
          href="/about"
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50"
        >
          ← Back
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {rows.length ? (
          rows.map((f) => {
            const photo = getPhotoUrl(f.name);
            return (
              <div
                key={f.id}
                className="rounded-3xl border border-white/60 bg-white/70 p-6 shadow-sm backdrop-blur"
              >
                {photo ? (
                  <img
                    src={photo}
                    alt={f.name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-700">
                    {f.name.charAt(0)}
                  </div>
                )}
                <div className="mt-4 text-sm font-semibold text-slate-950">{f.name}</div>
                <div className="mt-1 text-xs text-slate-500">{f.designation}</div>
                {f.qualification ? (
                  <div className="mt-2 text-xs text-slate-600">{f.qualification}</div>
                ) : null}
                {f.experience ? (
                  <div className="mt-1 text-xs text-slate-500">{f.experience} years experience</div>
                ) : null}
                {Object.entries(phoneMap).find(
                  ([key]) => normalizeName(key) === normalizeName(f.name),
                ) ? (
                  <div className="mt-2 text-xs text-slate-600">
                    {Object.entries(phoneMap).find(
                      ([key]) => normalizeName(key) === normalizeName(f.name),
                    )?.[1]}
                  </div>
                ) : null}
              </div>
            );
          })
        ) : (
          <div className="col-span-full rounded-3xl border border-white/60 bg-white/70 p-6 text-center text-sm text-slate-600 shadow-sm backdrop-blur">
            No faculty members added yet.
          </div>
        )}
      </div>
    </div>
  );
}
