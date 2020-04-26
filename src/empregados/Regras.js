/**
 * Nesse arquivo ficam as regras das funcionalidades
 * e onde estão as chamadas à módulos de banco de dados
 * ou serviços de terceiros.
 * 
 */
const db = require('../config/database');

module.exports = {
    async cadastroJaExistente(cpf, email) {
        const cpfExistente = (await db.query(`
            SELECT * FROM usuarios
            WHERE cpf = $1
        `, [cpf])).rows[0];
        if (cpfExistente) throw new Error("CPF já cadastrado");
        await emailJaExiste(email);
    },

    async criarEmpregado(cod_usuario, cod_jornada) {
        const empregado = (await db.query(`
            INSERT INTO empregados
            (enviar_lembrete,banco_horas,cod_usuario,cod_jornada)
            VALUES (false,0,$1,$2)
            RETURNING *
            `,
            [cod_usuario, cod_jornada])).rows[0];
        return empregado;
    },

    async atualizaEmpregado(cod_empregado, nome, email, celular, cod_jornada) {
        const empregado = (await db.query(`
            UPDATE empregados e
            SET cod_jornada = $1
            FROM usuarios u
            WHERE e.cod_usuario = u.codigo  
            AND cod_usuario = $2
            RETURNING *
            `,
            [cod_jornada, cod_empregado])).rows[0];
        if (!empregado) throw new Error("Empregado não encontrado");
        if (empregado.email != email) {
            await emailJaExiste(email);
        }
        const usuario = (await db.query(`
            UPDATE usuarios
            SET nome = $1,
            email = $2,
            celular = $3
            WHERE codigo = $4
            RETURNING *
            `,
            [nome, email, celular, cod_empregado])).rows[0];
        delete usuario.senha;
        return { ...usuario, cod_jornada };
    },

    async buscaEmpregado(cod_empresa, cod_empregado) {
        const empregado = (await db.query(`
            SELECT * FROM empregados e
            INNER JOIN usuarios u
            ON u.codigo = e.cod_usuario
            WHERE u.cod_empresa = $1
            AND u.codigo = $2
            `,
            [cod_empresa, cod_empregado])).rows[0];
        if (!empregado) throw new Error("Empregado não encontrado");
        delete empregado.senha;
        return empregado;
    },

    async buscaEmpregados(cod_empresa, cod_jornada, nome) {
        const empregados = (await db.query(`
            SELECT * FROM empregados e
            INNER JOIN usuarios u
            ON u.codigo = e.cod_usuario
            WHERE u.cod_empresa = $1
            AND ($2 = 0 or e.cod_jornada = $2)
            AND ($3 = '' or u.nome like $3)
            `,
            [
                cod_empresa,
                cod_jornada ? cod_jornada : 0,
                nome ? `%${nome}%` : ''
            ],
        )).rows;
        return empregados.map(empregado => {
            delete empregado.senha;
            return empregado;
        });
    },

    async deletarEmpregado(cod_empresa, cod_empregado) {
        await deletarPontos(cod_empresa, cod_empregado);
        await deletarAbonos(cod_empresa, cod_empregado);
        const deletado = await deletarEmpregado(cod_empresa, cod_empregado);
        if (!deletado) throw new Error("Empregado não encontrado");
        const admin = await ehAdmin(cod_empresa, cod_empregado);
        if (!admin) {
            await deletarConfirmacoes(cod_empresa, cod_empregado);
            await deletarUsuario(cod_empresa, cod_empregado);
        }
    },

}


async function emailJaExiste(email) {
    const emailExistente = (await db.query(`
            SELECT * FROM usuarios
            WHERE email = $1
        `, [email])).rows[0];
    if (emailExistente)
        throw new Error("E-mail já cadastrado");
}

async function deletarUsuario(cod_empresa, cod_empregado) {
    await db.query(`
                DELETE FROM usuarios 
                WHERE cod_empresa = $1
                AND codigo = $2
            `, [cod_empresa, cod_empregado]);
}

async function deletarConfirmacoes(cod_empresa, cod_empregado) {
    await db.query(`
                DELETE FROM confirmacoes c
                USING usuarios u
                WHERE u.codigo = c.cod_usuario
                AND u.cod_empresa = $1
                AND u.codigo = $2
            `, [cod_empresa, cod_empregado]);
}

async function ehAdmin(cod_empresa, cod_empregado) {
    return (await db.query(`
            SELECT * FROM administradores a
            INNER JOIN usuarios u
            ON u.codigo = a.cod_usuario
            WHERE u.cod_empresa = $1
            AND u.codigo = $2
        `, [cod_empresa, cod_empregado])).rowCount >= 1;
}

async function deletarEmpregado(cod_empresa, cod_empregado) {
    return (await db.query(`
            DELETE FROM empregados e
            USING usuarios u
            WHERE u.codigo = e.cod_usuario
            AND u.cod_empresa = $1
            AND u.codigo = $2
        `, [cod_empresa, cod_empregado])).rowCount >= 1;
}

async function deletarPontos(cod_empresa, cod_empregado) {
    await db.query(`
            DELETE FROM pontos p
            USING usuarios u
            WHERE u.codigo = p.cod_empregado
            AND u.cod_empresa = $1
            AND u.codigo = $2
        `, [cod_empresa, cod_empregado]);
}

async function deletarAbonos(cod_empresa, cod_empregado) {
    await db.query(`
            DELETE FROM abonos a
            USING usuarios u
            WHERE u.codigo = a.cod_empregado
            AND u.cod_empresa = $1
            AND u.codigo = $2
        `, [cod_empresa, cod_empregado]);
}
