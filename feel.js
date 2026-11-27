var FEEL=["","Легко","Нормально","Тяжело"],FCOL=["","#3FA34D","#F2B705","#E4572E"];
function feelData(){var n=new Date(view.y,view.m+1,0).getDate(),c=[0,0,0,0],seq=[],last=0;for(var d=1;d<=n;d++){var r=data[key(view.y,view.m,d)],v=r&&(r.f===1||r.f===2||r.f===3)?r.f:0;c[v]++;if(v){seq.push(v);last=d}}return {c:c,seq:seq,last:last,n:c[1]+c[2]+c[3]}}
function feelSummary(c,n,rest){
  if(n<1)return "";
  if(n<3)return "Пока мало записей, чтобы делать выводы.";
  var mx=Math.max(c[1],c[2],c[3]),tops=[1,2,3].filter(function(v){return c[v]==mx}),nm=tops.map(function(v){return FEEL[v].toLowerCase()});
  var t=tops.length==1?"Чаще всего: "+nm[0]+".":"Поровну: "+(nm.length==2?nm[0]+" и "+nm[1]:nm[0]+", "+nm[1]+" и "+nm[2])+".";
  return t+(rest?" Последние три тренировки были тяжёлыми, может, стоит отдохнуть.":"");
}
function feelBlock(){
  var D=feelData(),f=document.createDocumentFragment();
  if(!D.n){f.append(el("p","hint fnone","Самочувствие появится, когда отметишь его в тренировке."));return f}
  f.append(el("p","th","Самочувствие"));
  var bar=el("div","fshare"),leg=el("div","fleg2");
  [1,2,3].forEach(function(v){
    if(D.c[v]){var i=el("i");i.style.flex=D.c[v];i.style.background=FCOL[v];bar.append(i)}
    var s=el("span"),sq=el("i");sq.style.background=FCOL[v];s.append(sq,document.createTextNode(FEEL[v].toLowerCase()+" "+D.c[v]));leg.append(s);
  });
  var q=D.seq.slice(-3),td=new Date(),cur=view.y==td.getFullYear()&&view.m==td.getMonth(),
      rest=cur&&q.length==3&&q.every(function(v){return v==3})&&td.getDate()-D.last<=7;
  f.append(bar,leg,el("p","fsum",feelSummary(D.c,D.n,rest)));
  return f;
}
