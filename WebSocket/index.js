const {EventEmitter} = require("events")

function WebSocket() {
	this.emitter = new EventEmitter()
}

WebSocket.prototype.init = require("./init")
WebSocket.prototype.send = require("./send")
WebSocket.prototype.getMessage = require("./getmessage")

module.exports = WebSocket