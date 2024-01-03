const Settings = require("../../settings")

module.exports = async function() {
	const {
		isSuccessful,
		message,
		result
	} = await this.Http(Settings.API.URL.default, "api/register/getregdata", "GET", {}, {
		Cookie: "lang=pt_PT; ssid=" + this.ssid
	})

	if (!isSuccessful)
		throw new Error(message)

	return result
}