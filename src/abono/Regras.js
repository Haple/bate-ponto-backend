/**
 * Nesse arquivo ficam as regras das funcionalidades
 * e onde estão as chamadas à módulos de banco de dados
 * ou serviços de terceiros.
 * 
 */
const db = require('../db');
const bcrypt = require("bcryptjs");

module.exports = {
    
    async ehEmpregado(cod_usuario) {
        const empregado = (await db.query(`
        SELECT * FROM empregados
        WHERE cod_usuario = $1
        `,
            [cod_usuario])).rows[0];
        return (empregado ? true : false);
    },

    async criarAbono(cod_usuario, dataSolicitacao, dataAbono, motivo) {
        const abono = (await db.query ( `
            INSERT INTO abonos 
            (motivo,data_solicitacao,data_abonada,cod_empregado)
            VALUES ($4,$2,$3,$1)
            RETURNING
            motivo, data_solicitacao, data_abonada, cod_empregado
        `,
        [motivo, dataSolicitacao, dataAbono, cod_usuario])).rows[0];

        return abono;
    }
}