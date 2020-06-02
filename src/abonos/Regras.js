/**
 * Nesse arquivo ficam as regras das funcionalidades
 * e onde estão as chamadas à módulos de banco de dados
 * ou serviços de terceiros.
 * 
 */
const db = require('../config/database');
const { buscaEmpregado } = require("../empregados/Regras");
const { buscarJornada } = require("../jornadas/Regras");
const { atualizaBancoDeHoras } = require('../pontos/Regras')

module.exports = {
    async criarAbono(motivo, data_abonada, cod_empregado) {
        const abonoJaExiste = (await db.query(`
            SELECT * FROM abonos
            WHERE cod_empregado = $1
            AND data_abonada = $2`,
            [cod_empregado, data_abonada])).rows[0];

        if (abonoJaExiste)
            throw new Error("Abono já solicitado!");

        const abono = (await db.query(`
            INSERT INTO abonos 
            (motivo,data_solicitacao,data_abonada,cod_empregado)
            VALUES ($1,$2,$3,$4)
            RETURNING *`,
            [motivo, new Date(), data_abonada, cod_empregado])).rows[0];
        return abono;
    },

    async listarAbonosEmpregado(cod_empregado, status = '') {
        status = status.toUpperCase();
        if (status == 'APROVADO'
            || status == 'REPROVADO') {
            const abonos = (await db.query(`
                SELECT * FROM abonos
                WHERE cod_empregado = $1
                AND aprovado = $2
                ORDER BY data_solicitacao DESC`,
                [
                    cod_empregado,
                    status == 'APROVADO'
                ])).rows;
            return abonos;
        } else if (status == 'PENDENTE') {
            const abonos = (await db.query(`
                SELECT * FROM abonos
                WHERE cod_empregado = $1
                AND aprovado IS NUll
                ORDER BY data_solicitacao DESC`,
                [cod_empregado])).rows;
            return abonos;
        } else {
            const abonos = (await db.query(`
                SELECT * FROM abonos
                WHERE cod_empregado = $1
                ORDER BY data_solicitacao DESC`,
                [cod_empregado])).rows;
            return abonos;
        }
    },

    async listarAbonos(cod_empresa, status = '') {
        status = status.toUpperCase();
        if (status == 'APROVADO'
            || status == 'REPROVADO') {
            const abonos = (await db.query(`
                SELECT a.*, u.nome FROM abonos a
                INNER JOIN usuarios u
                ON a.cod_empregado = u.codigo
                WHERE a.cod_empregado IN (
                    SELECT e.cod_usuario FROM empregados e
                    INNER JOIN usuarios u
                    ON e.cod_usuario = u.codigo
                    WHERE u.cod_empresa = $1
                )
                AND aprovado = $2
                ORDER BY data_solicitacao DESC`,
                [cod_empresa, status == 'APROVADO'])).rows;
            return abonos;
        } else if (status == 'PENDENTE') {
            const abonos = (await db.query(`
            SELECT a.*, u.nome FROM abonos a
            INNER JOIN usuarios u
            ON a.cod_empregado = u.codigo
            WHERE a.cod_empregado IN (
                SELECT e.cod_usuario FROM empregados e
                INNER JOIN usuarios u
                ON e.cod_usuario = u.codigo
                WHERE u.cod_empresa = $1
            )
            AND aprovado IS NULL
            ORDER BY data_solicitacao DESC`,
                [cod_empresa])).rows;
            return abonos;
        } else {
            const abonos = (await db.query(`
            SELECT a.*, u.nome FROM abonos a
            INNER JOIN usuarios u
            ON a.cod_empregado = u.codigo
            WHERE a.cod_empregado IN (
                SELECT e.cod_usuario FROM empregados e
                INNER JOIN usuarios u
                ON e.cod_usuario = u.codigo
                WHERE u.cod_empresa = $1
            )
            ORDER BY data_solicitacao DESC`,
                [cod_empresa])).rows;
            return abonos;
        }
    },

    async buscarAbono(cod_abono, cod_empresa) {
        const abono = (await db.query(`
            SELECT * FROM abonos
            WHERE codigo = $1
            AND cod_empregado IN (
                SELECT e.cod_usuario FROM empregados e
                INNER JOIN usuarios u
                ON e.cod_usuario = u.codigo
                WHERE u.cod_empresa = $2
            )`,
            [cod_abono, cod_empresa])).rows[0];
        if (!abono) {
            throw new Error("Abono não encontrado!");
        }
        return abono;
    },

    async atualizaAbono(avaliacao, aprovado, cod_admin, cod_empresa, cod_abono) {
        const abono = (await db.query(`
            UPDATE abonos a
            SET avaliacao = $1,
            aprovado = $2,
            cod_admin = $3
            WHERE codigo = $4
            AND cod_empregado IN (
                SELECT codigo FROM
                    usuarios
                WHERE cod_empresa = $5
            )
            AND cod_admin IS NULL
            RETURNING *`,
            [avaliacao, aprovado, cod_admin, cod_abono, cod_empresa])).rows[0];
        if (!abono)
            throw new Error("Abono não encontrado!");
        return { ...abono };
    },

    async abonar(cod_empresa, cod_usuario) {
        const { cod_jornada, banco_horas } =
            await buscaEmpregado(cod_empresa, cod_usuario);
        const { carga_diaria } = await buscarJornada(cod_jornada, cod_empresa);
        await atualizaBancoDeHoras(banco_horas + carga_diaria, cod_usuario);
    },

    async addAnexo(anexo, anexo_original, cod_abono, cod_empregado) {
        const abono = (await db.query(`
            UPDATE abonos 
            SET anexo = $1,
            anexo_original = $2
            WHERE codigo = $3
            AND cod_empregado = $4
            RETURNING *`,
            [anexo, anexo_original, cod_abono, cod_empregado])).rows[0];
        if (!abono) {
            throw new Error("Abono não encontrado!")
        }
        return abono;
    },
}