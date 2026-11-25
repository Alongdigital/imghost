
document.addEventListener("DOMContentLoaded", () => {

  // ELEMENTS
  const searchInput = document.getElementById("fileSearch");
  const typeFilter = document.getElementById("fileTypeFilter");
  const sortSelect = document.getElementById("fileSort");

  const tableBody = document.getElementById("filesTableBody");
  const fileCountLabel = document.getElementById("fileCountLabel");
  const refreshBtn = document.getElementById("refreshFilesBtn");

  const totalFiles = document.getElementById("totalFiles");
  const totalImages = document.getElementById("totalImages");
  const totalDocuments = document.getElementById("totalDocuments");
  const totalStorage = document.getElementById("totalStorage");

  const imageStorageSize = document.getElementById("imageStorageSize");
  const documentStorageSize = document.getElementById("documentStorageSize");

  const storagePercentage = document.getElementById("storagePercentage");
  const storageProgressFill = document.getElementById("storageProgressFill");

  const toast = document.getElementById("toast");


  // FILE DATA
  // Actual Supabase data will be loaded here later.
  let files = [];


  // STORAGE LIMIT FOR DISPLAY
  // Change this when your Supabase storage plan is finalized.
  const STORAGE_LIMIT = 1024 * 1024 * 1024;


  // TOAST
  function showToast(message) {

    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);

  }


  // FILE SIZE FORMAT
  function formatSize(bytes) {

    if (!bytes) return "0 MB";

    if (bytes < 1024) {
      return bytes + " B";
    }

    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + " KB";
    }

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";

  }


  // GET FILE EXTENSION
  function getExtension(name) {

    return name.includes(".")
      ? name.split(".").pop().toLowerCase()
      : "file";

  }


  // GET FILE ICON
  function getIcon(extension) {

    const icons = {
      jpg: "JPG",
      jpeg: "JPEG",
      png: "PNG",
      webp: "WEBP",
      gif: "GIF",

      pdf: "PDF",
      doc: "DOC",
      docx: "DOCX",
      txt: "TXT",
      ppt: "PPT",
      pptx: "PPTX",
      xls: "XLS",
      xlsx: "XLSX",
      zip: "ZIP"
    };

    return icons[extension] || "FILE";

  }


  // FORMAT DATE
  function formatDate(date) {

    if (!date) return "--";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "--";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  }


  // UPDATE STATISTICS
  function updateStats() {

    const images = files.filter(file => file.type === "image");

    const documents = files.filter(file => file.type === "document");

    const imageBytes = images.reduce(
      (sum, file) => sum + (Number(file.size) || 0), 0
    );

    const documentBytes = documents.reduce(
      (sum, file) => sum + (Number(file.size) || 0), 0
    );

    const totalBytes = imageBytes + documentBytes;

    totalFiles.textContent = files.length;
    totalImages.textContent = images.length;
    totalDocuments.textContent = documents.length;

    totalStorage.textContent = formatSize(totalBytes);

    imageStorageSize.textContent = formatSize(imageBytes);
    documentStorageSize.textContent = formatSize(documentBytes);

    const percentage = STORAGE_LIMIT > 0
      ? Math.min((totalBytes / STORAGE_LIMIT) * 100, 100)
      : 0;

    storagePercentage.textContent = percentage.toFixed(1) + "%";

    storageProgressFill.style.width = percentage + "%";

  }


  // EMPTY TABLE
  function showEmpty(message = "No Files Found") {

    tableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-files">
          <div>▣</div>
          <h3>${message}</h3>
          <p>Your hosted files will appear here.</p>
        </td>
      </tr>
    `;

  }


  // RENDER FILES
  function renderFiles() {

    const search = searchInput.value.toLowerCase().trim();

    const filter = typeFilter.value;

    const sort = sortSelect.value;

    let filteredFiles = files.filter(file => {

      const matchesSearch = file.name
        .toLowerCase()
        .includes(search);

      const matchesType =
        filter === "all" || file.type === filter;

      return matchesSearch && matchesType;

    });


    // SORTING
    if (sort === "newest") {

      filteredFiles.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

    } else if (sort === "oldest") {

      filteredFiles.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

    } else if (sort === "name") {

      filteredFiles.sort(
        (a, b) => a.name.localeCompare(b.name)
      );

    }


    fileCountLabel.textContent =
      `Showing ${filteredFiles.length} of ${files.length} files`;


    if (filteredFiles.length === 0) {

      showEmpty(
        files.length === 0
          ? "No Files Found"
          : "No Matching Files"
      );

      return;

    }


    tableBody.innerHTML = "";


    filteredFiles.forEach(file => {

      const extension = getExtension(file.name);

      const row = document.createElement("tr");


      // FILE NAME CELL
      const nameCell = document.createElement("td");

      const nameWrapper = document.createElement("div");

      nameWrapper.className = "file-name-cell";


      const icon = document.createElement("div");

      icon.className = "file-type-icon";

      icon.textContent = getIcon(extension);


      const name = document.createElement("span");

      name.className = "file-name-text";

      name.textContent = file.name;


      nameWrapper.append(icon, name);

      nameCell.appendChild(nameWrapper);


      // TYPE CELL
      const typeCell = document.createElement("td");

      const typeLabel = document.createElement("span");

      typeLabel.className = "file-type-label";

      typeLabel.textContent =
        file.type === "image" ? "Image" : "Document";

      typeCell.appendChild(typeLabel);


      // SIZE CELL
      const sizeCell = document.createElement("td");

      sizeCell.textContent = formatSize(file.size);


      // DATE CELL
      const dateCell = document.createElement("td");

      dateCell.textContent = formatDate(file.date);


      // ACTION CELL
      const actionCell = document.createElement("td");

      const actions = document.createElement("div");

      actions.className = "file-actions";


      const openBtn = document.createElement("button");

      openBtn.type = "button";

      openBtn.textContent = "Open";

      openBtn.addEventListener("click", () => {

        if (!file.url) {
          showToast("File URL is not available.");
          return;
        }

        window.open(file.url, "_blank", "noopener,noreferrer");

      });


      const copyBtn = document.createElement("button");

      copyBtn.type = "button";

      copyBtn.textContent = "Copy URL";

      copyBtn.addEventListener("click", () => {

        copyText(file.url);

      });


      actions.append(openBtn, copyBtn);

      actionCell.appendChild(actions);


      row.append(
        nameCell,
        typeCell,
        sizeCell,
        dateCell,
        actionCell
      );

      tableBody.appendChild(row);

    });

  }


  // COPY URL
  async function copyText(text) {

    if (!text) {
      showToast("File URL is not available.");
      return;
    }

    try {

      if (navigator.clipboard && window.isSecureContext) {

        await navigator.clipboard.writeText(text);

      } else {

        const input = document.createElement("textarea");

        input.value = text;
        input.style.position = "fixed";
        input.style.opacity = "0";

        document.body.appendChild(input);

        input.select();

        const copied = document.execCommand("copy");

        input.remove();

        if (!copied) {
          throw new Error("Copy failed");
        }

      }

      showToast("URL copied successfully!");

    } catch (error) {

      showToast("Unable to copy URL.");

    }

  }


  // SEARCH
  searchInput.addEventListener("input", renderFiles);


  // FILTER
  typeFilter.addEventListener("change", renderFiles);


  // SORT
  sortSelect.addEventListener("change", renderFiles);


  // REFRESH
  refreshBtn.addEventListener("click", () => {

    showToast("Supabase connection is not configured yet.");

  });


  // THEME
  const themeToggle = document.getElementById("themeToggle");

  function applyTheme(theme) {

    document.documentElement.setAttribute("data-theme", theme);

    document.body.setAttribute("data-theme", theme);

    localStorage.setItem("ad-theme", theme);

  }


  const savedTheme = localStorage.getItem("ad-theme");

  if (savedTheme) {
    applyTheme(savedTheme);
  }


  if (themeToggle) {

    themeToggle.addEventListener("click", () => {

      const currentTheme =
        document.documentElement.getAttribute("data-theme") ||
        document.body.getAttribute("data-theme") ||
        "dark";

      applyTheme(
        currentTheme === "dark" ? "light" : "dark"
      );

    });

  }


  // MOBILE SIDEBAR
  const menuBtn = document.getElementById("menuBtn");

  const sidebar = document.getElementById("sidebar");

  if (menuBtn && sidebar) {

    menuBtn.addEventListener("click", () => {

      sidebar.classList.toggle("active");

    });

  }


  // INITIAL LOAD
  updateStats();

  renderFiles();

});
