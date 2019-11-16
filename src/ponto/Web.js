/**
 * Nesse arquivo é feita a interface com a internet. 
 * Aqui são recebidas as requisições HTTP e onde são 
 * manipuladas as entradas e saídas das rotas.
 * 
 */
const router = require("express").Router();
const { toDate } = require("date-fns");
const { checaJWT, ehEmpregado } = require("../sessao/Validacoes");
const { checaPonto } = require("./Validacoes");
const { atualizaBancoDeHoras, buscarEmpregado, buscarJornada } = require("./Regras");
const { buscarPontosDeHoje, calculaNovoSaldo, salvarPonto } = require("./Regras");

router.use(checaJWT);
router.use(ehEmpregado);

router.post("/", checaPonto, async (req, res) => {
	const { codigo } = req.usuario;
	const { latitude, longitude, localizacao } = req.body;
	const ponto = await salvarPonto(latitude, longitude, localizacao, codigo);
	const pontosDeHoje = (await buscarPontosDeHoje(codigo))
		.map(ponto => toDate(ponto.criado_em));
	const { cod_jornada, banco_horas } = await buscarEmpregado(codigo);
	const { carga_diaria } = await buscarJornada(cod_jornada);
	const saldoAtual = calculaNovoSaldo(pontosDeHoje, carga_diaria, banco_horas);
	await atualizaBancoDeHoras(saldoAtual, codigo);
	return res.json(ponto);
});

router.get("/", async (req, res) => {
	const { codigo } = req.usuario;
	const pontos = await buscarPontosDeHoje(codigo);
	return res.json(pontos);
});

module.exports = app => app.use('/pontos', router);


