/**
 * Nesse arquivo ficam as regras das funcionalidades
 * e onde estão as chamadas à módulos de banco de dados
 * ou serviços de terceiros.
 * 
 */
const startOfToday = require('date-fns/startOfToday');
const endOfToday= require('date-fns/endOfToday');
const startOfYesterday = require('date-fns/startOfYesterday');
const { differenceInMinutes, subMonths } = require("date-fns");
const db = require("../config/database");

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

  async buscarEmpregados() {
    return (await db.query(`
      SELECT * from empregados
      `)).rows;
  },

  async buscarPontos(cod_empregado, cod_empresa = 0) {
    return (await db.query(`
      SELECT p.* FROM pontos p
      INNER JOIN usuarios u
      ON u.codigo = p.cod_empregado
      WHERE p.cod_empregado = $1
      AND ($2 = 0 or u.cod_empresa = $2)
      AND p.criado_em >= $3
      ORDER BY p.codigo DESC
      `, [
      cod_empregado,
      cod_empresa
      , subMonths(new Date(), 1)
    ])).rows;
  },

  async buscarPontosDeOntem(cod_empregado) {
    return (await db.query(`
      SELECT * FROM pontos
      WHERE cod_empregado = $1
      AND criado_em >= $2
      AND criado_em < $3
      `, [cod_empregado, startOfYesterday(), startOfToday()])).rows;
  },

  async checaAtraso(nome, email, cod_jornada, cod_empregado, cod_empresa){

    const primeiroPontoDoDia = (await db.query(`
      SELECT * FROM pontos
      WHERE cod_empregado = $1
      AND criado_em >= $2
      AND criado_em < $3
      `, [cod_empregado, startOfToday(), endOfToday()])).rowCount == 0;
    if(!primeiroPontoDoDia) return;

    let horario_esperado = (await db.query(`
    SELECT entrada1 FROM jornadas
    WHERE codigo = $1
    `, [cod_jornada])).rows[0].entrada1;
    let horas = parseInt(horario_esperado.split(':')[0]);
    let minutos = parseInt(horario_esperado.split(':')[1]);
    let agora = new Date();
    if (agora.getHours() > horas || agora.getMinutes() > minutos + 5) {
      await db.query(`
      INSERT INTO atrasos
      (nome, email, horario_esperado, data_hora_atraso, cod_empregado, cod_empresa)
      values ($1, $2, $3, $4, $5, $6) returning * 
      `, [nome, email, horario_esperado, agora, cod_empregado, cod_empresa]);      
    } 
  },

  async salvarPonto(latitude, longitude, localizacao, cod_empregado) {
    return (await db.query(`
      INSERT INTO pontos
      (criado_em, latitude, longitude, localizacao, cod_empregado)
      values ($1, $2, $3, $4, $5) returning * 
      `, [new Date(), latitude, longitude, localizacao, cod_empregado])).rows[0];
  }

}

