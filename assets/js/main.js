import { initCards } from "./modules/build-cards.js";
import { initMenu } from "./modules/menu.js";
import { initSlider } from "./modules/slider.js";

// Theme toggle
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("theme-toggle");
  const htmlElement = document.documentElement;

  toggleBtn.addEventListener("click", () => {
    const isDark = htmlElement.getAttribute("data-theme") === "dark";

    if (isDark) {
      htmlElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      htmlElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
  });
});

// Current page
const pageName = document.body.dataset.pageName;

if (pageName === "index") {
  initSlider();
} else if (pageName === "menu") {
  initCards();
}

initMenu();
