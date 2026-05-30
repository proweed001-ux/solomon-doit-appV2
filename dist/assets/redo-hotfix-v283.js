(()=>{'use strict';
// Field-test hotfix: pro-json-app-v265.js still evaluates `sshape ? null : snap()` inside doRedo().
// In a browser script, defining a global `var sshape = false` makes that legacy expression resolve to snap()
// instead of throwing ReferenceError. This avoids rewriting the large core file during field-test hardening.
try{
  if(typeof window.sshape==='undefined') window.sshape=false;
  if(typeof sshape==='undefined') var sshape=false;
}catch{window.sshape=false}
})();