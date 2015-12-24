function SprayAndPray_setup(team) {
    var botVars = {};
    botVars["color"] = team;
    return botVars;
}

function SprayAndPray_getActions(gameInfo, botVars) {
    var actions = [];

    if (gameInfo[botVars["color"]+"_alive"]) {
        actions.push("turn left");
        if (Math.random() > 0.5) { actions.push("fire engine")};
       actions.push("fire missile");
    }

    return actions;
}