"use server";

import { db } from "@/db";
import { feedback } from "@/db/schema";
import { requireUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export type FeedbackActionState = { error?: string };

export async function createFeedbackAction(
  _prev: FeedbackActionState,
  formData: FormData,
): Promise<FeedbackActionState> {
  const user = await requireUser();

  const ratingRaw = String(formData.get("rating") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  const rating = ratingRaw ? Number(ratingRaw) : null;
  if (!message) return { error: "Please enter your feedback." };
  if (rating !== null && (!Number.isFinite(rating) || rating < 1 || rating > 5)) {
    return { error: "Rating must be between 1 and 5." };
  }

  await db.insert(feedback).values({
    userId: user.id,
    rating: rating === null ? undefined : rating,
    message,
  });

  redirect("/dashboard");
}
