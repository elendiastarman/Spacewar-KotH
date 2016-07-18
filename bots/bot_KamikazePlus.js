function KamikazePlus_setup(team) {
  // Typical setup. Nothing to see here. ;)
  var botVars = {};
  botVars["color"] = team;
  return botVars;
}


function KamikazePlus_getActions(gameInfo, botVars) {
    var actions = [];
    var us, them, red = {
            rotation: gameInfo.red_rot,
            x: gameInfo.red_x,
            y: gameInfo.red_y,
            alive: gameInfo.blue_alive
        },
        blue = {
            rotation: gameInfo.blue_rot,
            x: gameInfo.blue_x,
            y: gameInfo.blue_y,
            alive: gameInfo.blue_alive
        };
    if (botVars.color == "red") {
        us = red;
        them = blue;
    } else if (botVars.color == "blue") {
        us = blue;
        them = red;
    }

    function distance(x1, y1, x2, y2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    }

    // Get our ship's position
    var rotation, x, y, opponentAlive;
    if (botVars.color == "red") {
        rotation = gameInfo.red_rot;
        x = gameInfo.red_x;
        y = gameInfo.red_y;
        opponentAlive = gameInfo.blue_alive;
    } else if (botVars.color == "blue") {
        rotation = gameInfo.blue_rot;
        x = gameInfo.blue_x;
        y = gameInfo.blue_y;
        opponentAlive = gameInfo.red_alive;
    }

    // Calculate our rotation compared to the sun in degrees
    var sunX = gameInfo.sun_x,
        sunY = gameInfo.sun_y,
        angle = Math.atan2(sunY - y, sunX - x) * 180 / Math.PI,
        rotationToSun = (rotation - angle + 360) % 360;

    // Check if we need to hyperspace to avoid the sun
    var rX = x - sunX,
        rY = y - sunY,
        distanceFromSun = Math.sqrt(rX * rX + rY * rY) - gameInfo.sun_r;
    if (distanceFromSun < 30) {
        actions.push("hyperspace");
        console.log("Command Module is Hyperspacing.")
    }
    if (gameInfo[botVars["color"] + "_alive"]) {
        var angle = Math.degrees(Math.atan2(them.y - us.y, them.x - us.x)),
            rotationToOpponent = (us.rotation - angle + 360) % 360;
        if (rotationToOpponent > 90 && rotationToOpponent < 270) {
            actions.push("turn left");
        } else {
            actions.push("turn right");
        };
        actions.push("fire engine");
        if (Math.random() > 0.3) {
            actions.push("fire missile")
        }

    }
    return actions;
}