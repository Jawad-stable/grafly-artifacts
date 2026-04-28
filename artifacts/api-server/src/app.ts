import express, { type Express } from "express";
import cors from "cors";
import path from "node:path";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

// Serve the bundled critique design images (e.g. social_sneaker.png) over a
// public URL so the multimodal LLM (NVIDIA NIM Maverick) can fetch them.
// At runtime, __dirname is `dist/` (set by the esbuild banner) and
// `build.mjs` copies `assets/` → `dist/assets/` so this path resolves.
app.use(
  "/api/critique/design-images",
  express.static(path.join(__dirname, "assets/designs"), {
    immutable: true,
    maxAge: "30d",
  }),
);

app.use("/api", router);

export default app;
