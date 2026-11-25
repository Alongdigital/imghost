
document.addEventListener("DOMContentLoaded", () => {

  // PDF BUTTON
  const pdfButton = document.querySelector("#aboutPdfBtn");
  const pdfStatus = document.querySelector("#pdfStatus");

  const pdfURL = ASSETS.documents?.aboutPdf || "";

  if (pdfButton) {

    if (pdfURL.trim() !== "") {

      pdfButton.href = pdfURL;
      pdfButton.classList.remove("disabled");

      if (pdfStatus) {
        pdfStatus.textContent = "Project documentation is available.";
      }

    } else {

      pdfButton.href = "#";
      pdfButton.classList.add("disabled");

      if (pdfStatus) {
        pdfStatus.textContent = "Documentation PDF will be available soon.";
      }

      pdfButton.addEventListener("click", (event) => {
        event.preventDefault();

        showToast("PDF has not been added yet.");
      });

    }

  }


  // TOAST
  function showToast(message) {

    const toast = document.querySelector("#toast");

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);

  }


  // THEME
  const themeToggle = document.querySelector("#themeToggle");

  const savedTheme = localStorage.getItem("ad-theme");

  if (savedTheme) {
    document.documentElement.setAttribute("data-theme", savedTheme);
    document.body.setAttribute("data-theme", savedTheme);
  }

  if (themeToggle) {

    themeToggle.addEventListener("click", () => {

      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "dark";

      const newTheme =
        currentTheme === "dark" ? "light" : "dark";

      document.documentElement.setAttribute("data-theme", newTheme);
      document.body.setAttribute("data-theme", newTheme);

      localStorage.setItem("ad-theme", newTheme);

    });

  }


  // MOBILE SIDEBAR
  const menuBtn = document.querySelector("#menuBtn");
  const sidebar = document.querySelector("#sidebar");

  if (menuBtn && sidebar) {

    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });

  }

});
