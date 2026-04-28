import { chmodSync, existsSync } from "node:fs";
import { join } from "node:path";

// Vercel build runs on Linux; occasionally Vite's bin can lose +x and exit 126.
// This is a no-op on Windows.
if (process.platform === "win32") process.exit(0);

const viteBin = join(process.cwd(), "node_modules", ".bin", "vite");
if (!existsSync(viteBin)) process.exit(0);

try {
  chmodSync(viteBin, 0o755);
} catch {
  // If it still fails, let the build surface the underlying error.
}

