/**
 * Nesse arquivo é feita a interface com a internet. 
 * Aqui são recebidas as requisições HTTP e onde são 
 * manipuladas as entradas e saídas das rotas.
 * 
 */
const router = require("express").Router();
const { confirmar } = require("./Regras");

/**
 * Confirmar e-mail
 */
router.get("/:cod_confirmacao", async (req, res) => {
	try {
		await confirmar(req.params.cod_confirmacao);
		return res.redirect(process.env.PAGINA_LOGIN);;
	} catch (error) {
		return res.status(400).json({ erro: "Código inválido" });
	}
});

module.exports = app => app.use('/confirmacoes', router);