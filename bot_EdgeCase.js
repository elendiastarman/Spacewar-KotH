function EdgeCase_setup(team) {
  var botVars = {};
  botVars["color"] = team;
  return botVars;
}

function EdgeCase_getActions(gameInfo, botVars) {
  var actions = [];
  // Get our ship's position
  var rotation, x, y, opponentAlive;
  if(botVars.color == "red") {
    rotation = gameInfo.red_rot;
    x = gameInfo.red_x;
    y = gameInfo.red_y;
    opponentAlive = gameInfo.blue_alive;
  }
  else if(botVars.color == "blue") {
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
  if(distanceFromSun < 30) actions.push("hyperspace");
  else {

    // Turn away from the sun
    if(rotationToSun > 90 && rotationToSun < 270) {
      actions.push("turn right");
    }
    else actions.push("turn left");

    // Fire engines if we're pointing away from the sun
    if(rotationToSun > 180) {
      actions.push("fire engine");
    }

    // If we shoot while our opponent's dead we can only kill ourself
    else if(opponentAlive) actions.push("fire missile");
  }
  
  return actions;
}