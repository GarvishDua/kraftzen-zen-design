/**
 * Where AdSense is allowed.
 *
 * The tag itself is global, in `index.html`, because Google verifies a site by
 * finding that code and their instructions say to put it on every page. A tag
 * being present is not the same as an ad rendering: where ads appear is an Auto
 * ads setting in the dashboard. An earlier version of this file restricted the
 * tag to `/blog` on inventory-value grounds, which confused those two things
 * and risked failing verification.
 *
 * `/admin` is the single exception, and it is not a policy nicety. It is a tool
 * the site owner is signed into. Ads shown to the owner are how accidental self
 * clicks happen, and self clicks are an automated permanent ban.
 *
 * Block-list of exactly one route, so every page you add later is covered by
 * default. That is the right direction here: the risk is a missing tag failing
 * review, not an extra tag on a marketing page.
 */
export function adsAllowed(pathname: string): boolean {
  return !pathname.startsWith("/admin");
}
