// Netlify Edge Function — robots.txt pointing crawlers to the sitemap.

export default function handler(req: Request): Response {
  const origin = new URL(req.url).origin;
  const txt = `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;
  return new Response(txt, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "public, max-age=3600" } });
}

export const config = { path: "/robots.txt" };
