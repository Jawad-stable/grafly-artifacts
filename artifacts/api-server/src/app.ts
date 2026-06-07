import { Hono } from "hono";
import { cors } from "hono/cors";
import type { Env } from "./types";
import healthRouter from "./routes/health";
import critiqueRouter from "./routes/critique";
import ttsRouter from "./routes/tts";
import adminRouter from "./routes/admin";
import authRouter from "./routes/auth";

const app = new Hono<{ Bindings: Env }>();

app.use("*", cors());

app.route("/api", healthRouter);
app.route("/api", critiqueRouter);
app.route("/api", ttsRouter);
app.route("/api", adminRouter);
app.route("/", authRouter);

export default app;
