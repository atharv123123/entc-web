import { db } from "@/db";
import { news } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function NoticeTicker() {
  const newsRows = await db.select().from(news).orderBy(desc(news.createdAt)).limit(10);

  if (!newsRows.length) return null;

  const fill = Math.max(2, Math.ceil(8 / newsRows.length));
  const set = Array.from({ length: fill }, () => newsRows).flat();
  const renderItems = set.concat(set);

  return (
    <div className="border-b border-slate-800 bg-slate-900">
      <div className="mx-auto flex w-full max-w-6xl items-stretch">
        <div className="flex shrink-0 items-center gap-2 bg-indigo-600 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white">
          News
        </div>
        <div className="relative flex-1 overflow-hidden py-2">
          <div className="flex w-max animate-marquee">
            {renderItems.map((n, i) => (
              <span
                key={i}
                className="mr-12 flex shrink-0 items-center gap-3 whitespace-nowrap text-sm text-slate-100"
              >
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                {n.title}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}