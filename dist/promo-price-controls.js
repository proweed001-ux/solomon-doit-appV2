(() => {
  const PRICE_RPC=SUPA+'/rest/v1/rpc/save_promo_group_price';
  const UNITS=['ชิ้น','ขวด','แพ็ค','กล่อง','ลัง','ซอง','ด้าม','ถุง','ชุด'];
  const drafts=new Map();
  const priceKey=v=>{if(v===''||v==null)return'';const n=Number(v);return Number.isFinite(n)?n.toFixed(2):String(v)};
  const updateSummary=()=>{const priced=groups.filter(g=>Number(g.base_unit_price)>0).length,dirty=drafts.size;$('summary').textContent=`${groups.length} กลุ่ม | มีราคา ${priced} | ขาด ${groups.length-priced}${dirty?` | ยังไม่บันทึก ${dirty}`:''}`};
  const setState=(div,text,kind='')=>{const s=div.querySelector('.saveState');if(s){s.textContent=text;s.className='saveState '+kind}};
  const unitOptions=selected=>UNITS.map(u=>`<option value="${u}"${u===selected?' selected':''}>${u}</option>`).join('');
  function markDirty(div){
    const gid=div.dataset.groupId,g=groups.find(x=>x.group_id===gid)||{},p=div.querySelector('.price').value.trim(),u=div.querySelector('.unit').value;
    const dirty=priceKey(p)!==priceKey(g.base_unit_price??'')||u!==(g.unit_label||'ชิ้น');
    div.dataset.dirty=dirty?'1':'0';div.classList.toggle('dirty',dirty);div.querySelector('.saveBtn').disabled=!dirty;
    if(dirty){drafts.set(gid,{price:p,unit:u});setState(div,'แก้แล้ว แต่ยังไม่ได้บันทึก','warn')}
    else{drafts.delete(gid);setState(div,Number(g.base_unit_price)>0?'บันทึกแล้ว':'ยังไม่มีราคา',Number(g.base_unit_price)>0?'ok':'')}
    updateSummary();
  }
  function passPatched(g){const f=$('filter').value,q=$('search').value.trim().toLowerCase(),priced=Number(g.base_unit_price)>0,isNew=g.status==='conservative_new_group',cs=groupCards[g.group_id]||[];if(f==='missing'&&priced)return false;if(f==='priced'&&!priced)return false;if(f==='new'&&!isNew)return false;return!q||[g.group_id,g.canonical_name,g.classes,...cs.map(c=>c.card_id+' '+c.class_id+' '+c.promo_title)].join(' ').toLowerCase().includes(q)}
  renderGroups=function(){
    const box=$('list'),rows=groups.filter(passPatched);box.innerHTML='';
    for(const g of rows){
      const cs=groupCards[g.group_id]||[],isPriced=Number(g.base_unit_price)>0,isNew=g.status==='conservative_new_group',draft=drafts.get(g.group_id),unit=draft?.unit??g.unit_label??'ชิ้น',price=draft?.price??g.base_unit_price??'',div=document.createElement('div');
      div.className='item '+(isPriced?'priced ':'')+(isNew?'new ':'')+(draft?'dirty':'');div.dataset.groupId=g.group_id;div.dataset.updatedAt=g.price_updated_at||'';div.dataset.dirty=draft?'1':'0';
      div.innerHTML=`<div class="sample"><div>${g.anchor_image_url?`<img src="${esc(g.anchor_image_url)}" loading="lazy">`:'<div class="empty">ไม่มีรูป</div>'}</div><div><span class="tag blue">${esc(g.group_id)}</span><span class="tag ${isNew?'orange':'green'}">${isNew?'แยกกลุ่มใหม่':'จับกลุ่มอัตโนมัติ'}</span><h3>${esc(g.canonical_name)}</h3><div class="meta">คลาส: ${esc(g.classes||[...new Set(cs.map(c=>c.class_id))].join(', '))} | ${g.card_count||cs.length} การ์ด</div><div class="priceGrid"><div><label>ราคาฐานต่อหน่วย</label><input class="price" type="number" min="0.01" max="1000000" step="0.01" inputmode="decimal" value="${esc(price)}"></div><div><label>หน่วย</label><select class="unit">${unitOptions(unit)}</select></div></div><div class="priceActions"><button class="saveBtn" type="button" ${draft?'':'disabled'}>บันทึกราคากลุ่มนี้</button><div class="saveState ${draft?'warn':isPriced?'ok':''}">${draft?'แก้แล้ว แต่ยังไม่ได้บันทึก':isPriced?'บันทึกแล้ว':'ยังไม่มีราคา'}</div></div></div></div>`;
      div.querySelector('.price').oninput=()=>markDirty(div);div.querySelector('.unit').onchange=()=>markDirty(div);div.querySelector('.saveBtn').onclick=()=>saveOne(div);box.appendChild(div);
    }
    if(!rows.length)box.innerHTML='<div class="empty">ไม่พบกลุ่มตามตัวกรอง</div>';updateSummary();
  };
  function errorText(data,status){const c=String(data?.message||data?.error||'');if(c.includes('price_conflict'))return'ราคากลุ่มนี้ถูกแก้จากเครื่องอื่นแล้ว กรุณารีเฟรชหน้า';if(c.includes('invalid_admin_key')||status===401||status===403)return'รหัสไม่ถูกต้องหรือถูกปิดใช้งาน';if(c.includes('group_not_found'))return'ไม่พบกลุ่มสินค้านี้ในเดือนที่เลือก';if(c.includes('invalid_price'))return'ราคาต้องมากกว่า 0 และไม่เกิน 1,000,000';if(c.includes('invalid_unit'))return'หน่วยสินค้าไม่ถูกต้อง';return c||`บันทึกไม่สำเร็จ (${status})`}
  saveOne=async function(div){
    const gid=div.dataset.groupId,btn=div.querySelector('.saveBtn'),price=div.querySelector('.price'),unit=div.querySelector('.unit');
    if(!$('key').value.trim()){setState(div,'ใส่รหัสอัปโหลดก่อน','bad');$('key').focus();return}
    const raw=Number(price.value);if(!Number.isFinite(raw)||raw<=0||raw>1000000){setState(div,'ราคาต้องมากกว่า 0 และไม่เกิน 1,000,000','bad');price.focus();return}
    const rounded=Math.round(raw*100)/100;price.value=rounded.toFixed(2);btn.disabled=true;btn.textContent='กำลังบันทึก...';setState(div,'กำลังตรวจและบันทึก');
    try{
      const headers={apikey:PUB,'Content-Type':'application/json'};headers.Authorization='Bearer '+PUB;
      const r=await fetch(PRICE_RPC,{method:'POST',headers,body:JSON.stringify({p_promo_month_id:month(),p_group_id:gid,p_base_unit_price:rounded,p_unit_label:unit.value,p_auth_hash:await hashKey(),p_expected_updated_at:div.dataset.updatedAt||null})}),data=await r.json().catch(()=>({}));
      if(!r.ok)throw Error(errorText(data,r.status));const row=Array.isArray(data)?data[0]:data;if(!row?.group_id)throw Error('เซิร์ฟเวอร์ไม่ส่งผลบันทึกกลับมา');
      const g=groups.find(x=>x.group_id===gid);if(g){g.base_unit_price=Number(row.base_unit_price);g.unit_label=row.unit_label;g.price_updated_at=row.updated_at}drafts.delete(gid);div.dataset.updatedAt=row.updated_at||'';div.dataset.dirty='0';div.classList.remove('dirty');div.classList.add('priced');btn.disabled=true;btn.textContent='บันทึกราคากลุ่มนี้';setState(div,`บันทึกสำเร็จ ใช้กับ ${Number(row.affected_cards||0)} การ์ด`,'ok');updateSummary();
    }catch(e){btn.disabled=false;btn.textContent='ลองบันทึกอีกครั้ง';setState(div,e.message||'บันทึกไม่สำเร็จ','bad')}
  };
  queueSave=markDirty;
  const style=document.createElement('style');style.textContent='.item.dirty{border-color:#f59e0b!important;background:#fffbeb}.priceActions{display:flex;gap:8px;align-items:center;margin-top:10px}.saveBtn{height:42px;border:0;border-radius:11px;background:#2563eb;color:#fff;padding:0 14px;font-weight:950;white-space:nowrap}.saveBtn:disabled{background:#94a3b8;opacity:.7}.saveState{font-size:12px;font-weight:900;color:#64748b;line-height:1.35}.saveState.ok{color:#15803d}.saveState.bad{color:#b91c1c}.saveState.warn{color:#a16207}';document.head.appendChild(style);
  const meta=document.querySelector('#prices .groupHead .meta');if(meta)meta.textContent='1 กลุ่มใช้ราคาเดียวกันทุกการ์ด กรอกเสร็จแล้วกด “บันทึกราคากลุ่มนี้”';
  $('search').oninput=renderGroups;$('filter').onchange=renderGroups;
  window.addEventListener('beforeunload',e=>{if(drafts.size){e.preventDefault();e.returnValue=''}});
  renderGroups();
})();