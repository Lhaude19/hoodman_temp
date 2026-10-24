import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import pageCss from "../communique.css?url";
import bodyHtml from "../content/communique.html?raw";

const TITLE = "BAAH PLATINUM™ — Brands Ambassador Africa Impact Honors";
const DESC =
  "BAAH PLATINUM™ recognizes Africa's Top 100 brand ambassadors turning brand influence into economic growth and social impact.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: "https://raw.githubusercontent.com/Lhaude19/image_bucket/main/Asset%2012-100.jpg" },
      { name: "twitter:image", content: "https://raw.githubusercontent.com/Lhaude19/image_bucket/main/Asset%2012-100.jpg" },
    ],
    links: [
      { rel: "stylesheet", href: pageCss },
      { rel: "icon", type: "image/png", href: "https://raw.githubusercontent.com/Lhaude19/image_bucket/main/Group%201.png" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const on = (t: EventTarget, e: string, f: EventListener, o?: AddEventListenerOptions) => {
      t.addEventListener(e, f, o);
      cleanups.push(() => t.removeEventListener(e, f));
    };

    // Reading progress
    const bar = document.getElementById("progressBar");
    const update = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(el.scrollTop / max, 1) : 0})`;
    };
    on(window, "scroll", update, { passive: true });
    on(window, "resize", update);
    update();

    // Scroll spy + reveal
    const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.toc a[href^="#"]'));
    const sections = Array.from(document.querySelectorAll<HTMLElement>(".doc section[id]"));
    const spy = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (vis.length) {
          const id = vis[0]!.target.id;
          links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${id}`));
        }
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    const reveal = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("hb-in")),
      { threshold: 0.05 },
    );
    sections.forEach((s) => (spy.observe(s), reveal.observe(s)));
    cleanups.push(() => (spy.disconnect(), reveal.disconnect()));

    // Copy link / print
    const copyBtn = document.getElementById("copyLink");
    if (copyBtn) {
      on(copyBtn, "click", async () => {
        try {
          await navigator.clipboard.writeText(location.href);
          copyBtn.textContent = "Copied ✓";
        } catch {
          copyBtn.textContent = "Copy failed";
        }
        setTimeout(() => (copyBtn.textContent = "Copy link"), 1600);
      });
    }
    document.querySelectorAll("#printBtn, [data-print]").forEach((b) => on(b, "click", () => window.print()));

    // Lightbox for figures
    document.querySelectorAll<HTMLAnchorElement>(".doc-figure a").forEach((a) =>
      on(a, "click", (ev) => {
        ev.preventDefault();
        const img = a.querySelector("img");
        if (!img) return;
        const box = document.createElement("div");
        box.className = "hb-lightbox";
        box.innerHTML = `<img src="${img.src}" alt="${img.alt}">`;
        const close = () => (box.remove(), window.removeEventListener("keydown", esc));
        const esc = (k: KeyboardEvent) => k.key === "Escape" && close();
        box.onclick = close;
        window.addEventListener("keydown", esc);
        document.body.appendChild(box);
      }),
    );

    // Honorees: collapsible regions + search + region filter
    const regions = Array.from(document.querySelectorAll<HTMLElement>("#honorees .region"));
    regions.forEach((r) => {
      const t = r.querySelector(".region-title");
      if (t) on(t, "click", () => r.classList.toggle("hb-collapsed"));
    });
    const firstRegion = regions[0];
    if (firstRegion && !document.querySelector(".hb-search")) {
      const bar2 = document.createElement("div");
      bar2.className = "hb-search";
      const input = document.createElement("input");
      input.type = "search";
      input.placeholder = "Search 100 honorees…";
      input.setAttribute("aria-label", "Search honorees");
      bar2.appendChild(input);
      const names = ["All", ...regions.map((r) => r.querySelector(".region-title")?.firstChild?.textContent?.trim().replace(" Africa", "") ?? "")];
      let active = "All";
      const chips = names.map((n) => {
        const c = document.createElement("button");
        c.type = "button";
        c.className = "hb-chip";
        c.textContent = n;
        c.setAttribute("aria-pressed", String(n === "All"));
        c.onclick = () => {
          active = n;
          chips.forEach((x) => x.setAttribute("aria-pressed", String(x === c)));
          apply();
        };
        bar2.appendChild(c);
        return c;
      });
      const empty = document.createElement("p");
      empty.className = "hb-empty";
      empty.textContent = "No honorees match your search.";
      empty.hidden = true;
      firstRegion.before(bar2);
      regions[regions.length - 1]!.after(empty);
      const apply = () => {
        const q = input.value.trim().toLowerCase();
        let total = 0;
        regions.forEach((r, i) => {
          const regionOk = active === "All" || names[i + 1] === active;
          let n = 0;
          r.querySelectorAll("li").forEach((li) => {
            const hit = !q || li.textContent!.toLowerCase().includes(q);
            li.hidden = !hit;
            li.classList.toggle("hb-hit", !!q && hit);
            if (hit) n++;
          });
          r.hidden = !regionOk || n === 0;
          if (q) r.classList.remove("hb-collapsed");
          if (!r.hidden) total += n;
        });
        empty.hidden = total > 0;
      };
      input.oninput = apply;
      cleanups.push(() => (bar2.remove(), empty.remove()));
    }

    return () => cleanups.forEach((c) => c());
  }, []);

  return <div id="top" dangerouslySetInnerHTML={{ __html: bodyHtml }} />;
}
