module.exports = {
	"mixins": [],
	"actions": {
		"login": function() {
			this._res.writeHead(200, {"Content-Type": "text/plain"});
			this._res.write("/index/login");
			this._res.end();
		}
	}
};