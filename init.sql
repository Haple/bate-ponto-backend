DROP TABLE avaliacoes_abono;
DROP TABLE abonos;
DROP TABLE pontos;
DROP TABLE horarios;
DROP TABLE empregados;
DROP TABLE jornadas;
DROP TABLE administradores;
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
	senha varchar,
	celular varchar,
	fk_codigo_empresa int references empresas(codigo)
);

CREATE TABLE administradores(
	alertar_atraso boolean,
	codigo_usuario int primary key references usuarios(codigo)
);

CREATE TABLE jornadas(
	codigo serial primary key,
	fk_codigo_empresa int references empresas(codigo),
	nome varchar
);

CREATE TABLE horarios(
	codigo serial primary key,
	dia_semana int,
	horario time,
	fk_codigo_jornada int references jornadas(codigo)
);

CREATE TABLE empregados(
	enviar_lembrete boolean,
	fk_codigo_jornada int references jornadas(codigo),
	codigo_usuario int primary key references usuarios(codigo)
);

CREATE TABLE pontos(
	codigo serial primary key,
	data_hora timestamp,
	latitude varchar,
	longitude varchar,
	localizacao varchar,
	fk_codigo_empregado int references empregados(codigo_usuario)
);

CREATE TABLE abonos(
	codigo serial primary key,
	motivo varchar,
	anexo bytea,
	data_solicitacao timestamp,
	data_abonada date,
	fk_codigo_empregado int references empregados(codigo_usuario)
);

CREATE TABLE avaliacoes_abono(
	status varchar,
	motivo varchar,
	fk_codigo_abono int references abonos(codigo),
	fk_codigo_admin int references administradores(codigo_usuario)
);
