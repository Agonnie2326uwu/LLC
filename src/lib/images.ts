import type { ImageMetadata } from 'astro';

/**
 * Optimised photos live in src/assets/images/** and are processed by astro:assets.
 * Data files keep plain string paths (e.g. 'images/services/deep.jpg'); this maps
 * such a path (with or without the BASE_URL / leading slash) to its ImageMetadata.
 */
const modules = import.meta.glob<{ default: ImageMetadata }>('../assets/images/**/*.{jpg,jpeg,png,webp}', {
  eager: true,
});

const BY_PATH = new Map<string, ImageMetadata>(
  Object.entries(modules).map(([file, mod]) => [file.replace(/^\.\.\/assets\//, ''), mod.default]),
);

const BASE = import.meta.env.BASE_URL;

export function resolveImage(path: string | undefined): ImageMetadata | undefined {
  if (!path) return undefined;
  let p = path;
  if (BASE && BASE !== '/' && p.startsWith(BASE)) p = p.slice(BASE.length);
  p = p.replace(/^\/+/, '');
  return BY_PATH.get(p);
}

/** Output formats for every <Picture>; fallback <img> stays JPEG. */
export const PICTURE_FORMATS = ['avif', 'webp'] as const;

/**
 * Center-crop dimensions for a target aspect ratio (w/h), never upscaling, plus a
 * srcset width list capped at the largest crop the source can supply.
 */
export function cropSet(img: ImageMetadata, ratio: number, candidates: number[]) {
  const maxW = Math.floor(Math.min(img.width, img.height * ratio));
  const widths = [...new Set([...candidates.filter((w) => w < maxW), maxW])].sort((a, b) => a - b);
  return { width: maxW, height: Math.round(maxW / ratio), widths };
}

/** Width list for an uncropped image, capped at its intrinsic width. */
export function widthSet(img: ImageMetadata, candidates: number[]) {
  return [...new Set([...candidates.filter((w) => w < img.width), img.width])].sort((a, b) => a - b);
}
