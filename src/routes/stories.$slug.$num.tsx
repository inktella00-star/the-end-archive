import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { formatDate, getStory, getThing } from "@/lib/data";
import { StoryByline } from "@/components/stories";

export const Route = createFileRoute("/stories/$slug/$num")({
  loader: ({ params }) => {
    const story = getStory(params.slug, params.num);
    const thing = getThing(params.slug);
    if (!story || !thing) throw notFound();
    return { story, thing };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData)
      return {
        meta: [{ title: "Story not found — Scruttin" }, { name: "robots", content: "noindex" }],
      };
    const { story: s, thing: t } = loaderData;
    const title = `${s.author} on ${t.name} (${s.relationship}) — Scruttin`;
    const desc = s.body.slice(0, 155);
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
      links: [{ rel: "canonical", href: `/stories/${params.slug}/${params.num}` }],
    };
  },
  notFoundComponent: () => (
    <main className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl font-bold">Story not found</h1>
      <Link to="/stories" className="mt-6 inline-block underline">
        All stories →
      </Link>
    </main>
  ),
  component: StoryPage,
});

function StoryPage() {
  const { story: s, thing: t } = Route.useLoaderData();
  return (
    <main className="mx-auto max-w-2xl px-4 pb-24 pt-12">
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
        Were you there? · Personal account
      </p>
      <div className="mt-6">
        <StoryByline s={s} />
      </div>
      <div className="mt-8 whitespace-pre-line text-xl leading-relaxed">{s.body}</div>
      <p className="mt-8 font-mono text-xs text-muted-foreground">
        Published {formatDate(s.date)} · Connection self-declared
      </p>
      <div className="mt-4 flex gap-5 font-mono text-xs text-muted-foreground">
        <Link to="/account" className="hover:text-foreground">
          ♡ Appreciate
        </Link>
        <Link to="/account" className="hover:text-foreground">
          {copied ? "Link copied" : "Share"}
        </Link>
        <Link to="/account" className="hover:text-foreground">
          {reported ? "Reported — thanks" : "Report"}
        </Link>
      </div>
      <Link
        to="/thing/$slug"
        params={{ slug: t.slug }}
        className="mt-12 inline-block border-t border-foreground pt-4 font-mono text-sm underline"
      >
        ← Back to What happened to {t.name}?
      </Link>
    </main>
  );
}
