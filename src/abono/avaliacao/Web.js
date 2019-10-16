/**
 * Nesse arquivo é feita a interface com a internet. 
 * Aqui são recebidas as requisições HTTP e onde são 
 * manipuladas as entradas e saídas das rotas.
 * 
 */
const router = require("express").Router({ mergeParams: true });
const { checaJWT } = require("../../sessao/Validacoes");
const { checaAlgumaCoisa } = require("./Validacoes");
const { algumaRegra } = require("./Regras");

// rotas das avaliações
router.post("/", checaJWT, async (req, res) => {
	algumaRegra();
	return res.status(200).json({
		id: req.params.id_abono,
		cod_usuario: req.usuario.codigo
	});
});

module.exports = app => app.use('/:id_abono/avaliacoes', router);