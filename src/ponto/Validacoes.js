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
            res.status(400).json({ erros: erros });
        } else {
            next();
        }
    },
}