import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { SITE_TAG } from "@/sanity/lib/live";

/**
 * Sanity GROQ webhook on publish/unpublish/delete. The site is ~37 pages and most pages read several documents
 * (navigation, site settings, collections), so any change revalidates the whole site rather than guessing which
 * pages a document feeds. `{ expire: 0 }`: never serve the stale version again (Next docs, revalidateTag).
 */
export async function POST(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) return NextResponse.json({ error: "SANITY_REVALIDATE_SECRET is not set" }, { status: 500 });

  const { isValidSignature, body } = await parseBody<{ _type?: string; _id?: string }>(request, secret, true);
  if (!isValidSignature) return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  if (!body?._type) return NextResponse.json({ error: "Missing _type" }, { status: 400 });

  revalidateTag(SITE_TAG, { expire: 0 });
  return NextResponse.json({ revalidated: SITE_TAG, document: body._id, type: body._type });
}
