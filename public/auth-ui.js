(function () {
  document.body.className = "theme-slate-light";

  const overlay = document.createElement("div");
  overlay.className = "auth-alert-overlay";
  overlay.setAttribute("aria-hidden", "true");
  overlay.innerHTML = `
    <section class="auth-alert unity-panel" role="alertdialog" aria-modal="true" aria-labelledby="authAlertTitle" aria-describedby="authAlertMessage">
      <div class="auth-alert-icon" aria-hidden="true"><i class="fa-solid fa-triangle-exclamation"></i></div>
      <h2 class="auth-alert-title" id="authAlertTitle">System Alert</h2>
      <p class="auth-alert-message" id="authAlertMessage"></p>
      <button type="button" class="auth-alert-dismiss unity-btn">Dismiss</button>
    </section>`;
  document.body.appendChild(overlay);

  const title = overlay.querySelector("#authAlertTitle");
  const message = overlay.querySelector("#authAlertMessage");
  const icon = overlay.querySelector(".auth-alert-icon i");
  const dismissButton = overlay.querySelector(".auth-alert-dismiss");
  let resolveAlert = null;
  let previouslyFocusedElement = null;

  function closeAuthAlert() {
    overlay.classList.remove("is-visible");
    overlay.setAttribute("aria-hidden", "true");
    document.removeEventListener("keydown", handleAlertKeydown);
    if (resolveAlert) {
      resolveAlert();
      resolveAlert = null;
    }
    if (previouslyFocusedElement && typeof previouslyFocusedElement.focus === "function") {
      previouslyFocusedElement.focus();
    }
  }

  function handleAlertKeydown(event) {
    if (event.key === "Escape") closeAuthAlert();
  }

  window.showAuthAlert = function (text, type) {
    if (overlay.classList.contains("is-visible")) closeAuthAlert();

    const alertType = type || "error";
    const alertDetails = {
      success: { title: "Success", icon: "fa-circle-check" },
      offline: { title: "Connection Alert", icon: "fa-wifi" },
      error: { title: "System Alert", icon: "fa-triangle-exclamation" }
    };
    const details = alertDetails[alertType] || alertDetails.error;

    title.textContent = details.title;
    message.textContent = text;
    icon.className = `fa-solid ${details.icon}`;
    overlay.dataset.alertType = alertType;
    previouslyFocusedElement = document.activeElement;
    overlay.classList.add("is-visible");
    overlay.setAttribute("aria-hidden", "false");
    document.addEventListener("keydown", handleAlertKeydown);
    dismissButton.focus();

    return new Promise(function (resolve) {
      resolveAlert = resolve;
    });
  };

  dismissButton.addEventListener("click", closeAuthAlert);

  let wasOffline = !navigator.onLine;
  window.addEventListener("offline", function () {
    wasOffline = true;
    window.showAuthAlert("You are offline. Login and registration need a connection to the server.", "offline");
  });
  window.addEventListener("online", function () {
    if (!wasOffline) return;
    wasOffline = false;
    window.showAuthAlert("Your internet connection is back.", "success");
  });

  if (wasOffline) {
    window.showAuthAlert("You are offline. Login and registration need a connection to the server.", "offline");
  }
})();
