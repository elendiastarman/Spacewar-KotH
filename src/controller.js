function Player(){
	if(red.assigned){
		if(blue.assigned){
			return null;
		}
		blue.assigned = true;
		this.team = "blue";
		this.ship = blue;
	} else {
		this.team = "red";
		this.ship = red;
		red.assigned = true;
	}
	Player.players.push(this);
}

Player.players = [];

/*function Field(width,height){
	this.width      = width;
	this.height     = height;
	this.players    = [];
}

Field.prototype.connect = function(player){
	if(!(player instanceof Player)){
		// reject non-player object
		return null;
	}
	this.players.push({
		player: player,
		missles: 20,
		x: 0,
		y: 0,
		turn: 0
	});
}

Field.prototype.frame = function(){
	// loop through all the players and get decisions!
	for(var i=0;i<this.players.length;i++){
		var currentPlayer = this.players[i];
		var action = currentPlayer.player.frame();
		if(action.type=="fire"){
			currentPlayer.missles--;
		}
	}
}

function Action(type,data){
	this.type = type;
	this.data = data;
}

var sendMissle = new Action("fire",{});

function Player(name,frameFunction){
	this.name       = name;
	this.frame      = frameFunction;
}*/
