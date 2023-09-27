const express = require("express");
const {
    listarconsulta,
    cadastrarconsultas,
    atualizarconsulta,
    deletarConsultas,
    finalizarconsulta,
    listarlaudo,
    consultasmedicos,
} = require("./controladores/consulta");
const {
    validarsenha,
    validarcadastros,
    validaratualizacao,
    validafinalizaconsulta,
    validarlaudo,
    validarmedico,
} = require("./intermediarios");

const rotas = express();

//criando rota de Lista de consultas

rotas.get("/consultas", validarsenha, listarconsulta);
rotas.post("/consultas", validarcadastros, cadastrarconsultas);
rotas.put(
    "/consultas/:identificadorconsulta/paciente",
    validaratualizacao,
    atualizarconsulta
);
rotas.delete("/consultas/:identificadorConsulta", deletarConsultas);
rotas.post("/consultas/finalizar", finalizarconsulta);
rotas.get("/consultas/laudo", validarlaudo, listarlaudo);
rotas.get("/consultas/medico", consultasmedicos);

module.exports = rotas;
