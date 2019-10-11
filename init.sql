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
	cod_empresa int references empresas
);

CREATE TABLE administradores(
	alertar_atraso boolean,
	cod_usuario int primary key references usuarios
);

CREATE TABLE jornadas(
	codigo serial primary key,
	cod_empresa int references empresas,
	nome varchar
);

CREATE TABLE horarios(
	codigo serial primary key,
	dia_semana int,
	horario time,
	cod_jornada int references jornadas
);

CREATE TABLE empregados(
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
	criado_em timestamp,
	data_abonada date,
	cod_empregado int references empregados
);

CREATE TABLE avaliacoes_abono(
	codigo serial primary key,
	status varchar,
	motivo varchar,
	criado_em timestamp,
	cod_abono int references abonos,
	cod_admin int references administradores
);
