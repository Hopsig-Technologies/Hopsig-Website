import { llmsFullTxt } from "@/lib/llms";

/** llmstxt.org: every service, industry, case note and note as text, for AI assistants (lib/llms.ts). */
export async function GET() {
  return new Response(await llmsFullTxt(), { headers: { "Content-Type": "text/markdown; charset=utf-8" } });
}
