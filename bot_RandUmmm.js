function RandUmmm_setup(t){
    function P(n,t,r,o,e,f,g){for(o=[e=1<<(f=n.length)];e;)for(t=e.toString(2),r=g=t.length,o[--e]=[];r;)~-t[--r]||o[e].push(n[r+f-g]);return o}var q=P(["fire missile","turn right","fire engine","turn left"]);q.pop();
    return {color:t,m:function(){return q[Math.random()*q.length|0]}};
}

function RandUmmm_getActions(g,b){
    return b.m();
}