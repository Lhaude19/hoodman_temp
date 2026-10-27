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
    document.querySelectorAll<HTMLElement>(".organization-profile h3").forEach((heading) => {
      heading.style.scrollMarginTop = "1.5rem";
    });
  }, []);

  return (
    <main className="profile-page">
      <Link to="/" className="profile-back">← Back to communiqué</Link>
      <article className="profile-doc organization-profile" dangerouslySetInnerHTML={{ __html: profileHtml }} />
    </main>
  );
}
