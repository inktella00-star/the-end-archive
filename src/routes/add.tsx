import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/add")({
  validateSearch: (s: Record<string, unknown>): { correction?: string; story?: string } => ({
    ...(typeof s["correction"] === "string" ? { correction: s["correction"] } : {}),
    ...(typeof s["story"] === "string" ? { story: s["story"] } : {}),
  }),
  head: () => ({
    meta: [
      { title: "Contribute — Scruttin" },
      {
        name: "description",
        content: "Add something that ended, suggest a correction, or share a first-hand story.",
      },
      { property: "og:title", content: "Contribute — Scruttin" },
      { property: "og:description", content: "Help document what happened." },
    ],
  }),
  component: Add,
});

function Add() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-24 text-center">
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        Account required
      </p>
      <h1 className="mt-4 font-display text-4xl font-bold">Sign in to contribute</h1>
      <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
        Create an account or sign in with Google before adding to the archive, suggesting a
        correction, or sharing a story.
      </p>
      <Link
        to="/account"
        className="mt-8 inline-flex bg-foreground px-6 py-3 font-mono text-sm uppercase text-background"
      >
        Continue with Google
      </Link>
    </main>
  );
}
