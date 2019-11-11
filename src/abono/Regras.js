/**
 * Nesse arquivo ficam as regras das funcionalidades
 * e onde estão as chamadas à módulos de banco de dados
 * ou serviços de terceiros.
 * 
 */
const db = require('../db');
const bcrypt = require("bcryptjs");

module.exports = {
    async criarAbono(motivo, data_solicitacao, data_abonada, cod_empregado) {
        const abono = (await db.query(`
        INSERT INTO abonos 
        (motivo,data_solicitacao, data_abonada, cod_empregado)
        VALUES ($1, $2, $3, $4) RETURNING *
        `, [motivo,data_solicitacao, data_abonada, cod_empregado])).rows[0];
        return abono
    }
};