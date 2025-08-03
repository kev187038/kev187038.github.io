//Counter of repo and years of experience
const startYear = 2025;
const thisYear = new Date().getFullYear();
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("experience-counter").textContent = thisYear - startYear;
});

// GitHub public repo count
fetch("https://api.github.com/users/kev187038")
  .then((response) => response.json())
  .then((data) => {
    document.getElementById("repo-count").textContent = data.public_repos;
  });
