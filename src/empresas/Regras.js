/**
 * Nesse arquivo ficam as regras das funcionalidades
 * e onde estão as chamadas à módulos de banco de dados
 * ou serviços de terceiros.
 * 
 */
const db = require('../config/database');
const bcrypt = require("bcryptjs");

module.exports = {
    async cadastroJaExistente(cnpj, cpf, email) {
        const cnpjExistente = (await db.query(`
            SELECT * FROM empresas
            WHERE cnpj = $1
        `, [cnpj])).rows[0];
        if (cnpjExistente) throw new Error("CNPJ já cadastrado!");
        const cpfExistente = (await db.query(`
            SELECT * FROM usuarios
            WHERE cpf = $1
        `, [cpf])).rows[0];
        if (cpfExistente) throw new Error("CPF já cadastrado!");
        const emailExistente = (await db.query(`
            SELECT * FROM usuarios
            WHERE email = $1
        `, [email])).rows[0];
        if (emailExistente) throw new Error("E-mail já cadastrado!");
    },
    async criarEmpresa(cnpj, razao_social) {
        const empresa = (await db.query(`
            INSERT INTO empresas (cnpj,razao_social)
            VALUES ($1, $2) RETURNING *
        `, [cnpj, razao_social])).rows[0];
        return empresa;
    },
    async criarUsuario(cod_empresa, cpf, nome, email, senha, celular) {
        senha = await bcrypt.hash(senha, 8);
        const usuario = (await db.query(`
            INSERT INTO usuarios
            (cod_empresa,cpf,nome,email
                ,senha,celular,confirmado)
            VALUES ($1,$2,$3,$4,$5,$6,false) 
            RETURNING 
            codigo, cpf, nome, email, celular, confirmado
            `,
            [cod_empresa, cpf, nome, email,
                senha, celular])).rows[0];
        return usuario;
    },
    async criarAdmin(cod_usuario) {
        const admin = (await db.query(`
            INSERT INTO administradores
            (alertar_atraso, cod_usuario)
            VALUES (false,$1)
            RETURNING alertar_atraso
            `,
            [cod_usuario])).rows[0];
        return admin;
    }
}