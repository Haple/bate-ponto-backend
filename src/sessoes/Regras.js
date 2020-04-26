/**
 * Nesse arquivo ficam as regras das funcionalidades
 * e onde estão as chamadas à módulos de banco de dados
 * ou serviços de terceiros.
 * 
 */
const db = require('../config/database');
const bcrypt = require("bcryptjs");

module.exports = {
    async checaCredenciais(email, senha) {
        const usuario = (await db.query(`
            SELECT *
            FROM usuarios
            WHERE email = $1
            `,
            [email])).rows[0];
        if (!usuario) throw new Error("Credenciais inválidas");
        const senhaCerta = await bcrypt.compare(senha, usuario.senha);
        delete usuario.senha;
        if (senhaCerta) return usuario;
        else throw new Error("Credenciais inválidas");
    },
    async buscaEmpregado(cod_usuario) {
        const empregado = (await db.query(`
        SELECT * FROM empregados
        WHERE cod_usuario = $1
        `,
            [cod_usuario])).rows[0];
        return empregado;
    },
    async buscaAdmin(cod_usuario) {
        const admin = (await db.query(`
        SELECT * FROM administradores
        WHERE cod_usuario = $1
        `,
            [cod_usuario])).rows[0];
        return admin;
    }
}