/**
 * Nesse arquivo ficam as regras das funcionalidades
 * e onde estão as chamadas à módulos de banco de dados
 * ou serviços de terceiros.
 * 
 */
const db = require('../db');
const bcrypt = require("bcryptjs");

module.exports = {
    async criarAbono(motivo,data_solicitacao,data_abono,codigo) {
        const abono = (await db.query (`
        INSERT INTO abonos 
        (motivo,data_solicitacao,data_abonada,cod_empregado)
        VALUES ($1,$2,$3,$4)
        RETURNING
        *`,
        [motivo,data_solicitacao,data_abono,codigo])).rows[0];

        return abono;
    },

    async listarAbono(codigo) {
        const abonos = (await db.query(`
        SELECT * FROM abonos
        WHERE cod_empregado = $1`,
        [codigo])).rows;
        
        return abonos;
    }
}