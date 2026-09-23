import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import type { MDXRemoteProps } from "next-mdx-remote/rsc";

// format: "md" disables JSX, expressions and ESM so AI-generated
// content can never execute code at build time.
export const mdxOptions: NonNullable<MDXRemoteProps["options"]> = {
  mdxOptions: {
    format: "md",
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  },
};
