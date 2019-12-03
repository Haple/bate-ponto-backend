/**
 * Nesse arquivo é feita a interface com a internet. 
 * Aqui são recebidas as requisições HTTP e onde são 
 * manipuladas as entradas e saídas das rotas.
 * 
 */
const router = require("express").Router();
const { checaCadastro, checaAtualizacao, checaCodEmpregado } = require("./Validacoes");
const { criarEmpregado, cadastroJaExistente, buscaEmpregado } = require("./Regras");
const { atualizaEmpregado, buscaEmpregados, deletarEmpregado } = require("./Regras");
const { buscarJornada } = require("../jornada/Regras");
const { buscarPontos } = require("../ponto/Regras");
const { solicitarConfirmacao } = require("../confirmacao/Regras");
const { criarUsuario } = require("../empresa/Regras");
const { checaJWT, ehAdmin } = require("../sessao/Validacoes");

router.use(checaJWT);
router.use(ehAdmin);

/**
 * Buscar um empregado
 */
router.get("/:cod_empregado", checaCodEmpregado, async (req, res) => {
	const { cod_empresa } = req.usuario;
	const { cod_empregado } = req.params;
	try {
		const empregado = await buscaEmpregado(cod_empresa, cod_empregado);
		return res.status(200).json(empregado);
	} catch (erro) {
		return res.status(404).json({ erro: erro.message })
	}
});


/**
 * Buscar pontos de um empregado
 */
router.get("/:cod_empregado/pontos", checaCodEmpregado, async (req, res) => {
	const { cod_empresa } = req.usuario;
	const { cod_empregado } = req.params;
	try {
		const pontos = await buscarPontos(cod_empregado, cod_empresa);
		return res.status(200).json(pontos);
	} catch (erro) {
		return res.status(404).json({ erro: erro.message })
	}
});


/**
 * Deletar um empregado
 */
router.delete("/:cod_empregado", checaCodEmpregado, async (req, res) => {
	const { cod_empresa } = req.usuario;
	const { cod_empregado } = req.params;
	try {
		await deletarEmpregado(cod_empresa, cod_empregado);
		return res.status(200).json();
	} catch (erro) {
		return res.status(404).json({ erro: erro.message })
	}
});

/**
 * Buscar todos os empregados da empresa
 */
router.get("/", async (req, res) => {
	const { cod_empresa } = req.usuario;
	const { nome, cod_jornada } = req.query;
	const empregados = await buscaEmpregados(cod_empresa, cod_jornada, nome);
	return res.json(empregados);
});

/**
 * Atualizar um empregado
 */
router.put("/:cod_empregado", checaAtualizacao, async (req, res) => {
	const { cod_empresa } = req.usuario;
	const { cod_empregado } = req.params;
	const { nome, email, celular, cod_jornada } = req.body;
	try {
		await buscarJornada(cod_jornada, cod_empresa);
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

/**
 * Criar um empregado
 */
router.post("/", checaCadastro, async (req, res) => {
	const { cod_empresa } = req.usuario;
	const { cpf, nome, email, senha, celular, cod_jornada } = req.body;
	try {
		await cadastroJaExistente(cpf, email);
		await buscarJornada(cod_jornada, cod_empresa);
		const usuario = await criarUsuario(cod_empresa, cpf
			, nome, email, senha, celular);
		const empregado = await criarEmpregado(usuario.codigo, cod_jornada);
		const urlAtual = req.protocol + '://' + req.get('host');
		await solicitarConfirmacao(usuario.codigo, email, nome, urlAtual);
		return res.status(201).json({ ...usuario, ...empregado });
	} catch (erro) {
		return res.status(400).json({ erro: erro.message });
	}
});

module.exports = app => app.use('/empregados', router);

