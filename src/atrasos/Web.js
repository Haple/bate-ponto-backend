/**
 * Nesse arquivo é feita a interface com a internet. 
 * Aqui são recebidas as requisições HTTP e onde são 
 * manipuladas as entradas e saídas das rotas.
 * 
 */
const router = require("express").Router();
const { checaJWT, ehAdmin } = require("../sessoes/Validacoes");
const { buscarAtrasos } = require('./Regras');
/**
 * Buscar atrasos
 */
router.get("/", checaJWT, ehAdmin, async (req, res) => {
	const { cod_empresa } = req.usuario;
	const pontos = await buscarAtrasos(cod_empresa);
	return res.json(pontos);
});

module.exports = app => app.use('/atrasos', router);


