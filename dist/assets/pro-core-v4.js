(()=>{'use strict';
const CORE_URL='https://cdn.jsdelivr.net/gh/proweed001-ux/solomon-doit-appV2@5ab766454e174c517cff76a60e7ce0b2d2e43353/dist/assets/pro-core-v4.js';
function patchTeamName(){try{document.querySelectorAll('.devInfo b').forEach(b=>{if((b.textContent||'').trim()==='ฐากูร อุปมัย')b.textContent='นาย ฐากูร อุปมัย'});const img=document.getElementById('teamThakoonPro');if(img)img.alt='นาย ฐากูร อุปมัย'}catch{}}
function openTeam(){try{patchTeamName();if(typeof window.openDevTeamModal==='function'){window.openDevTeamModal();setTimeout(patchTeamName,50);return true}}catch{}return false}
function autoTeam(){let tries=0;const tick=()=>{tries++;patchTeamName();if(openTeam()||tries>30)return;setTimeout(tick,150)};tick()}
function loadCore(){const s=document.createElement('script');s.src=CORE_URL;s.async=false;s.onload=()=>setTimeout(autoTeam,350);s.onerror=()=>{console.error('[AYA] load pinned pro core failed:',CORE_URL);setTimeout(autoTeam,350)};document.head.appendChild(s)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',loadCore);else loadCore();
})();