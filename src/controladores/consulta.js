const { parseInt } = require("lodash");
const fs = require("fs/promises");
let {
    consultorio,
    consultas,

    consultasFinalizadas,
    laudos,
} = require("../bancodedados");

let idConsulta = 1;
let idlaudo = 1;
let idmedico;
//lista contendo todas as consultas.

const listarconsulta = (req, res) => {
    if (consultas.length == 0) {
        return res.status(404).json({
            mensagem: "Nenhuma consulta encontrada",
        });
    }

    return res.status(200).json(consultas);
};

//cadastrar consultas

const cadastrarconsultas = (req, res) => {
    const { tipoConsulta, valorConsulta, paciente } = req.body;

    if (tipoConsulta === "ODONTOLOGIA") {
        idmedico = 1;
    } else if (tipoConsulta === "GERAL") {
        idmedico = 2;
    }

    const novaConsulta = {
        identificador: idConsulta++,
        tipoConsulta,
        identificadorMedico: idmedico,
        finalizada: false,
        valorConsulta,
        paciente,
    };

    consultas.push(novaConsulta);

    return res.status(204).send();
};

//Atualizar informações da consulta médica

const atualizarconsulta = (req, res) => {
    const { nome, cpf, dataNascimento, celular, email, senha } = req.body;
    const { identificadorconsulta } = req.params;

    if (consultas.length == 0) {
        return res.status(404).json({
            mensagem: "Nenhuma consulta cadastrada no sistema",
        });
    }

    const consulta = consultas.find(
        (consulta) => consulta.identificador === Number(identificadorconsulta)
    );

    const { paciente, identificador, tipoConsulta } = consulta;

    paciente.nome = nome;
    paciente.cpf = cpf;
    paciente.dataNascimento = dataNascimento;
    paciente.celular = celular;
    paciente.email = email;
    paciente.senha = senha;

    return res.status(204).send();
};

//deletar consultas
const deletarConsultas = (req, res) => {
    const { identificadorConsulta } = req.params;

    const consulta = consultas.find((consulta) => {
        return Number(consulta.identificador) === Number(identificadorConsulta);
    });

    if (!consulta) {
        return res.status(404).json({ mensagem: "O consulta não existe." });
    }
    if (consulta.finalizada === true) {
        return res.status(404).json({
            mensagem:
                "A consulta só pode ser removida se a mesma não estiver finalizada",
        });
    }
    //consultas = consultas.filter((consulta) => {
    //   return consulta.identificador !== Number(identificadorConsulta);
    // });
    consultas = consultas.filter((consulta) => {
        return Number(consulta.identificador) !== Number(identificadorConsulta);
    });
    return res.status(204).send();
};
//finalizar consulta

const finalizarconsulta = (req, res) => {
    const { identificadorConsulta, textoMedico } = req.body;

    if (consultas.length == 0) {
        return res.status(404).json({
            mensagem: "Nenhuma consulta encontrada",
        });
    }

    const consulta = consultas.find((consulta) => {
        return consulta.identificador === Number(identificadorConsulta);
    });

    if (!consulta) {
        return res.status(404).json({ mensagem: "O consulta não existe." });
    }
    //const consultafinalizada = consulta;
    const consultafinalizada = {};
    const laudo = {};

    //consultafinalizada.identificadorMedico = 1;
    //consultafinalizada.identificadorlaudo = idlaudo++;

    if (consulta.tipoConsulta === "ODONTOLOGIA") {
        idmedico = 1;
    } else if (consulta.tipoConsulta === "GERAL") {
        idmedico = 2;
    }

    consultafinalizada.identificador = identificadorConsulta;
    consultafinalizada.tipoConsulta = consulta.tipoConsulta;
    consultafinalizada.identificadorMedico = idmedico;
    consulta.finalizada = true;
    consultafinalizada.finalizada = consulta.finalizada;
    consultafinalizada.identificadorlaudo = idlaudo++;
    consultafinalizada.valorConsulta = consulta.valorConsulta;
    consultafinalizada.paciente = consulta.paciente;

    consultasFinalizadas.push(consultafinalizada);

    laudo.identificador = consultafinalizada.identificadorlaudo;
    laudo.identificadorConsulta = consultafinalizada.identificador;
    laudo.identificadorMedico = idmedico;
    laudo.textoMedico = req.body.textoMedico;
    laudo.paciente = consultafinalizada.paciente;

    laudos.push(laudo);

    //console.log(laudos);

    return res.status(200).json(laudo);
};

const listarlaudo = (req, res) => {
    const { identificador_consulta, senha } = req.query;

    if (consultas.length == 0) {
        return res.status(404).json({
            mensagem: "Nenhuma consulta encontrada",
        });
    }

    //console.log(identificador_consulta);

    // console.log(laudos);

    const laudo = laudos.find((laudo) => {
        return (
            Number(laudo.identificadorConsulta) ===
            Number(identificador_consulta)
        );
    });

    //console.log(laudo);
    return res.status(200).json(laudo);
};

// medico
const consultasmedicos = (req, res) => {
    const { identificador_medico } = req.query;

    if (!identificador_medico) {
        return res.status(404).json({
            mensagem: "Identificador do medico obrigatorio na url",
        });
    }

    const idmedico = consultorio.medicos.find((medico) => {
        return Number(medico.identificador) === Number(identificador_medico);
    });

    if (!idmedico) {
        return res.status(404).json({
            mensagem: "O médico informado não existe na base!",
        });
    }

    if (consultasFinalizadas.length == 0) {
        return res.status(404).json({
            mensagem:
                "Nenhuma consulta finalizada por esse medico foi encontrada",
        });
    }

    const medico = consultasFinalizadas.filter((consulta) => {
        return (
            Number(consulta.identificadorMedico) ===
            Number(identificador_medico)
        );
    });
    if (medico.length == 0) {
        return res.status(404).json({
            mensagem:
                "Nenhuma consulta finalizada por esse medico foi encontrada",
        });
    }
    return res.status(200).json(medico);
};
module.exports = {
    listarconsulta,
    cadastrarconsultas,
    atualizarconsulta,
    deletarConsultas,
    finalizarconsulta,
    listarlaudo,
    consultasmedicos,
};
