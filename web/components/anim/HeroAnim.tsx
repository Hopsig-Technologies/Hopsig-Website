import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { CSSProperties } from "react";
import { animations, type AnimScene } from "@/content";
import { FigHint } from "../blocks";
import { AnimMount } from "./AnimMount";

const sceneById = (id: string): AnimScene => {
  for (const p of animations) for (const s of p.scenes) if (s.id === id) return s;
  throw new Error(`Unknown animation scene "${id}" (web/content/animations.ts)`);
};

/**
 * An animated figure (CLAUDE.md "Animations"): the frame reserves the artboard's aspect ratio and holds the
 * server-rendered static frame (`public/anim/<id>.static.svg`, from `pnpm anim:static`), which is what shows
 * before the scene loads, with JS off and under reduced motion; `AnimMount` swaps the live scene in on the
 * client. The caption comes from web/content/animations.ts; an empty caption renders no figcaption.
 */
export function HeroAnim({ id, style }: { id: string; style?: CSSProperties }) {
  const scene = sceneById(id);
  const svg = readFileSync(join(process.cwd(), "public", "anim", `${id}.static.svg`), "utf8");
  return (
    <figure className="anim" id={`fig-${id}`} data-scene={id} style={style}>
      <div className="frame" style={{ aspectRatio: `${scene.w} / ${scene.h}` }} dangerouslySetInnerHTML={{ __html: svg }} />
      {scene.caption ? (
        <figcaption id={`fig-${id}-cap`}>
          <FigHint text={scene.caption} hint={scene.captionHint} />
        </figcaption>
      ) : null}
      <AnimMount id={id} mode={scene.mode} />
    </figure>
  );
}
