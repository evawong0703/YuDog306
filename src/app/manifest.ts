import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "306 Pantry",
    short_name: "306",
    description: "Nana 存貨管理",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f2e8",
    theme_color: "#8b5e3c",

    icons: [
      {
        src: "/icon.png",
        sizes: "1024x1024",
        type: "image/png",
      },
    ],
  };
}