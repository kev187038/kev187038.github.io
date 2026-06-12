(function () {
  var root = document.documentElement;
  var themeToggle = document.querySelector("[data-theme-toggle]");
  var themeIcon = document.querySelector("[data-theme-icon]");
  var themeLabel = document.querySelector("[data-theme-label]");
  var mobileMenuButton = document.querySelector("[data-mobile-menu-button]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");
  var repoCount = document.querySelector("[data-public-repo-count]");
  var year = document.querySelector("[data-current-year]");

  function isDarkMode() {
    return root.classList.contains("dark");
  }

  function syncThemeButton() {
    if (!themeToggle || !themeIcon || !themeLabel) {
      return;
    }

    var darkMode = isDarkMode();
    themeIcon.textContent = darkMode ? "☀" : "☾";
    themeLabel.textContent = darkMode ? "Light" : "Dark";
    themeToggle.setAttribute("aria-label", darkMode ? "Switch to light mode" : "Switch to dark mode");
  }

  function applyTheme(theme) {
    var darkMode = theme === "dark";
    root.classList.toggle("dark", darkMode);
    root.style.colorScheme = darkMode ? "dark" : "light";
    syncThemeButton();
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      var nextTheme = isDarkMode() ? "light" : "dark";
      localStorage.setItem("theme", nextTheme);
      applyTheme(nextTheme);
    });
  }

  syncThemeButton();

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", function () {
      var expanded = mobileMenuButton.getAttribute("aria-expanded") === "true";
      mobileMenuButton.setAttribute("aria-expanded", expanded ? "false" : "true");
      mobileMenu.classList.toggle("hidden", expanded);
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        mobileMenu.classList.add("hidden");
        mobileMenuButton.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  if (repoCount) {
    fetch("https://api.github.com/users/kev187038", {
      headers: {
        Accept: "application/vnd.github+json"
      }
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("GitHub API request failed");
        }
        return response.json();
      })
      .then(function (data) {
        if (typeof data.public_repos === "number") {
          repoCount.textContent = data.public_repos + "+";
        }
      })
      .catch(function () {
        repoCount.textContent = "40+";
      });
  }
})();
