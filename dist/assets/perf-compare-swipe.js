(()=>{
  if(window.__PERF_COMPARE_SWIPE__) return;
  window.__PERF_COMPARE_SWIPE__=true;
  const order=['prev','same','avg3','pace'];
  function current(){return new URLSearchParams(location.search).get('cmp')||'prev'}
  function move(step){
    const q=new URLSearchParams(location.search);
    const i=Math.max(0,order.indexOf(current()));
    const n=order[Math.max(0,Math.min(order.length-1,i+step))];
    if(!n||n===current()) return;
    q.set('mode','compare');
    if(n==='prev') q.delete('cmp'); else q.set('cmp',n);
    location.search=q.toString();
  }
  let x=0,y=0,active=false;
  addEventListener('pointerdown',e=>{
    if(!e.target.closest('.cmpSwipe,.cmpSlider')) return;
    x=e.clientX;y=e.clientY;active=true;
  },{passive:true});
  addEventListener('pointerup',e=>{
    if(!active) return;
    active=false;
    const dx=e.clientX-x,dy=e.clientY-y;
    if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.4) move(dx<0?1:-1);
  },{passive:true});
})();
