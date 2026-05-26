const STORAGE_KEY = "grafly_admin_password";

export type CourseRow = {
  id: string;
  order_idx: number;
  enabled: boolean;
  data: Record<string, unknown>;
};

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? "").replace(/\/+$/, "");

function apiUrl(path: string): string {
  // VITE_API_BASE_URL points at the Worker when the admin is hosted on a
  // separate origin (e.g. Cloudflare Pages). Unset => same-origin relative.
  return `${API_BASE}${path}`;
}

export function getStoredPassword(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredPassword(password: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, password);
  } catch {
    // ignore
  }
}

export function clearStoredPassword(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

async function adminFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const password = getStoredPassword() ?? "";
  const headers = new Headers(init.headers);
  headers.set("x-admin-password", password);
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }
  return fetch(apiUrl(path), { ...init, headers });
}

export async function login(password: string): Promise<boolean> {
  const res = await fetch(apiUrl("/api/admin/login"), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) return false;
  setStoredPassword(password);
  return true;
}

export async function listCourses(): Promise<CourseRow[]> {
  const res = await adminFetch("/api/admin/courses");
  if (res.status === 401) {
    clearStoredPassword();
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error(`List failed: ${res.status}`);
  const json = (await res.json()) as { courses: CourseRow[] };
  return json.courses;
}

export async function getCourse(id: string): Promise<CourseRow> {
  const res = await adminFetch(`/api/admin/courses/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Get failed: ${res.status}`);
  const json = (await res.json()) as { course: CourseRow };
  return json.course;
}

export async function updateCourse(
  id: string,
  patch: Partial<Pick<CourseRow, "order_idx" | "enabled" | "data">>,
): Promise<CourseRow> {
  const res = await adminFetch(`/api/admin/courses/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Save failed: ${res.status} ${text}`);
  }
  const json = (await res.json()) as { course: CourseRow };
  return json.course;
}

export async function createCourse(row: CourseRow): Promise<CourseRow> {
  const res = await adminFetch(`/api/admin/courses`, {
    method: "POST",
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Create failed: ${res.status} ${text}`);
  }
  const json = (await res.json()) as { course: CourseRow };
  return json.course;
}

export async function deleteCourse(id: string): Promise<void> {
  const res = await adminFetch(`/api/admin/courses/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
}
