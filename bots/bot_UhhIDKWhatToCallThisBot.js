function UhhIDKWhatToCallThisBot_setup(team) {
var botVars = {};
 botVars['t'] = 0;
botVars["color"] = team;
     return botVars;

}

function UhhIDKWhatToCallThisBot_getActions(gameInfo, botVars) {
    var actions = [];
    //when i need it: "turn left",
    //Use missiles sparingly!
    var WCID = [
    "fire engine",
     "turn right",
    "fire engine",
    "fire missile",
    "turn right",
    "fire engine"]

    if (gameInfo[botVars["color"]+"_alive"]) {
        botVars['t']++;
        actions.push(WCID[botVars['t']%(WCID.length)]);
    }
     return actions;
}