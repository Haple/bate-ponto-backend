/**
 * Nesse arquivo é feita a interface com a internet. 
 * Aqui são recebidas as requisições HTTP e onde são 
 * manipuladas as entradas e saídas das rotas.
 * 
 */
const router = require("express").Router();
const { checaJWT, ehAdmin, ehEmpregado } = require("../sessao/Validacoes");
const upload = require("../config/multer");
const S3 = require("../config/S3");
const { checaCadastro, checaEnvioAnexo, checaAvaliacao } = require("./Validacoes");
const { checaDownload } = require("./Validacoes");
const { criarAbono, listarAbonosEmpregado, listarAbonos } = require("./Regras");
const { atualizaAbono, addAnexo, buscarAbono, abonar } = require("./Regras");

router.use(checaJWT);

router.get("/", async (req, res) => {
	const { cod_usuario, cod_empresa, admin, empregado } = req.usuario;
	const { buscarTudo } = req.query;
	try {
		let abonos = [];
		if (buscarTudo && admin) {
			abonos = await listarAbonos(cod_empresa);
		} else if (empregado) {
			abonos = await listarAbonosEmpregado(cod_usuario);
		} else {
			return res.status(400).json({ erro: "Usuário não é empregado" });
		}
		return res.json({ abonos });
	} catch (erro) {
		return res.status(500).json({ erro: erro.message });
	}
});

router.post("/", ehEmpregado, checaCadastro, async (req, res) => {
	const { data_abonada, motivo } = req.body;
	const { cod_usuario } = req.usuario;
	try {
		const abono = await criarAbono(motivo, data_abonada, cod_usuario);
		return res.json({ abono });
	} catch (erro) {
		return res.status(400).json({ erro: erro.message });
	}
});

router.post("/:cod_abono/anexos", ehEmpregado, upload.single('anexo'),
	checaEnvioAnexo, async (req, res) => {
		const { cod_usuario } = req.usuario;
		const { cod_abono } = req.params;
		const { key: anexo } = req.file;
		try {
			const abono = await addAnexo(anexo, cod_abono, cod_usuario);
			return res.json(abono);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	});

router.get("/:cod_abono/anexos", ehEmpregado,
	checaDownload, async (req, res) => {
		const { cod_usuario } = req.usuario;
		const { cod_abono } = req.params;
		try {
			const abono = await buscarAbono(cod_usuario, cod_abono);
			const arquivo = await new S3("bateponto").getItem(abono.anexo);
			res.setHeader('Content-disposition', 'attachment; filename='
				+ abono.anexo);
			return arquivo.pipe(res);
		} catch (erro) {
			return res.status(404).json({ erro: erro.message });
		}
	});

router.post("/:cod_abono/avaliacoes", ehAdmin,
	checaAvaliacao, async (req, res) => {
		const { cod_usuario, cod_empresa } = req.usuario;
		const { cod_abono } = req.params;
		const { avaliacao, aprovado } = req.body;
		try {
			const abono = await
				atualizaAbono(avaliacao, aprovado, cod_usuario, cod_abono);
			if (aprovado)
				await abonar(cod_empresa, abono.cod_empregado);
			return res.json(abono);
		} catch (erro) {
			return res.status(400).json({ erro: erro.message });
		}
	});



module.exports = app => app.use('/abonos', router);