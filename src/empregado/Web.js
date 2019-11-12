/**
 * Nesse arquivo é feita a interface com a internet. 
 * Aqui são recebidas as requisições HTTP e onde são 
 * manipuladas as entradas e saídas das rotas.
 * 
 */
const router = require("express").Router();
const { checaCadastro, checaAtualizacao, checaExclusao } = require("./Validacoes");
const { criarEmpregado, cadastroJaExistente, buscaEmpregado } = require("./Regras");
const { atualizaEmpregado, buscaEmpregados, deletarEmpregado } = require("./Regras");
const { jornadaExiste } = require("./Regras");
const { criarConfirmacao, enviarEmailConfirmacao } = require("../confirmacao/Regras");
const { criarUsuario } = require("../empresa/Regras");
const { checaJWT } = require("../sessao/Validacoes");

router.get("/:cod_empregado", checaJWT, async (req, res) => {
	const { cod_empresa } = req.usuario;
	const { cod_empregado } = req.params;
	try {
		const empregado = await buscaEmpregado(cod_empresa, cod_empregado);
		return res.status(200).json(empregado);
	} catch (erro) {
		return res.status(404).json({ erro: erro.message })
	}
});

router.delete("/:cod_empregado", checaJWT, checaExclusao, async (req, res) => {
	const { cod_empresa } = req.usuario;
	const { cod_empregado } = req.params;
	try {
		await deletarEmpregado(cod_empresa, cod_empregado);
		return res.status(200).json();
	} catch (erro) {
		return res.status(404).json({ erro: erro.message })
	}
});

router.get("/", checaJWT, async (req, res) => {
	const { cod_empresa } = req.usuario;
	const { nome, cod_jornada } = req.query;
	const empregados = await buscaEmpregados(cod_empresa, cod_jornada, nome);
	return res.json(empregados);
});

router.put("/:cod_empregado", checaJWT, checaAtualizacao, async (req, res) => {
	const { cod_empresa } = req.usuario;
	const { cod_empregado } = req.params;
	const { nome, email, celular, cod_jornada } = req.body;
	try {
		await jornadaExiste(cod_jornada, cod_empresa);
		const empregado = await atualizaEmpregado(
			cod_empregado,
			nome,
			email,
			celular,
			cod_jornada);
		return res.json(empregado);
	} catch (erro) {
		return res.status(404).json({ erro: erro.message });
	}
});

router.post("/", checaJWT, checaCadastro, async (req, res) => {
	const { cod_empresa } = req.usuario;
	const { cpf, nome, email, senha, celular, cod_jornada } = req.body;
	try {
		await cadastroJaExistente(cpf, email);
		await jornadaExiste(cod_jornada, cod_empresa);
		const usuario = await criarUsuario(cod_empresa, cpf
			, nome, email, senha, celular);
		const empregado = await criarEmpregado(usuario.codigo, cod_jornada);
		const cod_confirmacao = await criarConfirmacao(usuario.codigo);
		enviarEmailConfirmacao(cod_confirmacao, email, nome);
		return res.status(201).json({ ...usuario, ...empregado });
	} catch (erro) {
		return res.status(400).json({ erro: erro.message });
	}
});

module.exports = app => app.use('/empregados', router);

