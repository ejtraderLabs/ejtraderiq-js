module.exports = function(name, callback) {
	this.emitter.on(name, callback)
}