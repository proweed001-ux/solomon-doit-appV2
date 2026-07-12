(()=>{
'use strict';
const SESSION_KEY='doit-admin-session-v1';
let readyResolve;
const ready=new Promise(resolve=>{readyResolve=resolve});
const read=()=>{try{return JSON.parse(sessionStorage.getItem(SESSION_KEY)||'null')}catch{return null}};
const basic=s=>s&&s.id&&s.password?'Basic '+btoa(unescape(encodeURIComponent(String(s.id).trim().toUpperCase()+':'+String(s.password)))):'';
const headers=()=>{const h=basic(read());return h?{Authorization:h}:{}};
async function verify(session=read()){
  if(!session?.id||!session?.password)return null;
  const response=await fetch('/api/admin-storage?action=session',{headers:{Authorization:basic(session)},cache:'no-store'});
  if(!response.ok)return null;
  const result=await response.json();
  return result?.ok?result:null;
}
async function login(id,password){
  const session={id:String(id||'').trim().toUpperCase(),password:String(password||'')};
  const result=await verify(session);
  if(!result)return null;
  sessionStorage.setItem(SESSION_KEY,JSON.stringify(session));
  return result;
}
function logout(){sessionStorage.removeItem(SESSION_KEY);location.replace('/admin-login.html')}
async function provisionCloud(){
  const response=await fetch('/promo-live.html',{cache:'no-store'});
  if(!response.ok)throw Error('public_config_unavailable');
  const source=await response.text();
  const key=source.match(/const\s+KEY\s*=\s*['"]([^'"]+)['"]/i)?.[1]||'';
  if(!(/^sb_publishable_[A-Za-z0-9_-]{20,}$/.test(key)||/^eyJ[A-Za-z0-9_-]+\./.test(key)))throw Error('public_anon_key_unavailable');
  window.__ADMIN_SUPABASE_KEY__=key;
  const apply=()=>{
    const url=document.querySelector('#sbUrl'),input=document.querySelector('#sbKey');
    if(url)url.value='https://saodmeoilixfdqentofp.supabase.co';
    if(input)input.value=key;
    const status=document.querySelector('#cloudStatus');
    if(status)status.textContent='ตั้งค่า Cloud สำหรับ session นี้แล้ว';
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  return key;
}
async function protect(){
  try{
    const session=await verify();
    if(!session){sessionStorage.removeItem(SESSION_KEY);location.replace('/admin-login.html');return}
    await new Promise(resolve=>document.readyState==='loading'?document.addEventListener('DOMContentLoaded',resolve,{once:true}):resolve());
    await provisionCloud();
    document.documentElement.classList.remove('admin-auth-pending');
    const button=document.querySelector('#adminLogout');if(button)button.onclick=logout;
    readyResolve({ok:true,user:session.user});
  }catch{
    sessionStorage.removeItem(SESSION_KEY);
    location.replace('/admin-login.html?error=config');
  }
}
window.AdminAuth={headers,login,logout,protect,provisionCloud,read,ready,verify};
if(document.documentElement.hasAttribute('data-admin-protected'))protect();
})();
