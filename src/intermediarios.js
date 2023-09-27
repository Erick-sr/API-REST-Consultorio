const {
    consultas,
    consultasFinalizadas,
    consultorio,
} = require("./bancodedados");

const validarsenha = (req, res, next) => {
    const { senha_consultorio, cnes_consultorio } = req.query;
    const senha = "CubosHealth@2022";
    const cnes = "1001";

    if (!senha_consultorio) {
        return res.status(401).json({
            error: "A senha do consultorio obrigatório",
        });
    }
    if (!cnes_consultorio) {
        return res.status(400).json({
            error: "cnes do consultorio obrigatório",
        });
    }
    if (senha_consultorio !== senha) {
        return res.status(401).json({
            error: "Senha incorreta",
        });
    }
    if (cnes_consultorio !== cnes) {
        return res.status(400).json({
            error: "CNES incorreto",
        });
    }

    next();
};

const validarcadastros = (req, res, next) => {
    const { tipoConsulta, valorConsulta, paciente } = req.body;

    if (!tipoConsulta) {
        return res.status(400).json({
            mensagem: "O campo  tipo de consulta é obrigatório",
        });
    }

    if (!valorConsulta) {
        return res
            .status(400)
            .json({ mensagem: "O campo valor da Consulta é obrigatório" });
    }

    if (!paciente) {
        return res
            .status(400)
            .json({ mensagem: "O campo paciente é obrigatório" });
    }

    if (!paciente.cpf) {
        return res.status(400).json({ mensagem: "O campo cpf é obrigatório" });
    }

    if (!paciente.nome) {
        return res.status(400).json({ mensagem: "O campo nome é obrigatório" });
    }

    if (!paciente.dataNascimento) {
        return res
            .status(400)
            .json({ mensagem: "O campo data de nascimento é obrigatório" });
    }

    if (!paciente.celular) {
        return res
            .status(400)
            .json({ mensagem: "O campo celular é obrigatório" });
    }

    if (!paciente.email) {
        return res
            .status(400)
            .json({ mensagem: "O campo email é obrigatório" });
    }

    if (!paciente.senha) {
        return res
            .status(400)
            .json({ mensagem: "O campo senha é obrigatório" });
    }

    if (isNaN(valorConsulta)) {
        return res
            .status(400)
            .json({ mensagem: "O valor digitado não é um número" });
    }

    if (tipoConsulta != "ODONTOLOGIA" && tipoConsulta != "GERAL") {
        return res
            .status(400)
            .json({ mensagem: "Especialidade não encontrada" });
    }

    const consultacpf = consultas.find((consulta) => {
        return Number(consulta.paciente.cpf) == Number(paciente.cpf);
    });

    if (consultacpf) {
        return res
            .status(400)
            .json({ mensagem: "O cpf já cadastrado em consulta" });
    }

    next();
};

const validaratualizacao = (req, res, next) => {
    const { nome, cpf, dataNascimento, celular, email, senha } = req.body;
    const { identificadorconsulta } = req.params;

    if (!nome) {
        return res.status(400).json({
            mensagem: "O campo  nome é obrigatório",
        });
    }

    if (!cpf) {
        return res.status(400).json({
            mensagem: "O campo  cpf é obrigatório",
        });
    }

    if (!dataNascimento) {
        return res.status(400).json({
            mensagem: "O campo  data de nascimento é obrigatório",
        });
    }

    if (!celular) {
        return res.status(400).json({
            mensagem: "O campo  celular é obrigatório",
        });
    }

    if (!email) {
        return res.status(400).json({
            mensagem: "O campo  email é obrigatório",
        });
    }

    if (!senha) {
        return res.status(400).json({
            mensagem: "O campo  senhas é obrigatório",
        });
    }

    // const consultacpf = consultas.find((consulta) => {
    //     return Number(consulta.paciente.cpf) == Number(cpf);
    // });

    // if (consultacpf) {
    //     return res
    //         .status(400)
    //         .json({ mensagem: "O cpf já cadastrado em consulta" });
    // }

    next();
};

validafinalizaconsulta = (req, res, next) => {
    const { identificadorConsulta, textoMedico } = req.body;
    if (!identificadorConsulta) {
        return res.status(400).json({
            mensagem: "O campo identificador da consulta obrigatório",
        });
    }

    if (!textoMedico) {
        return res.status(400).json({
            mensagem: "O campo  texto é obrigatório",
        });
    }

    if (textoMedico.length < 0 || textoMedico.length >= 200) {
        return res.status(400).json({
            mensagem: "O tamanho do textoMedico não está dentro do esperado",
        });
    }
    next();
};

validarlaudo = (req, res, next) => {
    const { identificador_consulta, senha } = req.query;

    if (!identificador_consulta) {
        return res.status(400).json({
            mensagem: "O parametro identificador de consulta é obrigatório",
        });
    }

    if (!senha) {
        return res.status(400).json({
            mensagem: "O parametro senha é obrigatório",
        });
    }

    const consulta = consultas.find((consulta) => {
        return Number(consulta.paciente.senha) === Number(senha);
    });

    const idconsulta = consultasFinalizadas.find((consulta) => {
        return (
            Number(consulta.identificador) === Number(identificador_consulta)
        );
    });

    if (!idconsulta) {
        return res.status(404).json({
            mensagem: "Consulta não encontrada ou Consulta não finalizada",
        });
    }

    if (!consulta) {
        return res.status(404).json({
            mensagem: "senha incorreta",
        });
    }
    next();
};

module.exports = {
    validarsenha,
    validarcadastros,
    validaratualizacao,
    validafinalizaconsulta,
    validarlaudo,
};
