"use strict";

var renderLoop;
(function($){
	$(document).ready(function (){
		console.log("main.js");
		init();
		renderLoop = setInterval(update, 30);
		$(document).keydown(handleInput);
		$(document).keyup(handleInput);
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

function init() {
	initGame();
}

function update() {
	//pollBots();
	
	updateGame();
}

var keystates = {};
function handleInput(event) {
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
		
		if (event.which == 66) {
			window["red"].missileReady = true;
		} else if (event.which == 191) {
			window["blue"].missileReady = true;
		}
	}
}

var keysOfInterest = [
			90,88,67,86,66,
			78,77,188,190,191
		     ];
function checkKeys() {
	keysOfInterest.forEach(function(k){
		if (keystates[k]){
			switch (k){
				// RED
				case 90:
					teamMove("red","turn left");
					break;
				case 88:
					teamMove("red","turn right");
					break;
				case 67:
					teamMove("red","hyperspace");
					break;
				case 86:
					teamMove("red","fire engine");
					break;
				case 66:
					teamMove("red","fire missile");
					break;
				
				// BLUE
				case 78:
					teamMove("blue","turn left");
					break;
				case 77:
					teamMove("blue","turn right");
					break;
				case 188:
					teamMove("blue","hyperspace");
					break;
				case 190:
					teamMove("blue","fire engine");
					break;
				case 191:
					teamMove("blue","fire missile");
					break;
			}
		} else {
			switch (k){
				case 86:
					window["red"].flame = 0;
					break;
				case 190:
					window["blue"].flame = 0;
					break;
			}
		}
	});
}
