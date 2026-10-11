// One chunk per scene; each scene file registers itself on the engine (window.HA) when imported. Plain JS so
// TypeScript does not type-check the handover scene files (they are scripts, not modules); types in loaders.d.ts.
export const SCENES = {
  "agentic-flow-sim": () => import("./scenes/agentic-flow-sim.js"),
  "agentic-never-wall": () => import("./scenes/agentic-never-wall.js"),
  "agentic-strip": () => import("./scenes/agentic-strip.js"),
  "ai-transformation": () => import("./scenes/ai-transformation.js"),
  "home-agentic": () => import("./scenes/home-agentic.js"),
  "ind-fintech": () => import("./scenes/ind-fintech.js"),
  "ind-healthcare": () => import("./scenes/ind-healthcare.js"),
  "ind-iot": () => import("./scenes/ind-iot.js"),
  "ind-logistics": () => import("./scenes/ind-logistics.js"),
  "ind-retail": () => import("./scenes/ind-retail.js"),
  "ind-saas": () => import("./scenes/ind-saas.js"),
  "svc-ai-ml": () => import("./scenes/svc-ai-ml.js"),
  "svc-cloud-devops": () => import("./scenes/svc-cloud-devops.js"),
  "svc-custom-software": () => import("./scenes/svc-custom-software.js"),
  "svc-data-engineering": () => import("./scenes/svc-data-engineering.js"),
  "svc-legacy": () => import("./scenes/svc-legacy.js"),
  "svc-mobile": () => import("./scenes/svc-mobile.js"),
  "svc-qa": () => import("./scenes/svc-qa.js"),
  "svc-team-augmentation": () => import("./scenes/svc-team-augmentation.js"),
};
