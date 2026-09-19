"use server";

import { db } from "@/db";
import { media } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { getSupabaseAdmin, STORAGE_BUCKET } from "@/lib/supabase";
import { eq, asc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { validateUUID } from "@/lib/validation";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
const VALID_CATEGORIES = ["achievements", "events", "sports", "faculty"] as const;

function getFileExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot >= 0 ? filename.slice(dot + 1).toLowerCase() : "";
}

function getMimeType(filename: string): string | null {
  const ext = getFileExtension(filename);
  const map: Record<string, string> = {
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    mp4: "video/mp4",
    webm: "video/webm",
    mov: "video/quicktime",
  };
  return map[ext] ?? null;
}

export async function uploadMediaAction(
  prevState: { error: string } | null,
  formData: FormData,
): Promise<{ error: string } | { success: true }> {
  try {
    const admin = await requireAdmin();

    const file = formData.get("file") as File | null;
    const category = String(formData.get("category") ?? "");
    const label = String(formData.get("label") ?? "").trim();
    const sortOrder = Number(String(formData.get("sortOrder") ?? "0"));

    if (!file || file.size === 0) {
      return { error: "Please select a file to upload." };
    }

    if (!VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])) {
      return { error: "Invalid category." };
    }

    const mimeType = getMimeType(file.name);
    if (!mimeType) {
      return { error: "Unsupported file type. Use JPEG, PNG, WebP, MP4, or WebM." };
    }

    const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType);

    if (!isImage && !isVideo) {
      return { error: "Unsupported file type. Use JPEG, PNG, WebP, MP4, or WebM." };
    }

    if (isImage && file.size > MAX_IMAGE_SIZE) {
      return { error: "Image must be under 10MB." };
    }

    if (isVideo && file.size > MAX_VIDEO_SIZE) {
      return { error: "Video must be under 50MB." };
    }

    const ext = getFileExtension(file.name) || (isImage ? "jpeg" : "mp4");
    const uniqueName = `${crypto.randomUUID()}.${ext}`;
    const storagePath = `${category}/${uniqueName}`;

    const arrayBuffer = await file.arrayBuffer();
    const supabase = getSupabaseAdmin();
    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, arrayBuffer, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return { error: `Upload failed: ${uploadError.message}` };
    }

    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(storagePath);

    await db.insert(media).values({
      category: category as (typeof VALID_CATEGORIES)[number],
      type: isImage ? "image" : "video",
      url: urlData.publicUrl,
      storagePath,
      label: label || file.name.replace(/\.[^.]+$/, ""),
      sortOrder: Number.isFinite(sortOrder) ? Math.min(Math.max(sortOrder, 0), 9999) : 0,
      createdBy: admin.id,
    });

    revalidatePath("/admin");
    revalidatePath(`/about/${category}`);
    return { success: true };
  } catch (e) {
    console.error("uploadMediaAction error:", e);
    return { error: "An unexpected error occurred." };
  }
}

export async function deleteMediaAction(formData: FormData) {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  if (!id || !validateUUID(id)) {
    return;
  }

  const rows = await db.select().from(media).where(eq(media.id, id)).limit(1);
  const item = rows[0];
  if (!item) return;

  const supabase = getSupabaseAdmin();
  await supabase.storage.from(STORAGE_BUCKET).remove([item.storagePath]);

  await db.delete(media).where(eq(media.id, id));

  revalidatePath("/admin");
  revalidatePath(`/about/${item.category}`);
}

export async function getMediaByCategory(
  category: (typeof VALID_CATEGORIES)[number],
) {
  return db
    .select()
    .from(media)
    .where(eq(media.category, category))
    .orderBy(asc(media.sortOrder), asc(media.createdAt));
}
