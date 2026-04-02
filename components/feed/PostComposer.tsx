"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

type UploadedFile = { url: string; type: "image" | "video" | "audio" };

function getResourceType(file: File): "image" | "video" | "raw" {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "raw"; // audio
}

function getDisplayType(file: File): "image" | "video" | "audio" {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "audio";
}

async function uploadToCloudinary(file: File): Promise<string> {
  const resourceType = getResourceType(file);

  // Get signed params from server
  const paramsRes = await fetch("/api/upload/media", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ resourceType }),
  });
  if (!paramsRes.ok) throw new Error("Failed to get upload params");
  const { timestamp, signature, cloudName, apiKey, folder } = await paramsRes.json();

  // Upload directly to Cloudinary
  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", apiKey);
  fd.append("timestamp", String(timestamp));
  fd.append("signature", signature);
  fd.append("folder", folder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: "POST", body: fd }
  );
  if (!uploadRes.ok) throw new Error("Upload failed");
  const data = await uploadRes.json();
  return data.secure_url as string;
}

export function PostComposer() {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [streamingUrl, setStreamingUrl] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files ?? []);
    if (!selected.length) return;
    setUploading(true);
    setError(null);
    try {
      const uploaded = await Promise.all(
        selected.map(async (file) => {
          const url = await uploadToCloudinary(file);
          return { url, type: getDisplayType(file) } as UploadedFile;
        })
      );
      setFiles((prev) => [...prev, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    const trimmedUrl = streamingUrl.trim();
    if (!trimmed && files.length === 0 && !trimmedUrl) return;

    setLoading(true);
    setError(null);

    try {
      const mediaUrls = [
        ...files.map((f) => f.url),
        ...(trimmedUrl ? [trimmedUrl] : []),
      ];

      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed || " ", mediaUrls }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Failed to create post");
        return;
      }

      setContent("");
      setStreamingUrl("");
      setFiles([]);
      router.refresh();
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  const canPost = !loading && !uploading && (content.trim().length > 0 || files.length > 0 || streamingUrl.trim().length > 0);

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-cyan-500/[0.27] bg-zinc-900 p-4 shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_20px_rgba(34,211,238,0.13),0_0_40px_rgba(34,211,238,0.05)] space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What are you working on?"
        rows={3}
        className="w-full resize-none rounded-lg border border-cyan-500/[0.27] bg-zinc-800 p-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_12px_rgba(34,211,238,0.08)] focus:shadow-[0_0_0_1px_rgba(34,211,238,0.27),0_0_20px_rgba(34,211,238,0.16)]"
        disabled={loading}
      />

      {/* Streaming / YouTube URL */}
      <input
        type="url"
        value={streamingUrl}
        onChange={(e) => setStreamingUrl(e.target.value)}
        placeholder="YouTube, SoundCloud, or other streaming link (optional)"
        className="w-full rounded-lg border border-cyan-500/[0.27] bg-zinc-800 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:border-cyan-500/[0.4] focus:outline-none shadow-[0_0_0_1px_rgba(34,211,238,0.13),0_0_8px_rgba(34,211,238,0.06)]"
        disabled={loading}
      />

      {/* Media previews */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {files.map((f, i) => (
            <div key={i} className="relative group">
              {f.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.url} alt="" className="h-20 w-20 rounded-lg object-cover border border-cyan-500/[0.27]" />
              ) : f.type === "video" ? (
                <video src={f.url} className="h-20 w-20 rounded-lg object-cover border border-cyan-500/[0.27]" />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-cyan-500/[0.27] bg-zinc-800 text-xs text-zinc-400">
                  Audio
                </div>
              )}
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-700 text-zinc-300 text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}

      <div className="flex items-center justify-between">
        {/* File picker */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={loading || uploading}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
            </svg>
            {uploading ? "Uploading…" : "Add media"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,video/*,audio/*"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <button
          type="submit"
          disabled={!canPost}
          className="rounded-lg bg-gradient-to-r from-cyan-400 to-violet-400 px-4 py-2 text-sm font-bold text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 transition-opacity cursor-pointer shadow-[0_0_20px_rgba(34,211,238,0.2),0_4px_12px_rgba(34,211,238,0.13)]"
        >
          {loading ? "Posting…" : "Post"}
        </button>
      </div>
    </form>
  );
}
