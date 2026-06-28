(()=>{
  if(window.__PERF_COMPARE_SWIPE_V3__) return;
  window.__PERF_COMPARE_SWIPE_V3__=true;

  const order=['prev','same','avg3','pace'];
  const zone='.cmpModeSwipe,.cmpModeSwipe .row,.cmpModeSwipe .rowMain,.cmpModeSwipe .rowHead,.cmpModeSwipe .rowSub,.cmpSlider,.cmpCard';
  let sx=0,sy=0,active=false,swipedUntil=0;

  function isCompare(){
    const q=new URLSearchParams(location.search);
    return (q.get('mode')||'')==='compare' || location.search.includes('mode=compare');
  }
  function current(){
    return new URLSearchParams(location.search).get('cmp')||'prev';
  }
  function move(step){
    const now=current();
    const i=Math.max(0,order.indexOf(now));
    const next=order[Math.max(0,Math.min(order.length-1,i+step))];
    if(!next||next===now) return;
    const q=new URLSearchParams(location.search);
    q.set('mode','compare');
    if(next==='prev') q.delete('cmp'); else q.set('cmp',next);
    location.search=q.toString();
  }

  addEventListener('pointerdown',e=>{
    if(!isCompare()) return;
    if(!e.target.closest(zone)) return;
    sx=e.clientX; sy=e.clientY; active=true;
  },{capture:true,passive:true});

  addEventListener('pointerup',e=>{
    if(!active) return;
    active=false;
    const dx=e.clientX-sx, dy=e.clientY-sy;
    if(Math.abs(dx)>38 && Math.abs(dx)>Math.abs(dy)*1.1){
      swipedUntil=Date.now()+700;
      move(dx<0?1:-1);
    }
  },{capture:true,passive:true});

  addEventListener('click',e=>{
    if(Date.now()>swipedUntil) return;
    if(!e.target.closest(zone)) return;
    e.preventDefault();
    e.stopImmediatePropagation();
  },true);
})();
