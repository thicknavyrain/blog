const toggle = document.querySelector("[data-theme-toggle]");

const preferred = window.matchMedia("(prefers-color-scheme: dark)").matches;
const stored = localStorage.getItem("theme");

if (stored === "dark" || (!stored && preferred)) {
  document.body.classList.add("dark");
}

const updateLabel = () => {
  if (!toggle) return;
  toggle.textContent = document.body.classList.contains("dark")
    ? "Light mode"
    : "Dark mode";
};

updateLabel();

if (toggle) {
  toggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem(
      "theme",
      document.body.classList.contains("dark") ? "dark" : "light"
    );
    updateLabel();
  });
}
