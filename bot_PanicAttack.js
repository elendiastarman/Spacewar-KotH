function PanicAttack_setup(team) {
    var botVars = {};
    botVars["color"] = team;
    return botVars;
}

function PanicAttack_getActions(gameInfo, botVars) {
    var actions = [];
    actions.push("fire engine");
    if (Math.random()>0.5) {
        actions.push("fire missile");
    }

    if (Math.random()>0.2) {
        actions.push("turn left");
    } else {
        actions.push("turn right");
    }

    return actions;
}