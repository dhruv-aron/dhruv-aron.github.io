// Anchor links work without JavaScript. This adds the active-section indicator.
const header = document.querySelector(".site-header");
const navigationLinks = [...document.querySelectorAll('nav a[href^="#"]')];
const sections = navigationLinks.map((link) => document.querySelector(link.hash));
let headerHeight = header.getBoundingClientRect().height;
let scheduled = false;

function updateActiveSection() {
  const readingLine = headerHeight + 48;
  let currentSection = sections[0];

  for (const section of sections) {
    if (section.getBoundingClientRect().top <= readingLine) {
      currentSection = section;
    }
  }

  // The final section may be too short to reach the reading line.
  if (window.scrollY > 0 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
    currentSection = sections[sections.length - 1];
  }

  for (const link of navigationLinks) {
    if (link.hash === `#${currentSection.id}`) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  }

  scheduled = false;
}

function scheduleUpdate() {
  if (!scheduled) {
    scheduled = true;
    window.requestAnimationFrame(updateActiveSection);
  }
}

function updateHeaderHeight() {
  headerHeight = header.getBoundingClientRect().height;
  document.documentElement.style.setProperty("--header-height", `${headerHeight}px`);
  scheduleUpdate();
}

if ("ResizeObserver" in window) {
  new ResizeObserver(updateHeaderHeight).observe(header);
}

window.addEventListener("scroll", scheduleUpdate, { passive: true });
window.addEventListener("resize", updateHeaderHeight, { passive: true });
window.addEventListener("hashchange", scheduleUpdate);
window.addEventListener("pageshow", scheduleUpdate);
updateHeaderHeight();
