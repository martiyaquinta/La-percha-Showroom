import { file } from "bun";
import { extname } from "path";

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".jsx": "application/javascript",
  ".json": "application/json",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
};

const ROOT = import.meta.dir;
const PORT = 3000;

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    let path = url.pathname === "/" ? "/client/index.html" : url.pathname;
    const fsPath = ROOT + decodeURIComponent(path);

    const f = file(fsPath);
    if (!(await f.exists())) {
      return new Response("Not found", { status: 404 });
    }

    const ext = extname(fsPath);
    const type = MIME[ext] ?? "application/octet-stream";
    return new Response(f, { headers: { "Content-Type": type } });
  },
});

console.log(`La Percha Showroom → http://localhost:${PORT}`);
