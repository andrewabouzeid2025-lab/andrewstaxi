const fs = require('fs');
const content = fs.readFileSync('blog/autumn-day-trip-from-beirut-byblos-and-batroun-with-a-private-driver.md', 'utf8');
const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
if (match) {
  const frontmatter = match[1];
  const date = frontmatter.match(/date:\s*["']?([^"'\n]+)["']?/)?.[1];
  console.log('Parsed Date:', date);
}
