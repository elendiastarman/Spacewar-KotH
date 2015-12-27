function RammingSpeed_setup(team) {
	var botVars = {};
	
	botVars["color"] = team;
	botVars["enemy"] = team === "red" ? "blue" : "red"; 
	
	return botVars;
}

function RammingSpeed_getActions(gameInfo, botVars) {
	var actions = [];
	
	if (gameInfo[botVars["color"]+"_alive"] && gameInfo[botVars["enemy"]+"_alive"]) {
		var shipx = gameInfo[botVars["color"]+"_x"];
		var shipy = gameInfo[botVars["color"]+"_y"];
		var shipxv = gameInfo[botVars["color"]+"_xv"];
		var shipyv = gameInfo[botVars["color"]+"_yv"];
		
		var enemyx = gameInfo[botVars["enemy"]+"_x"];
		var enemyy = gameInfo[botVars["enemy"]+"_y"];
		
		var sunx = gameInfo["sun_x"];
		var suny = gameInfo["sun_y"];
		
		var dx1 = shipx - sunx;
		var dy1 = shipy - suny;
		var dis1 = Math.sqrt(dx1*dx1+dy1*dy1);
		var dx2 = shipx - enemyx;
		var dy2 = shipy - enemyy;
		var dis2 = Math.sqrt(dx2*dx2+dy2*dy2);
		
		actions.push("fire engine");
		
		var towardsSun = dx1*shipxv + dy1*shipyv //dot product is negative when pointing opposite directions
		
		var ang1 = gameInfo[botVars["color"]+"_rot"]+90;
		
		if (towardsSun > 0) { //going away from sun, so aim towards enemy
			var ang2 = Math.degrees( Math.atan2(dy2, dx2) );
		} else {
			var ang2 = Math.degrees( Math.atan2(-dy1, -dx1) );
		}
		
		var angDiff = ang2 - ang1;
		if (angDiff < -180) { //http://stackoverflow.com/a/7869457/1473772
			angDiff += 360;
		} else if (angDiff > 180) {
			angDiff -= 360;
		}
		
		if (angDiff <= 0) {
			actions.push("turn left");
		} else if (angDiff > 0) {
			actions.push("turn right");
		}
	}
	
	return actions;
}