import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { type Thing, year } from "@/lib/data";

export function Header() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const go = (e: FormEvent) => {
    e.preventDefault();
    nav({ to: "/search", search: { q } });
  };
  return (
    <header className="border-b border-foreground">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3">
        <Link to="/" className="font-display text-xl font-bold tracking-[0.2em]">
          SCRUTTIN
        </Link>
        <nav className="hidden gap-5 font-mono text-xs uppercase tracking-wider md:flex">
          <Link to="/recent" activeProps={{ className: "underline" }}>
            Recently
          </Link>
          <Link to="/ending-soon" activeProps={{ className: "underline" }}>
            Ending Soon
          </Link>
          <Link to="/end-list" activeProps={{ className: "underline" }}>
            The End List
          </Link>
          <Link to="/stories" activeProps={{ className: "underline" }}>
            Stories
          </Link>
        </nav>
        <form onSubmit={go} className="ml-auto flex-1 max-w-xs">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search…"
            aria-label="Search"
            className="w-full border-b border-foreground/40 bg-transparent py-1 font-mono text-sm outline-none focus:border-foreground"
          />
        </form>
        <Link to="/account" className="font-mono text-xs uppercase tracking-wider">
          Account
        </Link>
      </div>
    </header>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const soon = status === "Shutting Down Soon";
  return (
    <span
      className={`inline-block border px-2 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-widest ${soon ? "border-accent bg-accent text-accent-foreground" : "border-primary text-primary"}`}
    >
      {status}
    </span>
  );
}

export function Lifeline({ start, end, large }: { start: string; end: string; large?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 font-mono ${large ? "text-2xl md:text-3xl" : "text-sm"}`}
    >
      <span>{year(start)}</span>
      <span className="h-px flex-1 bg-foreground" />
      <span>{year(end)}</span>
      <span className="text-primary">×</span>
    </div>
  );
}

export function ThingCard({ t }: { t: Thing }) {
  return (
    <Link
      to="/thing/$slug"
      params={{ slug: t.slug }}
      className="group flex flex-col gap-3 border-t border-foreground pt-4"
    >
      <StatusBadge status={t.status} />
      <h3 className="font-display text-2xl font-semibold leading-tight group-hover:underline">
        {t.name}
      </h3>
      <p className="text-sm text-muted-foreground">{t.description}</p>
      <Lifeline start={t.launch} end={t.end} />
      <span className="font-mono text-xs uppercase tracking-wider">What happened →</span>
    </Link>
  );
}

export function ResultRow({ t }: { t: Thing }) {
  return (
    <Link
      to="/thing/$slug"
      params={{ slug: t.slug }}
      className="grid gap-1 border-b border-border py-5 md:grid-cols-[1fr_auto] md:items-center"
    >
      <div>
        <h3 className="font-display text-2xl font-semibold hover:underline">{t.name}</h3>
        <p className="text-sm text-muted-foreground">{t.description}</p>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {t.type} · {t.status}
        </p>
      </div>
      <span className="font-mono text-sm">
        {year(t.launch)} — {year(t.end)}
      </span>
    </Link>
  );
}

export function PageTitle({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="border-b border-foreground pb-6 pt-12">
      <h1 className="font-display text-5xl font-bold md:text-6xl">{title}</h1>
      {sub && <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{sub}</p>}
    </div>
  );
}
