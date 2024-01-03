module.exports = function(timestamp, duration, delta) {
	let date = new Date()

	if (duration == 1) {
		date = new Date(timestamp + ((delta + 30000) + (60 * 1000)))
	} else {
		for (var i = 0; i < 60; i++) {
			date = new Date(timestamp + ((delta + 90000) + ((60 * i) * 1000)))
			if (!(date.getMinutes() % duration)) break
		}
	}

	date.setSeconds(0)
	date.setMilliseconds(0)

	return date
}