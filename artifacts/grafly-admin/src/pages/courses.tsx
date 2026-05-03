import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { listCourses, clearStoredPassword, getStoredPassword, type CourseRow } from "@/lib/api";

export default function CoursesPage() {
  const [, setLocation] = useLocation();
  const [courses, setCourses] = useState<CourseRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getStoredPassword()) {
      setLocation("/login");
      return;
    }
    let cancelled = false;
    listCourses()
      .then((rows) => {
        if (!cancelled) setCourses(rows);
      })
      .catch((err) => {
        if (cancelled) return;
        if (err.message === "Unauthorized") {
          setLocation("/login");
        } else {
          setError(err.message);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [setLocation]);

  function signOut() {
    clearStoredPassword();
    setLocation("/login");
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card border-b">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Grafly Admin · Courses</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/new"
              className="text-sm h-9 px-3 rounded-md border inline-flex items-center hover:bg-accent"
            >
              + New course
            </Link>
            <button
              onClick={signOut}
              className="text-sm h-9 px-3 rounded-md border inline-flex items-center hover:bg-accent"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-6">
        {error && (
          <div className="mb-4 p-3 rounded-md border border-destructive text-sm text-destructive bg-destructive/5">
            {error}
          </div>
        )}
        {courses === null && !error && (
          <div className="text-sm text-muted-foreground">Loading…</div>
        )}
        {courses && courses.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No courses yet. Create one to get started.
          </div>
        )}
        {courses && courses.length > 0 && (
          <div className="bg-card rounded-lg border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-2 font-medium">Order</th>
                  <th className="text-left px-4 py-2 font-medium">ID</th>
                  <th className="text-left px-4 py-2 font-medium">Title</th>
                  <th className="text-left px-4 py-2 font-medium">Modules</th>
                  <th className="text-left px-4 py-2 font-medium">Enabled</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => {
                  const data = c.data as { title?: string; modules?: unknown[] };
                  const modules = Array.isArray(data.modules) ? data.modules.length : 0;
                  return (
                    <tr key={c.id} className="border-t hover:bg-accent/40">
                      <td className="px-4 py-3">{c.order_idx}</td>
                      <td className="px-4 py-3 font-mono text-xs">{c.id}</td>
                      <td className="px-4 py-3">{data.title ?? "—"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{modules}</td>
                      <td className="px-4 py-3">
                        <span
                          className={
                            c.enabled
                              ? "inline-block w-2 h-2 rounded-full bg-emerald-500"
                              : "inline-block w-2 h-2 rounded-full bg-muted-foreground/40"
                          }
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/courses/${encodeURIComponent(c.id)}`}
                          className="text-sm underline-offset-2 hover:underline"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
