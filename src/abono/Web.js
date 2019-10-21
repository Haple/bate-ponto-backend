/**
 * Nesse arquivo é feita a interface com a internet. 
S * Aqui são recebidas as requisições HTTP e onde são 
 * manipuladas as entradas e saídas das rotas.
 * 
 */
const router = require("express").Router();
const { ehPedidoValido } = require("./Validacoes");
const { ehEmpregado, criarAbono } = require("./Regras");

// rotas dos abonos
router.post("/", ehPedidoValido, async (req, res) => {
	const { cod_usuario, dataSolicitacao, dataAbono, motivo } = req.body;

	try {

		//const empregado = await ehEmpregado(cod_usuario);
		//if(empregado) criarAbono(cod_usuario, dataSolicitacao, dataAbono, motivo);

		return res.status(200).json({ msg: req.body });

	} catch (erro) {
		return res.status(401).json({ erro: erro.message });
	}
});

//require('./avaliacao')(router);

module.exports = app => app.use('/abonos', router);