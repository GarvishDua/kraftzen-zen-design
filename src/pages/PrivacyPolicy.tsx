import LegalPage, { type LegalSection } from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";

const sections: LegalSection[] = [
  {
    title: "What we collect",
    body: [
      `When you use the contact form on this site, your mail client sends us your name, email address, and anything else you typed into the form. That message arrives in our inbox at ${SITE.email} and nowhere else.`,
      "On the blog we count how many browsers open each article. To do that we store one random identifier in your browser and record which posts it opened on which day. That identifier is not linked to your name, your email, or anything you do on other websites, and we cannot use it to work out who you are. Clearing your site data removes it.",
    ],
  },
  {
    title: "Advertising",
    body: [
      "The blog carries ads served by Google AdSense. Google and its partners set cookies and use similar technologies to choose which ads you see, to measure them, and in some cases to build a profile of your interests across the websites you visit. That processing is Google's, not ours, and we do not receive it.",
      "You can review and change what Google uses at google.com/settings/ads, and read how Google handles data across its advertising products at policies.google.com/technologies/partner-sites.",
      "If you are in the European Economic Area, the UK or Switzerland, you will be asked to make a choice about this before any advertising cookie is set, and you can change that choice at any time.",
      "We do not sell advertising directly, and no advertiser is given your contact details or anything you send us through the contact form.",
    ],
  },
  {
    title: "Cookies and storage",
    body: [
      "Two kinds of storage are used here. The first is the blog view counter described above, which stays in your browser rather than on our servers. The second is advertising cookies set by Google and its partners, described in the previous section.",
      "We do not set marketing cookies of our own, and we do not run a separate analytics product. If we add one later, we will name the provider here before it goes live.",
    ],
  },
  {
    title: "How we use it",
    body: [
      "We use what you send us to reply to you, quote for work, and deliver a project if you hire us. That is the whole list.",
      "We do not sell your information, rent it, or add you to a mailing list you did not ask for.",
    ],
  },
  {
    title: "Who else sees it",
    body: [
      "Our email is hosted by a third party provider, so your message passes through their systems the same way any email does.",
      "The blog and its view counts are stored with Supabase, who host the database. Ads are served by Google, as described above.",
      "If a project needs us to work inside your own tools, we use the access you grant us and nothing wider. We do not copy client data out of client systems.",
      "We share information with anyone else only where the law requires it.",
    ],
  },
  {
    title: "How long we keep it",
    body: [
      "Enquiry emails stay in our inbox as business correspondence. If you want your enquiry and our replies deleted, write to us and we will remove them.",
      "Project files and code are kept for the length of the engagement and a reasonable period afterwards in case you need them again.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "You can ask us what we hold about you, ask for a copy, ask us to correct it, or ask us to delete it.",
      `Send any of those requests to ${SITE.email}. We will respond within thirty days.`,
    ],
  },
  {
    title: "Links to other sites",
    body: [
      "This site links out to products we run, such as Bro AI and AniVerseX, and occasionally to third party tools. Once you leave kraftzen.in, the privacy policy of that site applies instead of this one.",
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      "If this policy changes we update the date at the top of the page. Material changes will be described here rather than quietly edited in.",
    ],
  },
  {
    title: "Getting in touch",
    body: [
      `Questions about privacy go to ${SITE.email}. We are based in ${SITE.city}, ${SITE.country}.`,
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy"
      description="How Kraftzen handles the information you send through this website, what the blog stores, and the advertising cookies Google sets. Short version: we use what you send us to reply to you, we do not sell it, and you can ask us to delete it."
      updated="8 August 2026"
      intro="Short version: we use what you send us to reply to you and do the work, and we never sell it. The blog carries Google ads, so Google sets advertising cookies and you can control those. You can ask us to delete anything we hold at any time."
      sections={sections}
    />
  );
}
