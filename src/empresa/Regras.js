/**
 * Nesse arquivo ficam as regras das funcionalidades
 * e onde estão as chamadas à módulos de banco de dados
 * ou serviços de terceiros.
 * 
 */
const db = require('../db');

module.exports = {
    async criarEmpresa(cnpj, razao_social) {
        // TODO: verificar se o cnpj já está cadastrado
        let empresa = await db.query(`
            SELECT * FROM empresas WHERE
            cnpj = $1
        `, [cnpj]);
        empresa = await db.query(`
            INSERT INTO empresas (cnpj,razao_social)
            VALUES ($1, $2) RETURNING *
        `, [cnpj, razao_social]);
        return empresa.rows[0];
    },
    async criarUsuario(cod_empresa, cpf, nome, email, senha, celular) {
        // TODO: verificar se o cpf e o email já estão cadastrados
        const resultado = await db.query(`
            INSERT INTO usuarios
            (cod_empresa,cpf,nome,email
                ,senha,celular,confirmado)
            VALUES ($1,$2,$3,$4,$5,$6,false) RETURNING *
            `,
            [cod_empresa, cpf, nome, email,
                senha, celular]);
        return resultado.rows[0];
    },
    async criarAdmin(cod_usuario) {
        const resultado = await db.query(`
            INSERT INTO administradores
            (alertar_atraso, cod_usuario)
            VALUES (false,$1) RETURNING *
            `,
            [cod_usuario]);
        return resultado.rows[0];
    }
}