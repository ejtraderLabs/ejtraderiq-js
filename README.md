```js
const IQOption = require("ejtraderiq")
const {log, sleep} = require("ejtraderiq/utils")

const martinGales = [
	2.22,
	4.88,
	11.90,
	29.05,
	70.89,
	172.97,
	422.05,
	1029.81
]
const candleSize = 60 // MH1 = 60, MH5 = 300
const type = "BINARY" // BINARY OR DIGITAL
const accountType = "PRACTICE" // REAL OR PRACTICE
const active = "EURUSD"

let opering = false

async function operate(API) {
	try {
		opering = true
		log("===============================")

		const candles = await API.getCandles(active, candleSize, 3, Date.now())
		const binaryCandles = candles.map(({open, close}) => open >= close ? 0 : 1)
		const direction = binaryCandles.filter(Boolean).length >= 2 ? "PUT" : "CALL"

		log(`ULTIMAS VELAS: ${binaryCandles}`)
		log(`DIREÇAO: ${direction}`)

		for (let martinGale of martinGales) {
			const martinGaleNumber = martinGales.indexOf(martinGale)
			const isMartinGale = martinGale == martinGales[0]
			martinGale = martinGale.toFixed(2)

			log(isMartinGale ? `ENTRADA: R$ ${martinGale}` : `MG${martinGaleNumber}: R$ ${martinGale}`, false)
			const order = await API.trade({
				active,
				action: direction,
				amount: martinGale,
				type,
				duration: candleSize / 60
			})
			await order.close()
			const result = order.quote.win ? "WIN" : "LOSS"
			const balance = await API.getBalance(accountType)
			
			console.log("", result)
			console.log("", balance.amount)
			if (result == "WIN") break
		}

		opering = false
	} catch (error) {
		console.log(error)
	}
}


IQOption({
	email: "my@email.com",
	password: "mypassword",
}).then(async API => {
	API.accountType(accountType) // REAL OR PRACTICE
	

	const initInterval = setInterval(() => {
		const date = new Date(API.serverTimestamp)
		const nowMinutes = date.getMinutes()
		const nowSeconds = date.getSeconds()
		
		
		if (nowMinutes % 5 == 0) { // delay prevent (nowMinutes % 5 == 4 && nowMinutes % 3 == 2) && nowSeconds == 59
			operate(API)
			setInterval(() => {
				if (!opering) operate(API)
			}, (candleSize * 5) * 1000)
			return clearInterval(initInterval)
		}

		console.clear()
		log(`Aguardando entrada...`)
	}, 20)
}).catch(error => {
	log(error.message)
})

```
