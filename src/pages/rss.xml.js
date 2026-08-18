import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

const slugFor = (id) => id.replace(/^\d+_/, "");

export async function GET(context) {
  // same draft filter as /blog, [...slug] and the Writing block - one source of truth
  const posts = (await getCollection("posts", ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime(),
  );

  return rss({
    title: "Gil Neto — Writing",
    description:
      "Technical writing on infrastructure, AI systems, agents and founder-engineering.",
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/blog/${slugFor(post.id)}/`,
      categories: post.data.tags,
    })),
    customData: "<language>en</language>",
  });
}
