function AttackAndComeBack_setup(team) {
    var botVars = {};
    botVars["color"] = team;
    return botVars;
}

function AttackAndComeBack_getActions(gameInfo, botVars) {
    var actions = [];
    actions.push("fire missile");
    if (Math.random()>0.4){actions.push("turn right");}
    else {actions.push("turn left");}
    actions.push("fire engine");
    return actions;
}