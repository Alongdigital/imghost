
document.addEventListener("DOMContentLoaded", () => {

  // ==================================
  // ELEMENTS
  // ==================================

  const imageInput = document.getElementById("imageInput");
  const selectImageBtn = document.getElementById("selectImageBtn");
  const dropZone = document.getElementById("dropZone");

  const selectedFile = document.getElementById("selectedFile");
  const previewImage = document.getElementById("previewImage");
  const largePreview = document.getElementById("largePreview");
  const emptyPreview = document.getElementById("emptyPreview");

  const fileName = document.getElementById("fileName");
  const fileSize = document.getElementById("fileSize");
  const fileType = document.getElementById("fileType");

  const removeImageBtn = document.getElementById("removeImageBtn");
  const uploadImageBtn = document.getElementById("uploadImageBtn");
  const uploadStatus = document.getElementById("uploadStatus");

  const urlSection = document.getElementById("urlSection");
  const imageURL = document.getElementById("imageURL");
  const htmlCode = document.getElementById("htmlCode");

  const copyURLBtn = document.getElementById("copyURLBtn");
  const copyHTMLBtn = document.getElementById("copyHTMLBtn");

  const refreshImagesBtn = document.getElementById("refreshImagesBtn");

  const themeBtn = document.getElementById("themeBtn");
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.getElementById("sidebar");

  const toast = document.getElementById("toast");

  // ==================================
  // STATE
  // ==================================

  let currentFile = null;
  let previewURL = null;

  // ==================================
  // TOAST
  // ==================================

  let toastTimer;

  function showToast(message) {

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);

  }

  // ==================================
  // THEME
  // ==================================

  function applyTheme(theme) {

    document.body.classList.toggle(
      "light-theme",
      theme === "light"
    );

    themeBtn.textContent =
      theme === "light" ? "☾ Dark mode" : "☀ Light mode";

    localStorage.setItem("ad-theme", theme);

  }

  const savedTheme = localStorage.getItem("ad-theme");

  applyTheme(savedTheme || ASSETS.settings.defaultTheme);

  themeBtn.addEventListener("click", () => {

    const isLight =
      document.body.classList.contains("light-theme");

    applyTheme(isLight ? "dark" : "light");

  });

  // ==================================
  // MOBILE SIDEBAR
  // ==================================

  menuBtn.addEventListener("click", () => {

    sidebar.classList.toggle("open");

  });

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

  // ==================================
  // FILE SIZE FORMAT
  // ==================================

  function formatSize(bytes) {

    if (bytes < 1024) {
      return bytes + " Bytes";
    }

    if (bytes < 1024 * 1024) {
      return (bytes / 1024).toFixed(2) + " KB";
    }

    return (bytes / (1024 * 1024)).toFixed(2) + " MB";

  }

  // ==================================
  // IMAGE VALIDATION
  // ==================================

  function validateImage(file) {

    if (!file) {
      showToast("Please select an image.");
      return false;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif"
    ];

    if (!allowedTypes.includes(file.type)) {

      showToast("Unsupported image format.");
      return false;

    }

    // 10 MB temporary frontend limit.
    // We will align this with backend limits later.

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {

      showToast("Image must be smaller than 10 MB.");
      return false;

    }

    return true;

  }

  // ==================================
  // SELECT IMAGE
  // ==================================

  selectImageBtn.addEventListener("click", event => {

    event.stopPropagation();

    imageInput.click();

  });

  dropZone.addEventListener("click", event => {

    if (event.target === selectImageBtn) return;

    imageInput.click();

  });

  imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if (file) {
      handleImage(file);
    }

  });

  // ==================================
  // HANDLE IMAGE
  // ==================================

  function handleImage(file) {

    if (!validateImage(file)) {

      imageInput.value = "";
      return;

    }

    currentFile = file;

    // Clear previous preview URL.

    if (previewURL) {
      URL.revokeObjectURL(previewURL);
    }

    previewURL = URL.createObjectURL(file);

    // FILE INFORMATION

    fileName.textContent = file.name;
    fileSize.textContent = "Size: " + formatSize(file.size);
    fileType.textContent = "Type: " + file.type;

    // PREVIEWS

    previewImage.src = previewURL;
    largePreview.src = previewURL;

    selectedFile.hidden = false;
    largePreview.hidden = false;
    emptyPreview.hidden = true;

    // BUTTON

    uploadImageBtn.disabled = false;

    uploadStatus.textContent =
      "Image ready. Backend connection pending.";

    // RESET OLD URL

    urlSection.hidden = true;

    imageURL.value = "";

    htmlCode.textContent =
      '<img src="YOUR_IMAGE_URL" alt="My Image">';

    showToast("Image selected successfully.");

  }

  // ==================================
  // REMOVE IMAGE
  // ==================================

  function clearImage() {

    currentFile = null;

    if (previewURL) {

      URL.revokeObjectURL(previewURL);
      previewURL = null;

    }

    imageInput.value = "";

    previewImage.src = "";
    largePreview.src = "";

    selectedFile.hidden = true;

    largePreview.hidden = true;
    emptyPreview.hidden = false;

    uploadImageBtn.disabled = true;

    uploadStatus.textContent =
      "Select an image to continue.";

  }

  removeImageBtn.addEventListener("click", clearImage);

  // ==================================
  // DRAG AND DROP
  // ==================================

  ["dragenter", "dragover"].forEach(eventName => {

    dropZone.addEventListener(eventName, event => {

      event.preventDefault();

      dropZone.classList.add("drag-over");

    });

  });

  ["dragleave", "drop"].forEach(eventName => {

    dropZone.addEventListener(eventName, event => {

      event.preventDefault();

      dropZone.classList.remove("drag-over");

    });

  });

  dropZone.addEventListener("drop", event => {

    const file = event.dataTransfer.files[0];

    if (file) {
      handleImage(file);
    }

  });

  // ==================================
  // UPLOAD BUTTON
  // ==================================

  uploadImageBtn.addEventListener("click", () => {

    if (!currentFile) {

      showToast("Select an image first.");
      return;

    }

    /*
      SUPABASE UPLOAD WILL BE CONNECTED HERE.

      Planned process:

      1. Upload image to Supabase bucket.
      2. Get public image URL.
      3. Save image record in Google Sheets.
      4. Display generated URL.

      Never display a fake URL as a successful upload.
    */

    showToast("Backend connection is not configured yet.");

    uploadStatus.textContent =
      "Waiting for Supabase and Google Sheets integration.";

  });

  // ==================================
  // COPY IMAGE URL
  // ==================================

  async function copyText(text) {

    if (!text) {

      showToast("Nothing to copy.");
      return;

    }

    try {

      if (navigator.clipboard && window.isSecureContext) {

        await navigator.clipboard.writeText(text);

      } else {

        const temp = document.createElement("textarea");

        temp.value = text;

        temp.style.position = "fixed";
        temp.style.opacity = "0";

        document.body.appendChild(temp);

        temp.select();

        const copied = document.execCommand("copy");

        temp.remove();

        if (!copied) {
          throw new Error("Copy failed");
        }

      }

      showToast("Copied successfully!");

    } catch (error) {

      showToast("Unable to copy. Please copy manually.");

    }

  }

  copyURLBtn.addEventListener("click", () => {

    copyText(imageURL.value);

  });

  // ==================================
  // COPY HTML CODE
  // ==================================

  copyHTMLBtn.addEventListener("click", () => {

    copyText(htmlCode.textContent);

  });

  // ==================================
  // REFRESH IMAGES
  // ==================================

  refreshImagesBtn.addEventListener("click", () => {

    /*
      Later:
      Fetch image records from Supabase/Google Sheets.
    */

    showToast("Image library backend is not connected yet.");

  });

});
