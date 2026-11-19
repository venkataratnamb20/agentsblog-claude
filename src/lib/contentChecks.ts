const FENCED_CODE = /```[\s\S]*?```/g;
const MARKDOWN_IMAGE = /!\[([^\]]*)\]\(\s*([^)\s]+)[^)]*\)/g;
const HTML_IMAGE = /<img\b[^>]*>/gi;
const HTML_ALT = /\balt\s*=\s*(["'])(.*?)\1/i;
const HTML_SRC = /\bsrc\s*=\s*["']([^"']+)["']/i;

/**
 * Sources of images that have no usable alt text (missing, empty or blank).
 * Images inside fenced code blocks are ignored. O(n) in text length.
 */
export function findImagesMissingAlt(markdown: string): string[] {
  const text = markdown.replace(FENCED_CODE, '');
  const missing: string[] = [];

  text.replace(MARKDOWN_IMAGE, (_match: string, alt: string, src: string) => {
    if (alt.trim() === '') missing.push(src);
    return '';
  });

  text.replace(HTML_IMAGE, (tag: string) => {
    const alt = HTML_ALT.exec(tag)?.[2] ?? '';
    if (alt.trim() === '') missing.push(HTML_SRC.exec(tag)?.[1] ?? '(unknown)');
    return '';
  });

  return missing;
}
