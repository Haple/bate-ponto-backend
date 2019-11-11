/**
 * Nesse arquivo estão as validações de cada 
 * rota do módulo. As validações interrompem
 * a requisição à uma rota caso tenha algum
 * erro na checagem dos dados de entrada.
 * 
 */

module.exports = {
    ehPedidoValido(req, res, next) {
        const { motivo, data_solicitacao, data_abonada } = req.body;
        let erros = [];

        if(!data_solicitacao) erros.push({ erro: "Data da Solicitação obrigatória" });
        if(!data_abonada) erros.push({ erro: "Data do Abono obrigatório" });
        if(!motivo) erros.push({ erro: "Motivo obrigatório" });
             
        if(!validaData(data_solicitacao)) erros.push({ erro: "Data a Solicitação invalida" });
        if(!validaData(data_abonada)) erros.push({ erro: "Data do Abono invalida" });
        if(!validaPeriodo(data_abonada)) erros.push({ erro: "Data de abono não pode ser maior que data atual" });

        if (erros.length > 0) res.status(400).json({ erros: erros });
        else next();
    },

    ehFiltroValido(req, res, next) {
        const { data_solicitacao, data_abonada, cod_funcionario } = req.body;
        let erros = [];

        if(data_solicitacao)
            if(!validaData(data_solicitacao)) erros.push({ erro: "Data a Solicitação invalida" });
        if(data_abonada)
            if(!validaData(data_abonada)) erros.push({ erro: "Data a Solicitação invalida" });

        if (erros.length > 0) res.status(400).json({ erros: erros });
        else next();
    },
};

function validaPeriodo(data) {
    
    var parametro = data.split('/');
    var date = new Date();

    const ano = parametro[0];
    const mes = parametro[1];
    const dia = parametro[2];

    parametro = new Date(ano, mes - 1, dia);

    if(parametro.getTime() > date.getTime()) return false;

    return true;
};

function validaData(data) {

    const dataRegex = /(\d{4})[-.\/](\d{2})[-.\/](\d{2})/;
    if(!dataRegex.test(data))
        return false;
    return true;
};