function API(WebSocket, Http) {
	this.WebSocket = WebSocket
	this.Http = Http
}

API.prototype.login = require("./http/login")
API.prototype.getRegData = require("./http/getregdata")

API.prototype.connect = require("./websocket/connect")
API.prototype.timeSync = require("./websocket/timesync")
API.prototype.heartbeat = require("./websocket/heartbeat")
API.prototype.getCandles = require("./websocket/getcandles")
API.prototype.getBalance = require("./websocket/getbalance")
API.prototype.trade = require("./websocket/trade")
API.prototype.onCandleGenerate = require("./websocket/oncandlegenerate")

API.prototype.ssid = require("./storages/ssid")
API.prototype.profile = require("./storages/profile")
API.prototype.connected = require("./storages/connected")
API.prototype.actives = require("./storages/actives")
API.prototype.accountType = require("./storages/accountType")
API.prototype.serverTimestamp = require("./storages/servertimestamp")

module.exports = API
