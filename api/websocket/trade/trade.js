const {
	Binary,
	Digital
} = require("./actives")

function trade(API, options) {
	this.API = API
	this.options = options

	return new Promise(async (resolve, reject) => {
		if (!(this.options.active in this.API.actives))
			return reject("(trade) Invalid asset.")
		else if (Number.isNaN(parseInt(this.options.amount)))
			return reject("(trade) Invalid value.")
		else if (["CALL", "PUT"].indexOf(this.options.action) == -1)
			return reject("(trade) invalid action.")
		else if (["BINARY", "DIGITAL", "FOREX"].indexOf(this.options.type) == -1)
			return reject("(trade) Invalid type.")

		try {
			if (this.options.type == "BINARY") {
				this.quote = await Binary.call(this)
			} else if (this.options.type == "DIGITAL") {
				this.quote = await Digital.call(this)
			}
		} catch(error) {
			return reject(`(trade) ${error.message}`)
		}

		return resolve(this)
	})
}

trade.prototype.close = require("./close")

module.exports = trade