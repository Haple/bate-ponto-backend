/**
 * Nesse arquivo é feita a interface com a internet. 
 * Aqui são recebidas as requisições HTTP e onde são 
 * manipuladas as entradas e saídas das rotas.
 * 
 */
const router = require("express").Router();
const { checaCodIndicador } = require("./Validacoes");
const { buscaIndicadores, configurarIndicador, responderIndicador } = require("./Regras");
const { buscaIndicadoresRestantes } = require("./Regras");
const { checaJWT, ehAdmin, ehEmpregado } = require("../sessao/Validacoes");

router.use(checaJWT);

/**
 * Buscar os resultados dos indicadores da empresa (dashboard)
 */
router.get("/resultados", ehAdmin, async (req, res) => {
	const { cod_empresa } = req.usuario;
	const indicadores = await buscaIndicadores(cod_empresa);
	return res.json(indicadores);
});

/**
 * Configurar um indicador (habilitar/desabilitar)
 */
router.patch("/:cod_indicador", ehAdmin, checaCodIndicador, async (req, res) => {
	const { cod_empresa } = req.usuario;
	const { cod_indicador } = req.params;
	const { ativado } = req.body;
	try {
		await configurarIndicador(cod_empresa, cod_indicador, ativado);
		return res.status(200).json();
	} catch (erro) {
		return res.status(404).json({ erro: erro.message })
	}
});

/**
 * Responder indicador
 */
router.post("/:cod_indicador/respostas", ehEmpregado, checaCodIndicador, async (req, res) => {
	const { cod_empresa, codigo: cod_empregado } = req.usuario;
	const { cod_indicador } = req.params;
	const { resposta } = req.body;
	try {
		const resposta_salva = await responderIndicador(
			cod_empresa, cod_indicador, cod_empregado, resposta
		);
		return res.status(200).json(resposta_salva);
	} catch (erro) {
		return res.status(404).json({ erro: erro.message })
	}
});

/**
 * Buscar os indicadores para responder
 */
router.get("/", ehEmpregado, async (req, res) => {
	const { cod_empresa, codigo: cod_empregado } = req.usuario;
	const indicadores = await buscaIndicadoresRestantes(cod_empresa, cod_empregado);
	return res.json(indicadores);
});



module.exports = app => app.use('/indicadores', router);

