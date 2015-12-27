function DangitBobby_setup(team) {
    var botVars = {};
    botVars["color"] = team;
    if (team == 'red'){
        botVars['them'] = "blue";
    }
    else{
        botVars['them'] = 'red';
    }
    return botVars;
}

function DangitBobby_getActions(gameInfo, botVars) {
    var actions = [];
    if (gameInfo[botVars["color"]+"_alive"]) {
        actions.push('turn right');
        actions.push('fire engine');
        if (gameInfo[botVars['them']+'_missileStock'] == 0){
                actions.push('fire missile');
        }

    }
	return actions;
}
