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
