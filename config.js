require('dotenv').config();
const {Pool} = require('pg');
const ehProducao = process.env.NODE_ENV === 'production';

//formato da string de conexão
//postgresql://USER:PASSWORD@HOST:PORT/DATABASE
const stringDeConexao = 
`postgres://${process.env.DB_USER}`
+`:${process.env.DB_PASSWORD}`
+`@${process.env.DB_HOST}`
+`:${process.env.DB_PORT}`
+`/${process.env.DB_DATABASE}`;

const pool = new Pool({
	connectionString: 
		ehProducao ? process.env.DATABASE_URL : stringDeConexao,
	ssl: ehProducao
});

module.exports = { pool };
