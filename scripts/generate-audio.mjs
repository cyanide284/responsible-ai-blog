#!/usr/bin/env node
// Generate an ElevenLabs MP3 for a blog post.
// Usage: node scripts/generate-audio.mjs <slug>
// Requires: ELEVENLABS_API_KEY env var
//
// Voice: Daniel (British male, onwK4e9ZLuTAKqWW03F9) — clear and natural for technical content.
// Output: public/audio/<slug>.mp3

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const VOICE_ID = 'onwK4e9ZLuTAKqWW03F9'; // Daniel
const MODEL_ID = 'eleven_turbo_v2_5';
const CHUNK_MAX = 4500; // ElevenLabs safe limit per request

const slug = process.argv[2];
if (!slug) {
	console.error('Usage: node scripts/generate-audio.mjs <slug>');
	process.exit(1);
}

const apiKey = process.env.ELEVENLABS_API_KEY;
if (!apiKey) {
	console.error('ELEVENLABS_API_KEY is not set.');
	process.exit(1);
}

// --- Read and clean the post ---

const postPath = join('src/content/blog', `${slug}.md`);
let raw;
try {
	raw = readFileSync(postPath, 'utf-8');
} catch {
	console.error(`Post not found: ${postPath}`);
	process.exit(1);
}

function cleanMarkdown(md) {
	return md
		.replace(/^---[\s\S]*?---\n/, '')           // frontmatter
		.replace(/```[\s\S]*?```/g, '')              // fenced code blocks
		.replace(/`[^`\n]+`/g, '')                   // inline code
		.replace(/!\[.*?\]\(.*?\)/g, '')             // images
		.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')   // links → label text only
		.replace(/^#{1,6}\s+/gm, '')                 // headings
		.replace(/\*\*([^*]+)\*\*/g, '$1')           // bold
		.replace(/\*([^*\n]+)\*/g, '$1')             // italic
		.replace(/^[-*+]\s+/gm, '')                  // unordered list markers
		.replace(/^\d+\.\s+/gm, '')                  // ordered list markers
		.replace(/^>\s*/gm, '')                      // blockquotes
		.replace(/^-{3,}$/gm, '')                    // horizontal rules
		.replace(/\n{3,}/g, '\n\n')                  // collapse excess blank lines
		.trim();
}

const text = cleanMarkdown(raw);
console.log(`Post: ${slug}`);
console.log(`Clean text: ${text.length} characters`);

// --- Chunk at sentence boundaries ---

function chunkText(text, maxLen) {
	const chunks = [];
	let remaining = text;
	while (remaining.length > maxLen) {
		// Prefer splitting after ". " within the limit
		let cut = remaining.lastIndexOf('. ', maxLen);
		if (cut === -1) cut = remaining.lastIndexOf('\n', maxLen);
		if (cut === -1) cut = maxLen;
		else cut += 1; // include the period
		chunks.push(remaining.slice(0, cut).trim());
		remaining = remaining.slice(cut).trim();
	}
	if (remaining.length > 0) chunks.push(remaining);
	return chunks;
}

const chunks = chunkText(text, CHUNK_MAX);
console.log(`Chunks: ${chunks.length}`);

// --- Call ElevenLabs ---

async function generateChunk(text, index) {
	const res = await fetch(
		`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=mp3_44100_32`,
		{
			method: 'POST',
			headers: {
				'xi-api-key': apiKey,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				text,
				model_id: MODEL_ID,
				voice_settings: {
					stability: 0.5,
					similarity_boost: 0.75,
				},
			}),
		}
	);

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`ElevenLabs error on chunk ${index + 1}: ${res.status} ${body}`);
	}

	return Buffer.from(await res.arrayBuffer());
}

const parts = [];
for (let i = 0; i < chunks.length; i++) {
	process.stdout.write(`  Chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)... `);
	const buf = await generateChunk(chunks[i], i);
	parts.push(buf);
	console.log(`${(buf.length / 1024).toFixed(0)} KB`);
}

// --- Write output ---

mkdirSync('public/audio', { recursive: true });
const output = Buffer.concat(parts);
const outPath = join('public/audio', `${slug}.mp3`);
writeFileSync(outPath, output);
console.log(`\n✓ ${outPath} — ${(output.length / 1024 / 1024).toFixed(1)} MB`);
