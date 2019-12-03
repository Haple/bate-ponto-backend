-- Usuários

-- ADMIN
-- Email: santosalepholiveira@gmail.com
-- Senha: @Rataroeu1rainha

-- EMPREGADO
-- Email: renata2019@gmail.com
-- Senha: @Renata2019

-- EMPREGADO
-- Email: joana2019@gmail.com
-- Senha: @Joana2019

DROP TABLE IF EXISTS abonos;
DROP TABLE IF EXISTS pontos;
DROP TABLE IF EXISTS empregados;
DROP TABLE IF EXISTS jornadas;
DROP TABLE IF EXISTS administradores;
DROP TABLE IF EXISTS confirmacoes;
DROP TABLE IF EXISTS usuarios;
DROP TABLE IF EXISTS empresas;

CREATE TABLE IF NOT EXISTS empresas(
	codigo serial primary key,
	cnpj varchar,
	razao_social varchar
);

CREATE TABLE IF NOT EXISTS usuarios(
	codigo serial primary key,
	cpf varchar,
	nome varchar,
	email varchar,
	confirmado boolean,
	senha varchar,
	celular varchar,
	cod_empresa int references empresas
);

CREATE TABLE IF NOT EXISTS confirmacoes(
	codigo varchar primary key,
	data_expiracao date,
	cod_usuario int references usuarios
);

CREATE TABLE IF NOT EXISTS administradores(
	alertar_atraso boolean,
	cod_usuario int primary key references usuarios
);

CREATE TABLE IF NOT EXISTS jornadas(
	codigo serial primary key,
	cod_empresa int references empresas,
	nome varchar,
	entrada1 time,
	saida1 time,
	entrada2 time,
	saida2 time,
	carga_diaria int
);

CREATE TABLE IF NOT EXISTS empregados(
	banco_horas int,
	enviar_lembrete boolean,
	cod_jornada int references jornadas,
	cod_usuario int primary key references usuarios
);

CREATE TABLE IF NOT EXISTS pontos(
	codigo serial primary key,
	criado_em timestamp,
	latitude varchar,
	longitude varchar,
	localizacao varchar,
	cod_empregado int references empregados
);

CREATE TABLE IF NOT EXISTS abonos(
	codigo serial primary key,
	motivo varchar,
	anexo varchar,
	anexo_original varchar,
	data_solicitacao timestamp,
	data_abonada date,
	aprovado boolean,
	avaliacao varchar,
	cod_empregado int references empregados,
	cod_admin int references administradores
);



INSERT INTO empresas VALUES (DEFAULT,'61079117000105','Havaianas');
INSERT INTO usuarios 
VALUES (DEFAULT,
'47156633848',
'Aleph Santos Oliveira',
'santosalepholiveira@gmail.com',
'false',
'$2a$08$vV7K.KksBwjPjPPG2X2IhudEIyFVXshhPP4HrZs2cuPv6jNtnT0eS',
'19999898596',
1),
(DEFAULT,
'84265546102',	
'Renata Diniz Almeida',	
'renata2019@gmail.com',
'false',
'$2a$08$OLzQyVRjrESy5o81j6mMjOMAsL0syEPEn/5lcMN.QkambLWWP9b7i',
'19999898596',
1),
(DEFAULT,
'32554017476',	
'Joana Abreu',	
'joana2019@gmail.com',
'false',
'$2a$08$nG7.Prh1ZudAs/2j2n6/ge7RZXiFJ5UxJY10VQ92a8Zuo6frsuyg6',
'19999898596',
1);

INSERT INTO administradores VALUES ('false', 1);

INSERT INTO jornadas VALUES 
(DEFAULT,1,'Jornada padrão','08:00:00','12:00:00','13:00:00', '17:00:00',	480);

INSERT INTO empregados VALUES
(120,'false', 1, 2), (-160,'false', 1, 3);

INSERT INTO abonos 
VALUES (
DEFAULT,
'Fui acompanhar minha mãe no médico',
NULL,
NULL,
current_timestamp,
'2019-10-01',
NULL,
null,
2,
NULL
);

INSERT INTO pontos 
VALUES
(
DEFAULT,
'2019-12-02T07:00:00.000000',
'-22.8063854',
'-47.2226214',
'Rua Rio Grande do Norte, 65, Jardim Nova Veneza (Nova Veneza) - Sumaré',
2
),
(
DEFAULT,
'2019-12-02T12:00:00.000000',
'-22.8063854',
'-47.2226214',
'Rua Rio Grande do Norte, 65, Jardim Nova Veneza (Nova Veneza) - Sumaré',
2
),
(
DEFAULT,
'2019-12-02T13:00:00.000000',
'-22.8063854',
'-47.2226214',
'Rua Rio Grande do Norte, 65, Jardim Nova Veneza (Nova Veneza) - Sumaré',
2
),
(
DEFAULT,
'2019-12-02T18:00:00.000000',
'-22.8063854',
'-47.2226214',
'Rua Rio Grande do Norte, 65, Jardim Nova Veneza (Nova Veneza) - Sumaré',
2
);