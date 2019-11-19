require('dotenv').config();
var types = require('pg').types;
const { Pool } = require('pg');
const ehProducao = process.env.NODE_ENV === 'production';

//configuração para que a data do banco seja convertida
//corretamente para o fuso horário do servidor 
var timestampOID = 1114;
types.setTypeParser(timestampOID,
	(stringValue) => new Date(Date.parse(stringValue + "+0000")));

//formato da string de conexão
//postgresql://USER:PASSWORD@HOST:PORT/DATABASE
const stringDeConexao =
	`postgres://${process.env.DB_USER}`
	+ `:${process.env.DB_PASSWORD}`
	+ `@${process.env.DB_HOST}`
	+ `:${process.env.DB_PORT}`
	+ `/${process.env.DB_DATABASE}`;

const pool = new Pool({
	connectionString:
		ehProducao ? process.env.DATABASE_URL : stringDeConexao,
	ssl: ehProducao
});

module.exports = {
	query: (text, params) => {
		return pool.query(text, params);
	}
};
