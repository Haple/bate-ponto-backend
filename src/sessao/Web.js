/**
 * Nesse arquivo é feita a interface com a internet. 
 * Aqui são recebidas as requisições HTTP e onde são 
 * manipuladas as entradas e saídas das rotas.
 * 
 */
const router = require("express").Router();
const jwt = require('jsonwebtoken');
const { checaLogin } = require("./Validacoes");
const { checaCredenciais, buscaEmpregado, buscaAdmin } = require("./Regras");

router.post("/", checaLogin, async (req, res) => {
	const { email, senha } = req.body;
	try {
		const usuario = await checaCredenciais(email, senha);
		const empregado = await buscaEmpregado(usuario.codigo);
		const admin = await buscaAdmin(usuario.codigo);
		const token = jwt.sign({
			...usuario,
			...admin,
			...empregado,
			admin: admin ? true : false,
			empregado: empregado ? true : false,
		}, process.env.SECRET, {
			expiresIn: 86400 // expira em 24 horas
		});
		return res.status(200).json({ token });
	} catch (erro) {
		return res.status(401).json({ erro: erro.message });
	}
});

module.exports = app => app.use('/sessoes', router);