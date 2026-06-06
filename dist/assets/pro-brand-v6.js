(()=>{'use strict';
function patch(){
  document.title='AYA By.พี่ฐาสั่งลุยย';
  const t=document.querySelector('.topbar .title');
  if(!t)return false;
  let st=document.getElementById('ayaBrandV6Css');
  if(!st){
    st=document.createElement('style');
    st.id='ayaBrandV6Css';
    st.textContent=`
      @keyframes ayaRainbowRun{
        0%{background-position:0% 50%;filter:drop-shadow(0 0 4px #ff0080) drop-shadow(0 0 9px #00e5ff)}
        12%{background-position:18% 40%;filter:drop-shadow(0 0 5px #00ff66) drop-shadow(0 0 11px #ffcc00)}
        25%{background-position:36% 60%;filter:drop-shadow(0 0 5px #00b7ff) drop-shadow(0 0 12px #ff2bd6)}
        38%{background-position:54% 45%;filter:drop-shadow(0 0 6px #ff3b30) drop-shadow(0 0 10px #00ffcc)}
        50%{background-position:72% 55%;filter:drop-shadow(0 0 6px #ffd60a) drop-shadow(0 0 12px #7c3aed)}
        63%{background-position:90% 40%;filter:drop-shadow(0 0 5px #64ff00) drop-shadow(0 0 12px #ff006e)}
        75%{background-position:72% 60%;filter:drop-shadow(0 0 5px #00f5ff) drop-shadow(0 0 11px #ff9f0a)}
        88%{background-position:36% 50%;filter:drop-shadow(0 0 5px #f000ff) drop-shadow(0 0 10px #00ff88)}
        100%{background-position:0% 50%;filter:drop-shadow(0 0 4px #ff0080) drop-shadow(0 0 9px #00e5ff)}
      }
      @keyframes ayaPulseSoft{
        0%,100%{transform:translateY(0) scale(1)}
        50%{transform:translateY(-1px) scale(1.018)}
      }
      .ayaBrandTitle{
        font-family:Impact,"Arial Black",system-ui,sans-serif!important;
        font-size:21px!important;
        font-weight:950!important;
        letter-spacing:.45px!important;
        line-height:1.08!important;
        color:#fff!important;
        -webkit-text-fill-color:transparent!important;
        background:linear-gradient(90deg,#ff004c,#ffea00,#00ff73,#00e5ff,#0066ff,#b000ff,#ff00a8,#ff5e00,#ffffff,#00ffcc,#ff004c)!important;
        background-size:520% 520%!important;
        -webkit-background-clip:text!important;
        background-clip:text!important;
        text-shadow:0 2px 0 rgba(0,0,0,.42),0 0 18px rgba(255,255,255,.42)!important;
        -webkit-text-stroke:.65px rgba(0,0,0,.45);
        animation:ayaRainbowRun 4.2s linear infinite,ayaPulseSoft 2.4s ease-in-out infinite!important;
        white-space:nowrap!important;
      }
      .topbar{overflow:hidden!important;background:linear-gradient(90deg,#064e3b,#047857,#065f46)!important}
      @media(max-width:720px){.ayaBrandTitle{font-size:16.5px!important;letter-spacing:.1px!important;-webkit-text-stroke:.45px rgba(0,0,0,.5)}}
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