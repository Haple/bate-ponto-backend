/**
 * Nesse arquivo ficam as regras das funcionalidades
 * e onde estão as chamadas à módulos de banco de dados
 * ou serviços de terceiros.
 * 
 */
const startOfToday = require('date-fns/startOfToday');
const { differenceInMinutes } = require("date-fns");
const db = require("../db");


module.exports = {
  async atualizaBancoDeHoras(saldoAtual, cod_empregado) {
    await db.query(`
        UPDATE empregados
        SET banco_horas = $1
        WHERE cod_usuario = $2`, [saldoAtual, cod_empregado]);
  },

  calculaNovoSaldo(pontosDeHoje, cargaDiaria, bancoDeHoras) {
    let entradas = [];
    let saidas = [];
    let i, j = 0, k = 0;
    for (i = 0; i < pontosDeHoje.length; i++) {
      const horario = pontosDeHoje[i];
      if (i % 2 == 0)
        entradas[j++] = horario;
      else
        saidas[k++] = horario;
    }
    if (saidas.length == entradas.length) {
      let horasTrabalhadas = 0;
      for (i = 0; i < saidas.length - 1; i++) {
        horasTrabalhadas += differenceInMinutes(saidas[i], entradas[i]);
      }
      let saldoDiarioAnterior = horasTrabalhadas == 0 ? 0 : horasTrabalhadas - cargaDiaria;
      horasTrabalhadas += differenceInMinutes(saidas[i], entradas[i]);
      let saldoDiarioNovo = horasTrabalhadas - cargaDiaria;
      return (bancoDeHoras - saldoDiarioAnterior) + saldoDiarioNovo;
    }
    return bancoDeHoras;
  },

  async buscarJornada(cod_jornada) {
    return (await db.query(`
      SELECT * from jornadas
      WHERE codigo = $1`, [cod_jornada])).rows[0];
  },

  async buscarEmpregado(cod_empregado) {
    return (await db.query(`
      SELECT * from empregados
      WHERE cod_usuario = $1`, [cod_empregado])).rows[0];
  },

  async buscarPontosDeHoje(cod_empregado) {
    return (await db.query(`
      SELECT * FROM pontos
      WHERE cod_empregado = $1
      AND criado_em >= $2
      `, [cod_empregado, startOfToday()])).rows;
  },

  async salvarPonto(latitude, longitude, localizacao, cod_empregado) {
    return (await db.query(`
      INSERT INTO pontos
      (criado_em, latitude, longitude, localizacao, cod_empregado)
      values ($1, $2, $3, $4, $5) returning * 
      `, [new Date(), latitude, longitude, localizacao, cod_empregado])).rows[0];
  }
}