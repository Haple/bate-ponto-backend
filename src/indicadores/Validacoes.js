/**
 * Nesse arquivo estão as validações de cada 
 * rota do módulo. As validações interrompem
 * a requisição à uma rota caso tenha algum
 * erro na checagem dos dados de entrada.
 * 
 */

module.exports = {
    checaCodIndicador(req, res, next) {
        const { cod_indicador } = req.params;
        let erros = [];

        const numeroRegex = /^[0-9]*$/;
        if (!numeroRegex.test(cod_indicador)) erros.push({ erro: "Código do indicador inválido" });

        if (erros.length > 0) {
            return res.status(400).json({ erros: erros });
        } else {
            next();
        }
    }
}
