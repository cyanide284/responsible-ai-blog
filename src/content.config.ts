import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Defaults so existing posts need no change. Set explicitly on posts
			// by anyone else.
			author: z.string().optional().default('Abhinav Mohanty'),
			// Optional profile link for the byline. Guest posts set it so the
			// author is reachable without adding their socials to the site
			// header, which belongs to the site owner.
			//
			// The scheme is constrained deliberately. z.string().url() checks
			// syntax only, so it accepts javascript: and data:, and this value
			// is rendered straight into an href — a post file would be enough
			// to land script in the site's origin. Rejecting it here fails the
			// build with a named error instead.
			authorUrl: z.url({ protocol: /^https?$/ }).optional(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			tags: z.array(z.string()).optional().default([]),
			series: z.string().optional(),
			seriesPart: z.number().optional(),
			readingTime: z.string().optional(),
			audio: z.boolean().optional(),
		}),
});

export const collections = { blog };
