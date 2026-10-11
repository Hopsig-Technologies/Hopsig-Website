/**
 * All static copy, server-side only: nothing in web/content may reach a client bundle (so a placeholder such as
 * [YOUR RATE] is never in a shared JS chunk). Client components receive the strings they need as props.
 */
import "server-only";

export * from "./types";
export * from "./routes";
export { site } from "./site";
export { navigation } from "./navigation";
export { services } from "./services";
export { industries } from "./industries";
export { templates } from "./templates";
export { engagementPanel } from "./engagementPanel";
export { animations, scenesFor } from "./animations";
export { organization, seo, seoTemplates } from "./seo";
export { emails } from "./emails";

export { homePage } from "./pages/homePage";
export { servicesIndexPage } from "./pages/servicesIndexPage";
export { industriesIndexPage } from "./pages/industriesIndexPage";
export { workIndexPage } from "./pages/workIndexPage";
export { notesIndexPage } from "./pages/notesIndexPage";
export { approachPage } from "./pages/approachPage";
export { bookPage } from "./pages/bookPage";
export { briefPage } from "./pages/briefPage";
export { comparePage } from "./pages/comparePage";
export { workingWithUsPage } from "./pages/workingWithUsPage";
export { aiTransformationPage } from "./pages/aiTransformationPage";
export { agenticFlowPage } from "./pages/agenticFlowPage";
export { agenciesPage } from "./pages/agenciesPage";
export { joinPage } from "./pages/joinPage";
export { privacyPage } from "./pages/privacyPage";
export { termsPage } from "./pages/termsPage";
export { notFoundPage } from "./pages/notFoundPage";
