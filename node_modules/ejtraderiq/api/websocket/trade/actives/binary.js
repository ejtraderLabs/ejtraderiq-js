const getExpiration = require("../getexpiration")

module.exports = function() {
	return new Promise((resolve, reject) => {
		const {
			active,
			amount,
			action,
			duration
		} = this.options

		const expiration = getExpiration(this.API.serverTimestamp, duration, 0)

		const id = this.API.WebSocket.send("sendMessage", {
			name: "binary-options.open-option",
			version: "1.0",
			body: {
				user_balance_id: this.API.balance.id,
				active_id: this.API.actives[active],
				option_type_id: duration > 5 ? 1 : 3,
				direction: action.toLowerCase(),
				expired: expiration.getTime() / 1000,
				refund_value: 0,
				price: Number(amount),
				value: 0,
				profit_percent: 0
			}
		})

		const callback = message => {
			if (message.request_id == id) {
				this.API.WebSocket.emitter.removeListener("option", callback)
				if (message.status != 0) return reject(message.msg)
				return resolve({
					status: "open",
					win: null,
					id: message.msg.id,
					created: this.API.serverTimestamp,
					expire: expiration.getTime()
				})
			}
		}

		this.API.WebSocket.getMessage("option", callback)
	})
}