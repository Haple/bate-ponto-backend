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
const { EMAIL, EMAIL_SENHA } = process.env;
module.exports = {
    async solicitarConfirmacao(cod_usuario, email, nome, url) {
        const cod_confirmacao = uuid();
        await db.query(`
            INSERT INTO confirmacoes
            (codigo, data_expiracao,cod_usuario)
            VALUES ($1, $2, $3)
            `,
            [cod_confirmacao, addDays(new Date(), 2), cod_usuario]);
        const transporter = mailer.createTransport({
            service: 'gmail',
            auth: { user: EMAIL, pass: EMAIL_SENHA }
        });
        await transporter.sendMail({
            from: '"Bate ponto" <no-reply@bateponto.com>',
            to: email, subject: 'Confirmação de e-mail',
            html: `
                    ${nome}? É você? Se sim 
                    <a href="${url}/confirmacoes/${cod_confirmacao}">
                        clique aqui
                    </a>.
                `
        });
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
}