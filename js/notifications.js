(function () {
  const statusEl = document.getElementById("notif-status");
  const enableBtn = document.getElementById("enable-notif");
  const disableBtn = document.getElementById("disable-notif");
  const leadSelect = document.getElementById("notif-lead");
  if (!statusEl) return;

  function support() { return "Notification" in window; }
  function savedLead() { return localStorage.getItem("basura_notif_lead") || "60"; }
  function enabled() { return localStorage.getItem("basura_notif_enabled") === "1"; }

  function renderStatus() {
    if (!support()) { statusEl.textContent = "Notifications unsupported in this browser."; return; }
    if (Notification.permission === "denied") { statusEl.textContent = "Notifications blocked. Enable in browser settings."; return; }
    if (enabled() && Notification.permission === "granted") { statusEl.textContent = "Notifications enabled."; return; }
    statusEl.textContent = "Notifications disabled.";
  }

  if (leadSelect) {
    leadSelect.value = savedLead();
    leadSelect.addEventListener("change", () => localStorage.setItem("basura_notif_lead", leadSelect.value));
  }

  if (enableBtn) {
    enableBtn.addEventListener("click", async () => {
      if (!support()) { statusEl.textContent = "Notifications unsupported."; return; }
      const perm = await Notification.requestPermission();
      if (perm === "granted") {
        localStorage.setItem("basura_notif_enabled", "1");
        renderStatus();
        statusEl.textContent = "Notifications enabled (page open only).";
      } else {
        localStorage.setItem("basura_notif_enabled", "0");
        renderStatus();
      }
    });
  }
  if (disableBtn) {
    disableBtn.addEventListener("click", () => {
      localStorage.setItem("basura_notif_enabled", "0");
      renderStatus();
    });
  }

  renderStatus();

  // Page-open reminder check
  let lastFired = null;
  function checkReminder() {
    const S = window.BasuraSchedule;
    if (!S || !enabled() || !support() || Notification.permission !== "granted") return;
    const sched = S.activeSchedule();
    if (!sched) return;
    const n = S.nextCollection(sched);
    if (!n) return;
    const lead = parseInt(savedLead(), 10) * 60000;
    const now = Date.now();
    const target = n.date.getTime() - lead;
    if (Math.abs(now - target) < 60000 && lastFired !== n.date.getTime()) {
      lastFired = n.date.getTime();
      new Notification("Basura Alert reminder", { body: "Collection soon: " + n.type + " (DEMO ONLY if applicable)" });
    }
  }
  setInterval(checkReminder, 30000);
})();
EOF
Write-File -Path "C:\Users\CL2-Client\Desktop\basura-alert\js\notifications.js"