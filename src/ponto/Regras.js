/**
 * Nesse arquivo ficam as regras das funcionalidades
 * e onde estão as chamadas à módulos de banco de dados
 * ou serviços de terceiros.
 * 
 */
const startOfToday = require('date-fns/startOfToday');
const startOfYesterday = require('date-fns/startOfYesterday');
const { differenceInMinutes } = require("date-fns");
const db = require("../db");

module.exports = {
  async atualizaBancoDeHoras(saldoAtual, cod_empregado) {
    await db.query(`
        UPDATE empregados
        SET banco_horas = $1
        WHERE cod_usuario = $2`, [saldoAtual, cod_empregado]);
  },

  calculaSaldo(pontos, cargaDiaria) {
    let entradas = [];
    let saidas = [];
    let i, j = 0, k = 0;
    for (i = 0; i < pontos.length; i++) {
      const horario = pontos[i];
      if (i % 2 == 0)
        entradas[j++] = horario;
      else
        saidas[k++] = horario;
    }
    if (saidas.length > 0) {
      let horasTrabalhadas = 0;
      for (i = 0; i < saidas.length; i++) {
        horasTrabalhadas += differenceInMinutes(saidas[i], entradas[i]);
      }
      return horasTrabalhadas - cargaDiaria;
    } else {
      return -cargaDiaria;
    }
  },

  async buscarJornada(cod_jornada) {
    return (await db.query(`
      SELECT * from jornadas
      WHERE codigo = $1`, [cod_jornada])).rows[0];
  },

  async buscarEmpregados() {
    return (await db.query(`
      SELECT * from empregados
      `)).rows;
  },

  async buscarPontosDeOntem(cod_empregado) {
    return (await db.query(`
      SELECT * FROM pontos
      WHERE cod_empregado = $1
      AND criado_em >= $2
      AND criado_em < $3
      `, [cod_empregado, startOfYesterday(), startOfToday()])).rows;
  },

  async salvarPonto(latitude, longitude, localizacao, cod_empregado) {
    return (await db.query(`
      INSERT INTO pontos
      (criado_em, latitude, longitude, localizacao, cod_empregado)
      values ($1, $2, $3, $4, $5) returning * 
      `, [new Date(), latitude, longitude, localizacao, cod_empregado])).rows[0];
  }
}