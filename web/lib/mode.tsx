import { draftMode } from "next/headers";
import { Suspense, type ComponentType } from "react";
import { getFetchMode, PUBLISHED, type FetchMode } from "@/sanity/lib/live";

/**
 * Wraps a page's content component so the route is statically prerendered from published content, and only
 * in draft mode (Presentation tool) renders drafts with click-to-edit, behind a Suspense boundary because
 * reading the draft cookies is dynamic. `draftMode()` itself outside Suspense keeps the route static (Phase 4).
 *
 *   const Content = async ({ mode, params }: { mode: FetchMode; params: Promise<{ slug: string }> }) => …
 *   export default withMode(Content)
 */
export function withMode<P extends object>(Content: ComponentType<P & { mode: FetchMode }>) {
  async function Draft(props: P) {
    const mode = await getFetchMode();
    return <Content {...props} mode={mode} />;
  }
  return async function Page(props: P) {
    if ((await draftMode()).isEnabled) {
      return (
        <Suspense fallback={null}>
          <Draft {...props} />
        </Suspense>
      );
    }
    return <Content {...props} mode={PUBLISHED} />;
  };
}
