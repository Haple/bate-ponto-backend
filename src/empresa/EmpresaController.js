const db = require('../db');

module.exports={
	// Cadastrar empresa
	async store(req,res){
		const {cnpj, razao_social} = req.body;
		const {cpf,nome,email,senha,celular} = req.body;
		const empresa = await criarEmpresa(cnpj,razao_social);
		const usuario = await criarUsuario(empresa.codigo,cpf
			,nome,email,senha,celular);
		const admin = await criarAdmin(usuario.codigo);
		return res.status(201).json({
			empresa: empresa,
			admin: {
				...usuario,
				...admin
			}
		});
	}
};

async function criarEmpresa(cnpj,razao_social){
	// TODO: verificar se o cnpj já está cadastrado
	const resultado = await db.query(`
		INSERT INTO empresas (cnpj,razao_social)
		VALUES ($1, $2) RETURNING *`,
		[cnpj, razao_social]);
	return resultado.rows[0];
}

async function criarUsuario(cod_empresa,cpf,nome,email,senha,celular){
	// TODO: verificar se o cpf e o email já estão cadastrados
	const resultado = await db.query(`
		INSERT INTO usuarios
		(cod_empresa,cpf,nome,email
			,senha,celular,confirmado)
		VALUES ($1,$2,$3,$4,$5,$6,false) RETURNING *
		`,
		[cod_empresa,cpf,nome,email,
			senha,celular]);
	return resultado.rows[0];
}

async function criarAdmin(cod_usuario){
	const resultado = await db.query(`
		INSERT INTO administradores
		(alertar_atraso, cod_usuario)
		VALUES (false,$1) RETURNING *
		`,
		[cod_usuario]);
	return resultado.rows[0];
}
