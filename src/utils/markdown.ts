/** 将文本转为 URL 安全的 slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export interface Heading {
  level: number;
  text: string;
  id: string;
}

/** 从 Markdown 内容中提取 h2/h3 标题用于目录 */
export function extractHeadings(markdown: string): Heading[] {
  const lines = markdown.split("\n");
  const headings: Heading[] = [];

  for (const line of lines) {
    const match = line.match(/^(#{2,3})\s+(.+)/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[`*_]/g, "").trim();
      headings.push({ level, text, id: slugify(text) });
    }
  }

  return headings;
}
