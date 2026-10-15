/* Small, dependency-free interactions for the portfolio. */
const menuToggle = document.querySelector(".menu-toggle");
const siteNavigation = document.querySelector(".site-nav");

function closeNavigation() {
  if (!menuToggle || !siteNavigation) return;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
  siteNavigation.classList.remove("is-open");
  document.body.classList.remove("menu-open");
}

if (menuToggle && siteNavigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    siteNavigation.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("menu-open", !isOpen);
  });

  siteNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeNavigation);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 700) closeNavigation();
  });
}

const profileImage = document.querySelector(".profile-image");
const portraitFallback = document.querySelector(".portrait-fallback");
if (profileImage && portraitFallback) {
  const portraitFrame = profileImage.closest(".portrait-frame");
  const showProfileImage = () => {
    if (portraitFrame) portraitFrame.classList.add("has-profile-image");
  };
  const showPortraitFallback = () => {
    profileImage.hidden = true;
    if (portraitFrame) portraitFrame.classList.remove("has-profile-image");
  };

  profileImage.addEventListener("load", showProfileImage, { once: true });
  profileImage.addEventListener("error", showPortraitFallback, { once: true });
  if (profileImage.complete) {
    if (profileImage.naturalWidth > 0) showProfileImage();
    else showPortraitFallback();
  }
}

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = String(new Date().getFullYear());

const certificateDialog = document.querySelector(".certificate-dialog");
const certificateDialogTitle = document.querySelector("#certificate-dialog-title");
const certificateDialogImage = document.querySelector(".certificate-dialog-image");
const certificateDialogClose = document.querySelector(".certificate-dialog-close");
if (
  certificateDialog instanceof HTMLDialogElement &&
  certificateDialogTitle &&
  certificateDialogImage instanceof HTMLImageElement &&
  certificateDialogClose
) {
  document.querySelectorAll(".certificate-view-button").forEach((button) => {
    button.addEventListener("click", () => {
      const certificateCard = button.closest(".certificate-card, .education-card");
      const certificateTitle = certificateCard?.querySelector("h3")?.textContent?.trim();
      const certificateSource = button.getAttribute("data-certificate-src");
      const certificateAlt = button.getAttribute("data-certificate-alt");
      if (!certificateTitle || !certificateSource || !certificateAlt) return;

      certificateDialogTitle.textContent = certificateTitle;
      certificateDialogImage.src = certificateSource;
      certificateDialogImage.alt = certificateAlt;
      certificateDialog.showModal();
    });
  });

  certificateDialogClose.addEventListener("click", () => certificateDialog.close());
  certificateDialog.addEventListener("click", (event) => {
    if (event.target === certificateDialog) certificateDialog.close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && certificateDialog.open) certificateDialog.close();
  });
}

const sketchGallery = document.querySelector(".sketch-gallery");
const reducedMotionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
if (sketchGallery && !reducedMotionPreference.matches) {
  const sketchCards = Array.from(sketchGallery.querySelectorAll(".sketch-card"));
  let sketchIndex = 0;
  let autoScrollTimer = 0;
  let resumeTimer = 0;
  let galleryIsVisible = false;

  const stopAutoScroll = () => {
    window.clearInterval(autoScrollTimer);
    autoScrollTimer = 0;
  };
  const startAutoScroll = () => {
    stopAutoScroll();
    if (
      window.innerWidth > 700 ||
      document.hidden ||
      !galleryIsVisible ||
      sketchCards.length < 2
    ) return;

    autoScrollTimer = window.setInterval(() => {
      sketchIndex = (sketchIndex + 1) % sketchCards.length;
      const card = sketchCards[sketchIndex];
      sketchGallery.scrollTo({
        left: sketchGallery.scrollLeft +
          card.getBoundingClientRect().left -
          sketchGallery.getBoundingClientRect().left,
        behavior: "smooth"
      });
    }, 3200);
  };
  const pauseForManualScroll = () => {
    stopAutoScroll();
    window.clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(startAutoScroll, 6000);
  };

  sketchGallery.addEventListener("scroll", () => {
    const galleryLeft = sketchGallery.getBoundingClientRect().left;
    sketchIndex = sketchCards.reduce((nearestIndex, card, index) => {
      const nearestDistance = Math.abs(
        sketchCards[nearestIndex].getBoundingClientRect().left - galleryLeft
      );
      const distance = Math.abs(card.getBoundingClientRect().left - galleryLeft);
      return distance < nearestDistance ? index : nearestIndex;
    }, 0);
  }, { passive: true });
  ["pointerdown", "touchstart", "wheel", "keydown"].forEach((eventName) => {
    sketchGallery.addEventListener(eventName, pauseForManualScroll, { passive: true });
  });
  document.addEventListener("visibilitychange", startAutoScroll);
  window.addEventListener("resize", startAutoScroll);

  const galleryObserver = new IntersectionObserver(([entry]) => {
    galleryIsVisible = entry.isIntersecting;
    if (galleryIsVisible) startAutoScroll();
    else stopAutoScroll();
  });
  galleryObserver.observe(sketchGallery);
}

const heroRoleTitle = document.querySelector(".hero-role-title");
if (heroRoleTitle && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const roles = [
    "a Web Developer",
    "a Junior Software Developer",
    "a Programming Instructor",
    "a YouTuber & Content Creator",
    "a Cybersecurity Enthusiast",
    "an Aspiring Cybersecurity Professional"
  ];
  let roleIndex = 0;
  let characterIndex = roles[roleIndex].length;
  let deleting = true;

  const animateRole = () => {
    const role = roles[roleIndex];

    if (deleting) {
      characterIndex -= 1;
      heroRoleTitle.textContent = Array.from(role).slice(0, characterIndex).join("");

      if (characterIndex === 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        heroRoleTitle.setAttribute("aria-label", roles[roleIndex]);
      }
    } else {
      characterIndex += 1;
      heroRoleTitle.textContent = Array.from(roles[roleIndex]).slice(0, characterIndex).join("");

      if (characterIndex === Array.from(roles[roleIndex]).length) {
        deleting = true;
        window.setTimeout(animateRole, 1700);
        return;
      }
    }

    window.setTimeout(animateRole, deleting ? 38 : 72);
  };

  heroRoleTitle.setAttribute("aria-label", roles[roleIndex]);
  window.setTimeout(animateRole, 1700);
}

const contactForm = document.querySelector(".contact-form");
if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();
    const text = encodeURIComponent(`Hello Rambabu, I’m ${name}.\nEmail: ${email}\n\n${message}`);
    window.location.href = `https://wa.me/917070008828?text=${text}`;
  });
}
