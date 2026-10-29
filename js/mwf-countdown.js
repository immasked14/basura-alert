(function(){
  const TZ = 'Asia/Manila';
  const DAYS = [1,3,5];
  const START_H = 17, START_M = 0;
  const END_H = 19, END_M = 0;
  function getNextDow(c){ for(let i=1;i<=7;i++){ const d=(c+i)%7; if(DAYS.includes(d)) return d; } return c; }
  function formatCountdown(ms){ if(ms<0) ms=0; const d=Math.floor(ms/86400000), h=Math.floor((ms%86400000)/3600000), m=Math.floor((ms%3600000)/60000), s=Math.floor((ms%60000)/1000); return {d,h,m,s}; }
  function startMWFCountdown(elId){
    const el = document.getElementById(elId); if(!el) return;
    function update(){
      const now = new Date();
      const fmt = new Intl.DateTimeFormat('en-US',{timeZone:TZ, year:'numeric',month:'numeric',day:'numeric',hour:'numeric',minute:'numeric',second:'numeric',weekday:'long'});
      const parts={};
      for(const p of fmt.formatToParts(now)){ if(p.type!=='literal') parts[p.type]=p.value; }
      const dow = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].indexOf(parts.weekday);
      const y=parseInt(parts.year), mo=parseInt(parts.month)-1, da=parseInt(parts.day), h=parseInt(parts.hour);
      if(DAYS.includes(dow)){
        if(h>=START_H && h<END_H){ el.textContent='Collection is in progress (5:00 PM–7:00 PM)'; return; }
        else if(h<START_H){ const target=new Date(Date.UTC(y,mo,da,START_H-8,START_M,0)); const diff=target-now; const f=formatCountdown(diff); el.textContent=f.d+'d '+f.h+'h '+f.m+'m '+f.s+'s until 5:00 PM'; return; }
      }
      let daysAdd=0;
      if(DAYS.includes(dow)){ if(h>=START_H) daysAdd=(getNextDow(dow)-dow+7)%7||7; else daysAdd=0; } else { daysAdd=(getNextDow(dow)-dow+7)%7; }
      const target=new Date(Date.UTC(y,mo,da+daysAdd,START_H-8,START_M,0)); const diff=target-now; const f=formatCountdown(diff); el.textContent=f.d+'d '+f.h+'h '+f.m+'m '+f.s+'s until next collection (5:00 PM)';
    }
    update(); setInterval(update,1000);
  }
  window.BasuraMWF = { startMWFCountdown };
})();
