(()=>{'use strict';
function patch(){
  document.title='AYA By.พี่ฐาสั่งลุยย';
  const t=document.querySelector('.topbar .title');
  if(!t)return false;
  let st=document.getElementById('ayaSeaWaveTitleCss');
  if(!st){
    st=document.createElement('style');
    st.id='ayaSeaWaveTitleCss';
    st.textContent=`
      @keyframes ayaSeaWaveMove{
        0%{background-position:0% 52%;transform:translateY(0) skewX(-2deg) scale(1);filter:drop-shadow(0 3px 0 #002b36) drop-shadow(0 0 7px #00eaff)}
        12%{background-position:16% 46%;transform:translateY(-2px) skewX(1deg) scale(1.012);filter:drop-shadow(0 3px 0 #002b36) drop-shadow(0 0 10px #30f7ff)}
        25%{background-position:32% 60%;transform:translateY(2px) skewX(2deg) scale(1.018);filter:drop-shadow(0 3px 0 #002b36) drop-shadow(0 0 12px #40ffdc)}
        38%{background-position:50% 42%;transform:translateY(-3px) skewX(-1deg) scale(1.014);filter:drop-shadow(0 3px 0 #002b36) drop-shadow(0 0 13px #7dd3fc)}
        50%{background-position:66% 58%;transform:translateY(2px) skewX(1.5deg) scale(1.02);filter:drop-shadow(0 3px 0 #002b36) drop-shadow(0 0 14px #22d3ee)}
        63%{background-position:82% 44%;transform:translateY(-2px) skewX(-1.5deg) scale(1.016);filter:drop-shadow(0 3px 0 #002b36) drop-shadow(0 0 13px #a7f3d0)}
        75%{background-position:100% 62%;transform:translateY(3px) skewX(2deg) scale(1.012);filter:drop-shadow(0 3px 0 #002b36) drop-shadow(0 0 11px #67e8f9)}
        88%{background-position:56% 48%;transform:translateY(-1px) skewX(-2deg) scale(1.018);filter:drop-shadow(0 3px 0 #002b36) drop-shadow(0 0 10px #38bdf8)}
        100%{background-position:0% 52%;transform:translateY(0) skewX(-2deg) scale(1);filter:drop-shadow(0 3px 0 #002b36) drop-shadow(0 0 7px #00eaff)}
      }
      @keyframes ayaWaveSheen{
        0%{background-position:0% 50%}
        50%{background-position:100% 50%}
        100%{background-position:0% 50%}
      }
      .ayaBrandTitle{
        position:relative!important;
        display:inline-block!important;
        font-family:"Arial Black",Impact,system-ui,sans-serif!important;
        font-size:22px!important;
        font-weight:1000!important;
        letter-spacing:.35px!important;
        line-height:1.05!important;
        color:#fff!important;
        -webkit-text-fill-color:transparent!important;
        background:
          radial-gradient(circle at 20% 30%,#ffffff 0 7%,transparent 13%),
          linear-gradient(100deg,#e0ffff 0%,#00e5ff 14%,#00ffa6 27%,#0ea5e9 41%,#2563eb 55%,#22d3ee 69%,#a7f3d0 82%,#ffffff 100%)!important;
        background-size:260% 260%,420% 420%!important;
        -webkit-background-clip:text!important;
        background-clip:text!important;
        -webkit-text-stroke:.85px rgba(0,25,44,.72)!important;
        text-shadow:0 2px 0 rgba(0,24,38,.9),0 5px 14px rgba(0,229,255,.55),0 0 22px rgba(45,212,191,.35)!important;
        animation:ayaSeaWaveMove 3.8s ease-in-out infinite,ayaWaveSheen 5.4s linear infinite!important;
        white-space:nowrap!important;
        transform-origin:center!important;
      }
      .ayaBrandTitle::after{
        content:'';
        position:absolute;
        left:2%;right:2%;bottom:-5px;height:4px;
        border-radius:999px;
        background:linear-gradient(90deg,transparent,#67e8f9,#fff,#22d3ee,transparent);
        opacity:.85;
        filter:blur(.3px) drop-shadow(0 0 7px #22d3ee);
        animation:ayaWaveSheen 3.8s linear infinite;
      }
      .topbar{overflow:hidden!important;background:linear-gradient(90deg,#022c22,#075985,#064e3b)!important}
      @media(max-width:720px){.ayaBrandTitle{font-size:16.8px!important;letter-spacing:.05px!important;-webkit-text-stroke:.6px rgba(0,25,44,.8)!important}.ayaBrandTitle::after{bottom:-4px;height:3px}}
    `;
    document.head.appendChild(st);
  }
  t.textContent='AYA By.พี่ฐาสั่งลุยย';
  t.classList.add('ayaBrandTitle');
  return true;
}
function boot(){if(!patch())setTimeout(boot,250)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();