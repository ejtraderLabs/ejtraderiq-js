module.exports = {
	log: (message, lineBreak = true) => process.stdout.write(`[${new Date().toTimeString().split(" ")[0]}] ${message}${lineBreak ? "\n" : ""}`),
	sleep: ms => new Promise(resolve => setTimeout(resolve, ms))
}