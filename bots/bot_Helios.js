function Helios_setup(team) {
    var botVars = {};
    botVars.myPrefix = team + "_";
    botVars.enemyPrefix = team == "red" ? "blue_" : "red_";
    return botVars;
}

function Helios_getActions(gameInfo, botVars) {
    var actions = [];
    var halfPi = Math.PI / 2;
    var engageAngle = Math.PI / 8;

    var field = {};
    field.width = gameInfo.fieldWidth;
    field.height = gameInfo.fieldHeight;
    field.halfWidth = field.width / 2;
    field.halfHeight = field.height / 2;
    field.posOffsetX = field.width * 3 / 2 - gameInfo[botVars.myPrefix + "x"];
    field.posOffsetY = field.height * 3 / 2 - gameInfo[botVars.myPrefix + "y"];
    field.posAngle = (450 - gameInfo[botVars.myPrefix + "rot"]) % 360 * Math.PI / 180;
    field.posSin = Math.sin(-field.posAngle);
    field.posCos = Math.cos(-field.posAngle);
    field.movOffsetXV = -gameInfo[botVars.myPrefix + "xv"];
    field.movOffsetYV = gameInfo[botVars.myPrefix + "yv"];
    field.movAngle = Math.atan2(-field.movOffsetYV, -field.movOffsetXV);
    field.movSin = Math.sin(-field.movAngle);
    field.movCos = Math.cos(-field.movAngle);

    function zeroIfUndefined(v) {
        return v === undefined ? 0 : v;
    }

    function getEntity(source, prefix) {
        var tmpX = (field.posOffsetX + zeroIfUndefined(source[prefix + "x"])) % field.width - field.halfWidth;
        var tmpY = field.halfHeight - (field.posOffsetY + zeroIfUndefined(source[prefix + "y"])) % field.height;
        var tmpXV = zeroIfUndefined(source[prefix + "xv"]);
        var tmpYV = -zeroIfUndefined(source[prefix + "yv"]);
        var e = {};
        e.posX = tmpX * field.posCos - tmpY * field.posSin;
        e.posY = tmpX * field.posSin + tmpY * field.posCos;
        e.posR = Math.sqrt(e.posX * e.posX + e.posY * e.posY),
        e.posPhi = Math.atan2(e.posY, e.posX),
        e.posXV = tmpXV * field.posCos - tmpYV * field.posSin;
        e.posYV = tmpXV * field.posSin + tmpYV * field.posCos;
        e.movX = tmpX * field.movCos - tmpY * field.movSin;
        e.movY = tmpX * field.movSin + tmpY * field.movCos;
        e.movR = Math.sqrt(e.movX * e.movX + e.movY * e.movY),
        e.movPhi = Math.atan2(e.movY, e.movX),
        e.movXV = (tmpXV + field.movOffsetXV) * field.movCos - (tmpYV + field.movOffsetYV) * field.movSin;
        e.movYV = (tmpXV + field.movOffsetXV) * field.movSin + (tmpYV + field.movOffsetYV) * field.movCos;
        return e;
    }

    function getShip(prefix) {
        var ship = getEntity(gameInfo, prefix);
        ship.missileStock = gameInfo[prefix + "missileStock"];
        ship.inHyperspace = gameInfo[prefix + "inHyperspace"];
        ship.exploded = gameInfo[prefix + "exploded"];
        ship.alive = gameInfo[prefix + "alive"];
        return ship;
    }

    var myShip = getShip(botVars.myPrefix);
    myShip.movAngle = (field.posAngle - field.movAngle + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
    var enemyShip = getShip(botVars.enemyPrefix);
    var sun = getEntity(gameInfo, "sun_");

    enemyShip.intersectionLine = [[enemyShip.movX - enemyShip.movXV * 20, enemyShip.movY - enemyShip.movYV * 20],
            [enemyShip.movX + enemyShip.movXV * 20, enemyShip.movY + enemyShip.movYV * 20]];

    var intersection = LineIntersection([[0, 0], [Math.cos(myShip.movAngle) * 10 * 20, Math.sin(myShip.movAngle) * 10 * 20]],
            enemyShip.intersectionLine);
    if (intersection.length == 2) {
        myShip.intersection = Math.abs(intersection[1][0] / 2 + 0.5 - intersection[1][1]);
    }
    intersection = LineIntersection([[0, 0], [Math.cos(myShip.movAngle - 0.05) * 10 * 20, Math.sin(myShip.movAngle - 0.05) * 10 * 20]],
            enemyShip.intersectionLine);
    if (intersection.length == 2) {
        myShip.intersectionLeft = Math.abs(intersection[1][0] / 2 + 0.5 - intersection[1][1]);
    }
    intersection = LineIntersection([[0, 0], [Math.cos(myShip.movAngle + 0.05) * 10 * 20, Math.sin(myShip.movAngle + 0.05) * 10 * 20]],
            enemyShip.intersectionLine);
    if (intersection.length == 2) {
        myShip.intersectionRight = Math.abs(intersection[1][0] / 2 + 0.5 - intersection[1][1]);
    }

    function danger() {
        if (sun.movR < 40) {
            return true;
        }
        var shipLine1 = [[-18, 10], [-18, -10]];
        var shipLine2 = [[-18, 10], [10, 0]];
        var shipLine3 = [[-18, -10], [10, 0]];
        if (gameInfo.missiles !== undefined) {
            for (var i = 0; i < gameInfo.missiles.length; i++) {
                var missile = getEntity(gameInfo.missiles[i], "");
                var missileLine = [[missile.movX + missile.movXV * 0.5, missile.movY + missile.movYV * 0.5],
                        [missile.movX + missile.movXV * 3, missile.movY + missile.movYV * 3]];
                if (LineIntersection(shipLine1, missileLine).length == 2 ||
                        LineIntersection(shipLine2, missileLine).length == 2 ||
                        LineIntersection(shipLine3, missileLine).length == 2) {
                  return true;
                }
            }
        }
        return false;
    }

    function fire() {
        return enemyShip.alive && !enemyShip.inHyperspace && myShip.intersection !== undefined &&
            myShip.intersection < (330 - enemyShip.posR) / 300;
    }

    function evadeSun() {
        if ((sun.movPhi > 0 && myShip.movAngle < 0) || (sun.movPhi < 0 && myShip.movAngle > 0)) {
            actions.push("fire engine");
        }
        if (sun.movPhi > 0) {
            if (Math.abs(myShip.movAngle) < halfPi) {
                actions.push("turn right");
            } else {
                actions.push("turn left");
            }
        } else {
            if (Math.abs(myShip.movAngle) < halfPi) {
                actions.push("turn left");
            } else {
                actions.push("turn right");
            }
        }
    }

    function aim() {
        if (myShip.intersection !== undefined && myShip.intersectionLeft !== undefined && myShip.intersectionLeft < myShip.intersection) {
            actions.push("turn left");
        } else if (myShip.intersection !== undefined && myShip.intersectionRight !== undefined && myShip.intersectionRight < myShip.intersection) {
            actions.push("turn right");
        } else {
            if (enemyShip.posPhi > 0) {
                actions.push("turn left");
            } else {
                actions.push("turn right");
            }
        }
        if (myShip.missileStock == 0) {
            actions.push("fire engine");
        }
    }

    function engage() {
        if ((enemyShip.posPhi > 0 && enemyShip.posPhi < engageAngle) || enemyShip.posPhi < -engageAngle) {
            actions.push("turn right");
        } else {
            actions.push("turn left");
        }
        actions.push("fire engine");
    }

    if (myShip.alive && !myShip.inHyperspace) {
        if (danger()) {
            actions.push("hyperspace");
        }
        if (fire()) {
            actions.push("fire missile");
        }
        if (!enemyShip.alive || enemyShip.inHyperspace || sun.movR < 150 || (sun.movR < 350 && Math.abs(sun.movPhi) < Math.PI)) {
            evadeSun();
        } else if (enemyShip.posR < 300) {
            aim();
        } else {
            engage();
        }
    }

    return actions;
}