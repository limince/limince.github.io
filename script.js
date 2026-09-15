(() => {
  const content = window.SITE_CONTENT;
  const supportedLanguages = ["zh", "en"];
  const previewCount = 4;
  let publicationsExpanded = false;

  const getInitialLanguage = () => {
    const requested = new URLSearchParams(window.location.search).get("lang");
    if (supportedLanguages.includes(requested)) return requested;
    return navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
  };

  const renderResearch = (items) => {
    document.querySelector("#research-grid").innerHTML = items.map((item) => `
      <article class="research-card">
        <span class="card-number">${item.number}</span>
        <div><h3>${item.title}</h3><p>${item.description}</p></div>
      </article>`).join("");
  };

  const renderNews = (items) => {
    document.querySelector("#news-list").innerHTML = items.map((item) => `
      <article class="news-item"><time>${item.date}</time><p>${item.text}</p></article>`).join("");
  };

  const renderEducation = (items) => {
    document.querySelector("#education-list").innerHTML = items.map((item) => `
      <article class="timeline-item">
        <time>${item.date}</time><h4>${item.title}</h4><p>${item.place}</p>
      </article>`).join("");
  };

  const renderPublications = (groups, copy) => {
    const labels = { paper: copy.linkPaper, code: copy.linkCode, project: copy.linkProject };
    const renderItems = (items) => items.map((item, index) => {
      const links = Object.entries(item.links).filter(([, href]) => href).map(([type, href]) =>
        `<a href="${href}" target="_blank" rel="noreferrer">${labels[type]} <span aria-hidden="true">↗</span></a>`).join("");
      const concealed = !publicationsExpanded && index >= previewCount ? " publication-concealed" : "";

      return `<article class="publication-item${concealed}">
        <div class="publication-meta"><span>${item.year}</span><span>${item.venue}</span></div>
        <div class="publication-copy"><h4>${item.title}</h4><p class="authors">${item.authors}</p><p>${item.description}</p>${links ? `<div class="publication-links">${links}</div>` : ""}</div>
      </article>`;
    }).join("");

    const total = groups.primary.length + groups.collaborative.length;
    document.querySelector("#publication-list").innerHTML = `
      <section class="publication-group">
        <div class="group-heading"><h3>${copy.primaryGroup}</h3><span>${copy.authorNote} · ${groups.primary.length}</span></div>
        <div class="publication-list">${renderItems(groups.primary)}</div>
      </section>
      <section class="publication-group">
        <div class="group-heading"><h3>${copy.collaborativeGroup}</h3><span>${groups.collaborative.length}</span></div>
        <div class="publication-list">${renderItems(groups.collaborative)}</div>
      </section>
      <div class="publication-more-wrap">
        <button class="publication-more" type="button" aria-expanded="${publicationsExpanded}">
          <span>${publicationsExpanded ? copy.showFewerPublications : copy.showAllPublications}</span>
          <small>${publicationsExpanded ? "↑" : `+ ${total - previewCount * 2}`}</small>
        </button>
      </div>`;

    document.querySelector(".publication-more").addEventListener("click", () => {
      publicationsExpanded = !publicationsExpanded;
      renderPublications(groups, copy);
      if (!publicationsExpanded) document.querySelector("#publications").scrollIntoView({ behavior: "smooth" });
    });
  };

  const applyContactLinks = () => {
    const { contact } = content;
    document.querySelectorAll('[data-contact="email"]').forEach((link) => { link.href = `mailto:${contact.email}`; });
    document.querySelectorAll('[data-contact="email-text"]').forEach((link) => {
      link.href = `mailto:${contact.email}`;
      link.childNodes[0].textContent = `${contact.email} `;
    });
    ["cv", "scholar", "github", "orcid"].forEach((key) => {
      document.querySelectorAll(`[data-contact="${key}"]`).forEach((link) => {
        if (contact[key]) { link.href = contact[key]; link.hidden = false; } else { link.hidden = true; }
      });
    });
  };

  const applyLanguage = (language) => {
    const copy = content[language];
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
    document.title = copy.metaTitle;
    document.querySelector('meta[name="description"]').content = copy.metaDescription;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const value = copy[element.dataset.i18n];
      if (value !== undefined) element.textContent = value;
    });
    document.querySelectorAll("[data-i18n-html]").forEach((element) => {
      const value = copy[element.dataset.i18nHtml];
      if (value !== undefined) element.innerHTML = value;
    });

    document.querySelector(".language-current").textContent = language === "zh" ? "中文" : "EN";
    document.querySelector(".language-other").textContent = language === "zh" ? "EN" : "中文";
    publicationsExpanded = false;
    renderResearch(copy.research);
    renderEducation(copy.education);
    renderNews(copy.news);
    renderPublications(copy.publications, copy);

    const url = new URL(window.location.href);
    url.searchParams.set("lang", language);
    window.history.replaceState({}, "", url);
    window.localStorage.setItem("homepage-language", language);
  };

  let language = getInitialLanguage();
  const savedLanguage = window.localStorage.getItem("homepage-language");
  if (!new URLSearchParams(window.location.search).has("lang") && supportedLanguages.includes(savedLanguage)) language = savedLanguage;

  applyContactLinks();
  applyLanguage(language);
  document.querySelector("#current-year").textContent = new Date().getFullYear();
  document.querySelector(".language-toggle").addEventListener("click", () => {
    language = language === "zh" ? "en" : "zh";
    applyLanguage(language);
  });
})();
