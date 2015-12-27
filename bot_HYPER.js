function HYPER_setup(team){
	var botVars={};
	botVars["color"]=team;
	return botVars;
}

function HYPER_getActions(gameInfo,botVars){
	var actions=[];
	if(gameInfo[botVars["color"]+"_alive"]){
		actions.push(["fire engine","fire missile","hyperspace"][Math.round(Math.random()*2)])
	}
	return actions;
}