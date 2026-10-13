import { llmsTxt } from "@/lib/llms";

/** llmstxt.org: the site in brief for AI assistants (lib/llms.ts). */
export async function GET() {
  return new Response(await llmsTxt(), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
