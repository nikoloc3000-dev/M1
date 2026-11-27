var WEEKDAYS=["воскресенье","понедельник","вторник","среда","четверг","пятница","суббота"];
var MONTHS_GEN=["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
var period=1;
function totals(from,to){var t={};Object.keys(data).forEach(function(k){if(k<from||k>to)return;(data[k].ex||[]).forEach(function(x){var id=x.n.toLowerCase(),e=t[id]||(t[id]={n:x.n,reps:0});e.reps+=x.s*x.r})});return Object.keys(t).map(function(k){return t[k]}).sort(function(p,q){return q.reps-p.reps})}
function stats(){
  var f=document.createDocumentFragment(),days=new Date(view.y,view.m+1,0).getDate(),cnt=0,notes=[],strip=el("div","strip");
  for(var d=1;d<=days;d++){var r=data[key(view.y,view.m,d)],i=el("i");i.style.setProperty("--i",d);
    if(r&&r.w){cnt++;i.className="on";if(r.c)i.style.background=r.c}
    if(r&&(r.n||r.f||(r.ex&&r.ex.length)))notes.push([d,r]);strip.append(i)}
  var big=el("div","big",cnt),num=big.firstChild;big.append(el("small",null,"из "+days));
  if(!(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches)){var t0=performance.now();(function tick(t){var p=Math.max(0,Math.min(1,(t-t0)/650));num.nodeValue=Math.round(cnt*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick)})(t0)}
  f.append(big,el("p","lead",plural(cnt)+" с тренировкой"),strip);
  if(typeof feelBlock==="function")f.append(feelBlock());
  var th=el("p","th","Сделано"),pc=el("div","chips"),box=el("div","xlist");
  function draw(){
    var td=new Date(),k0=key(td.getFullYear(),td.getMonth(),td.getDate()),w0=new Date(td.getFullYear(),td.getMonth(),td.getDate()-6),from,to;
    if(period==0){from=key(w0.getFullYear(),w0.getMonth(),w0.getDate());to=k0}else if(period==1){from=key(view.y,view.m,1);to=key(view.y,view.m,days)}else{from="0000";to="9999"}
    var ex=totals(from,to),mx=ex.length?Math.max(1,ex[0].reps):1;box.replaceChildren();
    if(!ex.length)box.append(el("p","hint","За этот период упражнений нет."));
    ex.forEach(function(e){var rw=el("div","xr"),bar=el("i"),l=el("div","xl");bar.style.width=Math.max(4,Math.round(e.reps/mx*100))+"%";l.append(el("span",null,e.n),el("em",null,e.reps));rw.append(l,bar);box.append(rw)});
    Array.prototype.forEach.call(pc.children,function(c,i){c.setAttribute("aria-pressed",i==period)});
  }
  ["7 дней","Месяц","Всё время"].forEach(function(t,i){var c=el("button","chip",t);c.onclick=function(){period=i;draw()};pc.append(c)});
  draw();f.append(th,pc,box);
  if(!notes.length)f.append(el("p","hint","Записей пока нет. Открой день в календаре и добавь упражнения."));
  notes.reverse().forEach(function(x){
    var d=x[0],r=x[1],row=el("div","log"),tile=el("div","tile"+(r.w?" tr":""),d),body=el("div","lbody");
    if(r.c){tile.style.background=r.c;tile.style.color=ink(r.c)}
    body.append(el("div","ldate",WEEKDAYS[new Date(view.y,view.m,d).getDay()]+", "+d+" "+MONTHS_GEN[view.m]+(r.f?" · "+["","легко","нормально","тяжело"][r.f]:"")));
    (r.ex||[]).forEach(function(e){body.append(el("div","xline",e.n+" · "+e.s+"×"+e.r))});
    if(r.n)body.append(el("p",null,r.n));
    row.style.setProperty("--i",notes.indexOf(x));row.append(tile,body);f.append(row);
  });
  return f;
}
