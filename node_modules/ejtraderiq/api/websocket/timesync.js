module.exports = function() {
	return new Promise(resolve => {
		this.WebSocket.getMessage("timeSync", message => {
			this.serverTimestamp = message.msg
			return resolve(message.msg)
		})
	})
}