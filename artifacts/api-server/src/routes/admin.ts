import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import { getSupabaseAdmin } from "../lib/supabaseAdmin";
import type { Env } from "../types";

const admin = new Hono<{ Bindings: Env }>();

const requireAdmin: MiddlewareHandler<{ Bindings: Env }> = async (c, next) => {
  const adminPassword = c.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return c.json({ error: "ADMIN_PASSWORD not configured on server" }, 500);
  }
  const header = c.req.header("x-admin-password") ?? "";
  if (header !== adminPassword) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  return next();
};

admin.post("/admin/login", async (c) => {
  const adminPassword = c.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return c.json({ error: "ADMIN_PASSWORD not configured on server" }, 500);
  }
  const body = await c.req.json<{ password?: string }>().catch(() => ({} as { password?: string }));
  if (typeof body.password !== "string" || body.password !== adminPassword) {
    return c.json({ error: "Invalid password" }, 401);
  }
  return c.json({ ok: true });
});

admin.get("/admin/courses", requireAdmin, async (c) => {
  const supabaseAdmin = getSupabaseAdmin(c.env);
  if (!supabaseAdmin) {
    return c.json({ error: "Supabase admin client not configured" }, 500);
  }
  const { data, error } = await supabaseAdmin
    .from("app_courses")
    .select("id, order_idx, enabled, data")
    .order("order_idx", { ascending: true });
  if (error) {
    console.error("list courses failed", error);
    return c.json({ error: error.message }, 500);
  }
  return c.json({ courses: data ?? [] });
});

admin.get("/admin/courses/:id", requireAdmin, async (c) => {
  const supabaseAdmin = getSupabaseAdmin(c.env);
  if (!supabaseAdmin) {
    return c.json({ error: "Supabase admin client not configured" }, 500);
  }
  const { data, error } = await supabaseAdmin
    .from("app_courses")
    .select("id, order_idx, enabled, data")
    .eq("id", c.req.param("id"))
    .maybeSingle();
  if (error) {
    return c.json({ error: error.message }, 500);
  }
  if (!data) {
    return c.json({ error: "Not found" }, 404);
  }
  return c.json({ course: data });
});

admin.put("/admin/courses/:id", requireAdmin, async (c) => {
  const supabaseAdmin = getSupabaseAdmin(c.env);
  if (!supabaseAdmin) {
    return c.json({ error: "Supabase admin client not configured" }, 500);
  }
  const body = await c.req
    .json<{ order_idx?: number; enabled?: boolean; data?: unknown }>()
    .catch(() => ({} as { order_idx?: number; enabled?: boolean; data?: unknown }));

  const update: Record<string, unknown> = {};
  if (typeof body.order_idx === "number") update["order_idx"] = body.order_idx;
  if (typeof body.enabled === "boolean") update["enabled"] = body.enabled;
  if (body.data !== undefined) {
    if (typeof body.data !== "object" || body.data === null) {
      return c.json({ error: "data must be a JSON object" }, 400);
    }
    update["data"] = body.data;
  }
  if (Object.keys(update).length === 0) {
    return c.json({ error: "No fields to update" }, 400);
  }

  const { data, error } = await supabaseAdmin
    .from("app_courses")
    .update(update)
    .eq("id", c.req.param("id"))
    .select("id, order_idx, enabled, data")
    .maybeSingle();
  if (error) {
    console.error("update course failed", error);
    return c.json({ error: error.message }, 500);
  }
  if (!data) {
    return c.json({ error: "Not found" }, 404);
  }
  return c.json({ course: data });
});

admin.post("/admin/courses", requireAdmin, async (c) => {
  const supabaseAdmin = getSupabaseAdmin(c.env);
  if (!supabaseAdmin) {
    return c.json({ error: "Supabase admin client not configured" }, 500);
  }
  const body = await c.req
    .json<{ id?: string; order_idx?: number; enabled?: boolean; data?: unknown }>()
    .catch(() => ({} as { id?: string; order_idx?: number; enabled?: boolean; data?: unknown }));

  if (typeof body.id !== "string" || !body.id.trim()) {
    return c.json({ error: "id is required" }, 400);
  }
  if (typeof body.order_idx !== "number") {
    return c.json({ error: "order_idx is required" }, 400);
  }
  if (typeof body.data !== "object" || body.data === null) {
    return c.json({ error: "data must be a JSON object" }, 400);
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
    console.error("create course failed", error);
    return c.json({ error: error.message }, 500);
  }
  return c.json({ course: data }, 201);
});

admin.delete("/admin/courses/:id", requireAdmin, async (c) => {
  const supabaseAdmin = getSupabaseAdmin(c.env);
  if (!supabaseAdmin) {
    return c.json({ error: "Supabase admin client not configured" }, 500);
  }
  const { error } = await supabaseAdmin
    .from("app_courses")
    .delete()
    .eq("id", c.req.param("id"));
  if (error) {
    return c.json({ error: error.message }, 500);
  }
  return c.json({ ok: true });
});

export default admin;
