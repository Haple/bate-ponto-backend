/**
 * Nesse arquivo é feita a interface com a internet. 
 * Aqui são recebidas as requisições HTTP e onde são 
 * manipuladas as entradas e saídas das rotas.
 * 
 */
const router = require("express").Router();
const { confirmar } = require("./Regras");

router.post("/:cod_confirmacao", async (req, res) => {
	try {
		const email = await confirmar(req.params.cod_confirmacao);
		return res.status(200).json({ mensagem: "Usuário confirmado", email });
	} catch (error) {
		return res.status(400).json({ erro: "Código inválido" });
	}
});

module.exports = app => app.use('/confirmacoes', router);