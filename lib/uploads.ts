import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "public", "uploads");
const MAX_BYTES = 5 * 1024 * 1024;

// نوع فایل را از محتوای آن تشخیص می‌دهیم، نه از اسم یا نوعی که مرورگر گفته
function detectExt(b: Buffer): string | null {
  if (b.length < 12) return null;
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return ".jpg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return ".png";
  if (b.subarray(0, 4).toString("ascii") === "RIFF" && b.subarray(8, 12).toString("ascii") === "WEBP") return ".webp";
  if (b.subarray(4, 8).toString("ascii") === "ftyp" && ["avif", "avis"].includes(b.subarray(8, 12).toString("ascii"))) return ".avif";
  return null;
}

export async function saveImage(file: File): Promise<string> {
  if (file.size > MAX_BYTES) throw new Error("حجم هر عکس حداکثر ۵ مگابایت باشد.");

  const buf = Buffer.from(await file.arrayBuffer());
  const ext = detectExt(buf);
  if (!ext) throw new Error("فقط عکس JPG، PNG، WebP یا AVIF مجاز است.");

  await fs.mkdir(DIR, { recursive: true });
  const name = `${Date.now()}-${randomBytes(4).toString("hex")}${ext}`;
  await fs.writeFile(path.join(DIR, name), buf);

  return `/uploads/${name}`;
}