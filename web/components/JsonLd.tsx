import { homePage, industries, organization, services, site } from "@/content";
import { SITE_URL } from "@/lib/seo";

/** One schema.org block as JSON-LD (server-rendered; `<` escaped so text can never close the script). */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

export const orgRef = { "@type": "Organization", name: organization.name, url: SITE_URL };

export const organizationLd = () => ({
  "@type": "Organization",
  name: organization.name,
  legalName: organization.legalName,
  url: SITE_URL,
  email: organization.email,
  address: { "@type": "PostalAddress", ...organization.address },
  location: { "@type": "Place", name: organization.location.name, address: { "@type": "PostalAddress", addressLocality: organization.location.addressLocality, addressCountry: organization.location.addressCountry } },
  areaServed: organization.areaServed,
  description: site.footer.tagline,
  slogan: homePage.hero.title.split("\n").join(" "),
  logo: `${SITE_URL}/apple-icon`,
  // What search engines and assistants should connect the company with: the services and industries, by keyword.
  knowsAbout: [...services.map((s) => s.keyword), ...industries.map((d) => d.keyword)],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Software development services",
    itemListElement: services.map((s) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: s.keyword, url: `${SITE_URL}/services/${s.id}` },
    })),
  },
});

/** Home › Section › Page, as BreadcrumbList. `trail` is [name, path] pairs after Home. */
export const breadcrumbsLd = (trail: [string, string][]) => ({
  "@type": "BreadcrumbList",
  itemListElement: [["Home", "/"] as [string, string], ...trail].map(([name, path], i) => ({
    "@type": "ListItem",
    position: i + 1,
    name,
    item: `${SITE_URL}${path === "/" ? "" : path}`,
  })),
});
