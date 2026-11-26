function calendar(){
  var f=document.createDocumentFragment();
  var w=el("div","week");["пн","вт","ср","чт","пт","сб","вс"].forEach(function(d){w.append(el("span",null,d))});f.append(w);
  var g=el("div","grid"),first=(new Date(view.y,view.m,1).getDay()+6)%7,days=new Date(view.y,view.m+1,0).getDate();
  for(var i=0;i<first;i++)g.append(el("div","cell empty"));
  for(var d=1;d<=days;d++){(function(d){
    var r=data[key(view.y,view.m,d)],b=el("button","cell",d);
    if(r&&r.c){b.classList.add("has");b.style.background=r.c;b.style.color=ink(r.c)}
    if(r&&r.w)b.classList.add("tr");
    if(key(view.y,view.m,d)==lastKey)b.classList.add("pop");
    if(d==now.getDate()&&view.m==now.getMonth()&&view.y==now.getFullYear())b.classList.add("today");
    b.setAttribute("aria-label",d+" "+mname(0).toLowerCase()+(r&&r.w?", тренировка была":""));
    b.onclick=function(){openSheet(d)};g.append(b);
  })(d)}
  f.append(g,el("p","hint","Черта внизу дня: тренировка была."));return f;
}
