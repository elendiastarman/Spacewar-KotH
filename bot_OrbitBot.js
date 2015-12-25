function OrbitBot_setup(team) {
  var botVars = {};

  botVars.color = team;
  return botVars;
}


function OrbitBot_getActions(gameInfo, botVars) {
  var actions = [];

  function getVar(name) {
    return gameInfo[botVars.color + "_" + name];
  }

  function distance(x1, y1, x2, y2) {
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
  }

  function angleDistance(theta1, theta2) {
    var d = theta1 - theta2;
    while (d < 0 || d > Math.PI) {
      if (d < 0) {
        d += Math.PI * 2;
      }
      if (d > Math.PI * 2) {
        d -= Math.PI * 2;
      } else if (d > Math.PI) {
        d = Math.PI * 2 - d;
      }
    }
    return d;
  }

  function toRad(degrees) {
    return degrees / 180 * Math.PI;
  }

  var shape = getVar('shape');

  if (shape != 'nose only') {
    var broken = shape != 'full ship';
    var sunX = gameInfo.sun_x,
      sunY = gameInfo.sun_y,
      sunG = gameInfo.gravityStrength;

    var x = getVar("x") - sunX,
      y = sunY - getVar("y"),
      vx = getVar("xv"),
      vy = -getVar("yv");

    var r = Math.sqrt(x * x + y * y);
    var theta = Math.atan(y / x);

    var sunA = sunG/r/r,
            sunAx = -Math.cos(theta) * sunA,
        sunAy = -Math.sin(theta) * sunA;

    var dv = Math.sqrt(sunG / r);
    var dvx = -dv * Math.sin(theta);
    var dvy = dv * Math.cos(theta);
    if (distance(-dvx, -dvy, vx, vy) < distance(dvx, dvy, vx, vy)) {
      dvx = -dvx;
      dvy = -dvy;
    }

    var dax = dvx - vx;
    var day = dvy - vy;

    var dAngle = Math.atan(day / dax);
    if (dax < 0) {
        dAngle += Math.PI;
    }
    var cAngle = toRad(90 - getVar('rot'));
    var dLeft = angleDistance(cAngle + toRad(broken ? 2.5 : 5), dAngle);
    var dRight = angleDistance(cAngle - toRad(broken ? 2.5 : 5), dAngle);
    var dNeither = angleDistance(cAngle, dAngle);
    if (dLeft < dRight && dLeft < dNeither) {
      actions.push('turn left');
    } else if (dRight < dLeft && dRight < dNeither) {
      actions.push('turn right');
    }

    var cax = Math.cos(cAngle) * (broken ? .15 : .3);
    var cay = Math.sin(cAngle) * (broken ? .15 : .3);

    if (distance(cax, cay, dax, day) < distance(0, 0, dax, day)) {
      actions.push('fire engine');
    }

  }

  return actions;
}
