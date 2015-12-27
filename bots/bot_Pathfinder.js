function Pathfinder_setup(team) {
    var info = {};
    info.team = team;
    info.enemy = team == "red" ? "blue" : "red";
    info.edges = function(poly) {
        for (var i = 0, rtn = []; i < poly.length; i++) {
            var start = poly[i], end = poly[(i + 1) % poly.length];
            for (var j = 0; j < 10; j++)
                rtn.push([Math.round((end[0] - start[0]) / 10 * j + start[0]),
                          Math.round((end[1] - start[1]) / 10 * j + start[1])]);
        }
        return rtn;
    };
    info.circum = function(x, y, rad) {
        for (var θ = 0, rtn = []; θ < Math.PI * 2; θ += .1)
            rtn.push([Math.round(Math.cos(θ) * rad + x),
                      Math.round(Math.sin(θ) * rad + y)]);
        return rtn;
    };
    info.hypot = function(x, y) { return Math.sqrt(x * x + y * y); };
    info.grav = function(x, y, game) {
        var dist = this.hypot(game.sun_x - x, game.sun_y - y);
        var force = Math.min(game.gravityStrength / dist / dist, game.maxSpeed),
            θ = Math.atan2(game.sun_x - x, game.sun_y - y);
        return [Math.round(Math.cos(θ) * force),
                Math.round(Math.sin(θ) * force)];
    };
    return info;
}

function Pathfinder_getActions(game, info) {
    var danger = [];
    var g_x = info.hypot;
    for (var i = 0; i < game.numMissiles; i++) {
        var cur = game.missiles[i];
        var g = info.grav(cur.x, cur.y, game);
        danger.push([cur.x + cur.xv + g[0],
                     cur.y + cur.yv + g[1]]);
    }
    Array.prototype.push.apply(danger,
        info.edges(getShipCoords(info.enemy).map(function(coords) {
            var g = info.grav(coords[0], coords[1], game);
            return [coords[0] + game[info.enemy + "_xv"] + g[0],
                    coords[1] + game[info.enemy + "_yv"] + g[1]];
        })));
    Array.prototype.push.apply(danger,
        info.circum(game.sun_x, game.sun_y, game.sun_r));
    var x = game[info.team + "_x"],
        y = game[info.team + "_y"];
    var dir = game[info.team + "_rot"] * Math.PI / 180,
        delta = Math.PI / 36,
        g = info.grav(x, y, game);
    var l_nx = Math.round(Math.min(Math.cos(dir + delta)
                   * game.engineThrust, game.speedLimit)) + x + g[0],
        l_ny = Math.round(Math.min(Math.sin(dir + delta)
                   * game.engineThrust, game.speedLimit)) + y + g[1],
        s_nx = Math.round(Math.min(Math.cos(dir)
                   * game.engineThrust, game.speedLimit)) + x + g[0],
        s_ny = Math.round(Math.min(Math.sin(dir)
                   * game.engineThrust, game.speedLimit)) + y + g[1],
        r_nx = Math.round(Math.min(Math.cos(dir - delta)
                   * game.engineThrust, game.speedLimit)) + x + g[0],
        r_ny = Math.round(Math.min(Math.sin(dir - delta)
                   * game.engineThrust, game.speedLimit)) + y + g[1];
    var choices = [[l_nx, l_ny], [s_nx, s_ny], [r_nx, r_ny]];
    var final = [0, 1, 2].map(function(idx) {
        return danger.map(function(coord) {
            return [idx, info.hypot(choices[idx], coord)];
        }).reduce(function(a, b) { return Math.min(a, b); });
    }).reduce(function(a, b) { return b[1] > a[1] ? b : a; })[0];
    return final == 0 ? ["turn left", "fire engine"]
         : final == 2 ? ["turn right", "fire engine"]
         : ["fire engine"];
}