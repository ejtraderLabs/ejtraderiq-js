module.exports = function(active, callback) {
	return new Promise((resolve, reject) => {
		if (!(active in this.actives))
			return reject("Invalid asset.")

		const activeId = this.actives[active]

		this.WebSocket.send("subscribeMessage", {
			name: "candle-generated",
			params: {
				routingFilters: {
					active_id: activeId,
					size: 60
				}
			}
		})

		this.WebSocket.getMessage("candle-generated", message => {
			if (message.msg.active_id == activeId) {
				callback(message.msg)
			}
		})
	})
}