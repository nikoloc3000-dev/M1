render();
try{if(navigator.storage&&navigator.storage.persist)navigator.storage.persist()}catch(e){}
if("serviceWorker" in navigator){window.addEventListener("load",function(){navigator.serviceWorker.register("sw.js").catch(function(){})})}
var lastDay=new Date().toDateString();
document.addEventListener("visibilitychange",function(){if(document.hidden)return;var t=new Date().toDateString();if(t!==lastDay&&!scrim.classList.contains("on")){lastDay=t;now=new Date();anim="";render()}});
