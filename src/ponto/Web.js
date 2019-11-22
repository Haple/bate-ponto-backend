/**
 * Nesse arquivo é feita a interface com a internet. 
 * Aqui são recebidas as requisições HTTP e onde são 
 * manipuladas as entradas e saídas das rotas.
 * 
 */
const router = require("express").Router();
const cron = require('node-cron');
const { toDate } = require("date-fns");
const { checaJWT, ehEmpregado } = require("../sessao/Validacoes");
const { checaPonto } = require("./Validacoes");
const { buscarJornada } = require("../jornada/Regras");
const { salvarPonto, buscarEmpregados, } = require("./Regras");
const { buscarPontosDeOntem, atualizaBancoDeHoras } = require("./Regras");
const { calculaSaldo, buscarPontos } = require("./Regras");

router.use(checaJWT);
router.use(ehEmpregado);

/**
 * Bater ponto
 */
router.post("/", checaPonto, async (req, res) => {
	const { codigo } = req.usuario;
	const { latitude, longitude, localizacao } = req.body;
	const ponto = await salvarPonto(latitude, longitude, localizacao, codigo);
	return res.json(ponto);
});

/**
 * Buscar pontos (pessoal)
 */
router.get("/", async (req, res) => {
	const { codigo } = req.usuario;
	const pontos = await buscarPontos(codigo);
	return res.json(pontos);
});

/**
 * Cálculo de banco de horas executado 2h de terça a sábado.
 * Esse job calcula o banco de horas de todos os empregados,
 * se baseando nos pontos registrados no dia anterior, ou
 * seja, a execução de terça-feira calcula o banco de horas
 * se baseando nos pontos registrados na segunda-feira, e
 * assim por diante.
 *  
 */
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

module.exports = app => app.use('/pontos', router);


