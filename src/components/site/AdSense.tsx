import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { adsAllowed } from "@/lib/adsense";

/**
 * Keeps AdSense off `/admin`, and nowhere else.
 *
 * The script tag is global in `index.html`, which is what Google's verification
 * expects. This component exists only to undo that on the admin route, because
 * `/admin` is a signed-in tool and an ad shown to the site owner is how an
 * accidental self click happens. Self clicks are an automated permanent ban, so
 * this is the one place worth enforcing in code rather than trusting a
 * dashboard exclusion to stay switched on.
 *
 * On a single-page app the tag from `index.html` is already in the document by
 * the time the router mounts, so this removes it and anything it has injected,
 * then lets a normal page load restore it when you navigate back out.
 */
export default function AdSense() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (adsAllowed(pathname)) return;

    const strip = () => {
      document
        .querySelectorAll(
          'script[src*="adsbygoogle"], ins.adsbygoogle, iframe[src*="googlesyndication"], iframe[id^="aswift"]'
        )
        .forEach((el) => el.remove());
    };

    strip();
    // Auto ads can inject after load, so keep clearing for as long as the admin
    // route is mounted rather than only once on entry.
    const observer = new MutationObserver(strip);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
