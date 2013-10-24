var watch = require("node-watch");
var spawn = require("child_process").spawn;

var appSpawn = spawn("node", ["app.js"]);

appSpawn.stdout.on("data", onAppOutput);
appSpawn.on("close", onAppClose);
appSpawn.on("error", onAppError);

watch(".", function(filename) {
	console.log("File changed: "+filename);
	if(!appSpawn.kill()) {
		console.log("Uh oh, unable to kill the app");
	}
});

function onAppClose(code, signal) {
	appSpawn = spawn("node", ["app.js"]);
	appSpawn.stdout.on("data", onAppOutput);
	appSpawn.on("close", onAppClose);
}

function onAppOutput(outputBuffer) {
	console.log(outputBuffer.toString());
}

function onAppError(error) {
	console.log(error);
}