"use server";

import { db } from "@/db";
import { complaints } from "@/db/schema";
import { requireAdmin, requireUser } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export type ComplaintActionState = { error?: string };

export async function createComplaintAction(
  _prev: ComplaintActionState,
  formData: FormData,
): Promise<ComplaintActionState> {
  const user = await requireUser();

  const category = String(formData.get("category") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!category || !subject || !description) {
    return { error: "Please fill all fields." };
  }

  await db.insert(complaints).values({
    userId: user.id,
    category,
    subject,
    description,
  });

  redirect("/complaints");
}

export async function updateComplaintStatusAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id) return;
  if (!['submitted','in_progress','resolved'].includes(status)) return;

  await db.update(complaints).set({ status: status as any }).where(eq(complaints.id, id));
  redirect("/admin");
}

export async function deleteComplaintAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  // user can delete only own complaints that are still submitted
  const row = await db
    .select({ id: complaints.id, userId: complaints.userId, status: complaints.status })
    .from(complaints)
    .where(eq(complaints.id, id))
    .limit(1);

  const c = row[0];
  if (!c) return;
  if (c.userId !== user.id) return;
  if (c.status !== "submitted") return;

  await db.delete(complaints).where(eq(complaints.id, id));
  redirect("/complaints");
}
