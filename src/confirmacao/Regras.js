/**
 * Nesse arquivo ficam as regras das funcionalidades
 * e onde estão as chamadas à módulos de banco de dados
 * ou serviços de terceiros.
 * 
 */
const db = require('../config/database');
const uuid = require("uuid/v4");
const { addDays } = require("date-fns");

const mailer = require("nodemailer");

module.exports = {
    async criarConfirmacao(cod_usuario) {
        const codigo = uuid();
        await db.query(`
            INSERT INTO confirmacoes
            (codigo, data_expiracao,cod_usuario)
            VALUES ($1, $2, $3)
            `,
            [codigo, addDays(new Date(), 2), cod_usuario]);
        return codigo;
    },
    async confirmar(cod_confirmacao) {
        const confirmacao = (await db.query(`
            SELECT * FROM confirmacoes
            WHERE codigo = $1
            `,
            [cod_confirmacao])).rows[0];
        if (!confirmacao) throw new Error("Código inválido");
        const usuario = (await db.query(`
            UPDATE usuarios
            SET confirmado = true
            WHERE codigo = $1
            RETURNING *
            `,
            [confirmacao.cod_usuario])).rows[0];
        return usuario.email;
    },
    async enviarEmailConfirmacao(cod_confirmacao, email, nome) {
        const transporter = mailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_SENHA
            }
        });

        await transporter.sendMail({
            from: '"Bate ponto" <no-reply@bateponto.com>',
            to: email,
            subject: 'Confirmação de e-mail',
            html: `
                ${nome}? É você? Se sim 
                <a href="https://surge.sh?cod=${cod_confirmacao}">clique aqui</a>.
            `
        });
    }
}