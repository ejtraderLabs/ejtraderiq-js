const md5 = require("md5")

module.exports = function(name, msg) {
	const id = md5(Math.random())

	const message = {
		name,
		msg,
		request_id: id
	}

	this.socket.send(JSON.stringify(message))

	return id
}