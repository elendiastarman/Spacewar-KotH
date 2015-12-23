"use strict";

var renderLoop;
var players = ["human","userbot"];
(function($){
	$(document).ready(function (){
		console.log("main.js");
		init();
		renderLoop = setInterval(update, 30);
		$('#playfield').focus();
		$('#playfield').bind("keydown",handleInput);
		$('#playfield').bind("keyup",handleInput);
		$('#gravityCheck').on('change', function(){ gravityStrength = this.checked*5000; });
		$('#showIntersections').on('change', function(){
			showIntersections = !showIntersections;
			teams.forEach(function(ship){
				field.selectAll('.intP'+ship.color).remove();
				field.selectAll('.shipVerts'+ship.color).remove();
				field.selectAll('.missileHit'+ship.color).remove();
			});
		});
	});
})(jQuery);

var redPlayer = "human";
var bluePlayer = "userbot";
var redVars = {};
var blueVars = {};
var theGame;

var vs = 20;
var hs = 25;
var charw = 8;
var charh = 12;
var maxlen = 20;
var q = charw*maxlen;

function horizLineCoords(k) {
	var y = k*vs;
	var coords = "0,"+(q+y)+" "+(q+players.length*hs)+","+(q+y);
	return coords;
}
function vertLineCoords(k) {
	var x = k*hs;
	var coords = ""+(1.5*q+x)+",0 "+(q+x)+","+(q)+" "+(q+x)+","+(q+players.length*vs);
	return coords;
}
function redSelectCoords(k) {
	var y = k*vs;
	return ""+0+","+(q+y)+" "+(q)+","+(q+y)+" "+(q)+","+(q+y+vs)+" "+0+","+(q+y+vs);
}
function blueSelectCoords(k) {
	var x = k*hs;
	return ""+(1.5*q+x)+","+0+" "+(1.5*q+x+hs)+","+0+" "+(q+x+hs)+","+(q)+" "+(q+x)+","+(q);
}
function bothSelectCoords(k,k2) {
	var x = k2*hs;
	var y = k*vs;
	return ""+(q+x)+","+(q+y)+" "+(q+x+hs)+","+(q+y)+" "+(q+x+hs)+","+(q+y+vs)+" "+(q+x)+","+(q+y+vs);
}

function playerSet(a,b) {
	return function() {
		if (a+1){ redPlayer = players[a]; }
		if (b+1){ bluePlayer = players[b]; }
		updateHighlights();
		
		redVars = window[redPlayer+"_setup"]("red");
		blueVars = window[bluePlayer+"_setup"]("blue");
		
		setupGame(1);
	}
}

function updateHighlights() {
	console.log("Players: "+redPlayer+", "+bluePlayer)
	d3.select('#selectGridBoxes').selectAll('polygon').attr("fill","white");
	d3.select('#selectGrid').selectAll('text').attr("fill","black");
	
	d3.select('#redName-'+redPlayer).attr("fill","white");
	d3.select('#blueName-'+bluePlayer).attr("fill","white");
	d3.select('#redBox-'+redPlayer).attr("fill","red");
	d3.select('#blueBox-'+bluePlayer).attr("fill","blue");
	d3.select('#bothBox-'+redPlayer+'-'+bluePlayer).attr("fill","yellow");
}

function init() {
	theGame = initGame();
	
	setUserBotCode();
	
	redVars = window[redPlayer+"_setup"]("red");
	blueVars = window[bluePlayer+"_setup"]("blue");
	
	var scriptNames = eval(jQuery("#script-names").text());
	for (var i=0; i<scriptNames.length; i++) {
		var sn = scriptNames[i].substring(9); //takes out "Spacewar/"
		if (sn.substr(0,4) === "bot_") {
			players.push(sn.substring(4,sn.length-3));
		}
	}
	
	var selectGrid = d3.select('svg').append("g")
		.attr("id","selectGrid");
	var selectGridBoxes = selectGrid.append("g")
		.attr("id","selectGridBoxes")
		.attr("fill","white");
	var selectGridLines = selectGrid.append("g")
		.attr("id","selectGridLines")
		.attr("fill","none")
		.attr("stroke","black")
		.attr("stroke-width","2px");;
	d3.select("#field").attr("height",fieldHeight+charw*maxlen + (players.length+1)*vs + 2);
	
	selectGridLines.append("polyline")
		.attr("points", horizLineCoords(0));
	selectGridLines.append("polyline")
		.attr("points", vertLineCoords(0));
		
	for (var j=0; j<players.length; j++) {
		
		selectGridLines.append("polyline")
			.attr("points", horizLineCoords(j+1));
		selectGridLines.append("polyline")
			.attr("points", vertLineCoords(j+1));
		
		selectGrid.append("text")
			.attr("text-anchor","end")
			.attr("x",charw*maxlen - charw/2)
			.attr("y",charw*maxlen + (j+1)*vs - charh/2+1)
			.attr("id","redName-"+players[j])
			.on("click", playerSet(j,-1))
			.text(players[j]);
		selectGrid.append("text")
			.attr("text-anchor","start")
			.attr("x",charw*maxlen + (j+1)*hs - hs/2)
			.attr("y",charw*maxlen)
			.attr("id","blueName-"+players[j])
			.attr("transform","rotate(-63.435 "+(charw*maxlen+(j+1)*hs-hs/2)+","+(charw*maxlen-vs/2)+")")
			.on("click", playerSet(-1,j))
			.text(players[j]);

		selectGridBoxes.append("polygon")
			.attr("points", redSelectCoords(j))
			// .attr("fill","red")
			.attr("id","redBox-"+players[j])
			.on("click", playerSet(j,-1));
		selectGridBoxes.append("polygon")
			.attr("points", blueSelectCoords(j))
			// .attr("fill","blue")
			.attr("id","blueBox-"+players[j])
			.on("click", playerSet(-1,j));
		
		for (var j2=0; j2<players.length; j2++) {
			selectGridBoxes.append("polygon")
				.attr("points", bothSelectCoords(j,j2))
				// .attr("fill","yellow")
				.attr("id","bothBox-"+players[j]+"-"+players[j2])
				.on("click", playerSet(j,j2));
		}
	}
	
	selectGrid.attr("transform","translate(20,"+(fieldHeight+20)+")");
	updateHighlights();
	
}

function update() {
	if (gameOver) { return; }
	//pollBots();
	var uniqueRedActions = [""];
	var redActions = window[redPlayer+"_getActions"](theGame,redVars);
	if (redActions.indexOf("hyperspace") > -1) {
		uniqueRedActions.push("hyperspace");
	} else {
		for (var i=0; i<redActions.length; i++) {
			if (redActions.indexOf(redActions[i]) == i) { uniqueRedActions.push(redActions[i]) }
		}
	}
	teamMove("red",uniqueRedActions);
	
	var uniqueBlueActions = [""];
	var blueActions = window[bluePlayer+"_getActions"](theGame,blueVars);
	if (blueActions.indexOf("hyperspace") > -1) {
		uniqueBlueActions.push("hyperspace");
	} else {
		for (var i=0; i<blueActions.length; i++) {
			if (blueActions.indexOf(blueActions[i]) == i) { uniqueBlueActions.push(blueActions[i]) }
		}
	}
	teamMove("blue",uniqueBlueActions);
	
	jQuery('#action-table').find("td").each(function(i,elem){ jQuery(elem).removeClass("redAction blueAction") });
	
	uniqueRedActions.forEach(function(action){
		jQuery("#red-"+action.replace(" ","-")).addClass("redAction");
	});
	uniqueBlueActions.forEach(function(action){
		jQuery("#blue-"+action.replace(" ","-")).addClass("blueAction");
	});
	
	if (updateGame()) {
		// do whatever is done upon finishing a game
	}
}

var keystates = {};
function handleInput(event) {
	if (event.target.id !== 'playfield') { return; }
	
	// console.log(event.which);
	if (event.which == 27){ //ESC key, stops animation
		clearInterval(renderLoop);
		renderLoop = false;
		return;
	} else if (event.which == 13){ //ENTER key, resumes animation
		event.preventDefault();
		if (!renderLoop){ renderLoop = setInterval(update, 30); }
		return;
	} else if (event.which == 32 && event.type == 'keyup'){ //SPACEBAR key, resets field
		setupGame(0);
	} else if (event.which == 83 && event.type == 'keyup'){ //S key, restarts game
		setupGame(1);
	}
	
	if (event.which == 191 || event.which == 32){ event.preventDefault(); };
	
	if (event.type == 'keydown'){ keystates[event.which] = true;  }
	if (event.type == 'keyup')  {
		keystates[event.which] = false;
		
		if (event.which == 66 && redPlayer === "human") {
			window["red"].missileReady = true;
		} else if (event.which == 191 && bluePlayer === "human") {
			window["blue"].missileReady = true;
		}
	}
}


function human_setup(team) {
	var keysOfInterest = {"red":[90,88,67,86,66], "blue":[78,77,188,190,191]};
	var choices = ["turn left","turn right","hyperspace","fire engine","fire missile"];
	return {'keys':keysOfInterest[team], 'choices':choices};
}

function human_getActions(gameInfo,botVars) {
	var actions = [];
	
	for (var i=0; i<5; i++) {
		var key = botVars.keys[i];
		if (keystates[key]) { actions.push(botVars.choices[i]) }
	}
	
	return actions;
}


function setUserBotCode() {
	window["userbot_setup"] = new Function("team", "var botVars = {};\n"+jQuery("#userbot-setup").val()+"\n\nreturn botVars;");
	window["userbot_getActions"] = new Function("gameInfo", "botVars", "var actions = [];\n"+jQuery("#userbot-getactions").val()+"\nreturn actions;");
}