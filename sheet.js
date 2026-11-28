var draft=null,editKey=null;
var scrim=document.getElementById("scrim"),sheet=document.getElementById("sheet");
var PALETTE=["#E4572E","#F2B705","#3FA34D","#2E86AB","#7B4B94","#E56399","#17BEBB","#8D6E63"];
function openSheet(d){
  editKey=key(view.y,view.m,d);var r=data[editKey]||{};draft={c:r.c||"",w:!!r.w,n:r.n||"",f:r.f||0,ex:(r.ex||[]).map(function(x){return {n:x.n,s:x.s,r:x.r}})};
  sheet.replaceChildren(el("h2","title",d+" "+mname(0).toLowerCase()));
  var sw=el("div","sw");
  function mark(){Array.prototype.forEach.call(sw.children,function(b){b.classList.toggle("sel",(b.dataset.c||"")==draft.c&&b.tagName=="BUTTON")})}
  var none=el("button",null,"—");none.dataset.c="";none.setAttribute("aria-label","Без цвета");none.onclick=function(){draft.c="";mark()};sw.append(none);
  PALETTE.forEach(function(c){var b=el("button");b.style.background=c;b.dataset.c=c;b.setAttribute("aria-label","Цвет "+c);b.onclick=function(){draft.c=c;mark()};sw.append(b)});
  var cu=el("label",null,"+"),inp=el("input");inp.type="color";inp.value=draft.c||"#E4572E";inp.oninput=function(){draft.c=inp.value.toUpperCase();mark()};
  cu.append(inp);cu.setAttribute("aria-label","Свой цвет");sw.append(cu);sheet.append(sw);mark();
  var tg=el("button","tg");tg.append(el("i"),el("span",null,"Тренировка была"));tg.setAttribute("aria-pressed",draft.w);
  tg.onclick=function(){draft.w=!draft.w;autoDone=true;tg.setAttribute("aria-pressed",draft.w)};sheet.append(tg);
  var autoDone=false;function autoTick(){if(!draft.w&&!autoDone){draft.w=true;autoDone=true;tg.setAttribute("aria-pressed",true)}}
  var fl=el("div","feel");
  ["Легко","Нормально","Тяжело"].forEach(function(t,i){var b=el("button","chip",t);b.setAttribute("aria-pressed",draft.f==i+1);b.onclick=function(){draft.f=draft.f==i+1?0:i+1;Array.prototype.forEach.call(fl.children,function(x,j){x.setAttribute("aria-pressed",draft.f==j+1)});if(draft.f)autoTick()};fl.append(b)});
  sheet.append(fl);
  var dl=el("datalist"),seen={};dl.id="exn";
  Object.keys(data).forEach(function(k){(data[k].ex||[]).forEach(function(x){if(!seen[x.n]){seen[x.n]=1;var o=el("option");o.value=x.n;dl.append(o)}})});
  var xs=el("div","exs");
  function xrow(x){var w=el("div","xrow"),n=el("input"),s=el("input"),r=el("input"),rm=el("button",null,"×");
    n.placeholder="Упражнение";n.setAttribute("list","exn");n.value=x.n;n.oninput=function(){x.n=n.value;if(n.value.trim())autoTick()};
    s.type="number";r.type="number";s.min="0";r.min="0";s.inputMode="numeric";r.inputMode="numeric";s.placeholder="подх.";r.placeholder="повт.";s.value=x.s||"";r.value=x.r||"";
    s.oninput=function(){x.s=Math.max(0,Math.round(+s.value||0))};r.oninput=function(){x.r=Math.max(0,Math.round(+r.value||0))};
    rm.setAttribute("aria-label","Убрать упражнение");rm.onclick=function(){draft.ex.splice(draft.ex.indexOf(x),1);w.remove()};
    w.append(n,s,el("span",null,"×"),r,rm);xs.append(w)}
  draft.ex.forEach(xrow);sheet.append(dl,xs);
  var add=el("button","again","+ Упражнение");add.onclick=function(){var x={n:"",s:0,r:0};draft.ex.push(x);xrow(x)};sheet.append(add);
  var ta=el("textarea");ta.placeholder="Заметка (необязательно)";ta.value=draft.n;ta.oninput=function(){draft.n=ta.value};sheet.append(ta);
  var sv=el("button","go","Сохранить"),clr=el("button","clr","Очистить день");
  sv.onclick=function(){var n=draft.n.trim(),ex=draft.ex.filter(function(x){return x.n.trim()}).map(function(x){return {n:x.n.trim(),s:x.s||0,r:x.r||0}});if(!draft.c&&!draft.w&&!n&&!draft.f&&!ex.length)delete data[editKey];else data[editKey]=sanitizeDay({c:draft.c,w:draft.w,n:n,f:draft.f,ex:ex});lastKey=editKey;persist();closeSheet();if(typeof afterSave==="function")afterSave(editKey)};
  clr.onclick=function(){delete data[editKey];persist();closeSheet()};
  sheet.append(sv,clr);scrim.classList.add("on");
}
function closeSheet(){scrim.classList.remove("on");render()}
scrim.addEventListener("click",function(e){if(e.target===scrim)closeSheet()});
