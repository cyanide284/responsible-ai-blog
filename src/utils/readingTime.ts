export function readingTime(body: string): string {
	const words = body.trim().split(/\s+/).length;
	const minutes = Math.ceil(words / 200);
	return `${minutes} min read`;
}
