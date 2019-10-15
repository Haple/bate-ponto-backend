const router = require("express").Router();
const jwt = require('jsonwebtoken');
const { checaLogin } = require("./Validacoes");
const { logar } = require("./Regras");

router.post("/", checaLogin, async (req, res) => {
	const { email, senha } = req.body;
	const usuario = await logar(email, senha);
	return res.status(200).json({
		usuario, admin: true, empregado: false
	});
});

module.exports = app => app.use('/sessoes', router);

//authentication
// app.post('/login', (req, res, next) => {
// 	if (req.body.user === 'luiz' && req.body.pwd === '123') {
// 		//auth ok
// 		const id = 1; //esse id viria do banco de dados
// 		var token = jwt.sign({ id }, process.env.SECRET, {
// 			expiresIn: 300 // expires in 5min
// 		});
// 		res.status(200).send({ auth: true, token: token });
// 	}

// 	res.status(500).send('Login inválido!');
// })
