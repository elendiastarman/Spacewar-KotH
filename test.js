window.addEventListener("load",function(){
	// it loaded correctly
	console.log("test.js");
	// setting some useful functions
	window.logData = function(){
		var z = [];
		for(var i=0;i<arguments.length;i++){
			z.push(arguments[i]);
		}
		document.body.innerHTML += "<p>"+z.map(JSON.stringify).join(" ")+"</p>";
	}
	window.logMessage = function(){
		var z = [];
		for(var i=0;i<arguments.length;i++){
			z.push(arguments[i]);
		}
		document.body.innerHTML += "<p>"+z.join(" ")+"</p>";
	}
	// testing
	//logData([1,2],"3",4,Math.PI,[1,2,"3",[3,4]]);
	//logMessage("Success!");
});
