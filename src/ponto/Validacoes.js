/**
 * Nesse arquivo estão as validações de cada 
 * rota do módulo. As validações interrompem
 * a requisição à uma rota caso tenha algum
 * erro na checagem dos dados de entrada.
 * 
 */

module.exports = {
    checaPonto(req, res, next) {

        const { latitude, longitude, localizacao } = req.body;

        let erros = [];

        if (!latitude || latitude.trim() == "") erros.push({ erro: "Latitude obrigatória" });
        if (!longitude || longitude.trim() == "") erros.push({ erro: "Longitude obrigatória" });
        if (!localizacao || localizacao.trim() == "") erros.push({ erro: "Localização obrigatória" });

        if (erros.length > 0) {
            return res.status(400).json({ erros: erros });
        } else {
            next();
        }
    },
    checaBusca(req, res, next) {
        const { cod_empregado } = req.params;

        let erros = [];

        const numeroRegex = /^[0-9]*$/;
        if (!cod_empregado) erros.push({ erro: "Código do empregado obrigatório" });
        if (!numeroRegex.test(cod_empregado)) erros.push({ erro: "Código do empregado inválido" });

        if (erros.length > 0)
            return res.status(400).json({ erros: erros });
        else
            next();
    }
}