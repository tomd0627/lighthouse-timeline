(function () {
  try {
    var t = localStorage.getItem("theme");
    document.documentElement.setAttribute(
      "data-theme",
      t === "dark" || t === "light"
        ? t
        : window.matchMedia("(prefers-color-scheme: light)").matches
          ? "light"
          : "dark"
    );
  } catch (e) {}
})();
