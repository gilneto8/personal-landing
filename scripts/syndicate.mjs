#!/usr/bin/env node
// Mirror newly published posts to dev.to and Hashnode, with the canonical URL pointing back to
// gil-neto.com, and hand back a prefilled HN submit link (HN has no submit API; Gil submits it).
//
// Runs in CD after a deploy to `release`. Idempotent: a post already present on a platform (matched
// by canonical URL) is skipped there, so a re-run never double-posts.
//
//   DEVTO_API_KEY, HASHNODE_TOKEN   platform credentials (GitHub secrets)
//   scripts/syndicated.json         slugs already mirrored by hand (posts 1-5), never touched
//   DRY_RUN=1                       validate tokens and print the plan, write nothing
//   LIST_ONLY=1                     print the posts that would be considered, no network
//   GITHUB_STEP_SUMMARY             if set, the report is appended there
//   SYNDICATE_REPORT                if set, the report is also written to this file

import { readdirSync, readFileSync, appendFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SITE = "https://gil-neto.com";
const HASHNODE_HOST = "blog.gil-neto.com";
const POSTS_DIR = new URL("../src/content/posts/", import.meta.url).pathname;
const DONE_BY_HAND = new Set(JSON.parse(readFileSync(new URL("./syndicated.json", import.meta.url), "utf8")).slugs);
const DRY = process.env.DRY_RUN === "1";
const DEVTO_KEY = process.env.DEVTO_API_KEY;
const HASHNODE_TOKEN = process.env.HASHNODE_TOKEN;

// ---------- posts ----------

function parseFrontMatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error("no front matter");
  const data = {};
  let listKey = null;
  for (const line of m[1].split("\n")) {
    const item = line.match(/^\s+-\s+(.*)$/);
    if (item && listKey) { data[listKey].push(unquote(item[1])); continue; }
    const kv = line.match(/^([A-Za-z][\w]*):\s*(.*)$/);
    if (!kv) continue;
    const [, k, v] = kv;
    if (v === "") { data[k] = []; listKey = k; continue; }
    listKey = null;
    const val = unquote(v);
    data[k] = /^["']/.test(v.trim()) ? val : val === "true" ? true : val === "false" ? false : val;
  }
  return { data, body: m[2] };
}

function unquote(v) {
  v = v.trim();
  if (!/^["']/.test(v)) v = v.replace(/\s+#.*$/, ""); // YAML comment after an unquoted value
  if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
  return v;
}

const norm = (u) => (u || "").trim().replace(/\/+$/, "").toLowerCase();

function loadPosts() {
  return readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const { data, body } = parseFrontMatter(readFileSync(join(POSTS_DIR, f), "utf8"));
      const slug = f.replace(/\.md$/, "").replace(/^\d+_/, "");
      const url = `${SITE}/blog/${slug}/`;
      return {
        file: f,
        title: data.title,
        description: data.description || "",
        pubDate: new Date(data.pubDate),
        tags: Array.isArray(data.tags) ? data.tags : [],
        // published only when draft is explicitly false or absent (Astro's default); anything else is held
        draft: !(data.draft === false || data.draft === undefined),
        slug,
        cover: data.cover ? new URL(data.cover, SITE).href : `${SITE}/og-image.png`,
        url,
        // relative links and images would break off-site
        body: body.replace(/\]\(\//g, `](${SITE}/`).replace(/src="\//g, `src="${SITE}/`).trim() + "\n",
      };
    })
    .filter((p) => !p.draft && !DONE_BY_HAND.has(p.slug));
}

async function waitLive(url, tries = 20) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch(url, { method: "GET", redirect: "follow" }).catch(() => null);
    if (r && r.ok) return true;
    await new Promise((s) => setTimeout(s, 15000));
  }
  return false;
}

// ---------- dev.to ----------

const devtoHeaders = () => ({
  "api-key": DEVTO_KEY,
  "Content-Type": "application/json",
  Accept: "application/vnd.forem.api-v1+json",
});

async function devto(path, init = {}) {
  const r = await fetch(`https://dev.to/api${path}`, { ...init, headers: devtoHeaders() });
  const text = await r.text();
  if (!r.ok) throw new Error(`dev.to ${init.method || "GET"} ${path}: ${r.status} ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

async function devtoCanonicals() {
  const seen = new Set();
  for (let page = 1; page < 20; page++) {
    const list = await devto(`/articles/me/all?per_page=100&page=${page}`);
    for (const a of list) seen.add(norm(a.canonical_url));
    if (list.length < 100) break;
  }
  return seen;
}

const devtoTags = (tags) =>
  tags.map((t) => t.toLowerCase().replace(/[^a-z0-9]/g, "")).filter(Boolean).slice(0, 4);

async function devtoPublish(p) {
  const res = await devto("/articles", {
    method: "POST",
    body: JSON.stringify({
      article: {
        title: p.title,
        body_markdown: p.body,
        published: true,
        description: p.description,
        tags: devtoTags(p.tags).join(", "), // Forem v1 takes a comma-separated string, max 4
        canonical_url: p.url,
        main_image: p.cover,
      },
    }),
  });
  return res.url;
}

// ---------- Hashnode ----------

async function hashnode(query, variables = {}) {
  const r = await fetch("https://gql.hashnode.com", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: HASHNODE_TOKEN },
    body: JSON.stringify({ query, variables }),
  });
  const text = await r.text();
  let j = {};
  try { j = JSON.parse(text); } catch { /* non-JSON body, reported below */ }
  if (!r.ok || j.errors || !j.data) throw new Error(`hashnode: ${r.status} ${(JSON.stringify(j.errors) || text).slice(0, 300)}`);
  return j.data;
}

async function hashnodePublication() {
  const d = await hashnode(
    `query($host: String!) { publication(host: $host) { id posts(first: 20) { edges { node { title url canonicalUrl } } } } }`,
    { host: HASHNODE_HOST },
  );
  if (!d.publication) throw new Error(`hashnode: no publication at ${HASHNODE_HOST}`);
  const seen = new Set(d.publication.posts.edges.map((e) => norm(e.node.canonicalUrl)));
  return { id: d.publication.id, seen };
}

const hashnodeTags = (tags) =>
  tags.slice(0, 5).map((t) => ({ slug: t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), name: t }));

async function hashnodePublish(p, publicationId) {
  const d = await hashnode(
    `mutation($input: PublishPostInput!) { publishPost(input: $input) { post { url } } }`,
    {
      input: {
        publicationId,
        title: p.title,
        subtitle: p.description.slice(0, 150),
        contentMarkdown: p.body,
        originalArticleURL: p.url,
        tags: hashnodeTags(p.tags),
      },
    },
  );
  return d.publishPost.post.url;
}

// ---------- main ----------

const hnLink = (p) =>
  `https://news.ycombinator.com/submitlink?u=${encodeURIComponent(p.url)}&t=${encodeURIComponent(p.title)}`;

async function main() {
  if (process.env.LIST_ONLY === "1") {
    for (const p of loadPosts()) console.log(p.pubDate.toISOString().slice(0, 10), p.url, devtoTags(p.tags), p.body.length);
    return;
  }
  if (!DEVTO_KEY || !HASHNODE_TOKEN) throw new Error("DEVTO_API_KEY and HASHNODE_TOKEN are required");
  const lines = [];
  const log = (s) => { console.log(s); lines.push(s); };

  // token checks run every time, so a revoked key fails loudly
  const me = await devto("/users/me");
  const hn = await hashnode(`{ me { username } }`);
  log(`tokens ok: dev.to @${me.username} · hashnode @${hn.me.username}${DRY ? " · DRY RUN" : ""}`);

  const posts = loadPosts();
  if (!posts.length) { log("nothing to mirror (no published post outside scripts/syndicated.json)"); return finish(lines); }

  const devSeen = await devtoCanonicals();
  const pub = await hashnodePublication();
  let failed = false;

  for (const p of posts) {
    log(`\n### ${p.title}\n${p.url}`);
    if (!DRY && !(await waitLive(p.url))) { log(`- ⚠ not live on the site yet, skipped (re-run CD later)`); failed = true; continue; }
    for (const [name, seen, publish] of [
      ["dev.to", devSeen, () => devtoPublish(p)],
      ["Hashnode", pub.seen, () => hashnodePublish(p, pub.id)],
    ]) {
      if (seen.has(norm(p.url))) { log(`- ${name}: already there, skipped`); continue; }
      if (DRY) { log(`- ${name}: would publish`); continue; }
      try { log(`- ${name}: published ${await publish()}`); }
      catch (e) { log(`- ⚠ ${name}: FAILED ${e.message}`); failed = true; }
    }
    log(`- HN (submit by hand, then add your first comment): ${hnLink(p)}`);
  }
  finish(lines);
  if (failed) process.exitCode = 1;
}

function finish(lines) {
  const text = lines.join("\n") + "\n";
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, text);
  if (process.env.SYNDICATE_REPORT) writeFileSync(process.env.SYNDICATE_REPORT, text);
}

main().catch((e) => { console.error(e.message); process.exit(1); });
