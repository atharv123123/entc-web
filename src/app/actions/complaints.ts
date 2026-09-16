"use server";

import { db } from "@/db";
import { complaints } from "@/db/schema";
import { requireAdmin, requireUser } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { sanitizeInput, validateUUID } from "@/lib/validation";

export type ComplaintActionState = { error?: string };

export async function createComplaintAction(
  _prev: ComplaintActionState,
  formData: FormData,
): Promise<ComplaintActionState> {
  const user = await requireUser();

  const category = sanitizeInput(String(formData.get("category") ?? ""), 100);
  const subject = sanitizeInput(String(formData.get("subject") ?? ""), 200);
  const description = sanitizeInput(String(formData.get("description") ?? ""), 5000);

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
  return { error: "" };
}

export async function updateComplaintStatusAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id || !validateUUID(id)) return;
  if (!["submitted", "in_progress", "resolved"].includes(status)) return;

  await db
    .update(complaints)
    .set({ status: status as "submitted" | "in_progress" | "resolved" })
    .where(eq(complaints.id, id));
  redirect("/admin");
}

export async function deleteComplaintAction(formData: FormData) {
  const user = await requireUser();
  const id = String(formData.get("id") ?? "");
  if (!id || !validateUUID(id)) return;

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
