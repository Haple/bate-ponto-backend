/**
 * Nesse arquivo é feita a interface com a internet. 
 * Aqui são recebidas as requisições HTTP e onde são 
 * manipuladas as entradas e saídas das rotas.
 * 
 */
const router = require("express").Router();
const { checaJWT } = require("../sessao/Validacoes");
const multer  = require("../multer");
const flehelper = require("../file-helper");
const { ehPedidoValido } = require("./Validacoes");
const { criarAbono, listarAbono } = require("./Regras");

// rotas dos abonos
router.post("/", checaJWT, ehPedidoValido, async (req, res) => {
	const { data_solicitacao, data_abono, motivo } = req.body;
	const { cod_usuario } = req.usuario;

	try {
		criarAbono(motivo,data_solicitacao,data_abono,cod_usuario);

		return res.status(200).json({ msg: "Sucesso, cadastro de abono"});

	} catch (erro) {
		return res.status(500).json({ erro: erro.message });
	}
}),

router.post("/:id_abono/anexos", checaJWT, multer.single('image'),  async (req, res) => {
	if (req.file) {
		data = flehelper.compressImage(req.file, 100)
				.then(newPath => {
					return res.status(200).json({ msg: "Imagem recebida e cadastrada"});
				})
				.catch(err => console.log(err) );
	}
}),

router.get("/listaAnexos", checaJWT, async (req, res) => {
	const { cod_usuario } = req.usuario;
	var abonos = [];
	try {

		abonos.push(listarAbono(cod_usuario));
		
		return res.status(200).json({ msg: "Sucesso, cadastro de abono"});

	} catch (erro) {
		return res.status(500).json({ erro: erro.message });
	}

})

require('./avaliacao')(router);

module.exports = app => app.use('/abonos', router);