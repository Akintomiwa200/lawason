export type PageBlock =
  | { id: string; type: "heading"; text: string }
  | { id: string; type: "paragraph"; text: string }
  | { id: string; type: "image"; url: string; alt?: string; publicId?: string }
  | {
      id: string;
      type: "gallery";
      images: { url: string; alt?: string; publicId?: string }[];
    }
  | { id: string; type: "video"; youtubeId?: string; url?: string }
  | { id: string; type: "cta"; label: string; href: string };

export function isPageBlock(value: unknown): value is PageBlock {
  if (!value || typeof value !== "object" || !("type" in value) || !("id" in value)) {
    return false;
  }

  const type = (value as { type: unknown }).type;
  return (
    type === "heading" ||
    type === "paragraph" ||
    type === "image" ||
    type === "gallery" ||
    type === "video" ||
    type === "cta"
  );
}

export function parsePageBlocks(content: unknown): PageBlock[] {
  if (!Array.isArray(content)) {
    return [];
  }

  return content.filter(isPageBlock);
}

export function createBlockId() {
  return crypto.randomUUID();
}
