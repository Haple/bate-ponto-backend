/**
 * Nesse arquivo ficam as regras das funcionalidades
 * e onde estão as chamadas à módulos de banco de dados
 * ou serviços de terceiros.
 * 
 */
const db = require('../db');

module.exports = {
    async logar(email, senha) {
        const resultado = await db.query(`
            SELECT * FROM usuarios
            WHERE email = $1 
            AND senha = $2
            `,
            [email, senha]);
        return resultado.rows[0];
    }
}