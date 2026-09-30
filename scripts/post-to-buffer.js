#!/usr/bin/env node
/**
 * scripts/post-to-buffer.js
 * Posts to social media using Buffer API.
 */
const BUFFER_API_URL = 'https://api.buffer.com';
const SITE_URL = (process.env.SITE_URL || 'https://andrewstaxi.com').replace(/\/$/, '');

// Replace these with the actual channel IDs for the taxi service
const CHANNELS = {
  facebook: '6abcb11eea19ca0bde2f8f2e',
  instagram: '6abcafe3ea19ca0bde2f88de',
};

async function bufferRequest(token, query, variables) {
  const response = await fetch(BUFFER_API_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify({ query, variables }),
  });
  const body = await response.json();
  if (body.errors && body.errors.length > 0) throw new Error(body.errors.map(e => e.message).join('; '));
  return body.data;
}

const CREATE_POST_MUTATION = `
  mutation CreatePost($input: CreatePostInput!) {
    createPost(input: $input) {
      ... on PostActionSuccess { post { id } }
      ... on MutationError { message }
    }
  }
`;

async function postToChannel(token, { channelId, label, text, imageUrl, metadata }) {
  if (channelId.includes('REPLACE')) return false; // Skip unconfigured channels
  const input = {
    text, channelId, schedulingType: 'automatic', mode: 'shareNow',
    assets: imageUrl ? [{ image: { url: imageUrl } }] : [],
    ...(metadata && { metadata })
  };
  try {
    const data = await bufferRequest(token, CREATE_POST_MUTATION, { input });
    if (data.createPost?.message) {
      console.warn(`${label}: ${data.createPost.message}`);
      return false;
    }
    console.log(`${label}: queued successfully.`);
    return true;
  } catch (error) {
    console.warn(`${label}: ${error.message}`);
    return false;
  }
}

async function main() {
  const token = process.env.BUFFER_ACCESS_TOKEN;
  if (!token) return console.error('BUFFER_ACCESS_TOKEN not set.');

  const slug = process.env.POST_SLUG || '';
  const title = process.env.POST_TITLE || '';
  const excerpt = process.env.POST_EXCERPT || '';
  const image = process.env.POST_IMAGE || '';

  if (!slug || !title) return console.log('No post generated.');

  const postUrl = `${SITE_URL}/blog/${slug}`;
  let imageUrl = image ? `${SITE_URL}${image}` : '';

  console.log(`Posting to socials: ${postUrl}`);

  await postToChannel(token, {
    channelId: CHANNELS.facebook,
    label: 'Facebook',
    text: `${title}\n\n${excerpt}\n\nRead more: ${postUrl}`,
    imageUrl,
    metadata: { facebook: { type: 'post' } },
  });
}

main().catch(e => console.error(e));
