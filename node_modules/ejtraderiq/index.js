const API = require("./api")
const WebSocket = require("./WebSocket")
const Http = require("./http")

module.exports = async function({ email, password }) {
    const websocket = new WebSocket()
    await websocket.init()
    
    const api = new API(websocket, Http)
    await api.login(email, password)
    await api.connect()
    await api.timeSync()
    api.heartbeat()
    api.accountType("PRACTICE")

    return api
}
