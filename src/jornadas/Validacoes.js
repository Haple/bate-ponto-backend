/**
 * Nesse arquivo estão as validações de cada 
 * rota do módulo. As validações interrompem
 * a requisição à uma rota caso tenha algum
 * erro na checagem dos dados de entrada.
 * 
 */
const { horarioEstaDepois } = require("../util/Horario");

module.exports = {
    checaCadastro(req, res, next) {
        const { admin } = req.usuario;
        const { nome, entrada1, saida1 } = req.body;
        const { entrada2, saida2 } = req.body;
        let erros = [];

        if (!admin) erros.push({ erro: "Apenas administradores podem criar jornadas!" });

        if (!nome || nome.trim() == "") erros.push({ erro: "Nome é obrigatório!" });

        const horaRegex = /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/;
        if (!entrada1) erros.push({ erro: "Entrada 1 é obrigatória!" });
        if (!horaRegex.test(entrada1)) erros.push({ erro: "Entrada 1 inválida!" });

        if (!saida1) erros.push({ erro: "Saída 1 é obrigatória!" });
        if (!horaRegex.test(saida1)) erros.push({ erro: "Saída 1 inválida!" });

        if (!entrada2) erros.push({ erro: "Entrada 2 é obrigatória!" });
        if (!horaRegex.test(entrada2)) erros.push({ erro: "Entrada 2 inválida!" });

        if (!saida2) erros.push({ erro: "Saída 2 é obrigatória!" });
        if (!horaRegex.test(saida2)) erros.push({ erro: "Saída 2 inválida!" });

        if (!horarioEstaDepois(entrada1, saida1))
            erros.push({ erro: "Saída 1 precisa ser maior que a Entrada 1!" });
        if (!horarioEstaDepois(saida1, entrada2))
            erros.push({ erro: "Entrada 2 precisa ser maior que a Saída 1!" });
        if (!horarioEstaDepois(entrada2, saida2))
            erros.push({ erro: "Saída 2 precisa ser maior que a Entrada 2!" });

        if (erros.length > 0) {
            return res.status(400).json({ erros: erros });
        } else {
            next();
        }
    },
    checaExclusao(req, res, next) {
        const { cod_jornada } = req.params;
        let erros = [];

        const numeroRegex = /^[0-9]*$/;
        if (!numeroRegex.test(cod_jornada)) erros.push({ erro: "Código da jornada inválido!" });

        if (erros.length > 0) {
            return res.status(400).json({ erros: erros });
        } else {
            next();
        }
    }
}