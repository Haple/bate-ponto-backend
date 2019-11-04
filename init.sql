DROP TABLE avaliacoes_abono;
DROP TABLE abonos;
DROP TABLE pontos;
DROP TABLE empregados;
DROP TABLE jornadas;
DROP TABLE administradores;
DROP TABLE confirmacoes;
DROP TABLE usuarios;
DROP TABLE empresas;

CREATE TABLE empresas(
	codigo serial primary key,
	cnpj varchar,
	razao_social varchar
);

CREATE TABLE usuarios(
	codigo serial primary key,
	cpf varchar,
	nome varchar,
	email varchar,
	confirmado boolean,
	senha varchar,
	celular varchar,
	cod_empresa int references empresas
);

CREATE TABLE confirmacoes(
	codigo varchar primary key,
	data_expiracao date,
	cod_usuario int references usuarios
);

CREATE TABLE administradores(
	alertar_atraso boolean,
	cod_usuario int primary key references usuarios
);

CREATE TABLE jornadas(
	codigo serial primary key,
	cod_empresa int references empresas,
	nome varchar,
	entrada1 time,
	saida1 time,
	entrada2 time,
	saida2 time,
	carga_diaria int
);


CREATE TABLE empregados(
	banco_horas int,
	enviar_lembrete boolean,
	cod_jornada int references jornadas,
	cod_usuario int primary key references usuarios
);

CREATE TABLE pontos(
	codigo serial primary key,
	criado_em timestamp,
	latitude varchar,
	longitude varchar,
	localizacao varchar,
	cod_empregado int references empregados
);

CREATE TABLE abonos(
	codigo serial primary key,
	motivo varchar,
	anexo bytea,
	data_solicitacao timestamp,
	data_abonada date,
	cod_empregado int references empregados
);

CREATE TABLE avaliacoes_abono(
	aprovado boolean,
	motivo varchar,
	cod_abono int primary key references abonos,
	cod_admin int references administradores
);
