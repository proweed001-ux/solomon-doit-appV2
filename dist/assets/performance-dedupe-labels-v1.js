(()=>{'use strict';
const SEP=/\s*[·•]\s*/;
function cleanText(text){
  const raw=String(text||'').trim();
  if(!raw)return raw;
  const parts=raw.split(SEP).map(x=>x.trim()).filter(Boolean);
  if(parts.length<2)return raw;
  const first=parts[0];
  const out=[first];
  for(let i=1;i<parts.length;i++){
    if(parts[i]!==first && !out.includes(parts[i]))out.push(parts[i]);
  }
  return out.join(' · ');
}
function clean(root=document){
  const app=document.getElementById('app');
  if(!app)return;
  app.querySelectorAll('.rowHead b,.title').forEach(el=>{
    const next=cleanText(el.textContent);
    if(next && next!==el.textContent)el.textContent=next;
  });
}
const run=()=>clean();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run,{once:true});else run();
new MutationObserver(run).observe(document.getElementById('app')||document.body,{childList:true,subtree:true,characterData:true});
})();