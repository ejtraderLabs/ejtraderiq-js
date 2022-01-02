module.exports = function(type) {
	return new Promise((resolve, reject) => {
		if (["PRACTICE", "REAL"].indexOf(type) == -1)
			return reject("Ativo inválido.")

		const id = this.WebSocket.send("sendMessage", {
			name: "get-balances",
			version: "1.0",
			body: {
				types_ids: [1, 4, 2],
				tournaments_statuses_ids: [3, 2]
			}
		})

		const callback = message => {
			if (message.request_id == id) {
				this.WebSocket.emitter.removeListener("balances", callback)
				return resolve(message.msg.find(balance => type == "REAL" && balance.type == 1 || type == "PRACTICE" && balance.type == 4))
			}
		}

		this.WebSocket.getMessage("balances", callback)
	})
}