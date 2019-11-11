/**
 * Nesse arquivo é feita a interface com a internet. 
 * Aqui são recebidas as requisições HTTP e onde são 
 * manipuladas as entradas e saídas das rotas.
 * 
 */
const { checaJWT } = require("../sessao/Validacoes");
const { ehPedidoValido, ehFiltroValido } = require("./Validacoes");
const { criarAbono } = require("./Regras");
const multer = require("../multer");
const filehelper = require("../file-helper");
const router = require("express").Router();

// rotas dos abonos
router.post("/", checaJWT, ehPedidoValido, async (req, res) => {
	const { motivo, data_solicitacao, data_abonada } = req.body;
	const { codigo } = req.usuario;
	
	try {
		//await criarAbono(motivo, data_solicitacao, data_abonada, codigo);
		return res.status(200).json({ msg: "Abono cadastrado" });
	}catch (erro) {
		return res.status(401).json({ erro: erro.message });
	}
}),

router.post("/:id_abono/anexos", checaJWT, multer.single('image') , async (req, res) => {
	if(req.file) {

		try {
			const newPath = await filehelper.compressImage(req.file, 100);

			return res.status(200).json({ 
				msg: "Upload e compressão realizados com sucesso! O novo caminho é:" + newPath });
		} catch(err) {
			return res.status(500).json({ erro: "Erro ao comprimir imagem" });
		}
	} 

	return res.status(401).json({ erro: "Houve erro no upload!" });
});

require('./avaliacao')(router);

module.exports = app => app.use('/abonos', router);