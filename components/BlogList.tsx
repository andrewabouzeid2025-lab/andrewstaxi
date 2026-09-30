import React from 'react';
import { Link } from 'react-router-dom';

// Fetch all markdown files from the blog directory
const postsRaw = import.meta.glob('../../blog/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const posts = Object.entries(postsRaw).map(([path, content]) => {
  const slug = path.split('/').pop()?.replace('.md', '');
  
  let title = slug;
  let date = '';
  let excerpt = '';
  let image = '';
  
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (match) {
    const frontmatter = match[1];
    title = frontmatter.match(/title:\s*["']?([^"'\n]+)["']?/)?.[1] || title;
    date = frontmatter.match(/date:\s*["']?([^"'\n]+)["']?/)?.[1] || date;
    excerpt = frontmatter.match(/excerpt:\s*["']?([^"'\n]+)["']?/)?.[1] || excerpt;
    image = frontmatter.match(/image:\s*["']?([^"'\n]+)["']?/)?.[1] || image;
  }
  
  const body = content.replace(/^---\n[\s\S]*?\n---/, '').trim();
  
  return { slug, title, date, excerpt, image, body };
}).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export const BlogList: React.FC = () => {
  return (
    <div className="pt-24 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Taxi & Travel Blog</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
            {post.image && <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />}
            <div className="p-6 flex-1 flex flex-col">
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-500 text-sm mb-4">{post.date}</p>
              <p className="text-gray-700 flex-1">{post.excerpt}</p>
              <span className="text-taxi-yellow font-semibold mt-4">Read more &rarr;</span>
            </div>
          </Link>
        ))}
        {posts.length === 0 && (
          <div className="col-span-3 text-center py-12 text-gray-500">
            No blog posts yet. Check back soon!
          </div>
        )}
      </div>
    </div>
  );
};
