/**
 * Nesse arquivo ficam as regras das funcionalidades
 * e onde estão as chamadas à módulos de banco de dados
 * ou serviços de terceiros.
 * 
 */
const db = require("../config/database");

module.exports = {

  async buscarAtrasos(cod_empresa) {
    return (await db.query(`
      SELECT * FROM atrasos
      WHERE cod_empresa = $1
      ORDER BY codigo DESC
      `, [cod_empresa])).rows;
  },

}

