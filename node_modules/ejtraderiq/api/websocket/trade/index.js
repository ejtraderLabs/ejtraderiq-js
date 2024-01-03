const trade = require("./trade")

module.exports = function(options) {
	return new trade(this, options)
}