module.exports = function() {
	return new Promise(resolve => {
		const callback = message => {
			if (message.msg.status == "closed" && ((this.options.type == "BINARY" && message.msg.external_id == this.quote.id) || (this.options.type == "DIGITAL" && message.msg.raw_event.order_ids.indexOf(this.quote.id) != -1))) {
				this.API.WebSocket.emitter.removeListener("position-changed", callback)
				
				const action = this.options.action

				const {
					open_quote,
					close_quote
				} = message.msg

				this.quote.win = ((open_quote < close_quote) && action == "CALL") || ((open_quote > close_quote) && action == "PUT")
				this.quote.status = "closed"
				return resolve(message.msg)
			}
		}

		this.API.WebSocket.getMessage("position-changed", callback)
	})
}