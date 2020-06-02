/**
 * Nesse arquivo ficam as regras das funcionalidades
 * e onde estão as chamadas à módulos de banco de dados
 * ou serviços de terceiros.
 * 
 */
const db = require('../config/database');
const { startOfMonth, subMonths } = require('date-fns');
const { utcToZonedTime } = require('date-fns-tz')
const { nomeDoMes } = require('../util/Horario');

module.exports = {

    async buscaIndicadores(cod_empresa) {
        const indicadores = (await db.query(`
            SELECT * FROM indicadores`)).rows;
        const indicadores_ativados = (await db.query(`
            SELECT * FROM indicadores_ativados ia
            WHERE ia.cod_empresa = $1
            `,
            [cod_empresa],
        )).rows;
        const indicadores_resultados = (await db.query(`
            SELECT * FROM indicadores_resultados ir
            WHERE ir.cod_empresa = $1
            AND periodo >= $2
            `,
            [cod_empresa, subMonths(startOfMonth(new Date()), 12)],
        )).rows;

        return indicadores.map(indicador => {
            indicador.ativado = indicadores_ativados.find(
                ia => ia.cod_indicador == indicador.codigo
            ) != undefined;

            let resultados = indicadores_resultados.filter(
                ir => ir.cod_indicador == indicador.codigo
            );
            resultados = resultados.map(r => {
                let total = r.concordo + r.neutro + r.discordo;
                r.concordo = Math.round((r.concordo * 100) / total);
                r.neutro = Math.round((r.neutro * 100) / total);
                r.discordo = Math.round((r.discordo * 100) / total);
                let mes = utcToZonedTime(r.periodo).getMonth() + 1; 
                r.mes = mes;                
                r.nomeMes = nomeDoMes(mes);                
                return r;
            });
            indicador.resultados = resultados;
            return indicador;
        });
    },


    async configurarIndicador(cod_empresa, cod_indicador, ativado) {
        await buscarIndicador(cod_indicador);

        const indicador_ativado = (await db.query(`
            SELECT * FROM indicadores_ativados
            WHERE cod_indicador = $1
            AND cod_empresa = $2
            `, [cod_indicador, cod_empresa])).rows[0];

        if (indicador_ativado && ativado) throw new Error("Indicador já está ativado!");

        if (!indicador_ativado && !ativado) throw new Error("Indicador já está desativado!");

        if (ativado) {
            await db.query(`
                INSERT INTO indicadores_ativados
                VALUES ($1,$2)
                RETURNING *
                `, [cod_indicador, cod_empresa]);
        } else {
            await db.query(`
                DELETE FROM indicadores_ativados
                WHERE cod_indicador = $1
                AND cod_empresa = $2
                `, [cod_indicador, cod_empresa]);
        }
    },

    async responderIndicador(cod_empresa, cod_indicador, cod_empregado, resposta) {
        const indicadores_restantes = await buscaIndicadoresRestantes(cod_empresa, cod_empregado);
        const indicador = indicadores_restantes.find(ir => ir.codigo == cod_indicador);
        if (!indicador) throw new Error("Indicador inexistente ou já respondido!");
        const resposta_salva = (await db.query(`
            INSERT INTO indicadores_respostas
            VALUES ($1,$2,$3,$4)
            RETURNING *
            `,
            [cod_indicador, cod_empregado, startOfMonth(new Date()), resposta])).rows[0];
        await atualizarResultado(cod_indicador, cod_empresa, resposta);
        return resposta_salva;
    },


    buscaIndicadoresRestantes


}

async function buscaIndicadoresRestantes(cod_empresa, cod_empregado) {
    const indicadores = (await db.query(`
        SELECT * FROM indicadores i
        INNER JOIN indicadores_ativados ia
        ON i.codigo = ia.cod_indicador
        WHERE ia.cod_empresa = $1
        AND ia.cod_indicador NOT IN (
            SELECT cod_indicador FROM indicadores_respostas
            WHERE cod_empregado = $2
            AND periodo = $3
        )
        `, [cod_empresa, cod_empregado, startOfMonth(new Date())])).rows;
    return indicadores;
}

async function buscarIndicador(cod_indicador) {
    const indicador = (await db.query(`
            SELECT * FROM indicadores
            WHERE codigo = $1
            `, [cod_indicador])).rows[0];
    if (!indicador)
        throw new Error("Indicador não encontrado");
    return indicador;
}

async function atualizarResultado(cod_indicador, cod_empresa, resposta) {
    const resposta_valida = ['CONCORDO', 'NEUTRO', 'DISCORDO'].find(r => r == resposta);
    if (!resposta_valida) throw new Error("Resposta inválida");
    const resultado = (await db.query(`
            INSERT INTO indicadores_resultados
            (cod_indicador,cod_empresa,periodo,${resposta})
            VALUES ($1,$2,$3,1) 
            ON CONFLICT (cod_indicador,cod_empresa,periodo) 
            DO UPDATE SET ${resposta} = indicadores_resultados.${resposta} + 1
            RETURNING *;
            `, [cod_indicador, cod_empresa, startOfMonth(new Date())])).rows[0];
    return resultado;
}
