var KEYRE=/^\d{4}-\d{2}-\d{2}$/;
function nonneg(v,max){v=+v;return isFinite(v)&&v>=0?Math.min(v,max):0}
function sanitizeDay(r){
  if(!r||typeof r!=="object"||Array.isArray(r))return null;
  var f=+r.f,o={c:/^#[0-9a-fA-F]{6}$/.test(r.c)?r.c:"",w:!!r.w,n:typeof r.n==="string"?r.n:"",f:(f===1||f===2||f===3)?f:0,ex:[]};
  if(Array.isArray(r.ex))r.ex.forEach(function(x){if(x&&typeof x.n==="string"&&x.n.trim())o.ex.push({n:x.n.trim().slice(0,80),s:Math.round(nonneg(x.s,9999)),r:Math.round(nonneg(x.r,99999))})});
  return o;
}
function sanitizeData(raw){var o={};if(raw&&typeof raw==="object"&&!Array.isArray(raw))Object.keys(raw).forEach(function(k){if(KEYRE.test(k)){var d=sanitizeDay(raw[k]);if(d)o[k]=d}});return o}
function sanitizeProfile(p){
  var o={};if(!p||typeof p!=="object"||Array.isArray(p))p={};
  ["h","a","w"].forEach(function(k){var v=p[k];o[k]=(v===""||v==null||isNaN(+v)||+v<=0)?"":Math.min(+v,999)});
  o.wh=[];if(Array.isArray(p.wh))p.wh.forEach(function(x){if(x&&KEYRE.test(x.d)&&+x.w>0)o.wh.push({d:x.d,w:Math.min(+x.w,999)})});
  o.wh=o.wh.slice(-3650);return o;
}
var data={};
try{data=sanitizeData(JSON.parse(localStorage.getItem("wk:v1")||"{}"))}catch(e){data={}}
function persist(){try{localStorage.setItem("wk:v1",JSON.stringify(data))}catch(e){}}
var profile=sanitizeProfile({});
try{profile=sanitizeProfile(JSON.parse(localStorage.getItem("wk:profile")||"{}"))}catch(e){profile=sanitizeProfile({})}
function persistProfile(){try{localStorage.setItem("wk:profile",JSON.stringify(profile))}catch(e){}}
