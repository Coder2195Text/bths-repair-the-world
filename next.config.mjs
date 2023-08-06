import createMDX from "@next/mdx";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/image-upload",
        destination:
          "https://freeimage.host/api/1/upload?key=6d207e02198a847aa98d0a2a901485a5", // Proxy to Backend
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.mdx?$/,

  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
    providerImportSource: "@mdx-js/react",
  },
});
export default withMDX(nextConfig);
