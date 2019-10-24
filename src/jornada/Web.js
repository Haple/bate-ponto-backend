/**
 * Nesse arquivo é feita a interface com a internet. 
 * Aqui são recebidas as requisições HTTP e onde são 
 * manipuladas as entradas e saídas das rotas.
 * 
 */
const router = require("express").Router();
const { checaJWT } = require("../sessao/Validacoes");
const { checaCadastro, checaExclusao } = require("./Validacoes");
const { jornadaJaExistente, criarJornada } = require("./Regras");
const { buscarJornadas, deletarJornada } = require("./Regras");


router.delete("/:cod_jornada", checaJWT, checaExclusao, async (req, res) => {
	const { cod_empresa } = req.usuario;
	const { cod_jornada } = req.params;
	const deletado = await deletarJornada(cod_empresa, cod_jornada);
	if (deletado) return res.status(200).json();
	else return res.status(404).json();
});

router.get("/", checaJWT, async (req, res) => {
	const { cod_empresa } = req.usuario;
	const jornadas = await buscarJornadas(cod_empresa);
	return res.json(jornadas);
});

router.post("/", checaJWT, checaCadastro, async (req, res) => {
	const { nome, entrada1, saida1 } = req.body;
	const { entrada2, saida2 } = req.body;
	const { cod_empresa } = req.usuario;
	try {
		await jornadaJaExistente(cod_empresa, nome);
	} catch (erro) {
		return res.status(400).json({ erro: erro.message });
	}
	const jornada = await criarJornada(
		cod_empresa,
		nome,
		entrada1,
		saida1,
		entrada2,
		saida2);
	return res.status(201).json(jornada);
});

module.exports = app => app.use('/jornadas', router);

