#!/usr/bin/env node
/**
 * scripts/generate-blog.js
 *
 * Daily SEO post generator for Andrews Taxi.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import sharp from 'sharp';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const BRAVE_URL = 'https://api.search.brave.com/res/v1/web/search';

const POSTS_DIR = path.join(process.cwd(), 'blog');
const IMAGES_DIR = path.join(process.cwd(), 'public', 'images');
const CONSTANTS_FILE = path.join(process.cwd(), 'constants.ts');

const SITE_URL = 'https://www.andrewstaxi.com';

const MODEL = 'claude-sonnet-5-5';
const DRAFT_MODE = String(process.env.DRAFT_MODE).toLowerCase() === 'true';

const MAX_SEARCHES = 6;
const MAX_ROUNDS = 10;

function fail(message) {
  console.error(`\n[generate-blog] ERROR: ${message}\n`);
  process.exit(1);
}

function log(message) {
  console.log(`[generate-blog] ${message}`);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 70);
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}

// Read Constants.ts to inject real zones/services
function loadCatalogue() {
  if (!fs.existsSync(CONSTANTS_FILE)) return [];
  const source = fs.readFileSync(CONSTANTS_FILE, 'utf8');
  const zones = [];
  const matches = source.matchAll(/id:\s*'([^']+)',\s*label:\s*'([^']+)'/g);
  for (const match of matches) {
    if (match[1] !== 'other') {
      zones.push({ id: match[1], title: match[2], url: `${SITE_URL}/#fare-estimator` });
    }
  }
  return zones;
}

const PRESETS = {
  airport: {
    label: 'Airport Transfer',
    visual: 'a sleek modern taxi waiting outside an international airport arrivals terminal, professional driver loading luggage, golden hour lighting, high quality',
  },
  tourism: {
    label: 'Lebanon Tourism',
    visual: 'a comfortable private car driving along a scenic coastal road in Lebanon, overlooking the Mediterranean Sea, sunny day, travel photography',
  },
  city: {
    label: 'City Rides',
    visual: 'a clean taxi navigating the vibrant streets of Beirut at dusk, city lights blurring in the background, cinematic urban photography',
  },
  default: {
    label: 'Taxi Service',
    visual: 'a modern, perfectly clean premium taxi parked on a beautiful street in Lebanon, professional travel service, photorealistic',
  }
};

async function braveSearch(query, count = 8) {
  const apiKey = process.env.BRAVE_API_KEY;
  if (!apiKey) return 'Search is unavailable: no API key. Write from your own knowledge.';
  if (!query) return 'No query.';

  log(`  Brave search: "${query}"`);
  try {
    const response = await fetch(`${BRAVE_URL}?q=${encodeURIComponent(query)}&count=${count}`, {
      headers: { accept: 'application/json', 'x-subscription-token': apiKey },
    });
    if (!response.ok) return `Search failed: HTTP ${response.status}`;
    const data = await response.json();
    return (data?.web?.results || []).map(r => `${r.title}\n${r.description}`).join('\n\n');
  } catch (e) {
    return `Search failed: ${e.message}`;
  }
}

const BRAVE_TOOL = {
  name: 'brave_search',
  description: 'Search the web for trending travel or taxi topics in Lebanon.',
  input_schema: { type: 'object', properties: { query: { type: 'string' } }, required: ['query'] },
};

const SYSTEM_PROMPT = `You are the in-house SEO content writer for Andrews Taxi, a premium taxi and transfer service in Lebanon.
BRAND VOICE: Direct, professional, helpful. Emphasize reliability, fixed pricing, and 24/7 availability.

TOPIC GUIDELINES:
Vary your topics every day. Include the following subjects from time to time:
- Touristic tours and spots to visit in Lebanon.
- Restaurants, pubs, and nightlife (reminding readers they can order our taxi to get there).
- Safety and fast service.
- Daily rides such as school drop-offs and pickups, or university commutes.
- Interviews or Q&A with the owner "Charbel Abou Zeid" who has more than 30 years in the business.

KEYWORD STRATEGY:
Combine high-intent keywords like "Beirut airport taxi", "Lebanon private driver", "taxi to Byblos", "Beirut airport transfer" with trending topics.

LINKING TO OUR ZONES:
Here are our supported pickup/dropoff zones:
\${CATALOGUE}

Wherever relevant, naturally mention these destinations and link them to the fare estimator: e.g. [Beirut Airport (BEY)](https://andrewstaxi.com/#fare-estimator).

OUTPUT FORMAT & BILINGUAL REQUIREMENT:
Write the blog post in English. After the English content, you MUST provide the exact same blog post translated into Arabic within the same document, clearly separated by a heading (e.g., ## Arabic Translation / ترجمة عربية).

Return ONLY a Markdown document starting with YAML frontmatter:
---
title: "Title here"
date: "\${DATE}"
excerpt: "Short summary"
keywords: "taxi, lebanon, beirut airport"
---
Body text in English...

## Arabic Translation / ترجمة عربية
Body text in Arabic...
`;

async function callAnthropicRaw(apiKey, body) {
  const response = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`Anthropic Error: ${await response.text()}`);
  return await response.json();
}

async function generateArticle(apiKey, catalogue) {
  const catText = catalogue.map(c => `- "${c.title}" -> ${c.url}`).join('\n');
  const messages = [{ role: 'user', content: `Write today's SEO blog post. Date: ${todayISO()}. Use brave_search if needed.` }];
  let searches = 0;

  try {
    for (let i = 0; i < MAX_ROUNDS; i++) {
      const data = await callAnthropicRaw(apiKey, {
        model: MODEL, max_tokens: 4000, system: SYSTEM_PROMPT.replace('${CATALOGUE}', catText).replace('${DATE}', todayISO()),
        messages, tools: [BRAVE_TOOL]
      });

      const blocks = data.content || [];
      const toolUses = blocks.filter(b => b.type === 'tool_use');
      if (toolUses.length === 0) return blocks.filter(b => b.type === 'text').map(b => b.text).join('').trim();

      messages.push({ role: 'assistant', content: blocks });
      const results = [];
      for (const tu of toolUses) {
        const res = searches >= MAX_SEARCHES ? 'Budget exhausted.' : await braveSearch(tu.input?.query);
        searches++;
        results.push({ type: 'tool_result', tool_use_id: tu.id, content: res });
      }
      messages.push({ role: 'user', content: results });
    }
    return `---
title: "AI Timeout Error"
date: "${todayISO()}"
excerpt: "The AI took too many rounds to finish."
---
The AI did not finish in time.`;
  } catch (err) {
    return `---
title: "AI Generation Error"
date: "${todayISO()}"
excerpt: "Failed to generate blog post due to an API error."
---
We encountered an error while generating today's blog post.

**Error Details:**
\`\`\`
${err.message}
\`\`\`
`;
  }
}

async function cloudflareImage(prompt) {
  const accountId = process.env.CF_ACCOUNT_ID;
  const token = process.env.CF_API_TOKEN;
  const model = process.env.CF_IMAGE_MODEL || '@cf/black-forest-labs/flux-1-schnell';

  if (!accountId || !token) {
    throw new Error('Missing Cloudflare Secrets! CF_ACCOUNT_ID and CF_API_TOKEN must be set in GitHub Repository Secrets.');
  }

  const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/${model}`, {
    method: 'POST', headers: { authorization: `Bearer ${token}` },
    body: JSON.stringify({ prompt: prompt.slice(0, 2000) }),
  });
  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`CF HTTP ${response.status}: ${errText}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const json = await response.json();
    if (json.success === false) {
      throw new Error(`CF AI Error: ${JSON.stringify(json.errors)}`);
    }
    const b64 = json.result?.image || json.result;
    if (typeof b64 === 'string') {
      return { buffer: Buffer.from(b64, 'base64'), extension: 'png' };
    }
    throw new Error('Unexpected CF JSON response format: ' + JSON.stringify(json).slice(0, 200));
  }

  return { buffer: Buffer.from(await response.arrayBuffer()), extension: 'png' };
}

async function main() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) fail('ANTHROPIC_API_KEY missing');

  const catalogue = loadCatalogue();
  const markdown = await generateArticle(apiKey, catalogue);

  let title = 'taxi-post', excerpt = '';
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (match) {
    const tLine = match[1].match(/^title:\s*(.+)$/m);
    if (tLine) title = tLine[1].trim().replace(/^["']|["']$/g, '');
    const eLine = match[1].match(/^excerpt:\s*(.+)$/m);
    if (eLine) excerpt = eLine[1].trim().replace(/^["']|["']$/g, '');
  }
  const slug = slugify(title) || 'taxi-post';

  const imagePrompt = `Ultra-realistic cinematic travel photography in Lebanon. Scene: ${title} - areas, landmarks, roads, or villages in Lebanon related to ${excerpt.slice(0, 50)}. Photorealistic, beautiful scenery in Lebanon, hyper-detailed. No text.`;

  let imagePath = '';
  try {
    const { buffer, extension } = await cloudflareImage(imagePrompt);
    fs.mkdirSync(IMAGES_DIR, { recursive: true });

    const logoPath = path.join(process.cwd(), 'public', 'logo-white.png');
    const logoBuffer = await sharp(logoPath).resize({ width: 150 }).toBuffer();

    const finalBuffer = await sharp(buffer)
      .composite([{ input: logoBuffer, gravity: 'southeast' }])
      .toBuffer();

    const fileName = `${slug}-${crypto.randomBytes(4).toString('hex')}.${extension}`;
    fs.writeFileSync(path.join(IMAGES_DIR, fileName), finalBuffer);
    imagePath = `/images/${fileName}`;
  } catch (e) {
    log(`Image gen failed: ${e.message}`);
  }

  const finalMd = markdown.replace(/^---([\s\S]*?)---/, `---\nimage: "${imagePath}"$1---`);
  fs.mkdirSync(POSTS_DIR, { recursive: true });
  fs.writeFileSync(path.join(POSTS_DIR, `${slug}.md`), finalMd);
  log(`Created ${slug}.md`);

  // Update Sitemap
  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  if (fs.existsSync(sitemapPath)) {
    try {
      let sitemap = fs.readFileSync(sitemapPath, 'utf8');
      const newUrl = `
  <url>
    <loc>${SITE_URL}/blog/${slug}</loc>
    <lastmod>${todayISO()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
      sitemap = sitemap.replace('</urlset>', newUrl.trim() + '\n</urlset>');
      fs.writeFileSync(sitemapPath, sitemap);
      log(`Updated sitemap.xml with ${slug}`);
    } catch (err) {
      log(`Failed to update sitemap: ${err.message}`);
    }
  }

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `slug=${slug}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `title=${title}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `image=${imagePath}\n`);
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `excerpt=${excerpt}\n`);
  }
}

main().catch(e => fail(e.stack || e.message));
