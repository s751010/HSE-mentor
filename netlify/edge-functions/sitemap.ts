// Netlify Edge Function — dynamic sitemap.xml listing published blog articles
// plus the core pages, so Google can discover and index the blog.

const SUPABASE_URL = "https://wxrukupcyfypnqnotmxv.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4cnVrdXBjeWZ5cG5xbm90bXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NjA2OTEsImV4cCI6MjA5NzAzNjY5MX0.68unhGtpIxnTg4XsjdYHLiXM7aLuwls5Jo0tSarqR90";

export default async function handler(req: Request): Promise<Response> {
  const origin = new URL(req.url).origin;
  let rows: any[] = [];
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/articles?status=eq.published&select=slug,updated_at&order=published_at.desc&limit=1000`, {
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
    });
    if (res.ok) rows = await res.json();
  } catch (_e) { /* fall through with empty list */ }

  const urls = [
    `<url><loc>${origin}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
    `<url><loc>${origin}/blog</loc><changefreq>daily</changefreq><priority>0.9</priority></url>`,
    ...rows.map((a) =>
      `<url><loc>${origin}/blog/${encodeURIComponent(a.slug)}</loc><lastmod>${new Date(a.updated_at).toISOString()}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`
    ),
  ].join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
  return new Response(xml, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
}

export const config = { path: "/sitemap.xml" };
