/**
 * Nesse arquivo ficam as regras das funcionalidades
 * e onde estão as chamadas à módulos de banco de dados
 * ou serviços de terceiros.
 * 
 */
const db = require('../config/database');
const { diferencaDeHorario } = require("../util/Horario");

module.exports = {
    async jornadaJaExistente(cod_empresa, nome) {
        const jornada = (await db.query(`
            SELECT * FROM jornadas
            WHERE cod_empresa = $1
            AND nome = $2
        `, [cod_empresa, nome])).rows[0];
        if (jornada) throw new Error("Jornada já cadastrada");
    },
    async criarJornada(cod_empresa, nome, entrada1, saida1, entrada2, saida2) {
        let carga_diaria = diferencaDeHorario(saida1, entrada1);
        carga_diaria += diferencaDeHorario(saida2, entrada2);
        const jornada = (await db.query(`
            INSERT INTO jornadas 
            (cod_empresa, nome, entrada1, saida1, 
                entrada2, saida2, carga_diaria)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
        `, [cod_empresa, nome, entrada1, saida1,
            entrada2, saida2, carga_diaria])).rows[0];
        return jornada;
    },
    async buscarJornadas(cod_empresa) {
        const jornadas = (await db.query(`
            SELECT * FROM jornadas
            WHERE cod_empresa = $1
        `, [cod_empresa])).rows;
        return jornadas;
    },
    async deletarJornada(cod_empresa, cod_jornada) {
        const jornadaUsada = (await db.query(`
            SELECT * FROM empregados e
            INNER JOIN usuarios u
            ON e.cod_usuario = u.codigo
            WHERE u.cod_empresa = $1
            AND e.cod_jornada =$2
        `, [cod_empresa, cod_jornada])).rows[0];
        if (jornadaUsada) throw new Error("A jornada ainda está sendo utilizada.");
        const deletado = (await db.query(`
            DELETE FROM jornadas
            WHERE cod_empresa = $1
            AND codigo = $2
        `, [cod_empresa, cod_jornada])).rowCount >= 1;
        if (!deletado) throw new Error("Jornada não encontrada");
    }
}

