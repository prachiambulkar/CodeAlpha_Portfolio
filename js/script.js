
import { profile } from "../data/profile.js";
import { projects } from "../data/projects.js";
import { certificates } from "../data/certificates.js";

const get = (id) => document.getElementById(id);

const isRealLink = (url) =>
  typeof url === "string" &&
  url.trim() !== "" &&
  url !== "#" &&
  !url.toLowerCase().includes("your-");

function addExternalLink(container, label, url, className = "") {
  if (!container || !isRealLink(url)) return;

  const link = document.createElement("a");
  link.href = url;
  link.textContent = label;
  link.target = "_blank";
  link.rel = "noopener noreferrer";

  if (className) link.className = className;
  container.appendChild(link);
}

/* PROFILE */

function loadProfile() {
  const nameElement = get("heroName");

  if (nameElement && profile.name) {
    const parts = profile.name.trim().split(" ");
    const lastName = parts.pop();

    nameElement.replaceChildren();

    nameElement.append(
      document.createTextNode(parts.join(" ") + " ")
    );

    const highlighted = document.createElement("span");
    highlighted.textContent = lastName + ".";
    nameElement.appendChild(highlighted);
  }

  const description = get("heroDescription");
  if (description) {
    description.textContent = profile.tagline || "";
  }

  const about = get("aboutText");
  if (about) about.textContent = profile.about || "";

  const education = get("educationText");
  if (education) education.textContent = profile.education || "";

  const goal = get("goalText");
  if (goal) goal.textContent = profile.goal || "";

  const interests = get("interestsText");
  if (interests) {
    interests.textContent = Array.isArray(profile.interests)
      ? profile.interests.join(" • ")
      : profile.interests || "";
  }

  const footerName = get("footerName");
  if (footerName) footerName.textContent = profile.name || "";

  /* PROFILE PHOTO */

  const image = get("profileImage");
  const placeholder = get("profilePlaceholder");

  if (image) {
    image.alt = `${profile.name || "Profile"} profile photo`;

    image.onload = () => {
      image.hidden = false;
      if (placeholder) placeholder.hidden = true;
    };

    image.onerror = () => {
      image.hidden = true;
      if (placeholder) placeholder.hidden = false;
    };

    if (profile.photo) {
      image.src = profile.photo;
    } else {
      image.hidden = true;
      if (placeholder) placeholder.hidden = false;
    }
  }

  /* SOCIAL LINKS */

  const socialLinks = get("socialLinks");

  if (socialLinks) {
    socialLinks.replaceChildren();

    addExternalLink(socialLinks, "GitHub ↗", profile.github);
    addExternalLink(socialLinks, "LinkedIn ↗", profile.linkedin);
  }

  /* CONTACT DETAILS */

  const contactDetails = get("contactDetails");

  if (contactDetails) {
    contactDetails.replaceChildren();

    if (isRealLink(profile.email)) {
      const emailLink = document.createElement("a");
      emailLink.className = "contact-link";
      emailLink.href = `mailto:${profile.email}`;
      emailLink.textContent = profile.email;
      contactDetails.appendChild(emailLink);
    }

    addExternalLink(
      contactDetails,
      "GitHub ↗",
      profile.github,
      "contact-link"
    );

    addExternalLink(
      contactDetails,
      "LinkedIn ↗",
      profile.linkedin,
      "contact-link"
    );

    if (
      !isRealLink(profile.email) &&
      !isRealLink(profile.github) &&
      !isRealLink(profile.linkedin)
    ) {
      const note = document.createElement("p");
      note.textContent =
        "Contact links will appear here once they are added.";
      contactDetails.appendChild(note);
    }
  }
}

/* TYPING ANIMATION */

function startTypingAnimation() {
  const element = get("typingText");
  if (!element) return;

  const roles = profile.roles?.length
    ? profile.roles
    : ["Aspiring Software Developer"];

  let roleIndex = 0;
  let characterIndex = 0;
  let deleting = false;

  function type() {
    const currentRole = roles[roleIndex];

    characterIndex += deleting ? -1 : 1;

    element.textContent = currentRole.substring(0, characterIndex);

    let delay = deleting ? 40 : 75;

    if (!deleting && characterIndex === currentRole.length) {
      deleting = true;
      delay = 1400;
    } else if (deleting && characterIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      delay = 350;
    }

    setTimeout(type, delay);
  }

  type();
}

/* PROJECT FILTERS */

function renderProjectFilters() {
  const container = get("projectFilters");
  if (!container) return;

  container.replaceChildren();

  const categories = [
    "all",
    ...new Set(
      projects
        .map((project) => project.category?.toLowerCase())
        .filter(Boolean)
    )
  ];

  categories.forEach((category) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "filter-btn";
    button.dataset.filter = category;

    button.textContent =
      category === "all"
        ? "All Projects"
        : category.charAt(0).toUpperCase() + category.slice(1);

    if (category === "all") {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      container.querySelectorAll(".filter-btn").forEach((item) => {
        item.classList.remove("active");
      });

      button.classList.add("active");
      renderProjects(category);
    });

    container.appendChild(button);
  });
}

/* PROJECTS */

function renderProjects(filter = "all") {
  const container = get("projectsGrid");
  if (!container) return;

  container.replaceChildren();

  const filteredProjects = projects.filter((project) =>
    filter === "all" ||
    project.category?.toLowerCase() === filter.toLowerCase()
  );

  if (!filteredProjects.length) {
    container.textContent =
      "No projects found in this category yet.";
    return;
  }

  filteredProjects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card reveal";

    // Project image or placeholder
    if (isRealLink(project.image)) {
      const image = document.createElement("img");

      image.className = "project-image";
      image.src = project.image;
      image.alt = `${project.title} project preview`;
      image.loading = "lazy";

      card.appendChild(image);
    } else {
      const placeholder = document.createElement("div");

      placeholder.className = "project-image-placeholder";
      placeholder.textContent = "✦";

      card.appendChild(placeholder);
    }

    const content = document.createElement("div");
    content.className = "project-content";

    // Project title
    const title = document.createElement("h3");
    title.textContent = project.title;

    // Project description
    const description = document.createElement("p");
    description.textContent = project.description;

    content.append(title, description);

    // Project features
    if (project.features?.length) {
      const featureHeading = document.createElement("h4");
      featureHeading.className = "project-feature-heading";
      featureHeading.textContent = "Key Features";

      const featureList = document.createElement("ul");
      featureList.className = "project-features";

      project.features.forEach((feature) => {
        const item = document.createElement("li");
        item.textContent = feature;
        featureList.appendChild(item);
      });

      content.append(featureHeading, featureList);
    }

    // Technology tags
    const techList = document.createElement("div");
    techList.className = "project-tech";

    (project.technologies || []).forEach((technology) => {
      const tag = document.createElement("span");
      tag.textContent = technology;
      techList.appendChild(tag);
    });

    // Project links
    const links = document.createElement("div");
    links.className = "project-links";

    addExternalLink(links, "GitHub ↗", project.github);
    addExternalLink(links, "Live Demo ↗", project.demo);

    content.append(techList, links);
    card.appendChild(content);

    container.appendChild(card);
  });

  observeRevealElements();
}

/* CERTIFICATES */

function renderCertificates() {
  const container = get("certificatesGrid");
  if (!container) return;

  container.replaceChildren();

  if (!certificates || certificates.length === 0) {
    const message = document.createElement("p");

    message.textContent =
      "Certificates and achievements will be added here as you earn them.";

    message.style.color = "var(--muted)";
    message.style.textAlign = "center";
    message.style.gridColumn = "1 / -1";

    container.appendChild(message);
    return;
  }

  certificates.forEach((certificate) => {
    const card = document.createElement("article");
    card.className = "certificate-card reveal";

    // Certificate image
    if (certificate.image) {
      const imageLink = document.createElement("a");

      imageLink.href = certificate.image;
      imageLink.target = "_blank";
      imageLink.rel = "noopener noreferrer";
      imageLink.className = "certificate-image-link";

      const image = document.createElement("img");

      image.src = certificate.image;
      image.alt = `${certificate.title || "Certificate"} image`;
      image.className = "certificate-image";
      image.loading = "lazy";

      image.style.width = "100%";
      image.style.height = "220px";
      image.style.objectFit = "contain";
      image.style.objectPosition = "center";
      image.style.display = "block";
      image.style.background = "rgba(255, 255, 255, 0.04)";
      image.style.borderRadius = "12px";
      image.style.marginBottom = "18px";

      image.onerror = () => {
        imageLink.remove();
      };

      imageLink.appendChild(image);
      card.appendChild(imageLink);
    } else {
      const icon = document.createElement("div");
      icon.className = "certificate-icon";
      icon.textContent = "✧";
      card.appendChild(icon);
    }

    // Certificate title
    const title = document.createElement("h3");
    title.textContent = certificate.title || "Certificate";

    // Organization
    const organization = document.createElement("p");
    organization.textContent = certificate.organization || "";

    // Date
    const date = document.createElement("p");
    date.textContent = certificate.date || "";

    card.append(title, organization, date);

    // View Certificate link
    if (isRealLink(certificate.image)) {
      addExternalLink(
        card,
        "View Certificate ↗",
        certificate.image
      );
    } else if (isRealLink(certificate.link)) {
      addExternalLink(
        card,
        "View Certificate ↗",
        certificate.link
      );
    }

    container.appendChild(card);
  });

  observeRevealElements();
}

/* DARK / LIGHT THEME */

function setupThemeToggle() {
  const button = get("themeToggle");
  const icon = get("themeIcon");

  if (!button) return;

  const savedTheme = localStorage.getItem("portfolio-theme");

  if (savedTheme === "light") {
    document.body.classList.add("light-theme");
  }

  function updateIcon() {
    if (icon) {
      icon.textContent =
        document.body.classList.contains("light-theme") ? "☾" : "☀";
    }
  }

  updateIcon();

  button.addEventListener("click", () => {
    document.body.classList.toggle("light-theme");

    const currentTheme =
      document.body.classList.contains("light-theme")
        ? "light"
        : "dark";

    localStorage.setItem("portfolio-theme", currentTheme);

    updateIcon();
  });
}

/* CONTACT FORM */

function setupContactForm() {
  const form = get("contactForm");
  const note = get("formNote");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = get("contactName")?.value.trim();
    const email = get("contactEmail")?.value.trim();
    const message = get("contactMessage")?.value.trim();

    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    if (!isRealLink(profile.email)) {
      if (note) {
        note.textContent =
          "The portfolio owner's email address has not been added yet.";
      }

      alert(
        "The contact email is not configured yet. Add your email in data/profile.js first."
      );

      return;
    }

    const subject = encodeURIComponent(
      `Portfolio message from ${name}`
    );

    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    );

    window.location.href =
      `mailto:${profile.email}?subject=${subject}&body=${body}`;
  });
}

/* MOBILE NAVIGATION */

function setupMobileNavigation() {
  const button = get("menuToggle");
  const nav = get("navLinks");

  if (!button || !nav) return;

  button.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");

    button.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
    });
  });
}

/* ACTIVE NAVIGATION */

function setupActiveNavigation() {
  const sections = document.querySelectorAll("main section[id]");
  const links = document.querySelectorAll(".nav-link");

  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((link) => {
            link.classList.toggle(
              "active",
              link.getAttribute("href") === `#${entry.target.id}`
            );
          });
        }
      });
    },
    { rootMargin: "-35% 0px -55% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/* SCROLL PROGRESS */

function setupScrollProgress() {
  const progress = get("scrollProgress");
  if (!progress) return;

  function updateProgress() {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage =
      scrollable > 0
        ? (window.scrollY / scrollable) * 100
        : 0;

    progress.style.width = `${percentage}%`;
  }

  window.addEventListener("scroll", updateProgress, {
    passive: true
  });

  updateProgress();
}

/* REVEAL ANIMATIONS */

let revealObserver;

function observeRevealElements() {
  const elements = document.querySelectorAll(
    ".reveal:not(.visible)"
  );

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => {
      element.classList.add("visible");
    });

    return;
  }

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
  }

  elements.forEach((element) => {
    revealObserver.observe(element);
  });
}

/* INITIALIZE */

function initializePortfolio() {
  loadProfile();

  startTypingAnimation();

  // Skills are already present in index.html.
  // Do not call renderSkills() here.

  renderProjectFilters();
  renderProjects();
  renderCertificates();

  setupThemeToggle();
  setupContactForm();
  setupMobileNavigation();
  setupActiveNavigation();
  setupScrollProgress();

  observeRevealElements();
}

initializePortfolio();
