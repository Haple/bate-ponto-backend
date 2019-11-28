/**
 * Nesse arquivo é feita a interface com a internet. 
 * Aqui são recebidas as requisições HTTP e onde são 
 * manipuladas as entradas e saídas das rotas.
 * 
 */
const { uploadTo, downloadItem } = require("../config/arquivo");
const { BUCKET_ANEXOS } = process.env;
const router = require("express").Router();
const { checaCodAbono } = require("./Validacoes");
const { checaJWT, ehAdmin, ehEmpregado } = require("../sessao/Validacoes");
const { atualizaAbono, addAnexo, buscarAbono, abonar } = require("./Regras");
const { criarAbono, listarAbonosEmpregado, listarAbonos } = require("./Regras");
const { checaCadastro, checaEnvioAnexo, checaAvaliacao } = require("./Validacoes");

router.use(checaJWT);

/**
 * Listar abonos.
 * Cenário 1: usuário é admin e quer listar todos os abonos da empresa;
 * Cenário 2: usuário é empregado e quer listar apenas o seus abonos;
 */
router.get("/", async (req, res) => {
	const { cod_usuario, cod_empresa, admin, empregado } = req.usuario;
	const { buscarTudo, status } = req.query;
	try {
		let abonos = [];
		if (buscarTudo && admin) {
			abonos = await listarAbonos(cod_empresa, status);
		} else if (empregado) {
			abonos = await listarAbonosEmpregado(cod_usuario, status);
		} else {
			return res.status(400).json({ erro: "Usuário não é empregado" });
		}
		return res.json(abonos);
	} catch (erro) {
		console.log(erro);

		return res.status(500).json({ erro: erro.message });
	}
});

/**
 * Solicitar abono
 */
router.post("/", ehEmpregado, checaCadastro, async (req, res) => {
	const { data_abonada, motivo } = req.body;
	const { cod_usuario } = req.usuario;
	try {
		const abono = await criarAbono(motivo, data_abonada, cod_usuario);
		return res.json(abono);
	} catch (erro) {
		return res.status(400).json({ erro: erro.message });
	}
});

/**
 * Enviar anexo
 */
router.post("/:cod_abono/anexos", ehEmpregado,
	uploadTo(BUCKET_ANEXOS).single('anexo'),
	checaEnvioAnexo, async (req, res) => {
		const { cod_usuario } = req.usuario;
		const { cod_abono } = req.params;
		const { key: anexo, originalname: anexo_original } = req.file;
		try {
			const abono = await
				addAnexo(anexo, anexo_original, cod_abono, cod_usuario);
			return res.json(abono);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	});

/**
 * Baixar anexo
 */
router.get("/:cod_abono/anexos", ehEmpregado,
	checaCodAbono, async (req, res) => {
		const { cod_usuario } = req.usuario;
		const { cod_abono } = req.params;
		try {
			const { anexo, anexo_original } =
				await buscarAbono(cod_usuario, cod_abono);
			const arquivo = downloadItem(BUCKET_ANEXOS, anexo);
			res.setHeader('Content-disposition',
				'attachment; filename=' + anexo_original);
			return arquivo.pipe(res);
		} catch (erro) {
			return res.status(404).json({ erro: erro.message });
		}
	});

/**
 * Avaliar abono
 */
router.post("/:cod_abono/avaliacoes", ehAdmin,
	checaAvaliacao, async (req, res) => {
		const { cod_usuario, cod_empresa } = req.usuario;
		const { cod_abono } = req.params;
		const { avaliacao, aprovado } = req.body;
		try {
			const abono = await
				atualizaAbono(avaliacao, aprovado, cod_usuario, cod_empresa, cod_abono);
			if (aprovado)
				await abonar(cod_empresa, abono.cod_empregado);
			return res.json(abono);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	});

module.exports = app => app.use('/abonos', router);