var MONTHS=["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];
var now=new Date(),view={y:now.getFullYear(),m:now.getMonth()},tab="cal";
var main=document.getElementById("main");
function pad(n){return n<10?"0"+n:""+n}
function key(y,m,d){return y+"-"+pad(m+1)+"-"+pad(d)}
function ink(h){var n=parseInt(h.slice(1),16),r=n>>16,g=n>>8&255,b=n&255;return (0.299*r+0.587*g+0.114*b)>150?"#111":"#fff"}
function plural(n){var a=n%10,b=n%100;return (a==1&&b!=11)?"день":(a>=2&&a<=4&&(b<10||b>=20))?"дня":"дней"}
function el(t,c,txt){var e=document.createElement(t);if(c)e.className=c;if(txt!=null)e.textContent=txt;return e}
function mname(d){return MONTHS[(view.m+d+12)%12]}
function shift(d){anim=d<0?" l":" r";view.m+=d;if(view.m<0){view.m=11;view.y--}if(view.m>11){view.m=0;view.y++}render()}
function topBar(){
  var f=document.createDocumentFragment(),t=el("div","tabs"),a=el("button",null,"Календарь"),b=el("button",null,"Статистика");
  a.setAttribute("aria-current",tab=="cal");b.setAttribute("aria-current",tab=="st");
  a.onclick=function(){if(tab!="cal"){tab="cal";anim=" f";render()}};b.onclick=function(){if(tab!="st"){tab="st";anim=" f";render()}};t.append(a,b);
  var h=el("h1","title",MONTHS[view.m]+" "+view.y),r=el("div","mrow"),p=el("button",null,mname(-1)),n=el("button",null,mname(1));
  p.setAttribute("aria-label","Предыдущий месяц: "+mname(-1));n.setAttribute("aria-label","Следующий месяц: "+mname(1));
  p.onclick=function(){shift(-1)};n.onclick=function(){shift(1)};r.append(p,n);f.append(t,h,r);return f;
}
var anim=" f",lastKey="";
function render(){var v=el("div","view"+anim);v.append(tab=="cal"?calendar():stats());main.replaceChildren(topBar(),v);anim="";lastKey=""}
