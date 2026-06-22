// Netlify Edge Function — Server-rendered HSE blog for SEO.
// Serves /blog (index) and /blog/<slug> (article) with full meta tags,
// Open Graph, Twitter cards, and schema.org JSON-LD. Reads published
// articles from Supabase REST using the public anon key.

const SUPABASE_URL = "https://wxrukupcyfypnqnotmxv.supabase.co";
const ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4cnVrdXBjeWZ5cG5xbm90bXh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0NjA2OTEsImV4cCI6MjA5NzAzNjY5MX0.68unhGtpIxnTg4XsjdYHLiXM7aLuwls5Jo0tSarqR90";

const SITE_NAME = "مرشد السلامة";
const AUTHOR = "سياف الهذلي";

function esc(s: string): string {
  return (s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

async function sb(path: string): Promise<any[]> {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
  });
  if (!res.ok) return [];
  return await res.json();
}

const SHELL_CSS = `
:root{--orange:#FF6D00;--gold:#FFB627;--ink:#0A1628;--bg:#f7f8fb;--card:#fff;--muted:#5b6675;--sep:#e6e9ef;}
*{box-sizing:border-box;}
body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Tajawal",Arial,sans-serif;background:var(--bg);color:#15202b;line-height:1.85;}
a{color:var(--orange);text-decoration:none;}
.bnav{position:sticky;top:0;z-index:10;display:flex;align-items:center;justify-content:space-between;padding:14px 22px;background:rgba(255,255,255,.9);backdrop-filter:blur(12px);border-bottom:1px solid var(--sep);}
.bnav .brand{display:flex;align-items:center;gap:10px;font-weight:900;color:var(--ink);}
.bnav .brand .logo{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,var(--orange),var(--gold));display:flex;align-items:center;justify-content:center;font-size:18px;}
.bnav .cta{background:linear-gradient(135deg,var(--orange),var(--gold));color:#fff;padding:9px 18px;border-radius:11px;font-weight:800;font-size:14px;}
.wrap{max-width:820px;margin:0 auto;padding:30px 20px 70px;}
.hero{background:radial-gradient(ellipse 120% 80% at 50% 0%,#13284A,#0A1628);color:#fff;padding:54px 20px 46px;text-align:center;}
.hero h1{font-size:clamp(26px,5vw,42px);font-weight:900;margin:0 0 12px;letter-spacing:-1px;}
.hero p{color:rgba(235,240,250,.72);max-width:620px;margin:0 auto;font-size:16px;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:18px;}
.card{background:var(--card);border:1px solid var(--sep);border-radius:18px;padding:22px;transition:.2s;display:block;color:inherit;}
.card:hover{transform:translateY(-4px);box-shadow:0 12px 34px rgba(10,22,40,.1);}
.card .emoji{font-size:34px;}
.card h2{font-size:18px;font-weight:800;color:var(--ink);margin:10px 0 8px;line-height:1.4;}
.card .ex{font-size:13.5px;color:var(--muted);margin-bottom:12px;}
.chip{display:inline-block;font-size:11px;font-weight:800;color:var(--orange);background:rgba(255,109,0,.08);padding:4px 11px;border-radius:12px;}
.meta{display:flex;flex-wrap:wrap;gap:10px;align-items:center;font-size:13px;color:var(--muted);margin:14px 0 0;}
article h1{font-size:clamp(26px,4.5vw,38px);font-weight:900;color:var(--ink);letter-spacing:-.5px;line-height:1.25;margin:0 0 10px;}
article h2{font-size:23px;font-weight:900;color:var(--ink);margin:34px 0 12px;border-right:4px solid var(--orange);padding-right:12px;}
article h3{font-size:19px;font-weight:800;color:var(--ink);margin:24px 0 10px;}
article p{margin:14px 0;font-size:16.5px;}
article ul,article ol{padding-right:24px;margin:14px 0;}
article li{margin:8px 0;font-size:16px;}
.std-box{background:linear-gradient(135deg,rgba(255,109,0,.07),rgba(255,182,39,.07));border:1px solid rgba(255,109,0,.25);border-radius:14px;padding:14px 18px;margin:22px 0;font-weight:700;color:#8a4b00;}
.author{display:flex;align-items:center;gap:12px;margin:26px 0;padding:16px;background:var(--card);border:1px solid var(--sep);border-radius:16px;}
.author .av{width:46px;height:46px;border-radius:50%;background:linear-gradient(135deg,var(--orange),var(--gold));display:flex;align-items:center;justify-content:center;font-size:22px;}
.endcta{margin-top:40px;background:linear-gradient(135deg,var(--orange),var(--gold));color:#fff;border-radius:22px;padding:34px;text-align:center;}
.endcta h3{font-size:24px;font-weight:900;margin:0 0 8px;}
.endcta a{display:inline-block;margin-top:14px;background:#fff;color:var(--orange);font-weight:800;padding:13px 30px;border-radius:13px;}
.bcrumb{font-size:13px;color:var(--muted);margin-bottom:14px;}
.foot{text-align:center;padding:30px 20px;color:var(--muted);font-size:13px;border-top:1px solid var(--sep);}
`;

function navHtml(origin: string): string {
  return `<nav class="bnav"><a class="brand" href="${origin}/blog"><span class="logo">🛡️</span> ${SITE_NAME}</a><a class="cta" href="${origin}/">ابدأ التدريب مجاناً 🚀</a></nav>`;
}
function footHtml(): string {
  return `<div class="foot">© ${new Date().getFullYear()} ${SITE_NAME} — بإشراف وتطوير ${AUTHOR} · أخصائي السلامة والصحة المهنية</div>`;
}

function page(opts: {
  title: string; description: string; canonical: string; origin: string;
  ogType: string; ogImage: string; jsonld: string; body: string; keywords?: string;
}): Response {
  const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(opts.title)}</title>
<meta name="description" content="${esc(opts.description)}">
${opts.keywords ? `<meta name="keywords" content="${esc(opts.keywords)}">` : ""}
<link rel="canonical" href="${esc(opts.canonical)}">
<meta name="author" content="${AUTHOR}">
<meta property="og:type" content="${opts.ogType}">
<meta property="og:title" content="${esc(opts.title)}">
<meta property="og:description" content="${esc(opts.description)}">
<meta property="og:url" content="${esc(opts.canonical)}">
<meta property="og:site_name" content="${SITE_NAME}">
<meta property="og:locale" content="ar_AR">
<meta property="og:image" content="${esc(opts.ogImage)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(opts.title)}">
<meta name="twitter:description" content="${esc(opts.description)}">
<meta name="twitter:image" content="${esc(opts.ogImage)}">
<script type="application/ld+json">${opts.jsonld}</script>
<style>${SHELL_CSS}</style>
</head>
<body>
${navHtml(opts.origin)}
${opts.body}
${footHtml()}
</body>
</html>`;
  return new Response(html, { headers: { "content-type": "text/html; charset=utf-8", "cache-control": "public, max-age=300, s-maxage=600" } });
}

function notFound(origin: string): Response {
  const body = `<div class="hero"><h1>المقال غير موجود</h1><p>ربما تم نقله أو لم يُنشر بعد.</p></div><div class="wrap" style="text-align:center;"><a class="chip" href="${origin}/blog">← العودة لكل المقالات</a></div>`;
  const res = page({ title: `المقال غير موجود — ${SITE_NAME}`, description: "الصفحة غير موجودة", canonical: `${origin}/blog`, origin, ogType: "website", ogImage: `${origin}/blog-og.png`, jsonld: "{}", body });
  return new Response(res.body, { status: 404, headers: res.headers });
}

export default async function handler(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const origin = url.origin;
  const parts = url.pathname.replace(/\/+$/, "").split("/").filter(Boolean); // ["blog"] or ["blog","slug"]

  // ── Article page ──
  if (parts.length >= 2 && parts[0] === "blog") {
    const slug = decodeURIComponent(parts.slice(1).join("/"));
    const rows = await sb(`articles?slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=*&limit=1`);
    const a = rows[0];
    if (!a) return notFound(origin);

    // Fire-and-forget view counter
    fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_article_views`, {
      method: "POST",
      headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}`, "content-type": "application/json" },
      body: JSON.stringify({ p_slug: slug }),
    }).catch(() => {});

    const canonical = `${origin}/blog/${encodeURIComponent(slug)}`;
    const title = a.seo_title || a.title;
    const desc = a.seo_description || a.excerpt || a.title;
    const ogImage = a.og_image || `${origin}/blog-og.png`;
    const jsonld = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: a.title,
      description: desc,
      datePublished: a.published_at,
      dateModified: a.updated_at,
      author: { "@type": "Person", name: AUTHOR },
      publisher: { "@type": "Organization", name: SITE_NAME },
      mainEntityOfPage: canonical,
      articleSection: a.category || undefined,
      keywords: a.keywords || (Array.isArray(a.tags) ? a.tags.join(", ") : undefined),
    });
    const breadcrumb = JSON.stringify({
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "المدونة", item: `${origin}/blog` },
        { "@type": "ListItem", position: 2, name: a.title, item: canonical },
      ],
    });
    const stdBox = a.standard ? `<div class="std-box">📋 المعيار المرجعي: ${esc(a.standard)}</div>` : "";
    const tags = Array.isArray(a.tags) && a.tags.length
      ? `<div class="meta">${a.tags.map((t: string) => `<span class="chip">${esc(t)}</span>`).join("")}</div>` : "";
    const body = `
<div class="wrap">
  <div class="bcrumb"><a href="${origin}/blog">المدونة</a> ← ${esc(a.category || "مقال")}</div>
  <article>
    <div style="font-size:46px;">${esc(a.cover_emoji || "🛡️")}</div>
    <h1>${esc(a.title)}</h1>
    <div class="meta">${a.category ? `<span class="chip">${esc(a.category)}</span>` : ""}<span>⏱ ${a.reading_minutes || 5} دقائق قراءة</span><span>✍️ ${AUTHOR}</span></div>
    ${stdBox}
    ${a.body_html || ""}
    ${tags}
  </article>
  <div class="author"><div class="av">🛡️</div><div><div style="font-weight:900;color:var(--ink);">${AUTHOR}</div><div style="font-size:13px;color:var(--muted);">أخصائي السلامة والصحة المهنية · مؤسس ${SITE_NAME}</div></div></div>
  <div class="endcta"><h3>طبّق ما تعلّمته الآن</h3><p>تدرّب على كوادر، حلّل مواقعك بالذكاء الاصطناعي، وارجع لأي معيار في ثوانٍ.</p><a href="${origin}/">ابدأ مجاناً 🚀</a></div>
</div>
<script type="application/ld+json">${breadcrumb}</script>`;
    return page({ title: `${title} — ${SITE_NAME}`, description: desc, canonical, origin, ogType: "article", ogImage, jsonld, body, keywords: a.keywords });
  }

  // ── Index page ──
  const list = await sb(`articles?status=eq.published&select=slug,title,excerpt,category,cover_emoji,reading_minutes,published_at&order=published_at.desc&limit=60`);
  const cards = list.length
    ? `<div class="grid">${list.map((a: any) => `<a class="card" href="${origin}/blog/${encodeURIComponent(a.slug)}"><div class="emoji">${esc(a.cover_emoji || "🛡️")}</div>${a.category ? `<span class="chip">${esc(a.category)}</span>` : ""}<h2>${esc(a.title)}</h2><div class="ex">${esc(a.excerpt || "")}</div><div style="font-size:12px;color:var(--muted);">⏱ ${a.reading_minutes || 5} دقائق</div></a>`).join("")}</div>`
    : `<div style="text-align:center;color:var(--muted);padding:40px;">لا توجد مقالات منشورة بعد.</div>`;
  const itemList = JSON.stringify({
    "@context": "https://schema.org", "@type": "ItemList",
    itemListElement: list.map((a: any, i: number) => ({ "@type": "ListItem", position: i + 1, url: `${origin}/blog/${encodeURIComponent(a.slug)}`, name: a.title })),
  });
  const body = `
<div class="hero"><h1>مدونة مرشد السلامة</h1><p>مقالات HSE عملية — خطوات قابلة للتطبيق في الميدان مع معيارها المرجعي. بإشراف ${AUTHOR}.</p></div>
<div class="wrap">${cards}</div>`;
  return page({
    title: `مدونة HSE العملية — ${SITE_NAME}`,
    description: "مقالات عملية في السلامة والصحة المهنية: خطوات ميدانية قابلة للتطبيق مع معاييرها المرجعية (OSHA / ISO 45001 / NFPA / كوادر).",
    canonical: `${origin}/blog`, origin, ogType: "website",
    ogImage: `${origin}/blog-og.png`, jsonld: itemList, body,
    keywords: "السلامة المهنية, HSE, كوادر, OSHA, ISO 45001, تحليل مخاطر, سلامة العمل",
  });
}

export const config = { path: ["/blog", "/blog/*"] };
