/**
 * Nesse arquivo é feita a interface com a internet. 
 * Aqui são recebidas as requisições HTTP e onde são 
 * manipuladas as entradas e saídas das rotas.
 * 
 */
const router = require("express").Router();
const { checaCadastro } = require("./Validacoes");
const { criarEmpresa, criarUsuario, criarAdmin, cadastroJaExistente } = require("./Regras");
const { solicitarConfirmacao } = require("../confirmacao/Regras");

/**
 * Criar empresa
 */
router.post("/", checaCadastro, async (req, res) => {
	const { cnpj, razao_social } = req.body;
	const { cpf, nome, email, senha, celular } = req.body;
	try {
		await cadastroJaExistente(cnpj, cpf, email)
	} catch (erro) {
		return res.status(400).json({ erro: erro.message });
	}
	const empresa = await criarEmpresa(cnpj, razao_social);
	const usuario = await criarUsuario(empresa.codigo, cpf
		, nome, email, senha, celular);
	const admin = await criarAdmin(usuario.codigo);
	const urlAtual = req.protocol + '://' + req.get('host');
	await solicitarConfirmacao(usuario.codigo, email, nome, urlAtual);
	return res.status(201).json({
		empresa: empresa,
		admin: {
			...usuario,
			...admin
		}
	});
});

module.exports = app => app.use('/empresas', router);

