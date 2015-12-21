function RighthandedSpasms_setup(team) {
	return {};
}

function RighthandedSpasms_getActions(gameInfo, botVars) {
	var actions = [];
	
	if (gameInfo.blue_alive) {
		if (Math.random() > 0.5) { actions.push("turn right") }
		if (Math.random() > 0.5) { actions.push("fire engine") }
		if (Math.random() > 0.8) { actions.push("fire missile") }
	}
	
	return actions;
}