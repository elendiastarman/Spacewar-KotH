function MissilesPlusScore_setup(team) {
	var botVars = {};
	botVars["color"] = team;
	return botVars;
}
function MissilesPlusScore_getActions(gameInfo, botVars) {
	var actions = [];
	var moves=["fire missile","hyperspace","turn right","turn left","fire engine","fire missile","turn right","hyperspace","turn left","fire missile","hyperspace","turn right","turn left","hyperspace","fire engine","fire missile","turn right","turn left","hyperspace","fire missile","turn right","turn left","fire engine","hyperspace","fire missile","turn right","turn left","hyperspace"];
	if(gameInfo[botVars["color"]+"_alive"]){
		var num=gameInfo["redScore"]-gameInfo["blueScore"];
		if(num<0){num=num*-1;}
		if(num===0){
			actions.push(moves[Math.round(Math.random()*4)]);}
		else{
			actions.push(moves[num+gameInfo["numMissiles"]]);
		}
	}
    return actions;
}