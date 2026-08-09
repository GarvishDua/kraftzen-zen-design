import { describe, expect, it } from "vitest";
import { postState } from "@/lib/supabase";

/**
 * `scheduled` is derived from a future `published_at`, never stored. These
 * tests pin that mapping because it is the one place the whole scheduling
 * feature lives: get it wrong in the "future" direction and a post leaks early
 * in the admin list, get it wrong in the "past" direction and a live post looks
 * pending forever.
 *
 * The matching database guarantee (that anon genuinely cannot read a future
 * post) is enforced by the RLS policy, not by this code.
 */
describe("postState", () => {
  const future = new Date(Date.now() + 86_400_000).toISOString();
  const past = new Date(Date.now() - 86_400_000).toISOString();

  it("calls a draft a draft, whatever the date says", () => {
    expect(postState({ status: "draft", published_at: null })).toBe("draft");
    expect(postState({ status: "draft", published_at: past })).toBe("draft");
    expect(postState({ status: "draft", published_at: future })).toBe("draft");
  });

  it("calls a published post with a past date published", () => {
    expect(postState({ status: "published", published_at: past })).toBe("published");
  });

  it("calls a published post with a future date scheduled", () => {
    expect(postState({ status: "published", published_at: future })).toBe("scheduled");
  });

  it("treats published with no date as a draft rather than as live", () => {
    // The RLS policy requires `published_at IS NOT NULL`, so such a row is
    // invisible to readers. Reporting it as published would be a lie.
    expect(postState({ status: "published", published_at: null })).toBe("draft");
  });

  it("does not flip at the boundary", () => {
    const justPast = new Date(Date.now() - 1000).toISOString();
    expect(postState({ status: "published", published_at: justPast })).toBe("published");
  });
});
