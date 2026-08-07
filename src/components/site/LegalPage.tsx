import Layout from "@/components/site/Layout";
import Seo, { breadcrumbSchema } from "@/components/site/Seo";
import { Reveal } from "@/components/motion/Reveal";

export interface LegalSection {
  title: string;
  body: string[];
}

interface LegalPageProps {
  title: string;
  path: string;
  description: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}

export default function LegalPage({
  title,
  path,
  description,
  updated,
  intro,
  sections,
}: LegalPageProps) {
  return (
    <Layout>
      <Seo
        title={title}
        description={description}
        path={path}
        schema={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: title, path },
          ]),
        ]}
      />

      <article className="pb-section pt-36 md:pt-44">
        <div className="shell">
          <header className="mb-14 border-b border-line pb-10">
            <Reveal>
              <p className="t-label t-mono mb-6 text-faint">Updated {updated}</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="t-h1 mb-7 max-w-[16ch]">{title}</h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="t-lead max-w-measure">{intro}</p>
            </Reveal>
          </header>

          <div className="grid gap-10 md:grid-cols-12">
            {/* Contents rail */}
            <nav aria-label="On this page" className="md:col-span-4">
              <div className="md:sticky md:top-28">
                <p className="t-label mb-5 text-brand">Contents</p>
                <ol className="space-y-2.5">
                  {sections.map((s, i) => (
                    <li key={s.title}>
                      <a
                        href={`#${slug(s.title)}`}
                        className="t-small text-muted-foreground transition-colors duration-short ease-out hover:text-ink"
                      >
                        <span className="t-mono mr-2 text-faint">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        {s.title}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </nav>

            <div className="md:col-span-8">
              {sections.map((section, i) => (
                <Reveal key={section.title} delay={Math.min(i * 0.03, 0.15)}>
                  <section
                    id={slug(section.title)}
                    className="scroll-mt-28 border-b border-line py-9 first:pt-0"
                  >
                    <h2 className="t-h3 mb-4">{section.title}</h2>
                    {section.body.map((para, j) => (
                      <p key={j} className="mb-4 max-w-measure text-muted-foreground last:mb-0">
                        {para}
                      </p>
                    ))}
                  </section>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </article>
    </Layout>
  );
}

function slug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
