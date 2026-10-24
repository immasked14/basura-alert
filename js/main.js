(function () {
  const cfg = window.BASURA_CONFIG;
  const S = window.BasuraSchedule;
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const links = document.querySelectorAll("nav a");
  const current = location.pathname.split("/").pop() || "index.html";
  links.forEach((a) => {
    const href = a.getAttribute("href");
    if (href === current) a.classList.add("active");
  });

  document.querySelectorAll("[data-community]").forEach((el) => {
    const key = el.getAttribute("data-community");
    if (cfg && cfg.community && cfg.community[key]) el.textContent = cfg.community[key];
  });

  const toggle = document.querySelector(".nav-toggle");
  const menu = document.querySelector("nav.menu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => menu.classList.toggle("open"));
  }

  const cdEl = document.getElementById("countdown");
  const nextEl = document.getElementById("next-schedule");
  if (cdEl || nextEl) {
    if (cdEl) S.startCountdown(cdEl.id);
    if (nextEl) {
      function renderNext() {
        const sched = S.activeSchedule();
        if (!sched) { nextEl.textContent = "Schedule not yet verified. Countdown inactive."; return; }
        const n = S.nextCollection(sched);
        if (!n) { nextEl.textContent = "Schedule to be confirmed."; return; }
        const demo = S.isDemo() ? " (DEMO ONLY)" : "";
        nextEl.textContent = `Next collection: ${n.type} on ${n.date.toLocaleString()}${demo}`;
      }
      renderNext();
      setInterval(renderNext, 1000);
    }
  }

  const banner = document.getElementById("reminder-banner");
  if (banner) {
    const verified = cfg.verification.status;
    const demo = S.isDemo();
    const lead = S.activeLead();
    if (demo) banner.textContent = "DEMO ONLY reminder: check schedule.";
    else if (verified) banner.textContent = "Reminder: dispose " + lead + " minutes before collection.";
    else banner.textContent = "Reminder: confirm local collection times with your community office.";
  }

  const preview = document.getElementById("schedule-preview");
  if (preview) {
    const sched = S.activeSchedule();
    if (!sched) preview.textContent = "Schedule not yet verified.";
    else preview.textContent = S.collectionTypes(sched).map((t) => t + ": " + sched[t].days.join(", ") + " " + sched[t].time).join(" | ") + (S.isDemo() ? " (DEMO ONLY)" : "");
  }
})();
EOF
Write-File -Path "C:\Users\CL2-Client\Desktop\basura-alert\js\main.js"