(()=>{'use strict';
function openTeam(){try{if(typeof window.openDevTeamModal==='function'){window.openDevTeamModal();return true}}catch{}return false}
function run(){let tries=0;const tick=()=>{tries++;if(openTeam()||tries>20)return;setTimeout(tick,150)};tick()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();