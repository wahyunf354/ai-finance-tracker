import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Finflow - AI Finance Tracker",
    short_name: "Finflow",
    description: "Personal finance tracker powered by AI",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#000000",
    theme_color: "#6b21a8", // Purple 800 (Finflow theme)
    categories: ["finance", "productivity"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/chat.png",
        sizes: "860x2116",
        type: "image/png",
        form_factor: "narrow",
        label: "Catat transaksi lewat chat AI",
      },
      {
        src: "/screenshots/dashboard.png",
        sizes: "870x1878",
        type: "image/png",
        form_factor: "narrow",
        label: "Dashboard keuangan",
      },
      {
        src: "/screenshots/budget.png",
        sizes: "870x1874",
        type: "image/png",
        form_factor: "narrow",
        label: "Kelola budget",
      },
    ],
  };
}
