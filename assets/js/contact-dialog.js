(function () {
  var dialog = document.getElementById("contact-dialog");
  var openBtn = document.getElementById("contact-open-btn");
  var closeBtn = document.getElementById("contact-close-btn");
  var cancelBtn = document.getElementById("contact-cancel-btn");

  if (!dialog || !openBtn) return;

  openBtn.addEventListener("click", function () {
    dialog.showModal();
  });

  function closeDialog() {
    dialog.close();
  }

  if (closeBtn) closeBtn.addEventListener("click", closeDialog);
  if (cancelBtn) cancelBtn.addEventListener("click", closeDialog);

  dialog.addEventListener("click", function (e) {
    if (e.target === dialog) closeDialog();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && dialog.open) closeDialog();
  });
})();
