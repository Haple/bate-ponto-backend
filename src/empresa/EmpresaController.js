const db = require('../db');

module.exports={
	// Cadastrar empresa
	async store(req,res){
		const {cnpj, razaoSocial} = req.body;
		const result = await db.query(`
			INSERT 	INTO empresas (cnpj,razao_social)
			VALUES ($1, $2) RETURNING *`, [cnpj, razaoSocial]);
		return res.json(result.rows[0]);
	}
};

function validarCnpj(){

}
