import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { formatDate, getStories, getThing, year } from "@/lib/data";
import { Lifeline, StatusBadge } from "@/components/ui-bits";
import { WereYouThere } from "@/components/stories";
import { SubjectGallery } from "@/components/gallery";

export const Route = createFileRoute("/thing/$slug")({
  loader: ({ params }) => {
    const thing = getThing(params.slug);
    if (!thing) throw notFound();
    return { thing };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData)
      return { meta: [{ title: "Not found — Scruttin" }, { name: "robots", content: "noindex" }] };
    const t = loaderData.thing;
    const title = `What Happened to ${t.name}? — Scruttin`;
    const desc = `${t.name} was ${t.status.toLowerCase()} in ${year(t.end)}. What happened, ${t.officialReason ? "why it ended, " : ""}what happened to users${t.replacedBy ? ", and what replaced it" : ""}.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/thing/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/thing/${params.slug}` }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description: desc,
            dateModified: t.updated,
            about: { "@type": "Thing", name: t.name, description: t.description },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <main className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-4xl font-bold">Not in the archive yet</h1>
      <Link to="/add" className="mt-6 inline-block underline">
        Add something that ended →
      </Link>
    </main>
  ),
  component: ThingPage,
});

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-3 mt-12 font-display text-3xl font-bold">{children}</h2>;
}
function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-1 mt-4 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
      {children}
    </p>
  );
}

function ThingPage() {
  const { thing: t } = Route.useLoaderData();
  return (
    <main className="mx-auto max-w-3xl px-4 pb-24">
      <header className="border-b border-foreground pb-8 pt-12">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {t.description.replace(/\.$/, "")} · {t.organization}
        </p>
        <h1 className="mt-3 font-display text-6xl font-bold md:text-7xl">{t.name}</h1>
        <div className="mt-6">
          <Lifeline start={t.launch} end={t.end} large />
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <StatusBadge status={t.status} />
          <span className="font-mono text-xs text-muted-foreground">
            {t.type} · Ended {formatDate(t.end)}
            {t.announced ? ` · Announced ${formatDate(t.announced)}` : ""}
          </span>
        </div>
      </header>

      <H>What happened?</H>
      <p className="text-xl leading-relaxed">{t.whatHappened}</p>

      {(t.officialReason || t.reportedFactors) && (
        <>
          <H>Why?</H>
          {t.officialReason && (
            <>
              <Label>Official reason</Label>
              <p className="text-lg leading-relaxed">{t.officialReason}</p>
            </>
          )}
          {t.reportedFactors && (
            <>
              <Label>Reported contributing factors</Label>
              <ul className="list-disc pl-5 text-lg">
                {t.reportedFactors.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </>
          )}
        </>
      )}

      {t.userImpact && (
        <>
          <H>What happened to users?</H>
          <ul className="list-disc space-y-1 pl-5 text-lg">
            {t.userImpact.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </>
      )}

      <H>What replaced it?</H>
      <p className="text-lg">
        {t.replacedBy ? (
          <>
            Replaced by <strong>{t.replacedBy}</strong>
          </>
        ) : (
          "No official replacement."
        )}
      </p>
      {t.alternatives && (
        <>
          <Label>Common alternatives</Label>
          <p className="text-lg">{t.alternatives.join(" · ")}</p>
        </>
      )}

      <H>Timeline</H>
      <ol className="border-l-2 border-foreground">
        {t.timeline.map((e, i) => (
          <li key={i} className="relative pb-6 pl-6">
            <span
              className={`absolute -left-[7px] top-1.5 h-3 w-3 ${i === t.timeline.length - 1 ? "bg-primary" : "bg-foreground"}`}
            />
            <p className="font-mono text-sm font-semibold">{e.date}</p>
            <p className="text-lg">{e.title}</p>
          </li>
        ))}
      </ol>

      <H>Sources</H>
      {t.sources.length ? (
        <ul className="space-y-2">
          {t.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer" className="underline">
                {s.title}
              </a>
              <span className="font-mono text-xs text-muted-foreground">
                {" "}
                — {s.publisher} · {s.type}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted-foreground">Sources for this record still need to be added.</p>
      )}
      <p className="mt-4 font-mono text-xs text-muted-foreground">
        Last updated {formatDate(t.updated)}
      </p>
      <div className="mt-4 flex gap-4 font-mono text-xs uppercase">
        <Link to="/account" className="underline">
          Suggest correction
        </Link>
        <Link to="/account" className="underline">
          Add source
        </Link>
      </div>

      <WereYouThere slug={t.slug} thingName={t.name} list={getStories(t.slug)} />
      <SubjectGallery subjectName={t.name} images={t.gallery} />
    </main>
  );
}
