module.exports = function() {
	this.WebSocket.getMessage("heartbeat", message => {
		this.WebSocket.send("heartbeat", {
            		heartbeatTime: message.msg,
            		userTime: Date.now()
       		})
	})
}
