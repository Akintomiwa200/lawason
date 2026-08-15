"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { savePage } from "@/actions/pages";
import { MediaUploader } from "@/components/admin/media-uploader";
import { createBlockId, type PageBlock } from "@/types/cms";

interface PageEditorProps {
  page?: {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    coverImage: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    showInNav: boolean;
    content: PageBlock[];
    status: "DRAFT" | "PUBLISHED";
  };
}

const fieldClass =
  "w-full rounded-2xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-accent";

export function PageEditor({ page }: PageEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState(page?.title ?? "");
  const [slug, setSlug] = useState(page?.slug ?? "");
  const [excerpt, setExcerpt] = useState(page?.excerpt ?? "");
  const [coverImage, setCoverImage] = useState(page?.coverImage ?? "");
  const [seoTitle, setSeoTitle] = useState(page?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(page?.seoDescription ?? "");
  const [showInNav, setShowInNav] = useState(page?.showInNav ?? false);
  const [blocks, setBlocks] = useState<PageBlock[]>(page?.content ?? []);
  const [saving, setSaving] = useState(false);

  const liveHref = useMemo(
    () => (page?.status === "PUBLISHED" && page.slug ? `/pages/${page.slug}` : null),
    [page],
  );

  function addBlock(type: PageBlock["type"]) {
    const id = createBlockId();
    const next: PageBlock =
      type === "heading"
        ? { id, type, text: "" }
        : type === "paragraph"
          ? { id, type, text: "" }
          : type === "image"
            ? { id, type, url: "" }
            : type === "gallery"
              ? { id, type, images: [] }
              : type === "video"
                ? { id, type, youtubeId: "" }
                : { id, type, label: "Learn more", href: "/contact" };
    setBlocks((current) => [...current, next]);
  }

  function updateBlock(id: string, patch: Partial<PageBlock>) {
    setBlocks((current) =>
      current.map((block) => (block.id === id ? ({ ...block, ...patch } as PageBlock) : block)),
    );
  }

  async function submit(publish: boolean) {
    setSaving(true);
    try {
      const saved = await savePage({
        id: page?.id,
        title,
        slug,
        excerpt,
        coverImage,
        seoTitle,
        seoDescription,
        showInNav,
        content: blocks,
        publish,
      });
      toast.success(publish ? "Page published" : "Draft saved");
      if (publish) {
        router.push(`/pages/${saved.slug}`);
        router.refresh();
        return;
      }
      if (!page?.id) {
        router.push(`/admin/pages/${saved.id}`);
      }
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not save page");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className="space-y-8"
      onSubmit={(event) => {
        event.preventDefault();
        void submit(false);
      }}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="font-medium">Title</span>
          <input className={fieldClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">Slug</span>
          <input className={fieldClass} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="summer-camp" />
        </label>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="font-medium">Excerpt</span>
        <textarea className={fieldClass} rows={3} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
      </label>

      <MediaUploader
        label="Cover image"
        value={coverImage}
        folder="gmlawason/pages"
        onChange={(url) => setCoverImage(url)}
      />

      <label className="flex items-center gap-3 text-sm">
        <input
          type="checkbox"
          checked={showInNav}
          onChange={(e) => setShowInNav(e.target.checked)}
          className="h-4 w-4 accent-accent"
        />
        Show in site navigation after publish
      </label>

      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {(["heading", "paragraph", "image", "gallery", "video", "cta"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => addBlock(type)}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted hover:border-accent hover:text-accent"
            >
              Add {type}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {blocks.map((block) => (
            <div key={block.id} className="rounded-3xl border border-border bg-surface p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted">{block.type}</p>
                <button
                  type="button"
                  className="text-xs text-muted hover:text-foreground"
                  onClick={() => setBlocks((current) => current.filter((item) => item.id !== block.id))}
                >
                  Remove
                </button>
              </div>

              {block.type === "heading" || block.type === "paragraph" ? (
                <textarea
                  className={fieldClass}
                  rows={block.type === "heading" ? 2 : 5}
                  value={block.text}
                  onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                />
              ) : null}

              {block.type === "image" ? (
                <MediaUploader
                  value={block.url}
                  folder="gmlawason/pages"
                  onChange={(url, publicId) => updateBlock(block.id, { url, publicId })}
                />
              ) : null}

              {block.type === "gallery" ? (
                <div className="space-y-3">
                  <MediaUploader
                    label="Add gallery image"
                    folder="gmlawason/pages"
                    onChange={(url, publicId) =>
                      updateBlock(block.id, {
                        images: [...block.images, { url, publicId }],
                      })
                    }
                  />
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                    {block.images.map((image) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={image.url} src={image.url} alt="" className="h-24 w-full rounded-xl object-cover" />
                    ))}
                  </div>
                </div>
              ) : null}

              {block.type === "video" ? (
                <input
                  className={fieldClass}
                  placeholder="YouTube video ID"
                  value={block.youtubeId ?? ""}
                  onChange={(e) => updateBlock(block.id, { youtubeId: e.target.value })}
                />
              ) : null}

              {block.type === "cta" ? (
                <div className="grid gap-3 md:grid-cols-2">
                  <input
                    className={fieldClass}
                    placeholder="Button label"
                    value={block.label}
                    onChange={(e) => updateBlock(block.id, { label: e.target.value })}
                  />
                  <input
                    className={fieldClass}
                    placeholder="/events/summer-camp"
                    value={block.href}
                    onChange={(e) => updateBlock(block.id, { href: e.target.value })}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="font-medium">SEO title</span>
          <input className={fieldClass} value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
        </label>
        <label className="space-y-2 text-sm">
          <span className="font-medium">SEO description</span>
          <input className={fieldClass} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
        >
          Save draft
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => void submit(true)}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground shadow-glow hover:brightness-110"
        >
          Publish live
        </button>
        {liveHref ? (
          <a href={liveHref} className="text-sm font-medium text-accent">
            View live page
          </a>
        ) : null}
      </div>
    </form>
  );
}
