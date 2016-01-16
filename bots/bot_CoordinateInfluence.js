function CoordinateInfluence_setup(team) {
	var botVars = {};
	botVars["color"] = team;
	return botVars;
}
function CoordinateInfluence_getActions(gameInfo, botVars) {
	var actions = [];
	
	if (gameInfo[botVars["color"]+"_alive"]) {
		if(gameInfo["blue_x"]>gameInfo["red_x"]){
			if(gameInfo["blue_y"]<gameInfo["red_y"]){actions.push("turn right");}
			else{actions.push("fire engine");}
		}
		else if(gameInfo["blue_y"]<gameInfo["red_y"]){
			if(gameInfo["blue_x"]>gameInfo["red_x"]){actions.push("turn left");}
			else{actions.push("fire missile");}
		}
		else{actions.push("hyperspace");}
	}
	
	return actions;
}