/**
 * Nesse arquivo ficam as regras das funcionalidades
 * e onde estão as chamadas à módulos de banco de dados
 * ou serviços de terceiros.
 * 
 */
const db = require('../config/database');
const { buscaEmpregado } = require("../empregado/Regras");
const { buscarJornada } = require("../jornada/Regras");
const { atualizaBancoDeHoras } = require('../ponto/Regras')

module.exports = {
    async criarAbono(motivo, data_abonada, cod_empregado) {
        const abonoJaExiste = (await db.query(`
            SELECT * FROM abonos
            WHERE cod_empregado = $1
            AND data_abonada = $2`,
            [cod_empregado, data_abonada])).rows[0];

        if (abonoJaExiste)
            throw new Error("Abono já solicitado");

        const abono = (await db.query(`
            INSERT INTO abonos 
            (motivo,data_solicitacao,data_abonada,cod_empregado)
            VALUES ($1,$2,$3,$4)
            RETURNING *`,
            [motivo, new Date(), data_abonada, cod_empregado])).rows[0];
        return abono;
    },

    async listarAbonosEmpregado(cod_empregado) {
        const abonos = (await db.query(`
            SELECT * FROM abonos
            WHERE cod_empregado = $1`,
            [cod_empregado])).rows;
        return abonos;
    },

    async buscarAbono(cod_empregado, cod_abono) {
        const abono = (await db.query(`
            SELECT * FROM abonos
            WHERE cod_empregado = $1
            AND codigo = $2`,
            [cod_empregado, cod_abono])).rows[0];
        if (!abono) {
            throw new Error("Abono não encontrado");
        }
        return abono;
    },

    async listarAbonos(cod_empresa) {
        const abonos = (await db.query(`
            SELECT * FROM abonos
            WHERE cod_empregado IN (
                SELECT e.cod_usuario FROM empregados e
                INNER JOIN usuarios u
                ON e.cod_usuario = u.codigo
                WHERE u.cod_empresa = $1
            )`,
            [cod_empresa])).rows;
        return abonos;
    },

    async atualizaAbono(avaliacao, aprovado, cod_admin, cod_abono) {
        const abono = (await db.query(`
            UPDATE abonos 
            SET avaliacao = $1,
            aprovado = $2,
            cod_admin = $3
            WHERE codigo = $4
            AND cod_admin IS NULL
            RETURNING *`,
            [avaliacao, aprovado, cod_admin, cod_abono])).rows[0];
        if (!abono) {
            throw new Error("Esse abono já foi avaliado");
        }
        return { ...abono };
    },

    async abonar(cod_empresa, cod_usuario) {
        const { cod_jornada, banco_horas } = await buscaEmpregado(cod_empresa, cod_usuario);
        const { carga_diaria } = await buscarJornada(cod_jornada);
        await atualizaBancoDeHoras(banco_horas + carga_diaria, cod_usuario);
    },

    async addAnexo(anexo, cod_abono, cod_empregado) {
        const abono = (await db.query(`
            UPDATE abonos 
            SET anexo = $1
            WHERE codigo = $2
            AND cod_empregado = $3
            RETURNING *`,
            [anexo, cod_abono, cod_empregado])).rows[0];
        if (!abono) {
            throw new Error("Abono não encontrado")
        }
        return { ...abono };
    },
}