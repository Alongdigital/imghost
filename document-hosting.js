
document.addEventListener("DOMContentLoaded", () => {

  // ELEMENTS
  const documentInput = document.getElementById("documentInput");
  const dropZone = document.getElementById("documentDropZone");
  const selectBtn = document.getElementById("selectDocumentBtn");

  const selectedDocument = document.getElementById("selectedDocument");
  const documentIcon = document.getElementById("documentIcon");
  const documentName = document.getElementById("documentName");
  const documentDetails = document.getElementById("documentDetails");

  const removeBtn = document.getElementById("removeDocumentBtn");
  const uploadBtn = document.getElementById("uploadDocumentBtn");
  const uploadStatus = document.getElementById("uploadStatus");

  const preview = document.getElementById("documentPreview");

  const documentURL = document.getElementById("documentURL");
  const documentHTMLCode = document.getElementById("documentHTMLCode");

  const copyURLBtn = document.getElementById("copyDocumentURLBtn");
  const copyHTMLBtn = document.getElementById("copyDocumentHTMLBtn");

  const refreshBtn = document.getElementById("refreshDocumentsBtn");
  const toast = document.getElementById("toast");

  let selectedFile = null;


  // ALLOWED FILE TYPES
  const allowedExtensions = [
    "pdf",
    "doc",
    "docx",
    "txt",
    "ppt",
    "pptx",
    "xls",
    "xlsx",
    "zip"
  ];

  // Maximum file size: 20 MB
  const MAX_FILE_SIZE = 20 * 1024 * 1024;


  // TOAST
  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }


  // FORMAT FILE SIZE
  function formatFileSize(bytes) {
    if (bytes < 1024) {
      return bytes + " B";
    }

    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + " KB";
    }

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }


  // GET FILE EXTENSION
  function getExtension(fileName) {
    return fileName.split(".").pop().toLowerCase();
  }


  // DOCUMENT ICON
  function getFileIcon(extension) {
    const icons = {
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


  // FILE SELECTION
  function handleFile(file) {

    if (!file) return;

    const extension = getExtension(file.name);

    if (!allowedExtensions.includes(extension)) {
      showToast("This file format is not allowed.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      showToast("File size must be below 20 MB.");
      return;
    }

    selectedFile = file;

    documentIcon.textContent = getFileIcon(extension);
    documentName.textContent = file.name;
    documentDetails.textContent =
      formatFileSize(file.size) + " • " + extension.toUpperCase();

    selectedDocument.style.display = "flex";

    uploadBtn.disabled = false;

    uploadStatus.textContent = "Document selected successfully.";

    showPreview(file, extension);
  }


  // DOCUMENT PREVIEW
  function showPreview(file, extension) {

    preview.innerHTML = `
      <div class="preview-file-icon">▤</div>

      <h3 class="preview-file-name"></h3>

      <p class="preview-file-details">
        Format: ${extension.toUpperCase()}<br>
        Size: ${formatFileSize(file.size)}<br>
        Status: Ready for upload
      </p>
    `;

    preview.querySelector(".preview-file-name").textContent =
      file.name;
  }


  // RESET DOCUMENT
  function resetDocument() {

    selectedFile = null;

    documentInput.value = "";

    selectedDocument.style.display = "none";

    uploadBtn.disabled = true;

    uploadStatus.textContent =
      "Select a document to continue.";

    documentURL.value = "";
    documentHTMLCode.value = "";

    preview.innerHTML = `
      <div class="empty-document">
        <div class="empty-icon">▤</div>
        <h3>No Document Selected</h3>
        <p>Your selected document details will appear here.</p>
      </div>
    `;
  }


  // BROWSE BUTTON
  selectBtn.addEventListener("click", () => {
    documentInput.click();
  });


  // INPUT CHANGE
  documentInput.addEventListener("change", (event) => {

    const file = event.target.files[0];

    if (file) {
      handleFile(file);
    }

  });


  // REMOVE BUTTON
  removeBtn.addEventListener("click", resetDocument);


  // DRAG AND DROP
  dropZone.addEventListener("dragover", (event) => {

    event.preventDefault();

    dropZone.classList.add("drag-over");

  });


  dropZone.addEventListener("dragleave", () => {

    dropZone.classList.remove("drag-over");

  });


  dropZone.addEventListener("drop", (event) => {

    event.preventDefault();

    dropZone.classList.remove("drag-over");

    const file = event.dataTransfer.files[0];

    if (file) {
      handleFile(file);
    }

  });


  // UPLOAD BUTTON
  uploadBtn.addEventListener("click", () => {

    if (!selectedFile) {
      showToast("Please select a document first.");
      return;
    }

    uploadStatus.textContent =
      "Backend connection is not configured yet.";

    showToast(
      "Document selected. Supabase upload will be connected next."
    );

  });


  // COPY FUNCTION
  async function copyText(text) {

    if (!text) {
      showToast("Nothing to copy.");
      return;
    }

    try {

      if (navigator.clipboard && window.isSecureContext) {

        await navigator.clipboard.writeText(text);

      } else {

        const textarea = document.createElement("textarea");

        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);

        textarea.select();

        const copied = document.execCommand("copy");

        textarea.remove();

        if (!copied) {
          throw new Error("Copy failed");
        }

      }

      showToast("Copied successfully!");

    } catch (error) {

      showToast("Unable to copy. Please copy manually.");

    }

  }


  // COPY URL
  copyURLBtn.addEventListener("click", () => {

    copyText(documentURL.value);

  });


  // COPY HTML
  copyHTMLBtn.addEventListener("click", () => {

    copyText(documentHTMLCode.value);

  });


  // REFRESH DOCUMENTS
  refreshBtn.addEventListener("click", () => {

    showToast("Backend connection is not configured yet.");

  });


  // THEME SWITCH
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

      const newTheme =
        currentTheme === "dark" ? "light" : "dark";

      applyTheme(newTheme);

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


  // INITIAL STATE
  resetDocument();

});
