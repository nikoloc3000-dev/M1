var data={};
try{data=JSON.parse(localStorage.getItem("wk:v1")||"{}")}catch(e){data={}}
function persist(){try{localStorage.setItem("wk:v1",JSON.stringify(data))}catch(e){}}
