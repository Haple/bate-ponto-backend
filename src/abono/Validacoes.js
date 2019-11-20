/**
 * Nesse arquivo estão as validações de cada 
 * rota do módulo. As validações interrompem
 * a requisição à uma rota caso tenha algum
 * erro na checagem dos dados de entrada.
 * 
 */
const { parse } = require("date-fns")

module.exports = {
    checaCadastro(req, res, next) {
        let { data_abonada, motivo } = req.body;
        let erros = [];

        if (!data_abonada || data_abonada.trim() == "")
            erros.push({ erro: "Data abonada é obrigatória" });
        else {
            data_abonada = parse(data_abonada, 'dd/MM/yyyy', new Date());
            req.body.data_abonada = data_abonada;
            if (data_abonada == 'Invalid Date')
                erros.push({ erro: "Data abonada inválida" });
            if (data_abonada >= new Date())
                erros.push({ erro: "Data abonada deve ser anterior a hoje" });
        }

        if (!motivo || motivo.trim() == "")
            erros.push({ erro: "Motivo obrigatório" });

        if (erros.length > 0)
            res.status(400).json({ erros: erros });
        else
            next();
    },
    checaEnvioAnexo(req, res, next) {
        const { file } = req;
        const { cod_abono } = req.params;

        let erros = [];

        if (!file) erros.push({ erro: "Anexo obrigatório" });

        const numeroRegex = /^[0-9]*$/;
        if (!cod_abono) erros.push({ erro: "Código do abono obrigatório" });
        if (!numeroRegex.test(cod_abono)) erros.push({ erro: "Código do abono inválido" });

        if (erros.length > 0)
            res.status(400).json({ erros: erros });
        else
            next();
    },

    checaDownload(req, res, next) {
        const { cod_abono } = req.params;

        let erros = [];

        const numeroRegex = /^[0-9]*$/;
        if (!cod_abono) erros.push({ erro: "Código do abono obrigatório" });
        if (!numeroRegex.test(cod_abono)) erros.push({ erro: "Código do abono inválido" });

        if (erros.length > 0)
            res.status(400).json({ erros: erros });
        else
            next();
    },

    checaAvaliacao(req, res, next) {
        const { cod_abono } = req.params;
        const { avaliacao } = req.body;

        let erros = [];

        const numeroRegex = /^[0-9]*$/;
        if (!cod_abono) erros.push({ erro: "Código do abono obrigatório" });
        if (!numeroRegex.test(cod_abono)) erros.push({ erro: "Código do abono inválido" });

        if (!avaliacao || avaliacao.trim() == "") erros.push({ erro: "Avaliação obrigatória" });

        if (erros.length > 0)
            res.status(400).json({ erros: erros });
        else
            next();
    },
};