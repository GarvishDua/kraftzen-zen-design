import { describe, expect, it } from "vitest";
import { adsAllowed } from "@/lib/adsense";

/**
 * Policy tests, not style tests.
 *
 * The tag is global because Google verifies a site by finding it. The one route
 * that must never carry it is `/admin`: ads shown to the signed-in owner are how
 * self clicks happen, and self clicks are an automated permanent ban.
 */
describe("adsAllowed", () => {
  it("never allows admin", () => {
    expect(adsAllowed("/admin")).toBe(false);
    expect(adsAllowed("/admin/")).toBe(false);
    expect(adsAllowed("/admin/anything")).toBe(false);
  });

  it("allows every public route, including the landing page", () => {
    for (const p of [
      "/",
      "/services",
      "/products",
      "/about",
      "/contact",
      "/blog",
      "/blog/some-post",
      "/privacy",
      "/terms",
      "/404",
    ]) {
      expect(adsAllowed(p)).toBe(true);
    }
  });

  it("covers routes added later by default", () => {
    expect(adsAllowed("/case-studies")).toBe(true);
    expect(adsAllowed("/anything-new")).toBe(true);
  });
});
