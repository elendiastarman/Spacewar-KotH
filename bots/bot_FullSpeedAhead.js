function FullSpeedAhead_setup(team){
    return {color: team};
}

function FullSpeedAhead_getActions(gameInfo, botVars){
    var actions = [];

    if (gameInfo[botVars["color"]+"_alive"]) {
        actions.push("fire engine");
        actions.push("fire missile");
    }
    return actions;
}