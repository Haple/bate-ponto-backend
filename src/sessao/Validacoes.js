/**
 * Nesse arquivo estão as validações de cada 
 * rota do módulo. As validações interrompem
 * a requisição à uma rota caso tenha algum
 * erro na checagem dos dados de entrada.
 * 
 */
const jwt = require('jsonwebtoken');

module.exports = {
    checaLogin(req, res, next) {
        const { email, senha } = req.body;
        let erros = [];

        const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!email || email.trim() == "") erros.push({ erro: "E-mail obrigatório" });
        if (!emailRegex.test(email)) erros.push({ erro: "E-mail inválido" });

        const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        if (!senha || senha.trim() == "") erros.push({ erro: "Senha obrigatória" });
        if (!senhaRegex.test(senha)) erros.push({ erro: "Senha inválida" });

        if (erros.length > 0) {
            res.status(400).json({ erros: erros });
        } else {
            next();
        }
    },
    checaJWT(req, res, next) {
        const token = req.headers['authorization'];
        if (!token) return res.status(401).send({
            mensagem: "Credencial ausente"
        });
        jwt.verify(token, process.env.SECRET, (erro, resultado) => {
            if (erro) return res.status(401).send({
                mensagem: 'Credencial inválida'
            });
            req.usuario = resultado;
            next();
        });
    },
    ehAdmin(req, res, next) {
        const { admin } = req.usuario;
        if (admin)
            next();
        else
            return res.status(403).json({
                erro: "Acesso restrito a administradores"
            });
    },
    ehEmpregado(req, res, next) {
        const { empregado } = req.usuario;
        if (empregado)
            next();
        else
            return res.status(403).json({
                erro: "Acesso restrito a empregados"
            });
    }
}; 