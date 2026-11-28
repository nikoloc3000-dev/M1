var PIC={bg:"#0E0F10",ink:"#F1F1EF",cell:"#1A1C1E",muted:"#8A8E92",f:["","#3FA34D","#F2B705","#E4572E"]};
function fnt(k,s){return k=="d"?"600 "+s+'px "Oswald","Arial Narrow",Impact,sans-serif':"500 "+s+'px "Onest",system-ui,"Segoe UI",Roboto,sans-serif'}
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function statsModel(){
  var y=view.y,m=view.m,n=new Date(y,m+1,0).getDate(),cnt=0,bars=[],fc=[0,0,0,0],tot={};
  for(var d=1;d<=n;d++){
    var r=data[key(y,m,d)];bars.push({on:!!(r&&r.w),c:r&&r.c?r.c:""});
    if(r&&r.w)cnt++;if(r&&r.f)fc[r.f]++;
    if(r)(r.ex||[]).forEach(function(x){var id=x.n.toLowerCase(),e=tot[id]||(tot[id]={n:x.n,reps:0});e.reps+=x.s*x.r});
  }
  var ex=Object.keys(tot).map(function(k){return tot[k]}).sort(function(a,b){return b.reps-a.reps}).slice(0,4);
  return {title:MONTHS[m]+" "+y,days:n,cnt:cnt,word:plural(cnt)+" с тренировкой",bars:bars,fc:fc,ex:ex};
}
function drawStats(c,M){
  var W=1080,H=1400,P=72,w=W-2*P,fn=M.fc[1]+M.fc[2]+M.fc[3];
  c.fillStyle=PIC.bg;c.fillRect(0,0,W,H);c.textBaseline="alphabetic";
  c.fillStyle=PIC.ink;c.font=fnt("d",132);c.fillText(M.title,P,230);
  var ns=String(M.cnt);c.font=fnt("d",270);c.fillText(ns,P,520);var nw=c.measureText(ns).width;
  c.fillStyle=PIC.muted;c.font=fnt("d",86);c.fillText("из "+M.days,P+nw+28,520);
  c.font=fnt("b",38);c.fillText(M.word,P,584);
  var n=M.days,g=6,bw=(w-g*(n-1))/n,sy=650,sh=110;
  M.bars.forEach(function(b,i){var h=b.on?sh:16;c.fillStyle=b.on?(b.c||PIC.ink):PIC.cell;rr(c,P+i*(bw+g),sy+sh-h,bw,h,Math.min(5,bw/2));c.fill()});
  if(fn){
    c.fillStyle=PIC.muted;c.font=fnt("b",32);c.fillText("Самочувствие",P,846);
    var k=[1,2,3].filter(function(v){return M.fc[v]}).length,room=w-6*(k-1),x=P;
    [1,2,3].forEach(function(v){if(!M.fc[v])return;var sw=room*M.fc[v]/fn;c.fillStyle=PIC.f[v];rr(c,x,868,sw,34,4);c.fill();x+=sw+6});
    var lx=P,nm=["","легко","нормально","тяжело"];c.font=fnt("b",32);
    [1,2,3].forEach(function(v){c.fillStyle=PIC.f[v];rr(c,lx,926,22,22,4);c.fill();c.fillStyle=PIC.muted;var t=nm[v]+" "+M.fc[v];c.fillText(t,lx+34,948);lx+=34+c.measureText(t).width+44});
  }
  if(M.ex.length){
    c.fillStyle=PIC.muted;c.font=fnt("b",32);c.fillText("Сделано за месяц",P,1016);
    var mx=Math.max(1,M.ex[0].reps);
    M.ex.forEach(function(e,i){
      var by=1074+i*80;c.fillStyle=PIC.ink;c.font=fnt("b",38);c.fillText(e.n.length>26?e.n.slice(0,25)+"…":e.n,P,by);
      c.font=fnt("d",48);c.textAlign="right";c.fillText(String(e.reps),P+w,by+2);c.textAlign="left";
      c.fillStyle=PIC.cell;rr(c,P,by+16,w,8,3);c.fill();c.fillStyle=PIC.ink;rr(c,P,by+16,Math.max(8,w*e.reps/mx),8,3);c.fill();
    });
  }
}
function downloadBlob(b,name){
  var a=document.createElement("a");a.href=URL.createObjectURL(b);a.download=name;document.body.append(a);a.click();a.remove();
  setTimeout(function(){URL.revokeObjectURL(a.href)},1000);showToast("Картинка сохранена в загрузки.");
}
function picBlob(){
  var cv=document.createElement("canvas");cv.width=1080;cv.height=1400;drawStats(cv.getContext("2d"),statsModel());
  return new Promise(function(res){cv.toBlob(res,"image/png")});
}
function savePicture(){
  var name="trenirovki-"+view.y+"-"+pad(view.m+1)+".png",ready=(document.fonts&&document.fonts.load)?Promise.all([document.fonts.load('600 100px Oswald'),document.fonts.load('500 30px Onest')]).catch(function(){}):Promise.resolve();
  ready.then(picBlob).then(function(b){
    if(!b)throw 0;
    var f=typeof File==="function"?new File([b],name,{type:"image/png"}):null;
    if(f&&navigator.canShare&&navigator.canShare({files:[f]}))return navigator.share({files:[f]}).catch(function(e){if(!e||e.name!=="AbortError")downloadBlob(b,name)});
    downloadBlob(b,name);
  }).catch(function(){showToast("Не удалось создать картинку.")});
}
