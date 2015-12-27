function Engineer_setup(t){
	botVars = {
		c:t,
		C:"red0blue".split(0)[+(t=="red")],
		d:function(x1,y1,x2,y2){return Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))},
		enemyDist:function(g){return botVars.d(g[botVars.c+"_x"],g[botVars.c+"_y"],g[botVars.C+"_x"],g[botVars.C+"_y"]);},
		hS:function(g){return botVars.d(g.sun_x,g.sun_y,g[botVars.c+"_x"],g[botVars.c+"_y"])<50},
		hSm:function(g){
			// get closest missile
			var r = (g.missiles||[{x:10000,y:10000}]).reduce(function(p,c){return Math.min(botVars.d(c.x,c.y,g[botVars.c+"_x"],g[botVars.c+"_y"]),p)},Infinity);
			return r<18;
		},
		dF:function(g){
			var a = Math.degrees(Math.atan2(g[botVars.C+"_y"]-g[botVars.c+"_y"],g[botVars.C+"_x"]-g[botVars.c+"_x"]));
			var tP = (g[botVars.c+"_rot"]+360-a)%360;
			return [a,tP];
		},
		lOr:function(g,b){
			var tP = b.dF(g)[1];
			return 90<tP&&tP<270?"turn left":"turn right";
		},
		thrust:function(g){
			return Math.abs(botVars.dF(g)-g[botVars.c+"_rot"]);
		}
	}
	return botVars;
}

function Engineer_getActions(gameInfo,botVars){
	var actions = [];
	// are we too close to the sun or a missile?
	if(botVars.hS(gameInfo)||botVars.hSm(gameInfo))actions.push("hyperspace");

	// should we fire?
	if(botVars.enemyDist(gameInfo)<200)actions.push("fire missile");

	// direction function
	actions.push(botVars.lOr(gameInfo,botVars));

	if(Math.random()<.7)actions.push("fire engine");
	return actions;
}
