supabase-js@2"></script>
/* SUPABASE CONFIGURATION */

const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
const SUPABASE_KEY = "YOUR_SUPABASE_PUBLISHABLE_KEY";

const client = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

/* ELEMENTS */

const fileInput = document.getElementById("imageFile");
const dropZone = document.getElementById("dropZone");
const previewBox = document.getElementById("previewBox");
const preview = document.getElementById("preview");
const status = document.getElementById("status");
const uploadBtn = document.getElementById("uploadBtn");
const result = document.getElementById("result");

let selectedFile = null;
let previewURL = null;

/* FILE SELECTION */

dropZone.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  if (fileInput.files.length) {
    selectImage(fileInput.files[0]);
  }
});

function selectImage(file) {
  const allowed = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif"
  ];

  if (!allowed.includes(file.type)) {
    status.textContent = "Please select JPG, PNG, WEBP or GIF.";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    status.textContent = "Image must be under 5 MB.";
    return;
  }

  selectedFile = file;

  if (previewURL) URL.revokeObjectURL(previewURL);

  previewURL = URL.createObjectURL(file);
  preview.src = previewURL;

  previewBox.style.display = "block";
  document.getElementById("fileName").textContent = file.name;
  document.getElementById("fileSize").textContent =
    (file.size / 1024).toFixed(1) + " KB";

  result.style.display = "none";
  status.textContent = "Image selected successfully!";
}

/* DRAG AND DROP */

["dragenter", "dragover"].forEach(event => {
  dropZone.addEventListener(event, e => {
    e.preventDefault();
    dropZone.classList.add("active");
  });
});

["dragleave", "drop"].forEach(event => {
  dropZone.addEventListener(event, e => {
    e.preventDefault();
    dropZone.classList.remove("active");
  });
});

dropZone.addEventListener("drop", e => {
  const file = e.dataTransfer.files[0];

  if (file) {
    selectImage(file);
  }
});

/* IMAGE UPLOAD */

uploadBtn.addEventListener("click", async () => {

  if (!selectedFile) {
    status.textContent = "Please select an image first.";
    return;
  }

  uploadBtn.disabled = true;
  uploadBtn.textContent = "Uploading...";
  status.textContent = "Uploading your image...";
  result.style.display = "none";

  try {

    const extensions = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif"
    };

    const fileName =
      crypto.randomUUID() + "." + extensions[selectedFile.type];

    const { data, error } = await client.storage
      .from("images")
      .upload(fileName, selectedFile, {
        contentType: selectedFile.type,
        upsert: false
      });

    if (error) throw error;

    const { data: urlData } = client.storage
      .from("images")
      .getPublicUrl(data.path);

    document.getElementById("imageURL").value =
      urlData.publicUrl;

    result.style.display = "block";
    status.textContent = "Your image is now hosted!";

  } catch (error) {

    status.textContent = "Upload failed: " + error.message;

  } finally {

    uploadBtn.disabled = false;
    uploadBtn.textContent = "↑ Upload Image";

  }
});

/* COPY IMAGE URL */

document.getElementById("copyBtn").addEventListener("click", async () => {

  const url = document.getElementById("imageURL").value;

  try {
    await navigator.clipboard.writeText(url);
    status.textContent = "Image URL copied successfully!";
  } catch {
    document.getElementById("imageURL").select();
    status.textContent = "Select and copy the URL manually.";
  }

});