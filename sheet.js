var draft=null,editKey=null;
var scrim=document.getElementById("scrim"),sheet=document.getElementById("sheet");
var PALETTE=["#E4572E","#F2B705","#3FA34D","#2E86AB","#7B4B94","#E56399","#17BEBB","#8D6E63"];
function openSheet(d){
  editKey=key(view.y,view.m,d);var r=data[editKey]||{};draft={c:r.c||"",w:!!r.w,n:r.n||""};
  sheet.replaceChildren(el("h2","title",d+" "+mname(0).toLowerCase()));
  var sw=el("div","sw");
  function mark(){Array.prototype.forEach.call(sw.children,function(b){b.classList.toggle("sel",(b.dataset.c||"")==draft.c&&b.tagName=="BUTTON")})}
  var none=el("button",null,"—");none.dataset.c="";none.setAttribute("aria-label","Без цвета");none.onclick=function(){draft.c="";mark()};sw.append(none);
  PALETTE.forEach(function(c){var b=el("button");b.style.background=c;b.dataset.c=c;b.setAttribute("aria-label","Цвет "+c);b.onclick=function(){draft.c=c;mark()};sw.append(b)});
  var cu=el("label",null,"+"),inp=el("input");inp.type="color";inp.value=draft.c||"#E4572E";inp.oninput=function(){draft.c=inp.value.toUpperCase();mark()};
  cu.append(inp);cu.setAttribute("aria-label","Свой цвет");sw.append(cu);sheet.append(sw);mark();
  var tg=el("button","tg");tg.append(el("i"),el("span",null,"Тренировка была"));tg.setAttribute("aria-pressed",draft.w);
  tg.onclick=function(){draft.w=!draft.w;tg.setAttribute("aria-pressed",draft.w)};sheet.append(tg);
  var ta=el("textarea");ta.placeholder="Заметка: что делал, как прошло";ta.value=draft.n;ta.oninput=function(){draft.n=ta.value};sheet.append(ta);
  var sv=el("button","go","Сохранить"),clr=el("button","clr","Очистить день");
  sv.onclick=function(){var n=draft.n.trim();if(!draft.c&&!draft.w&&!n)delete data[editKey];else data[editKey]={c:draft.c,w:draft.w,n:n};lastKey=editKey;persist();closeSheet()};
  clr.onclick=function(){delete data[editKey];persist();closeSheet()};
  sheet.append(sv,clr);scrim.classList.add("on");
}
function closeSheet(){scrim.classList.remove("on");render()}
scrim.addEventListener("click",function(e){if(e.target===scrim)closeSheet()});
