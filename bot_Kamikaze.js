function Kamikaze_setup(team) {
  var botVars = {};
  botVars["color"] = team;
  return botVars;
}

function Kamikaze_getActions(gameInfo, botVars) {
  var actions = [];

  // Get our ship's position
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
  if(botVars.color == "red") {
    us = red;
    them = blue;
  }
  else if(botVars.color == "blue") {
    us = blue;
    them = red;
  }

  // Turn towards our opponent's position
  var angle = Math.degrees(Math.atan2(them.y - us.y, them.x- us.x)),
      rotationToOpponent = (us.rotation - angle + 360) % 360;
  if(rotationToOpponent > 90 && rotationToOpponent < 270) {
    actions.push("turn left");
  }
  else actions.push("turn right");

  actions.push("fire missile", "fire engine");

  return actions;
}
