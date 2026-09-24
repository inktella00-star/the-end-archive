import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { CONNECTIONS, STORY_PREVIEW, getThing, timeAgo, type Story } from "@/lib/data";

function Avatar({ name }: { name: string }) {
  const anon = name.startsWith("Anonymous");
  const initials = anon
    ? "?"
    : name
        .split(/\s+/)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
  return (
    <span
      aria-hidden
      className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted font-mono text-xs font-semibold text-muted-foreground"
    >
      {initials}
    </span>
  );
}

export function StoryByline({ s }: { s: Story }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={s.author} />
      <div className="leading-tight">
        <p className="font-semibold">{s.author}</p>
        {/* Self-declared connection — never shown as verified */}
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          {s.relationship}
        </p>
      </div>
    </div>
  );
}

export function useShare() {
  const [copied, setCopied] = useState(false);
  const share = async (path: string, title: string) => {
    const url = typeof window !== "undefined" ? window.location.origin + path : path;
    try {
      if (navigator.share) await navigator.share({ title, url });
      else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* dismissed */
    }
  };
  return { copied, share };
}

export function AppreciateButton() {
  return (
    <Link to="/account" className="hover:text-foreground">
      ♡ Appreciate
    </Link>
  );
}

export function StoryEntry({ s, showSubject }: { s: Story; showSubject?: boolean }) {
  const long = s.body.length > STORY_PREVIEW;
  const preview = long
    ? s.body.slice(0, s.body.lastIndexOf(" ", STORY_PREVIEW)).replace(/[,.;:—\s]+$/, "") + "…"
    : s.body;
  const thing = getThing(s.slug);
  const { copied, share } = useShare();
  const path = `/stories/${s.slug}/${s.num}`;
  return (
    <article className="border-t border-foreground/20 pt-6">
      <StoryByline s={s} />
      {showSubject && thing && (
        <p className="mt-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
          About:{" "}
          <Link to="/thing/$slug" params={{ slug: s.slug }} className="text-foreground underline">
            {thing.name}
          </Link>
        </p>
      )}
      <blockquote className="mt-4 border-l-2 border-muted-foreground/40 pl-4 text-lg leading-relaxed">
        {preview}
      </blockquote>
      {long && (
        <Link
          to="/stories/$slug/$num"
          params={{ slug: s.slug, num: String(s.num) }}
          className="mt-3 inline-block font-mono text-xs uppercase tracking-wider underline"
        >
          Continue reading →
        </Link>
      )}
      <div className="mt-4 flex gap-5 font-mono text-xs text-muted-foreground">
        <AppreciateButton />
        <button
          type="button"
          onClick={() => share(path, `${s.author} on ${thing?.name ?? "Scruttin"}`)}
          className="hover:text-foreground"
        >
          {copied ? "Link copied" : "Share"}
        </button>
        <Link
          to="/stories/$slug/$num"
          params={{ slug: s.slug, num: String(s.num) }}
          className="hover:text-foreground"
        >
          {timeAgo(s.date)}
        </Link>
      </div>
    </article>
  );
}

export function StoryComposer({ thingName, onClose }: { thingName: string; onClose: () => void }) {
  const [conn, setConn] = useState<string>("");
  const [body, setBody] = useState("");
  const [done, setDone] = useState(false);
  if (done)
    return (
      <div className="mt-6 border-t border-foreground/20 pt-6">
        <p className="font-display text-2xl font-semibold">Thank you for sharing.</p>
        <p className="mt-2 text-muted-foreground">
          Your story about {thingName} will appear here once it's been reviewed.
        </p>
        <button onClick={onClose} className="mt-4 font-mono text-xs uppercase underline">
          Close
        </button>
      </div>
    );
  return (
    <form
      className="mt-6 border-t border-foreground/20 pt-6"
      onSubmit={(e) => {
        e.preventDefault();
        if (conn && body.trim()) setDone(true);
      }}
    >
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        Your connection
      </p>
      <p className="mt-1 font-display text-xl font-semibold">How were you there?</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {CONNECTIONS.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => setConn(c.value)}
            aria-pressed={conn === c.value}
            className={`border px-3 py-1.5 font-mono text-xs ${conn === c.value ? "border-foreground bg-foreground text-background" : "border-foreground/40 hover:border-foreground"}`}
          >
            {c.label}
          </button>
        ))}
      </div>
      <label className="mt-6 block font-display text-xl font-semibold" htmlFor="story-body">
        Tell us what happened from your side.
      </label>
      <textarea
        id="story-body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        rows={8}
        placeholder="Two sentences or the whole story — both are welcome."
        className="mt-3 w-full resize-y border border-foreground/30 bg-background p-4 text-lg leading-relaxed outline-none focus:border-foreground"
      />
      <div className="mt-4 flex items-center gap-5">
        <button
          type="submit"
          disabled={!conn || !body.trim()}
          className="bg-foreground px-5 py-3 font-mono text-sm uppercase text-background disabled:opacity-40"
        >
          Publish story
        </button>
        <button
          type="button"
          onClick={onClose}
          className="font-mono text-xs uppercase text-muted-foreground underline"
        >
          Cancel
        </button>
      </div>
      <p className="mt-3 font-mono text-[11px] text-muted-foreground">
        Your connection is shown as self-declared. Stories are reviewed before appearing.
      </p>
    </form>
  );
}

export function WereYouThere({
  slug,
  thingName,
  list,
}: {
  slug: string;
  thingName: string;
  list: Story[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <section className="mt-16 bg-muted/40 p-6 md:p-10">
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        Community accounts · not Scruttin reporting
      </p>
      <h2 className="mt-2 font-display text-4xl font-bold">Were you there?</h2>
      <p className="mt-2 text-lg text-muted-foreground">
        Did you build it, work there, use it, invest in it, or witness what happened?
      </p>
      {!open && (
        <Link
          to="/account"
          className="mt-6 inline-flex bg-foreground px-5 py-3 font-mono text-sm uppercase text-background"
        >
          Share your story
        </Link>
      )}
      {open && <StoryComposer thingName={thingName} onClose={() => setOpen(false)} />}
      <div className="mt-10 space-y-8">
        {list.length ? (
          list.map((s) => <StoryEntry key={s.id} s={s} />)
        ) : (
          <p className="italic text-muted-foreground">
            No one has shared a story about {thingName} yet.
          </p>
        )}
      </div>
      {list.length > 0 && (
        <p className="mt-8 font-mono text-[11px] text-muted-foreground">
          Personal accounts. Connections are self-declared and not verified by Scruttin.{" "}
          <Link to="/stories" className="underline">
            All stories →
          </Link>
        </p>
      )}
    </section>
  );
}
