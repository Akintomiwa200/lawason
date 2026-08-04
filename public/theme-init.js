(function () {
  var key = "gmlawason-theme";

  function getTheme() {
    try {
      var stored = localStorage.getItem(key);
      if (stored === "system") return "system";
      if (stored === "light" || stored === "dark") {
        localStorage.setItem(key, "system");
        return "system";
      }
      return "system";
    } catch (e) {
      return "system";
    }
  }

  function resolveTheme(theme) {
    if (theme === "system") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  }

  function applyTheme() {
    var resolved = resolveTheme(getTheme());
    var root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
  }

  applyTheme();

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", function () {
      if (getTheme() === "system") {
        applyTheme();
      }
    });

  window.addEventListener("storage", function (event) {
    if (event.key === key) {
      applyTheme();
    }
  });
})();
