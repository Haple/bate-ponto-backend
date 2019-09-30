const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (requisicao, resposta) => {
	resposta.json({status: 'DE PÉ!'});
});

app.listen(process.env.PORT || 3000, () => {
	console.log("Servidor iniciado com sucesso");
});
