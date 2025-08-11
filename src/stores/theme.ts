import { defineStore } from "pinia";

export const useThemeStore = defineStore("theme", {
  state: () => ({
    isDark: document.documentElement.classList.contains("dark")
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark;
      document.documentElement.classList.toggle("dark", this.isDark);
      localStorage.theme = this.isDark ? "dark" : "light";
    },
    setTheme(mode: "light" | "dark" | "system") {
      if (mode === "system") {
        localStorage.removeItem("theme");
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.classList.toggle("dark", prefersDark);
        this.isDark = prefersDark;
      } else {
        this.isDark = mode === "dark";
        document.documentElement.classList.toggle("dark", this.isDark);
        localStorage.theme = mode;
      }
    }
  }
});
