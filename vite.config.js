import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        country: resolve(__dirname, "src/countryPages/index.html"),
        travelList: resolve(__dirname, "src/travelList/index.html"),

      },
    },
  },
});
