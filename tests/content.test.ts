import { describe, expect, it } from "vitest";
import { siteConfig } from "../src/content/site-config";
import { services } from "../src/content/services";
import { faqs } from "../src/content/faqs";
import { scenarios } from "../src/content/scenarios";
import { faqPageJsonLd, organizationJsonLd } from "../src/lib/jsonld";

describe("site-config", () => {
  it("uses Fortitier spelling and logistics positioning", () => {
    expect(siteConfig.tradingName).toBe("Fortitier Logistics");
    expect(siteConfig.shortName).toBe("Fortitier");
    expect(siteConfig.ctaLabel).toBe("Request haulage");
    expect(siteConfig.positioningLine.toLowerCase()).toContain("bulk fuel");
    expect(siteConfig.email).toBe("info@fortitier.com");
    expect(siteConfig.phone).toContain("+233");
  });

  it("does not carry Gileara software residue", () => {
    const blob = JSON.stringify(siteConfig).toLowerCase();
    expect(blob).not.toContain("gileara");
    expect(blob).not.toContain("msme");
    expect(blob).not.toContain("digital transformation");
  });
});

describe("services", () => {
  it("has six services with roadmap only on fleet management", () => {
    expect(services).toHaveLength(6);
    const roadmap = services.filter((s) => s.status === "roadmap");
    expect(roadmap).toHaveLength(1);
    expect(roadmap[0]?.id).toBe("fleet-management-owners");
    expect(services.filter((s) => s.status === "available")).toHaveLength(5);
  });
});

describe("faqs + json-ld", () => {
  it("keeps FAQPage schema aligned with visible FAQs", () => {
    expect(faqs.length).toBeGreaterThanOrEqual(8);
    const ld = faqPageJsonLd();
    expect(ld.mainEntity).toHaveLength(faqs.length);
    expect(ld.mainEntity[0]?.name).toBe(faqs[0]?.question);
  });
});

describe("scenarios honesty", () => {
  it("labels all v1 entries as scenarios", () => {
    expect(scenarios.length).toBeGreaterThanOrEqual(3);
    for (const s of scenarios) {
      expect(s.status).toBe("scenario");
    }
  });
});

describe("organization schema", () => {
  it("serves Ghana bulk fuel haulage business types", () => {
    const org = organizationJsonLd();
    expect(org.areaServed).toMatchObject({ name: "Ghana" });
    expect(org.name).toContain("Fortitier");
  });
});
