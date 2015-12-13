var renderLoop;
(function($){
	$(document).ready(function (){
		console.log("main.js");
		setup();
		renderLoop = setInterval(update, 30);
		$(document).keydown(handleInput);
	});
})(jQuery);

var red = d3.select("#red");
var blue = d3.select("#blue");

function setup() {
	red.x = 50;
	red.y = Math.floor(500*Math.random())+50;
	red.rot = 90;
	red.xv = 10;
	red.yv = 0;
	red.attr("transform","translate("+red.x+","+red.y+"),rotate("+red.rot+")");
	
	blue.x = 800-50;
	blue.y = Math.floor(500*Math.random())+50;
	blue.rot = -90;
	blue.xv = 0;
	blue.yv = 0;
	blue.attr("transform","translate("+blue.x+","+blue.y+"),rotate("+blue.rot+")");
}

function update() {
	if (red.xv > 10){ red.xv = 10 } else if (red.xv < 0){red.xv = 0}
	if (red.yv > 10){ red.yv = 10 } else if (red.yv < 0){red.yv = 0}
	red.x += red.xv;
	red.x = (red.x+800)%800;
	red.y += red.yv;
	red.y = (red.y+600)%600;
	d3.select('#red').attr("transform","translate("+red.x+","+red.y+"),rotate("+red.rot+")");
	d3.select('#blue').attr("transform","translate("+blue.x+","+blue.y+"),rotate("+blue.rot+")");
}

function redMove(action) {
	switch (action){
		case "thrust":
		red.xv += Math.cos(red.rot);
		red.yv += Math.sin(red.rot);
		break;
		case "fire":
		// fireMissile("red");
		break;
		case "turn right":
		red.rot = red.rot + 5;
		break;
		case "turn left":
		red.rot = red.rot - 5;
		break;
		case "hyperspace":
		break;
	}
}

function handleInput(event) {
	console.log(event.which);
	switch (event.which){
		// general
		case 27:
		clearInterval(renderLoop);
		break;
		case 13:
		event.preventDefault();
		renderLoop = setInterval(update, 30);
		break
		
		// RED
		case 122:
		break;
		case 120:
		break;
		case 99:
		break;
		case 118:
		break;
		case 98:
		break;
		
		// BLUE
		case 110:
		break;
		case 109:
		break;
		case 44:
		break;
		case 46:
		break;
		case 47:
		break;
	}
}

// var svg = d3.select('svg');
