import { Router, type Request, type Response, type NextFunction } from "express";
import { supabaseAdmin } from "../lib/supabaseAdmin";

const router = Router();

const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"] ?? "";

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!ADMIN_PASSWORD) {
    res.status(500).json({ error: "ADMIN_PASSWORD not configured on server" });
    return;
  }
  const header = req.header("x-admin-password") ?? "";
  if (header !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

router.post("/admin/login", (req, res) => {
  if (!ADMIN_PASSWORD) {
    res.status(500).json({ error: "ADMIN_PASSWORD not configured on server" });
    return;
  }
  const body = (req.body ?? {}) as { password?: string };
  if (typeof body.password !== "string" || body.password !== ADMIN_PASSWORD) {
    res.status(401).json({ error: "Invalid password" });
    return;
  }
  res.json({ ok: true });
});

router.get("/admin/courses", requireAdmin, async (req, res) => {
  if (!supabaseAdmin) {
    res.status(500).json({ error: "Supabase admin client not configured" });
    return;
  }
  const { data, error } = await supabaseAdmin
    .from("app_courses")
    .select("id, order_idx, enabled, data")
    .order("order_idx", { ascending: true });
  if (error) {
    req.log?.error({ err: error }, "list courses failed");
    res.status(500).json({ error: error.message });
    return;
  }
  res.json({ courses: data ?? [] });
});

router.get("/admin/courses/:id", requireAdmin, async (req, res) => {
  if (!supabaseAdmin) {
    res.status(500).json({ error: "Supabase admin client not configured" });
    return;
  }
  const { data, error } = await supabaseAdmin
    .from("app_courses")
    .select("id, order_idx, enabled, data")
    .eq("id", req.params.id)
    .maybeSingle();
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  if (!data) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ course: data });
});

router.put("/admin/courses/:id", requireAdmin, async (req, res) => {
  if (!supabaseAdmin) {
    res.status(500).json({ error: "Supabase admin client not configured" });
    return;
  }
  const body = (req.body ?? {}) as {
    order_idx?: number;
    enabled?: boolean;
    data?: unknown;
  };
  const update: Record<string, unknown> = {};
  if (typeof body.order_idx === "number") update["order_idx"] = body.order_idx;
  if (typeof body.enabled === "boolean") update["enabled"] = body.enabled;
  if (body.data !== undefined) {
    if (typeof body.data !== "object" || body.data === null) {
      res.status(400).json({ error: "data must be a JSON object" });
      return;
    }
    update["data"] = body.data;
  }
  if (Object.keys(update).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }
  const { data, error } = await supabaseAdmin
    .from("app_courses")
    .update(update)
    .eq("id", req.params.id)
    .select("id, order_idx, enabled, data")
    .maybeSingle();
  if (error) {
    req.log?.error({ err: error }, "update course failed");
    res.status(500).json({ error: error.message });
    return;
  }
  if (!data) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ course: data });
});

router.post("/admin/courses", requireAdmin, async (req, res) => {
  if (!supabaseAdmin) {
    res.status(500).json({ error: "Supabase admin client not configured" });
    return;
  }
  const body = (req.body ?? {}) as {
    id?: string;
    order_idx?: number;
    enabled?: boolean;
    data?: unknown;
  };
  if (typeof body.id !== "string" || !body.id.trim()) {
    res.status(400).json({ error: "id is required" });
    return;
  }
  if (typeof body.order_idx !== "number") {
    res.status(400).json({ error: "order_idx is required" });
    return;
  }
  if (typeof body.data !== "object" || body.data === null) {
    res.status(400).json({ error: "data must be a JSON object" });
    return;
  }
  const row = {
    id: body.id.trim(),
    order_idx: body.order_idx,
    enabled: typeof body.enabled === "boolean" ? body.enabled : true,
    data: body.data,
  };
  const { data, error } = await supabaseAdmin
    .from("app_courses")
    .insert(row)
    .select("id, order_idx, enabled, data")
    .maybeSingle();
  if (error) {
    req.log?.error({ err: error }, "create course failed");
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(201).json({ course: data });
});

router.delete("/admin/courses/:id", requireAdmin, async (req, res) => {
  if (!supabaseAdmin) {
    res.status(500).json({ error: "Supabase admin client not configured" });
    return;
  }
  const { error } = await supabaseAdmin
    .from("app_courses")
    .delete()
    .eq("id", req.params.id);
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.json({ ok: true });
});

export default router;
