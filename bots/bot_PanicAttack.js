function PanicAttack_setup(team) {
    var botVars = {};
    botVars["color"] = team;
    return botVars;
}

function PanicAttack_getActions(gameInfo, botVars) {
    var actions = [];
    actions.push("fire engine");
    if(botVars.color == "red") {
        var opponentAlive = gameInfo.blue_alive;
    }
    else if(botVars.color == "blue") {
        var opponentAlive = gameInfo.red_alive;
    }

    if ((Math.random()>0.5)&&opponentAlive) {
        actions.push("fire missile");
    }

    if (Math.random()>0.2) {
        actions.push("turn left");
    } else {
        actions.push("turn right");
    }

    return actions;
}