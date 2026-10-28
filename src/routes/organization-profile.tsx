import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import pageCss from "../communique.css?url";
import profileHtml from "../content/organization-profile.html?raw";

export const Route = createFileRoute("/organization-profile")({
  head: () => ({
    meta: [
      { title: "Organisation Profile | B-HeCK Africa Alliance and ASAP GRAY-PSP" },
      { name: "description", content: "Read the institutional profile covering B-HeCK Africa Alliance’s heritage, leadership recognition, social-impact engagement and Pan-African enterprise development." },
      { name: "robots", content: typeof process !== "undefined" && process.env.VERCEL_ENV === "production" ? "index, follow" : "noindex, nofollow" },
      { property: "og:title", content: "Organisation Profile | B-HeCK Africa Alliance and ASAP GRAY-PSP" },
      { property: "og:description", content: "Institutional heritage, social impact, leadership recognition and Pan-African enterprise development." },
      { property: "og:type", content: "article" },
      { property: "og:url", content: "https://hoodmanlive.com/organization-profile" },
      { property: "og:image", content: "https://raw.githubusercontent.com/Lhaude19/image_bucket/main/Asset%2014-100.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://hoodmanlive.com/organization-profile" },
      { rel: "stylesheet", href: pageCss },
      { rel: "icon", type: "image/png", href: "https://raw.githubusercontent.com/Lhaude19/image_bucket/main/Group%201.png" },
    ],
  }),
  component: OrganizationProfilePage,
});

function OrganizationProfilePage() {
  useEffect(() => {
    const headings = Array.from(document.querySelectorAll<HTMLElement>(".organization-profile h3[id]"));
    headings.forEach((heading) => {
      heading.style.scrollMarginTop = "1.5rem";
    });

    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>(".profile-toc a"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) {
          const id = (visible[0]!.target as HTMLElement).id;
          links.forEach((link) => link.classList.toggle("active", link.hash === `#${id}`));
        }
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="profile-page">
      <Link to="/" className="profile-back">← Back to communiqué</Link>
      <div className="profile-layout">
        <aside className="toc profile-toc">
          <p className="toc-title">Profile contents</p>
          <nav aria-label="Organisation profile contents">
            <a href="#executive-overview">Executive Overview</a>
            <a href="#institutional-heritage">Institutional Heritage</a>
            <a href="#heleh-honours">HELEH Africa PCP Honours</a>
            <a href="#cov-week">COV-WEEK 2020</a>
            <a href="#royal-citizen-honours">Royal Citizen Honours</a>
            <a href="#institutional-evolution">Institutional Evolution</a>
            <a href="#baah-platinum">BAAH Platinum™ Opportunity</a>
            <a href="#partnership-proposition">Partnership Proposition</a>
            <a href="#executive-conclusion">Executive Conclusion</a>
          </nav>
        </aside>
        <article className="profile-doc organization-profile" dangerouslySetInnerHTML={{ __html: profileHtml }} />
      </div>
    </main>
  );
}
