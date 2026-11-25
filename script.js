
document.addEventListener("DOMContentLoaded", () => {

  // ELEMENTS
  const themeBtn = document.getElementById("themeBtn");
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sidebar");
  const searchInput = document.getElementById("serviceSearch");
  const noResults = document.getElementById("noResults");
  const toast = document.getElementById("toast");

  // LOAD BRANDING
  document.title = `${ASSETS.brand.name} | File Hosting`;

  // LOAD IMAGES
  const heroImage = document.getElementById("heroImage");

  heroImage.src = ASSETS.images.hero;

  document.querySelectorAll("[data-asset]").forEach(img => {
    const assetName = img.dataset.asset;

    if (ASSETS.images[assetName]) {
      img.src = ASSETS.images[assetName];
    }
  });

  // THEME SYSTEM
  function applyTheme(theme) {

    document.body.classList.toggle(
      "light-theme",
      theme === "light"
    );

    themeBtn.textContent =
      theme === "light" ? "☾ Dark mode" : "☀ Light mode";

    document.documentElement.style.setProperty(
      "--accent",
      ASSETS.settings.accentColor
    );

    localStorage.setItem("ad-theme", theme);
  }

  const savedTheme = localStorage.getItem("ad-theme");

  applyTheme(savedTheme || ASSETS.settings.defaultTheme);

  themeBtn.addEventListener("click", () => {

    const isLight =
      document.body.classList.contains("light-theme");

    applyTheme(isLight ? "dark" : "light");

  });

  // MOBILE MENU
  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  // TOAST MESSAGE
  let toastTimeout;

  function showToast(message) {

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);

  }

  // NAVIGATION
  function openPage(pageName) {

    const pageURL = ASSETS.pages[pageName];

    if (!pageURL) {
      showToast("Page not configured yet.");
      return;
    }

    if (pageName === "home") {
      window.location.href = pageURL;
      return;
    }

    // Other pages will be created in the next stages.
    window.location.href = pageURL;

  }

  document.querySelectorAll("[data-page]").forEach(element => {

    element.addEventListener("click", event => {

      event.preventDefault();

      const pageName = element.dataset.page;

      sidebar.classList.remove("open");

      openPage(pageName);

    });

  });

  // SERVICE SEARCH
  searchInput.addEventListener("input", () => {

    const searchValue =
      searchInput.value.toLowerCase().trim();

    const cards =
      document.querySelectorAll(".service-card");

    let visibleCount = 0;

    cards.forEach(card => {

      const searchableText =
        card.dataset.search.toLowerCase() + " " +
        card.innerText.toLowerCase();

      const matched =
        searchableText.includes(searchValue);

      card.style.display = matched ? "" : "none";

      if (matched) visibleCount++;

    });

    noResults.hidden = visibleCount !== 0;

  });

  // CLOSE SIDEBAR WHEN CLICKING OUTSIDE
  document.addEventListener("click", event => {

    if (
      window.innerWidth <= 700 &&
      sidebar.classList.contains("open") &&
      !sidebar.contains(event.target) &&
      !menuBtn.contains(event.target)
    ) {
      sidebar.classList.remove("open");
    }

  });

});


  // LOAD BRANDING
  document.title = `${ASSETS.brand.name} | File Hosting`;

  const brandLogo = document.querySelector(".brand-logo");

  if (brandLogo) {
    const logo = document.createElement("img");

    logo.src = ASSETS.brand.logo;
    logo.alt = ASSETS.brand.name + " Logo";

    logo.onerror = () => logo.remove();

    logo.style.width = "100%";
    logo.style.height = "100%";
    logo.style.objectFit = "contain";

    brandLogo.textContent = "";
    brandLogo.appendChild(logo);
  }

