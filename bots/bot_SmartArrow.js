function SmartArrow_setup(team) {
    var botVars = {};
    botVars['mpref'] = team + '_';
    botVars['epref'] = team == 'red' ? 'blue_' : 'red_';
    botVars['ecolor'] = team == 'red' ? 'blue' : 'red';
    return botVars;
}

function SmartArrow_getActions(gameInfo, botVars) {
    var actions = [];
    var x = gameInfo[botVars['mpref'] + 'x'],
        y = gameInfo[botVars['mpref'] + 'y'],
        rot = gameInfo[botVars['mpref'] + 'rot']; // SmartArrow position and rotation
    var ex = gameInfo[botVars['epref'] + 'x'],
        ey = gameInfo[botVars['epref'] + 'y']; // Enemy position
    var sunx = gameInfo.sun_x,
        suny = gameInfo.sun_y; // Sun position
    var Dsunx = Math.abs(x - sunx),
        Dsuny = Math.abs(y - suny); // Sun position delta
    var dex = Math.abs(x - ex),
        dey = Math.abs(y - ey); // Enemy position delta
    var sangle = Math.degrees(Math.atan2(suny - y, sunx - x)),
        snrot = (rot - sangle + 360) % 360;
    if (Dsunx < 40 && Dsuny < 40) // If SmartArrow is too close from sun, hyperspace !
        return ['hyperspace'];
    var missiles = gameInfo.missiles;
    for (var i = 0; i < missiles.length; i++) { // Avoid all these silly missiles
        var dx = Math.abs(x - missiles[i].x),
            dy = Math.abs(y - missiles[i].y);
        if (dx < 10 && dy < 10)
            return ['hyperspace'];
    }
    if (gameInfo[botVars['epref'] + 'alive']) { // If his enemy is alive, SmartArrow try to kill him (logic)
        var angle = Math.degrees(Math.atan2(ey - y, ex - x)),
            nrot = (rot - angle + 360) % 360;
        if (nrot > 90 && nrot < 270)
            actions.push('turn left');
        else
            actions.push('turn right');
        if (nrot > 80 && nrot < 100
         && Math.random() > 0.5) actions.push('fire missile'); // If SmartArrow is in a good spot, shot this silly oponnent
        if (Math.random() > 0.5) actions.push('fire engine');
    }
    else { // Simply (try to) act like SunAvoider if his enemy is dead
        if (snrot > 90 && snrot < 270)
            actions.push('turn right');
        else
            actions.push('turn left');
        if (Dsunx < 300 && Dsuny < 300)
            actions.push('fire engine');
        if (dex < 40 && dey < 40)
            actions.push('hyperspace'); // Dying on the corpse of his opponent is dumb.
    }
    return actions;
}