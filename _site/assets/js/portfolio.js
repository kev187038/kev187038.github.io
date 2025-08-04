
function toggleDescription(header) {
const description = header.nextElementSibling;
const arrow = header.querySelector(".arrow");

description.classList.toggle("expanded");
arrow.textContent = description.classList.contains("expanded") ? "▾" : "▸";
}

