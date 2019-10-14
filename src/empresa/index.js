const empresa = require("express").Router();
const {validStore} =require("./Validators");
const {store} = require("./EmpresaController");

empresa.post("/", validStore, store);

module.exports = empresa;
