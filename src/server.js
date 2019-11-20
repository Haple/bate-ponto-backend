const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (req, res) => {
	res.json({ status: 'Tô de pé' });
});

require('./empresa')(app);
require('./sessao')(app);
require('./abono')(app);
require("./confirmacao")(app);
require("./jornada")(app);
require("./empregado")(app);
require("./ponto")(app);

app.listen(process.env.PORT || 3000, () => {
	console.log("Servidor de pé! Vamo que vamo! ─=≡Σ((( つ＞＜)つ");
});
