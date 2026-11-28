function recordFlags(){
  var ks=Object.keys(data).sort(),best={},out={};
  ks.forEach(function(k){
    var ex=data[k].ex||[],fl=[];
    ex.forEach(function(x){var b=best[x.n.toLowerCase()],v=x.s*x.r;fl.push({set:!!b&&b.r>0&&x.r>b.r,day:!!b&&b.v>0&&v>b.v})});
    ex.forEach(function(x){var id=x.n.toLowerCase(),b=best[id]||(best[id]={r:0,v:0});if(x.r>b.r)b.r=x.r;if(x.s*x.r>b.v)b.v=x.s*x.r});
    out[k]=fl;
  });
  return out;
}
var toastT=null;
function showToast(t){
  var e=document.getElementById("toast");
  if(!e){e=el("div","toast");e.id="toast";e.setAttribute("role","status");document.body.append(e)}
  e.textContent=t;void e.offsetWidth;e.classList.add("on");
  clearTimeout(toastT);toastT=setTimeout(function(){e.classList.remove("on")},3800);
}
function afterSave(k){
  var fl=recordFlags()[k]||[],ex=(data[k]&&data[k].ex)||[],msg=[];
  fl.forEach(function(f,i){var x=ex[i];if(f.set)msg.push("Рекорд: "+x.n+", "+x.r+" за подход");else if(f.day)msg.push("Рекорд: "+x.n+", "+x.s*x.r+" за день")});
  if(msg.length)showToast(msg.slice(0,2).join(". "));
}
