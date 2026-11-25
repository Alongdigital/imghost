
const ASSETS = {

  // BRAND SETTINGS
  brand: {
    name: "Along Digital",
    shortName: "AD",
    tagline: "Your Digital File Space",
    logo: "assets/logo.png"
  },


  // WEBSITE PAGES
  pages: {
    home: "index.html",
    images: "image-hosting.html",
    documents: "document-hosting.html",
    ai: "ai-assistant.html",
    manager: "file-manager.html",
    about: "about.html"
  },


  // WEBSITE IMAGES
  images: {
    hero: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200",

    imageHosting: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=700",

    documentHosting: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=700",

    aiAssistant: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=700",

    fileManager: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=700"
  },


  // BACKEND CONFIGURATION
  backend: {

    // SEPARATE SUPABASE PROJECTS
    supabase: {

      // DOCUMENT HOSTING PROJECT
      documents: {
        url: "https://noavoulhbpcguchjcqwc.supabase.co",

        anonKey: "sb_publishable_wF6tDTi-t-s3t38ora4awg_krFp_pkc",

        bucket: "documents",

        table: "documents"
      },


      // IMAGE HOSTING PROJECT
      images: {
        url: "https://yqopqetltqrbfohvxsyr.supabase.co",

        anonKey: "sb_publishable_yxaTlveNgGI0WXZqm1kgOg_iLXEw8OM",

        bucket: "images",

        table: "images"
      }

    },


    // GOOGLE SHEETS TRACKING
    googleSheets: {

      webAppURL: "",

      sheets: {
        images: "images",
        documents: "document"
      }

    },


    // AI ASSISTANT
    ai: {
      endpoint: ""
    }

  },


  // DOCUMENT SETTINGS
  documents: {
    aboutPdf: "",
    allowedTypes: [
      "application/pdf"
    ],
    maxFileSize: 10 * 1024 * 1024
  },


  // IMAGE SETTINGS
  imageSettings: {
    allowedTypes: [
      "image/jpeg",
      "image/png",
      "image/webp"
    ],
    maxFileSize: 5 * 1024 * 1024
  },


  // WEBSITE SETTINGS
  settings: {
    defaultTheme: "dark",
    accentColor: "#3285ff",
    allowThemeSwitch: true
  }

};
