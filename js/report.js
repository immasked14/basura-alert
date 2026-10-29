(function () {
  const form = document.getElementById("report-form");
  if (!form) return;
  const status = document.getElementById("report-status");
  const refno = document.getElementById("refno");
  const imgInput = document.getElementById("image");
  const preview = document.getElementById("preview");
  const removeImg = document.getElementById("remove-image");
  let imageData = "";

  function loadReports() {
    try {
      const raw = localStorage.getItem("basura-reports");
      const parsed = JSON.parse(raw || "[]");
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((r) => r && r.ref && r.category && r.location && r.date && r.description);
    } catch (e) {
      return [];
    }
  }
  function saveReports(list) {
    try { localStorage.setItem("basura-reports", JSON.stringify(list)); } catch (e) {}
  }

  if (imgInput) {
    imgInput.addEventListener("change", () => {
      const f = imgInput.files[0];
      if (!f) { preview.style.display = "none"; imageData = ""; return; }
      if (!/^image\/(jpeg|png|jpg|gif|webp)$/.test(f.type)) { status.textContent = "Image must be JPG/PNG/GIF/WebP."; status.className = "status error"; imgInput.value = ""; return; }
      if (f.size > 2 * 1024 * 1024) { status.textContent = "Image must be under 2MB."; status.className = "status error"; imgInput.value = ""; return; }
      const r = new FileReader();
      r.onload = () => { imageData = r.result; preview.src = imageData; preview.style.display = "block"; if (removeImg) removeImg.style.display = "inline-block"; };
      r.readAsDataURL(f);
    });
  }
  if (removeImg) {
    removeImg.addEventListener("click", () => { imageData = ""; imgInput.value = ""; preview.style.display = "none"; removeImg.style.display = "none"; });
  }

  function renderList() {
    const list = document.getElementById("rep-list");
    if (!list) return;
    const q = (document.getElementById("rep-search").value || "").toLowerCase();
    const f = document.getElementById("rep-filter").value;
    const sort = document.getElementById("rep-sort") ? document.getElementById("rep-sort").value : "newest";
    let data = loadReports();
    data = data.filter((d) => (f === "all" || d.category === f) && (d.ref + " " + d.location + " " + d.description).toLowerCase().includes(q));
    if (sort === "newest") data.sort((a, b) => new Date(b.created) - new Date(a.created));
    list.innerHTML = "";
    const countEl = document.getElementById("rep-count");
    if (countEl) countEl.textContent = data.length + " saved demo report(s)";
    if (!data.length) { const li = document.createElement("li"); li.textContent = "No reports found."; list.appendChild(li); return; }
    data.forEach((d) => {
      const li = document.createElement("li");
      const ref = document.createElement("strong"); ref.textContent = d.ref; li.appendChild(ref);
      const p = document.createElement("p"); p.textContent = d.category + " — " + d.location + " — observed " + d.date + " — submitted " + new Date(d.created).toLocaleString(); li.appendChild(p);
      const btn = document.createElement("button"); btn.className = "btn secondary"; btn.textContent = "Delete"; btn.addEventListener("click", () => {
        if (!confirm("Delete this demonstration report?")) return;
        const all = loadReports().filter((r) => r.ref !== d.ref);
        saveReports(all);
        renderList();
      });
      li.appendChild(btn);
      list.appendChild(li);
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const category = document.getElementById("category").value;
    const location = document.getElementById("location").value.trim();
    const date = document.getElementById("date").value;
    const description = document.getElementById("description").value.trim();
    if (!category) { status.textContent = "Category required."; status.className = "status error"; document.getElementById("category").focus(); return; }
    if (!location) { status.textContent = "Location required."; status.className = "status error"; document.getElementById("location").focus(); return; }
    if (!date) { status.textContent = "Date required."; status.className = "status error"; document.getElementById("date").focus(); return; }
    const d = new Date(date);
    if (isNaN(d.getTime())) { status.textContent = "Invalid date."; status.className = "status error"; return; }
    if (description.length < 10 || description.length > 1000) { status.textContent = "Description must be 10-1000 chars."; status.className = "status error"; document.getElementById("description").focus(); return; }
    const ref = "BA-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase();
    const entry = { ref, category, location, date, description, created: new Date().toISOString(), status: "Demo — locally saved" };
    const list = loadReports();
    list.push(entry);
    saveReports(list);
    form.reset();
    preview.style.display = "none"; imageData = ""; if (removeImg) removeImg.style.display = "none";
    status.textContent = "Demonstration report saved locally (not sent).";
    status.className = "status success";
    if (refno) { refno.style.display = "block"; refno.textContent = "Demonstration reference number: " + ref; }
    renderList();
  });

  const rs = document.getElementById("rep-search");
  const rf = document.getElementById("rep-filter");
  const rsort = document.getElementById("rep-sort");
  if (rs) rs.addEventListener("input", renderList);
  if (rf) rf.addEventListener("change", renderList);
  if (rsort) rsort.addEventListener("change", renderList);
  const clearAll = document.getElementById("clear-all");
  if (clearAll) clearAll.addEventListener("click", () => {
    if (!confirm("Clear all demonstration reports?")) return;
    try { localStorage.removeItem("basura-reports"); } catch (e) {}
    renderList();
  });
  renderList();
})();
