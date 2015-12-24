function UhhIDKWhatToCallThisBot_setup(team) {
	var botVars = {};

	botVars["color"] = team;
    return botVars;
}

function UhhIDKWhatToCallThisBot_getActions(gameInfo, botVars) {
    var actions = [];

    if (gameInfo[botVars["color"]+"_alive"]) {
        var d = Math.random();
        if (d > 0.333 && d < 0.666) { actions.push("turn right") }
        if (d > 0.666) { actions.push("fire engine") }
        if (d < 0.333) { actions.push("fire missile") }
    }
    return actions;
}