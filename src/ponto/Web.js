/**
 * Nesse arquivo é feita a interface com a internet. 
 * Aqui são recebidas as requisições HTTP e onde são 
 * manipuladas as entradas e saídas das rotas.
 * 
 */
const router = require("express").Router();
const mailer = require("nodemailer");
const cron = require('node-cron');
const { toDate } = require("date-fns");
const { checaJWT, ehEmpregado } = require("../sessao/Validacoes");
const { checaPonto } = require("./Validacoes");
const { salvarPonto, buscarEmpregados, buscarJornada } = require("./Regras");
const { buscarPontosDeOntem, calculaSaldo, atualizaBancoDeHoras } = require("./Regras");

router.use(checaJWT);
router.use(ehEmpregado);

router.post("/", checaPonto, async (req, res) => {
	const { codigo } = req.usuario;
	const { latitude, longitude, localizacao } = req.body;
	const ponto = await salvarPonto(latitude, longitude, localizacao, codigo);
	return res.json(ponto);
});

router.get("/", async (req, res) => {
	const { codigo } = req.usuario;
	const pontos = await buscarPontosDeHoje(codigo);
	return res.json(pontos);
});

cron.schedule('0 0 2 * * TUE-SAT', async () => {
	console.log("Iniciando atualização do banco de horas...");
	const empregados = await buscarEmpregados();
	empregados.forEach(async empregado => {
		const { cod_usuario, cod_jornada, banco_horas } = empregado;
		const { carga_diaria } = await buscarJornada(cod_jornada);
		const pontosDeOntem = (await buscarPontosDeOntem(cod_usuario))
			.map(ponto => toDate(ponto.criado_em));
		const saldoDeOntem = calculaSaldo(pontosDeOntem, carga_diaria);
		await atualizaBancoDeHoras(banco_horas + saldoDeOntem, cod_usuario);
		if (saldoDeOntem == -carga_diaria) {
			console.log(`O empregado ${cod_usuario} não trabalhou ontem`);
		}
	});
}, {
	scheduled: true,
	timezone: "America/Sao_Paulo"
});

cron.schedule('* * * * *', async () => {
	console.log("TESTE HEROKU: ", new Date());
}, {
	scheduled: true,
	timezone: "America/Sao_Paulo"
});

module.exports = app => app.use('/pontos', router);


