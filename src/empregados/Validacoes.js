/**
 * Nesse arquivo estão as validações de cada 
 * rota do módulo. As validações interrompem
 * a requisição à uma rota caso tenha algum
 * erro na checagem dos dados de entrada.
 * 
 */
const { isValidCpf } = require("@brazilian-utils/is-valid-cpf");

module.exports = {
    checaCadastro(req, res, next) {
        const { admin } = req.usuario;
        const { cpf, nome, email, senha, celular, cod_jornada } = req.body;
        let erros = [];

        if (!admin) erros.push({ erro: "Apenas administradores podem criar empregados!" });

        if (!cpf || cpf.trim() == "") erros.push({ erro: "CPF obrigatório!" });
        if (!isValidCpf(cpf)) erros.push({ erro: "CPF inválido!" });
        req.body.cpf = cpf.replace(/(?!\w|\s)./g, '');

        if (!nome || nome.trim() == "") erros.push({ erro: "Nome obrigatório!" });

        const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!email || email.trim() == "") erros.push({ erro: "E-mail obrigatório!" });
        if (!emailRegex.test(email)) erros.push({ erro: "E-mail inválido!" });

        const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        if (!senha || senha.trim() == "") erros.push({ erro: "Senha obrigatória!" });
        if (!senhaRegex.test(senha)) erros.push({ erro: "Senha inválida!" });

        const celularRegex = /^(\({0,1}\d{0,2}\){0,1} {0,1})(\d{4,5}) {0,1}-{0,1}(\d{4})$/;
        if (!celular || celular.trim() == "") erros.push({ erro: "Celular obrigatório!" });
        if (!celularRegex.test(celular)) erros.push({ erro: "Celular inválido!" });
        req.body.celular = celular.replace(/(?!\w|\s)./g, '').replace(/\s/g, '');

        const numeroRegex = /^[0-9]*$/;
        if (!cod_jornada) erros.push({ erro: "Código da jornada obrigatório!" });
        if (!numeroRegex.test(cod_jornada)) erros.push({ erro: "Código da jornada inválido!" });

        if (erros.length > 0) {
            return res.status(400).json({ erros: erros });
        } else {
            next();
        }
    },
    checaAtualizacao(req, res, next) {
        const { cod_empregado } = req.params;
        const { nome, email, celular, cod_jornada } = req.body;

        let erros = [];

        const numeroRegex = /^[0-9]*$/;
        if (!cod_empregado) erros.push({ erro: "Código do empregado obrigatório!" });
        if (!numeroRegex.test(cod_empregado)) erros.push({ erro: "Código do empregado inválido!" });

        if (!nome || nome.trim() == "")
            erros.push({ erro: "Nome obrigatório!" });

        const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if (!email || email.trim() == "") erros.push({ erro: "E-mail obrigatório!" });
        if (!emailRegex.test(email)) erros.push({ erro: "E-mail inválido!" });

        const celularRegex = /^(\({0,1}\d{0,2}\){0,1} {0,1})(\d{4,5}) {0,1}-{0,1}(\d{4})$/;
        if (!celular || celular.trim() == "") erros.push({ erro: "Celular obrigatório!" });
        if (!celularRegex.test(celular)) erros.push({ erro: "Celular inválido!" });
        req.body.celular = celular.replace(/(?!\w|\s)./g, '').replace(/\s/g, '');

        if (!cod_jornada) erros.push({ erro: "Código da jornada obrigatório!" });
        if (!numeroRegex.test(cod_jornada)) erros.push({ erro: "Código da jornada inválido!" });

        if (erros.length > 0) {
            return res.status(400).json({ erros: erros });
        } else {
            next();
        }
    },
    checaCodEmpregado(req, res, next) {
        const { cod_empregado } = req.params;
        let erros = [];

        const numeroRegex = /^[0-9]*$/;
        if (!numeroRegex.test(cod_empregado)) erros.push({ erro: "Código do empregado inválido!" });

        if (erros.length > 0) {
            return res.status(400).json({ erros: erros });
        } else {
            next();
        }
    }
}
