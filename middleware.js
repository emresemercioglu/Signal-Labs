// Markdown content negotiation.
//
// Cloudflare converts HTML to Markdown on the fly for zones on its network.
// This site is served straight from Vercel, so the twins under /md/ are
// pre-built and swapped in here instead.
//
// This has to be middleware rather than a vercel.json rewrite: rewrites are
// evaluated only after the filesystem check, so a request for /pricing would
// always be answered by pricing.html before any rewrite could fire. Middleware
// runs first.
//
// Deliberately dependency-free so it builds without a package.json.

export const config = {
  // Skip assets and the discovery documents. Anything with a dot in the last
  // path segment is a file request and has no Markdown twin.
  matcher: ['/((?!_next|assets|\\.well-known|.*\\.[^/]+$).*)'],
};

export default async function middleware(request) {
  const accept = request.headers.get('accept') || '';

  // Browsers send Accept: text/html,...,*/* — the wildcard must not count as a
  // Markdown request, so require an explicit text/markdown token.
  if (!/(^|,)\s*text\/markdown\b/.test(accept)) return;

  const url = new URL(request.url);
  const clean = url.pathname.replace(/\/+$/, '');
  const twin = new URL(`/md${clean === '' ? '/index' : clean}.md`, url.origin);

  const res = await fetch(twin);
  // No twin for this path: fall through to the normal HTML response.
  if (!res.ok) return;

  return new Response(await res.text(), {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      // HTML and Markdown share a URL, so caches must key on Accept.
      Vary: 'Accept',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
      'Content-Signal': 'search=yes, ai-input=yes, ai-train=yes',
    },
  });
}
