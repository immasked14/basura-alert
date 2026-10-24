(function () {
  const cfg = window.BASURA_CONFIG;
  const S = window.BasuraSchedule;
  let weekOffset = 0;

  const notice = document.getElementById("verify-notice");
  if (notice && !cfg.verification.status && !S.isDemo()) {
    notice.textContent = "Schedule to be confirmed. The garbage disposal schedule is awaiting verification. Please check with your local community office.";
  }
  const vs = document.getElementById("verify-status");
  if (vs) vs.textContent = (cfg.verification.status || S.isDemo()) ? "Verified" : "Not verified";
  const src = document.getElementById("source-info");
  if (src) {
    const parts = [];
    if (cfg.verification.source) parts.push("Source: " + cfg.verification.source);
    if (cfg.verification.verifiedOn) parts.push("Verified on: " + cfg.verification.verifiedOn);
    src.textContent = parts.join(" | ");
  }

  const cdEl = document.getElementById("countdown");
  if (cdEl) S.startCountdown(cdEl.id);

  const nextEl = document.getElementById("next-collection-date");
  if (nextEl) {
    function renderNext() {
      const sched = S.activeSchedule();
      if (!sched) { nextEl.textContent = "Schedule to be confirmed."; return; }
      const n = S.nextCollection(sched);
      if (!n) { nextEl.textContent = "Schedule to be confirmed."; return; }
      const demo = S.isDemo() ? " (DEMO ONLY)" : "";
      nextEl.textContent = `${n.type} on ${n.date.toLocaleString()}${demo}`;
    }
    renderNext();
    setInterval(renderNext, 1000);
  }

  const cal = document.getElementById("calendar");
  function redrawCal() { S.renderCalendar("calendar", weekOffset); }
  redrawCal();
  const prev = document.getElementById("prev-week");
  const next = document.getElementById("next-week");
  const today = document.getElementById("today-week");
  if (prev) prev.addEventListener("click", () => { weekOffset--; redrawCal(); });
  if (next) next.addEventListener("click", () => { weekOffset++; redrawCal(); });
  if (today) today.addEventListener("click", () => { weekOffset = 0; redrawCal(); });

  // Reminder prefs
  const select = document.getElementById("reminder-lead");
  const saved = localStorage.getItem("basura_reminder_lead");
  if (select) {
    if (saved) select.value = saved;
    select.addEventListener("change", () => {
      localStorage.setItem("basura_reminder_lead", select.value);
      const status = document.getElementById("reminder-status");
      if (status) status.textContent = "Saved: " + select.options[select.selectedIndex].text;
    });
  }
  const status = document.getElementById("reminder-status");
  if (status) {
    const v = (saved || cfg.reminder.leadMinutes || 60);
    const opt = select ? select.querySelector(`option[value="${v}"]`) : null;
    status.textContent = "Current preference: " + (opt ? opt.text : v + " minutes before");
  }

  // Segregation guide
  const guide = [
    { name: "Fruit and vegetable scraps", cat: "biodegradable", info: "Food waste", advice: "Compost if possible.", caution: "" },
    { name: "Food leftovers", cat: "biodegradable", info: "Organic waste", advice: "Wrap securely.", caution: "" },
    { name: "Clean paper and cardboard", cat: "recyclable", info: "Dry recyclables", advice: "Keep dry.", caution: "" },
    { name: "Plastic bottles", cat: "recyclable", info: "PET/HDPE", advice: "Rinse and flatten.", caution: "" },
    { name: "Metal cans", cat: "recyclable", info: "Aluminum/steel", advice: "Rinse.", caution: "" },
    { name: "Plastic packaging", cat: "residual", info: "Mixed plastics", advice: "Dispose as residual.", caution: "Check local rules." },
    { name: "Used tissues", cat: "residual", info: "Contaminated paper", advice: "Dispose as residual.", caution: "" },
    { name: "Batteries", cat: "special", info: "Hazardous", advice: "Take to proper facility.", caution: "Do not put in household waste." },
    { name: "Electronic waste", cat: "special", info: "E-waste", advice: "Recycle via e-waste centers.", caution: "Do not put in household waste." },
    { name: "Expired household chemicals", cat: "special", info: "Chemicals", advice: "Follow local disposal instructions.", caution: "Do not put in household waste." },
  ];
  const list = document.getElementById("guide-list");
  const search = document.getElementById("guide-search");
  const filter = document.getElementById("guide-filter");
  let clearBtn = document.getElementById("guide-clear");
  if (!clearBtn && search) {
    clearBtn = document.createElement("button");
    clearBtn.id = "guide-clear"; clearBtn.className = "btn secondary"; clearBtn.textContent = "Clear filters";
    search.parentNode.insertBefore(clearBtn, search.nextSibling);
  }
  function render() {
    if (!list) return;
    const q = (search.value || "").toLowerCase();
    const f = filter.value;
    list.innerHTML = "";
    const matches = guide.filter((g) => (f === "all" || g.cat === f) && (g.name + " " + g.info).toLowerCase().includes(q));
    const countEl = document.getElementById("guide-count");
    if (countEl) countEl.textContent = matches.length + " result(s)";
    if (!matches.length) { const li = document.createElement("li"); li.textContent = "No matching items found."; list.appendChild(li); return; }
    matches.forEach((g) => {
      const li = document.createElement("li");
      const strong = document.createElement("strong"); strong.textContent = g.name + " — " + g.cat; li.appendChild(strong);
      const p = document.createElement("p"); p.textContent = g.info + ". " + g.advice + (g.caution ? " Caution: " + g.caution : ""); li.appendChild(p);
      list.appendChild(li);
    });
  }
  if (search) search.addEventListener("input", render);
  if (filter) filter.addEventListener("change", render);
  if (clearBtn) clearBtn.addEventListener("click", () => { if (search) search.value = ""; if (filter) filter.value = "all"; render(); });
  render();
})();
EOF
Write-File -Path "C:\Users\CL2-Client\Desktop\basura-alert\js\schedule.js"