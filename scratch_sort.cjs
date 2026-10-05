const fs = require('fs');
const files = fs.readdirSync('blog');
const posts = files.map(file => {
  const content = fs.readFileSync('blog/' + file, 'utf8');
  let date = '';
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (match) {
    const frontmatter = match[1];
    date = frontmatter.match(/date:\s*["']?([^"'\n]+)["']?/)?.[1] || date;
  }
  return { file, date, time: new Date(date).getTime() };
}).sort((a, b) => b.time - a.time);
console.log(posts);
