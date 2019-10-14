const {isValidCpf} = require("@brazilian-utils/is-valid-cpf");
const {isValidCnpj} = require("@brazilian-utils/is-valid-cnpj");

module.exports = {
    validStore(req,res,next){
        const {cnpj, razao_social} = req.body;
        const {cpf,nome,email,senha,celular} = req.body;
        let erros = [];
    
        if(!cnpj) erros.push({erro:"CNPJ obrigatório"});
        if(!isValidCnpj(cnpj)) erros.push({erro:"CNPJ inválido"});
    
        if(!razao_social) erros.push({erro:"Razão Social obrigatória"});
    
        if(!cpf) erros.push({erro:"CPF obrigatório"});
        if(!isValidCpf(cpf)) erros.push({erro:"CPF inválido"});
    
        if(!nome) erros.push({erro:"Nome obrigatório"});
    
        const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(!email) erros.push({erro:"E-mail obrigatório"});
        if(!emailRegex.test(email)) erros.push({erro: "E-mail inválido"});
    
        const senhaRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
        if(!senha) erros.push({erro:"Senha obrigatória"});
        if(!senhaRegex.test(senha)) erros.push({erro: "Senha inválida"});
    
        const celularRegex = /(\({0,1}\d{0,2}\){0,1} {0,1})(\d{4,5}) {0,1}-{0,1}(\d{4})/;
        if(!celular) erros.push({erro:"Celular obrigatório"});
        if(!celularRegex.test(celular)) erros.push({erro: "Celular inválido"});

        if (erros.length > 0) {
            res.status(400).json({erros: erros});
        }else{
            next();
        }
    }
}; 