const empresa = require("express").Router();
const EmpresaController = require("./EmpresaController");

empresa.post("/", EmpresaController.store);

module.exports = empresa;
