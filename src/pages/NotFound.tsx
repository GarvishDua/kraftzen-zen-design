import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/site/Layout";
import Seo from "@/components/site/Seo";
import { PillLink, ArrowLink } from "@/components/site/Cta";
import { Reveal } from "@/components/motion/Reveal";
import { NAV } from "@/lib/site";

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.warn("404: no route for", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <Seo
        title="Page not found"
        description="That page does not exist on kraftzen.com."
        path={location.pathname}
        noIndex
      />

      <section className="grain relative flex min-h-[70vh] items-center py-section pt-40">
        <div className="shell relative z-10">
          <Reveal>
            <p className="t-label t-mono mb-8 text-brand">Error 404</p>
          </Reveal>
          <Reveal delay={0.06}>
            <h1 className="t-h1 mb-8 max-w-[14ch]">
              That page is not <span className="t-accent">here</span>.
            </h1>
          </Reveal>
          <Reveal delay={0.12}>
            <p className="t-lead mb-12 max-w-lead">
              The link is either old or slightly wrong. Everything on the site is one of
              these five places.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <div className="mb-12 flex flex-wrap items-center gap-4">
              <PillLink to="/">Back to home</PillLink>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <ul className="flex flex-wrap gap-x-8 gap-y-4 border-t border-line pt-8">
              {NAV.map((item) => (
                <li key={item.to}>
                  <ArrowLink to={item.to}>{item.label}</ArrowLink>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>
    </Layout>
  );
}
