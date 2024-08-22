module.exports = {
	WEBSOCKET: {
		GATEWAY: {
			protocol: "wss",
			host: "iqoption.com",
			port: 443,
			path: "echo/websocket"
		}
	},
	API: {
		URL: {
			default: "iqoption.com",
			auth: "auth.iqoption.com",
			billing: "billing.iqoption.com"
		}
	}
}