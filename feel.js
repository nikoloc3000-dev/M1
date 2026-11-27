var FEEL=["","Легко","Нормально","Тяжело"],FCOL=["","#3FA34D","#F2B705","#E4572E"];
function feelData(){var n=new Date(view.y,view.m+1,0).getDate(),c=[0,0,0,0],seq=[];for(var d=1;d<=n;d++){var r=data[key(view.y,view.m,d)],v=r&&r.f?r.f:0;c[v]++;if(v)seq.push(v)}return {c:c,seq:seq,n:c[1]+c[2]+c[3]}}
function feelBlock(){
  var D=feelData(),f=document.createDocumentFragment();
  if(!D.n){f.append(el("p","hint fnone","Самочувствие появится, когда отметишь его в тренировке."));return f}
  f.append(el("p","th","Самочувствие"));
  var bar=el("div","fshare"),leg=el("div","fleg2"),top=1;
  [1,2,3].forEach(function(v){
    if(D.c[v]){var i=el("i");i.style.flex=D.c[v];i.style.background=FCOL[v];bar.append(i)}
    var s=el("span"),sq=el("i");sq.style.background=FCOL[v];s.append(sq,document.createTextNode(FEEL[v].toLowerCase()+" "+D.c[v]));leg.append(s);
    if(D.c[v]>D.c[top])top=v;
  });
  var q=D.seq.slice(-3),hard=q.length==3&&q.every(function(v){return v==3});
  f.append(bar,leg,el("p","fsum","Чаще всего: "+FEEL[top].toLowerCase()+"."+(hard?" Последние три тренировки были тяжёлыми, может, стоит отдохнуть.":"")));
  return f;
}
