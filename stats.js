function stats(){
  var f=document.createDocumentFragment(),days=new Date(view.y,view.m+1,0).getDate(),cnt=0,notes=[],strip=el("div","strip");
  for(var d=1;d<=days;d++){var r=data[key(view.y,view.m,d)],i=el("i");i.style.setProperty("--i",d);
    if(r&&r.w){cnt++;i.className="on";if(r.c)i.style.background=r.c}
    if(r&&r.n)notes.push([d,r]);strip.append(i)}
  var big=el("div","big",cnt),num=big.firstChild;big.append(el("small",null,"из "+days));
  if(!(window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches)){var t0=performance.now();(function tick(t){var p=Math.max(0,Math.min(1,(t-t0)/650));num.nodeValue=Math.round(cnt*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick)})(t0)}
  f.append(big,el("p","lead",plural(cnt)+" с тренировкой"),strip);
  if(!notes.length)f.append(el("p","hint","Заметок пока нет. Открой день в календаре и запиши, как всё прошло."));
  notes.reverse().forEach(function(x){
    var w=el("div","log"),bar=el("div","bar");w.style.setProperty("--i",notes.indexOf(x));if(x[1].c)bar.style.background=x[1].c;
    w.append(bar,el("div","num",x[0]),el("p",null,x[1].n));f.append(w);
  });
  return f;
}
