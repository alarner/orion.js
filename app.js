try {
	var global = require("./configs/global.js");
	var _ = require("underscore");
	var http = require("http");
	var router = require("basic_router");
	router.addRoute("(:any)/(:any)", function(matches) {
		var action = matches[1];
		var controllerFile = matches[0].toLowerCase()+"-controller.js";
		var controller = require("./mvc/controllers/"+controllerFile);
		matches.splice(0, 2);
		return {"func": controller.actions[action], "obj": controller};
	});
}
catch(e) {
	console.log(e.stack);
}

http.createServer(function(req, res) {
	try {
		var route = router.getRoute(req.url);
		if(route) {
			var callbackResult = route.callback(route.matches);
			var funcThis = callbackResult.func;
			if(callbackResult.obj) {
				callbackResult.obj._req = req;
				callbackResult.obj._res = res;
				funcThis = callbackResult.obj;
				if(callbackResult.obj.hasOwnProperty('mixins') && callbackResult.obj.mixins instanceof Object) {
					for(var i=0; i<callbackResult.obj.mixins.length; i++) {
						_.extend(callbackResult.obj, callbackResult.obj.mixins[i]);
					}
				}
			}
			if(callbackResult.obj.beforeAction) callbackResult.obj.beforeAction();
			callbackResult.func.apply(funcThis, route.matches);
			if(callbackResult.obj.afterAction) callbackResult.obj.afterAction();
		}
		else {
			res.writeHead(404, {"Content-Type": "text/html"});
			var template = require("basic_template");
			if(global["404_page"][0] != "/") global["404_page"] = "/"+global["404_page"];
			var html = template.render(__dirname+global["404_page"], {"req": req, "res": res});
			if(html) {
				res.write(html);
			}
			else {
				res.write('<html><body><h1>404 page not found.</h1></body></html>');
			}
			res.end();
		}
	}
	catch(e) {
		console.log(e.stack);
		require("basic_exception_handler")(e, res);
	}
}).listen(7357);