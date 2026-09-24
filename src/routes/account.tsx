import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — Scruttin" },
      { name: "description", content: "Sign in to participate in the Scruttin archive." },
    ],
  }),
  component: Account,
});

function Account() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl items-center px-4 py-16">
      <section className="w-full border-t border-foreground pt-8">
        <p className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
          The archive is participatory
        </p>
        <h1 className="mt-4 font-display text-5xl font-bold leading-none">Your account</h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
          Sign in to appreciate stories, share links, report entries, and contribute your own
          account of what happened.
        </p>
        <button
          type="button"
          className="mt-8 flex w-full items-center justify-center gap-3 border border-foreground bg-foreground px-5 py-3 font-mono text-sm uppercase text-background transition-opacity hover:opacity-85"
        >
          <span aria-hidden className="text-base font-semibold">
            G
          </span>
          Continue with Google
        </button>
        <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
          One account. Google sign-in only.
        </p>
        <Link to="/" className="mt-10 inline-block font-mono text-xs uppercase underline">
          ← Back to the archive
        </Link>
      </section>
    </main>
  );
}
