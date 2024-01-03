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
const type = "DIGITAL" // BINARY OR DIGITAL
const accountType = "PRACTICE" // REAL OR PRACTICE
const active = "NZDUSD-OTC"

let opering = false
/*
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
*/
let threshold = 0.5; // Variável global para o limiar
let weightCounter = 0; // Contador para ajustar o peso

async function operate(API) {
    try {
        opering = true;
        log("===============================");

        const candles = await API.getCandles(active, candleSize, 10, Date.now());
        const binaryCandles = candles.map(({ open, close }) => open >= close ? 0 : 1);
        const sumOfLast10 = binaryCandles.slice(-10).reduce((acc, value) => acc + value, 0);

        // Calcula a probabilidade condicional da direção ser "PUT" dado que as últimas 10 velas são favoráveis
        const probabilityOfPUT = sumOfLast10 / 10;

        // Ajusta o limiar para tentar reduzir as perdas
        if (weightCounter % 3 === 0) {
            threshold -= 0.01; // Diminui o limiar na escala de 0.01
            threshold = Math.max(threshold, 0.01); // Garante que o limiar não seja menor que 0.01
        }

        // Decide a direção com base na probabilidade condicional e no limiar
        const direction = probabilityOfPUT >= threshold ? "PUT" : "CALL";

        log(`ÚLTIMAS VELAS: ${binaryCandles}`);
        log(`DIREÇÃO: ${direction} (Probabilidade de PUT: ${probabilityOfPUT.toFixed(2)}, Limiar: ${threshold.toFixed(2)})`);

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

          // Atualiza o contador
          weightCounter++;

          opering = false;
    } catch (error) {
        console.log(error);
    }
}





IQOption({
	email: "blogdoalysson@gmail.com",
	password: "99636663",
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
