/**
 * Nesse arquivo é feita a interface com a internet. 
 * Aqui são recebidas as requisições HTTP e onde são 
 * manipuladas as entradas e saídas das rotas.
 * 
 */
const router = require("express").Router();
const { checaAlgumaCoisa } = require("./Validacoes");
const { algumaRegra } = require("./Regras");

// rotas dos abonos
router.post("/", checaAlgumaCoisa, async (req, res) => {
	algumaRegra();
	return res.status(200).json({ msg: "ALGUMA COISA" });
});

require('./avaliacao')(router);

module.exports = app => app.use('/abonos', router);