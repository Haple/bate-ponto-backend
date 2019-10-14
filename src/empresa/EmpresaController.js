const db = require('../db');

module.exports={
	// Cadastrar empresa
	async store(req,res){
		const {cnpj, razao_social} = req.body;
		const empresa = await db.query(`
			INSERT INTO empresas (cnpj,razao_social)
			VALUES ($1, $2) RETURNING *`,
			[cnpj, razao_social]);
		const {cpf,nome,email,senha,celular} = req.body;
		const usuario = await db.query(`
			INSERT INTO usuarios
			(cod_empresa,cpf,nome,email
				,senha,celular,confirmado)
			VALUES ($1,$2,$3,$4,$5,$6,false) RETURNING *
			`,
			[empresa.rows[0].codigo,cpf,nome,email,
				senha,celular]);
		const admin = await db.query(`
			INSERT INTO administradores
			(alertar_atraso, cod_usuario)
			VALUES (false,$1) RETURNING *
			`,
			[usuario.rows[0].codigo]);
		return res.json({
			empresa: empresa.rows[0],
			admin: {
				...usuario.rows[0],
				...admin.rows[0]
			}
		});
	}
};

function validarCnpj(){

}
