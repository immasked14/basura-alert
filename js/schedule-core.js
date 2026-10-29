(function () {
  const cfg = window.BASURA_CONFIG || {};
  const DAY_INDEX = { Sunday:0, Monday:1, Tuesday:2, Wednesday:3, Thursday:4, Friday:5, Saturday:6 };
  const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

  function isDemo() { return new URLSearchParams(location.search).get('demo') === '1'; }

  function activeSchedule() {
    if (isDemo()) return cfg.demo && cfg.demo.schedule ? cfg.demo.schedule : null;
    if (cfg.verification && cfg.verification.status) return cfg.schedule;
    return null;
  }

  function activeLead() {
    if (isDemo()) return (cfg.demo && cfg.demo.leadMinutes) || 60;
    return (cfg.reminder && cfg.reminder.leadMinutes) || 60;
  }

  function collectionTypes(schedule) {
    if (!schedule) return [];
    return Object.keys(schedule).filter((k) => schedule[k] && Array.isArray(schedule[k].days) && schedule[k].days.length && schedule[k].time);
  }

  function parseTime(t) { const [hh, mm] = (t || '').split(':').map(Number); return { h: hh || 0, m: mm || 0 }; }

  function nextCollection(schedule, from) {
    if (!schedule) return null;
    const now = from ? new Date(from) : new Date();
    let best = null;
    collectionTypes(schedule).forEach((type) => {
      const d = schedule[type];
      const { h, m } = parseTime(d.time);
      d.days.forEach((dayName) => {
        const targetDay = DAY_INDEX[dayName];
        if (targetDay === undefined) return;
        const candidate = new Date(now);
        const diff = (targetDay - now.getDay() + 7) % 7;
        candidate.setDate(now.getDate() + diff);
        candidate.setHours(h, m, 0, 0);
        if (candidate <= now) candidate.setDate(candidate.getDate() + 7);
        if (!best || candidate < best.date) best = { date: candidate, type };
      });
    });
    return best;
  }

  function formatCountdown(ms) {
    if (ms < 0) ms = 0;
    const d = Math.floor(ms / 86400000);
    const h = Math.floor((ms % 86400000) / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    return { d, h, m, s };
  }

  function startCountdown(containerId, opts) {
    const el = document.getElementById(containerId);
    if (!el) return null;
    let interval = null;
    function render() {
      const sched = activeSchedule();
      if (!sched) {
        el.textContent = 'Schedule to be confirmed.';
        if (interval) { clearInterval(interval); interval = null; }
        return;
      }
      const n = nextCollection(sched);
      if (!n) { el.textContent = 'Schedule to be confirmed.'; return; }
      const diff = n.date - new Date();
      const { d, h, m, s } = formatCountdown(diff);
      const demo = isDemo() ? ' (DEMO ONLY)' : '';
      el.textContent = d + 'd ' + h + 'h ' + m + 'm ' + s + 's until ' + n.type + demo;
    }
    render();
    interval = setInterval(render, 1000);
    return { stop: function() { if (interval) { clearInterval(interval); interval = null; } } };
  }

  function weekStart(date) {
    const d = new Date(date);
    d.setHours(0,0,0,0);
    const day = d.getDay();
    const diff = (day === 0) ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d;
  }

  function renderCalendar(containerId, weekOffset) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const sched = activeSchedule();
    const collectionDays = new Set();
    if (sched) collectionTypes(sched).forEach(function(t) { if (sched[t].days) sched[t].days.forEach(function(d) { collectionDays.add(d); }); });
    if (cfg.mwfSchedule && Array.isArray(cfg.mwfSchedule.days)) {
      cfg.mwfSchedule.days.forEach(function(d) { collectionDays.add(d); });
    }
    const base = weekStart(new Date());
    base.setDate(base.getDate() + (weekOffset || 0) * 7);
    const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    let html = '<div class=\"cal-header\" style=\"margin-bottom:1rem;font-weight:700;color:var(--forest-green);font-size:1.1rem;\">' + monthNames[base.getMonth()] + ' ' + base.getFullYear() + '</div>';
    html += '<div class=\"cal-grid\">';
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const isToday = d.toDateString() === new Date().toDateString();
      const dayName = days[i];
      const isColl = collectionDays.has(dayName);
      let cls = 'cal-day';
      if (isToday) cls += ' today';
      if (isColl) cls += ' collection';
      html += '<div class=\"' + cls + '\"><div class=\"cal-name\">' + dayName + '</div><div class=\"cal-date\">' + d.getDate() + '</div>' + (isColl ? '<div class=\"cal-mark\">Collection 5:00 PM–7:00 PM</div>' : '') + '</div>';
    }
    html += '</div>';
    if (!sched && !(cfg.mwfSchedule && cfg.mwfSchedule.days && cfg.mwfSchedule.days.length)) html += '<p class=\"notice\">Schedule to be confirmed. The garbage disposal schedule is awaiting verification. Please check with your local community office.</p>';
    el.innerHTML = html;
  }

  window.BasuraSchedule = {
    DAY_INDEX: DAY_INDEX, DAY_NAMES: DAY_NAMES, isDemo: isDemo, activeSchedule: activeSchedule, activeLead: activeLead,
    collectionTypes: collectionTypes, nextCollection: nextCollection, formatCountdown: formatCountdown, startCountdown: startCountdown, weekStart: weekStart, renderCalendar: renderCalendar
  };
})();
