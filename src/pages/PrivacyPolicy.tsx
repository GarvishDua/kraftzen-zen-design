import LegalPage, { type LegalSection } from "@/components/site/LegalPage";
import { SITE } from "@/lib/site";

const sections: LegalSection[] = [
  {
    title: "What we collect",
    body: [
      `When you use the contact form on this site, your mail client sends us your name, email address, and anything else you typed into the form. That message arrives in our inbox at ${SITE.email} and nowhere else.`,
      "This site does not run behavioural advertising trackers and does not build a profile of you across other websites.",
    ],
  },
  {
    title: "Cookies",
    body: [
      "This site does not set marketing or advertising cookies. Any storage it uses is limited to keeping the site working in your browser during a visit.",
      "If we add analytics later, we will name the provider here before it goes live.",
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
      description="How Kraftzen handles the information you send through this website. Short version: we use it to reply to you, we do not sell it, and you can ask us to delete it."
      updated="7 August 2026"
      intro="Short version: we use what you send us to reply to you and do the work. We do not sell it, we do not track you across the internet, and you can ask us to delete it at any time."
      sections={sections}
    />
  );
}
