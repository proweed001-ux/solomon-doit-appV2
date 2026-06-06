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
        0%{transform:translateY(0) skewX(-2deg) scale(1);filter:drop-shadow(0 3px 0 #003344) drop-shadow(0 0 7px rgba(255,255,255,.85))}
        12%{transform:translateY(-2px) skewX(1deg) scale(1.012);filter:drop-shadow(0 3px 0 #003344) drop-shadow(0 0 10px rgba(255,255,255,.95))}
        25%{transform:translateY(2px) skewX(2deg) scale(1.018);filter:drop-shadow(0 3px 0 #003344) drop-shadow(0 0 12px rgba(255,255,255,.9))}
        38%{transform:translateY(-3px) skewX(-1deg) scale(1.014);filter:drop-shadow(0 3px 0 #003344) drop-shadow(0 0 13px rgba(255,255,255,1))}
        50%{transform:translateY(2px) skewX(1.5deg) scale(1.02);filter:drop-shadow(0 3px 0 #003344) drop-shadow(0 0 14px rgba(255,255,255,.9))}
        63%{transform:translateY(-2px) skewX(-1.5deg) scale(1.016);filter:drop-shadow(0 3px 0 #003344) drop-shadow(0 0 13px rgba(255,255,255,.95))}
        75%{transform:translateY(3px) skewX(2deg) scale(1.012);filter:drop-shadow(0 3px 0 #003344) drop-shadow(0 0 11px rgba(255,255,255,.88))}
        88%{transform:translateY(-1px) skewX(-2deg) scale(1.018);filter:drop-shadow(0 3px 0 #003344) drop-shadow(0 0 10px rgba(255,255,255,.95))}
        100%{transform:translateY(0) skewX(-2deg) scale(1);filter:drop-shadow(0 3px 0 #003344) drop-shadow(0 0 7px rgba(255,255,255,.85))}
      }
      @keyframes ayaWhiteShine{
        0%{opacity:.45;left:-35%}
        50%{opacity:.95;left:45%}
        100%{opacity:.45;left:115%}
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
        -webkit-text-fill-color:#fff!important;
        background:none!important;
        -webkit-background-clip:initial!important;
        background-clip:initial!important;
        -webkit-text-stroke:.85px rgba(0,22,40,.86)!important;
        text-shadow:0 2px 0 rgba(0,24,38,.95),0 0 12px rgba(255,255,255,.85),0 0 22px rgba(125,211,252,.45)!important;
        animation:ayaSeaWaveMove 3.8s ease-in-out infinite!important;
        white-space:nowrap!important;
        transform-origin:center!important;
        overflow:hidden!important;
      }
      .ayaBrandTitle::before{
        content:'';
        position:absolute;
        top:-25%;bottom:-25%;width:28%;left:-35%;
        background:linear-gradient(90deg,transparent,rgba(255,255,255,.95),transparent);
        transform:skewX(-18deg);
        mix-blend-mode:screen;
        animation:ayaWhiteShine 4.4s ease-in-out infinite;
        pointer-events:none;
      }
      .ayaBrandTitle::after{
        content:'';
        position:absolute;
        left:2%;right:2%;bottom:-5px;height:4px;
        border-radius:999px;
        background:linear-gradient(90deg,transparent,#ffffff,#bae6fd,#ffffff,transparent);
        opacity:.9;
        filter:blur(.3px) drop-shadow(0 0 7px #ffffff);
        animation:ayaSeaWaveMove 3.8s ease-in-out infinite;
      }
      .topbar{overflow:hidden!important;background:linear-gradient(90deg,#022c22,#075985,#064e3b)!important}
      @media(max-width:720px){.ayaBrandTitle{font-size:16.8px!important;letter-spacing:.05px!important;-webkit-text-stroke:.6px rgba(0,25,44,.9)!important}.ayaBrandTitle::after{bottom:-4px;height:3px}}
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