function SetCourseFor30Degrees_setup(team) {
	var botVars = {};
	botVars["color"] = team;
	return botVars;
}

function SetCourseFor30Degrees_getActions(gameInfo, botVars) {
	var actions = [];
	var ang1 = gameInfo[botVars["color"]+"_rot"]+0;
	var fireChance=0.95;
	
	// sun avoidance
	var x = gameInfo[botVars["color"]+"_x"];
	var y = gameInfo[botVars["color"]+"_y"];
	var sunX = gameInfo["sun_x"]+0;
	var sunY = gameInfo["sun_y"]+0;
	var dx = sunX- x;
	var dy = sunY - y;
	var shortRangeAvoidanceDistance = (dx * dx + dy * dy ) ;

	x = gameInfo[botVars["color"]+"_x"]+gameInfo[botVars["color"]+"_xv"]*10;
	y = gameInfo[botVars["color"]+"_y"]+gameInfo[botVars["color"]+"_yv"]*10;
	dx = sunX- x;
	dy = sunY - y;

	var longRangeAvoidanceDistance = (dx * dx + dy * dy ) ;

	var vel = Math.sqrt(gameInfo[botVars["color"]+"_xv"]*gameInfo[botVars["color"]+"_xv"]+
	gameInfo[botVars["color"]+"_yv"]*gameInfo[botVars["color"]+"_yv"]);

	var close=vel*1.5;

	if (shortRangeAvoidanceDistance <= close* close) {
		actions.push("hyperspace");
	} else {
		if (longRangeAvoidanceDistance <= 200*200) {

			x = x+Math.cos((ang1-5)*Math.PI/180)*vel ;
			y = y+Math.sin((ang1-5)*Math.PI/180)*vel ;
			dx = sunX- x;
			dy = sunY - y;
			
			if (( dx * dx + dy * dy ) > longRangeAvoidanceDistance ) {
				actions.push("turn right")
			} else {
				actions.push("turn left")
			}
		} else {
			var course = botVars["color"]=="red"?30:-30;
			if (ang1>course ) {actions.push("turn left")}
			if (ang1<course ) {actions.push("turn right")}
		}
		if (Math.random() > fireChance){ actions.push("fire missile") }
		actions.push("fire engine");
	}
	
	return actions;
}