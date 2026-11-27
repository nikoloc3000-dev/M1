var pnote=null;
var PROFILE_FIELDS=[["h","Рост","см"],["a","Возраст","лет"],["w","Вес","кг"]];
function noteText(t){if(pnote)pnote.textContent=t}
function weightInfo(){var h=profile.wh;if(!h||!h.length)return "";var p=h[h.length-1].d.split("-");return "Вес обновлён "+(+p[2])+" "+MONTHS_GEN[+p[1]-1]+"."}
function profileView(){
  var f=document.createDocumentFragment(),g=el("div","ptiles"),wi=el("p","phint",weightInfo());
  PROFILE_FIELDS.forEach(function(x){
    var t=el("label","ptile"),i=el("input");
    i.type="number";i.inputMode="decimal";i.step="any";i.min="0";i.placeholder="—";i.value=profile[x[0]]||"";
    i.setAttribute("aria-label",x[1]+", "+x[2]);
    i.onchange=function(){
      var v=i.value===""?"":+i.value;if(v!==""&&!(v>=0))v="";
      profile[x[0]]=v;
      if(x[0]=="w"&&v!==""){var n=new Date(),k=key(n.getFullYear(),n.getMonth(),n.getDate()),h=profile.wh=profile.wh||[],l=h[h.length-1];if(l&&l.d==k)l.w=v;else h.push({d:k,w:v});wi.textContent=weightInfo()}
      persistProfile();
    };
    t.append(el("span","plabel",x[1]),i,el("span","punit",x[2]));g.append(t);
  });
  var dh=el("p","plabel pdata","Данные"),row=el("div","prow"),ex=el("button","plink","Сохранить копию"),im=el("button","plink","Загрузить копию"),fi=el("input");
  fi.type="file";fi.accept=".json,application/json";fi.hidden=true;
  ex.onclick=exportData;im.onclick=function(){fi.click()};fi.onchange=function(){importData(fi)};
  pnote=el("p","phint","Копия это файл с записями и профилем. Если сменишь телефон, загрузи его обратно.");
  row.append(ex,im);f.append(g,wi,dh,row,pnote,fi);return f;
}
function exportData(){
  var t=new Date(),blob=new Blob([JSON.stringify({app:"wk",v:1,days:data,profile:profile})],{type:"application/json"}),a=document.createElement("a");
  a.href=URL.createObjectURL(blob);a.download="trenirovki-"+key(t.getFullYear(),t.getMonth(),t.getDate())+".json";
  document.body.append(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(a.href)},1000);
  noteText("Копия сохранена в загрузки.");
}
function importData(fi){
  var file=fi.files&&fi.files[0];if(!file)return;
  var rd=new FileReader();
  rd.onload=function(){
    var msg="Не удалось прочитать файл. Нужна копия, сохранённая этим приложением.";
    try{
      var o=JSON.parse(rd.result);if(!o||o.app!=="wk"||!o.days||typeof o.days!=="object")throw 0;
      var ks=Object.keys(o.days).filter(function(k){return /^\d{4}-\d{2}-\d{2}$/.test(k)&&o.days[k]&&typeof o.days[k]==="object"});
      if(!confirm("Загрузить копию? Записей: "+ks.length+". Совпадающие дни будут заменены."))msg="Загрузка отменена.";
      else{
        var ok=0;ks.forEach(function(k){var dd=sanitizeDay(o.days[k]);if(dd){data[k]=dd;ok++}});persist();
        if(o.profile&&typeof o.profile==="object"){
          var sp=sanitizeProfile(o.profile),m={};
          ["h","a","w"].forEach(function(k){if(sp[k]!=="")profile[k]=sp[k]});
          (profile.wh||[]).concat(sp.wh).forEach(function(x){m[x.d]=x});profile.wh=Object.keys(m).sort().map(function(k){return m[k]});
          persistProfile();
        }
        anim="";render();msg="Загружено записей: "+ok+".";
      }
    }catch(e){}
    noteText(msg);fi.value="";
  };
  rd.onerror=function(){noteText("Не удалось прочитать файл.")};
  rd.readAsText(file);
}
