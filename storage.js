var data={};
try{data=JSON.parse(localStorage.getItem("wk:v1")||"{}")}catch(e){data={}}
function persist(){try{localStorage.setItem("wk:v1",JSON.stringify(data))}catch(e){}}
var profile={};
try{profile=JSON.parse(localStorage.getItem("wk:profile")||"{}")}catch(e){profile={}}
function persistProfile(){try{localStorage.setItem("wk:profile",JSON.stringify(profile))}catch(e){}}
