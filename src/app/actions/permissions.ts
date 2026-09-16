"use server";

import { db } from "@/db";
import { permissionRequests } from "@/db/schema";
import { requireAdmin, requireUser } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

export type PermissionActionState = { error?: string };

export async function createPermissionRequestAction(
  _prev: PermissionActionState,
  formData: FormData,
): Promise<PermissionActionState> {
  const user = await requireUser();

  const requestType = String(formData.get("requestType") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();
  const fromDate = String(formData.get("fromDate") ?? "").trim();
  const toDate = String(formData.get("toDate") ?? "").trim();

  if (!requestType || !reason || !fromDate || !toDate) {
    return { error: "Please fill all fields." };
  }

  await db.insert(permissionRequests).values({
    userId: user.id,
    requestType,
    reason,
    fromDate,
    toDate,
  });

  redirect("/permissions");
}

export async function updatePermissionStatusAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");

  if (!id) return;
  if (!['pending','approved','rejected'].includes(status)) return;

  await db
    .update(permissionRequests)
    .set({ status: status as any })
    .where(eq(permissionRequests.id, id));

  redirect("/admin");
}
