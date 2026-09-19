"use client";

import { useRef, useState } from "react";
import { uploadMediaAction } from "@/app/actions/media";

const CATEGORIES = [
  { value: "achievements", label: "Achievements" },
  { value: "events", label: "Events" },
  { value: "sports", label: "Sports" },
  { value: "faculty", label: "Faculty" },
] as const;

export default function MediaUploader() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      setFileType(null);
      return;
    }

    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      setMessage({ type: "error", text: "Only images and videos are supported." });
      e.target.value = "";
      return;
    }

    setFileType(isImage ? "image" : "video");
    setMessage(null);

    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  async function handleSubmit(formData: FormData) {
    setUploading(true);
    setMessage(null);

    try {
      const result = await uploadMediaAction(null, formData);

      if ("error" in result) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Media uploaded successfully!" });
        setPreview(null);
        setFileType(null);
        formRef.current?.reset();
      }
    } catch {
      setMessage({ type: "error", text: "Upload failed. Please try again." });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <form ref={formRef} action={handleSubmit} className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Category</label>
            <select
              name="category"
              required
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Label</label>
            <input
              name="label"
              placeholder="Description (optional)"
              className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">File</label>
          <input
            ref={fileInputRef}
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp,video/mp4,video/webm,video/quicktime"
            required
            onChange={handleFileChange}
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4 file:mr-3 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-slate-800"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-slate-700">Sort Order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue={0}
            min={0}
            max={9999}
            className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none ring-indigo-600/20 focus:ring-4"
          />
        </div>

        {preview && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="text-xs font-medium text-slate-500 mb-2">Preview</div>
            {fileType === "video" ? (
              <video src={preview} controls className="max-h-48 w-full rounded-xl object-cover" />
            ) : (
              <img src={preview} alt="Preview" className="max-h-48 w-full rounded-xl object-cover" />
            )}
          </div>
        )}

        {message && (
          <div
            className={`rounded-2xl px-4 py-3 text-sm ${
              message.type === "error"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-green-50 text-green-700 border border-green-200"
            }`}
          >
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}
