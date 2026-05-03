/**
 * One-shot seeder: pushes all bundled COURSES + asset images to Supabase.
 *
 * Prereqs:
 *   1. SUPABASE_SERVICE_ROLE_KEY env var is set (project secret).
 *   2. The SQL in scripts/supabase-schema.sql has been run once in the
 *      Supabase SQL Editor (creates app_courses table + course-assets bucket).
 *
 * Run: pnpm --filter @workspace/grafly run seed:supabase
 */
import { createClient } from "@supabase/supabase-js";
import { readFile, readdir, stat } from "node:fs/promises";
import { dirname, join, extname, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { COURSES } from "../constants/lessons";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error("Missing EXPO_PUBLIC_SUPABASE_URL");
  process.exit(1);
}
if (!SERVICE_KEY) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY (project secret)");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const HERE = dirname(fileURLToPath(import.meta.url));
const ASSETS_ROOT = join(HERE, "..", "assets");
const BUCKET = "course-assets";

const MIME: Record<string, string> = {
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

async function walk(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const entry of await readdir(dir)) {
    if (entry.startsWith(".")) continue;
    const full = join(dir, entry);
    const s = await stat(full);
    if (s.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

async function uploadAssets() {
  console.log("\n— Uploading images to Supabase Storage —");
  const files = await walk(ASSETS_ROOT);
  const imageFiles = files.filter((f) => MIME[extname(f).toLowerCase()]);
  let uploaded = 0;
  let skipped = 0;
  for (const file of imageFiles) {
    // Storage object key mirrors the path under assets/, e.g. "mascot/idle.webp".
    const key = relative(ASSETS_ROOT, file).split(/[\\/]/).join("/");
    const body = await readFile(file);
    const contentType = MIME[extname(file).toLowerCase()];
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(key, body, { contentType, upsert: true });
    if (error) {
      console.error(`  ✗ ${key}: ${error.message}`);
      skipped++;
    } else {
      uploaded++;
      console.log(`  ✓ ${key} (${(body.byteLength / 1024).toFixed(1)} KB)`);
    }
  }
  console.log(`Done. Uploaded ${uploaded}, failed ${skipped}.`);
}

async function uploadCourses() {
  console.log("\n— Upserting courses into app_courses —");
  const rows = COURSES.map((course, idx) => ({
    id: course.id,
    order_idx: idx,
    data: course,
    enabled: true,
    updated_at: new Date().toISOString(),
  }));
  const { error, count } = await supabase
    .from("app_courses")
    .upsert(rows, { onConflict: "id", count: "exact" });
  if (error) {
    console.error(`  ✗ ${error.message}`);
    process.exit(1);
  }
  console.log(`  ✓ Upserted ${count ?? rows.length} courses:`);
  for (const c of COURSES) {
    const lessonCount = c.nodes.reduce((n, m) => n + m.lessons.length, 0);
    console.log(
      `    - ${c.id} ("${c.title}") — ${c.nodes.length} modules, ${lessonCount} lessons`,
    );
  }
}

async function main() {
  console.log(`Seeding ${SUPABASE_URL}`);
  await uploadAssets();
  await uploadCourses();
  console.log("\n✅ All done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
