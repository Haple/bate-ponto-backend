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

DROP TABLE IF EXISTS atrasos;
DROP TABLE IF EXISTS indicadores_respostas;
DROP TABLE IF EXISTS indicadores_ativados;
DROP TABLE IF EXISTS indicadores_resultados;
DROP TABLE IF EXISTS indicadores;

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

CREATE TABLE IF NOT EXISTS indicadores(
	codigo serial primary key,
	titulo varchar,
	mensagem varchar
);

CREATE TABLE IF NOT EXISTS indicadores_ativados(
	cod_indicador int references indicadores,
	cod_empresa int references empresas
);

CREATE TABLE IF NOT EXISTS indicadores_resultados(
	cod_indicador int references indicadores,
	cod_empresa int references empresas,
	periodo date,
	concordo int default 0 not null,
	neutro int default 0 not null,
	discordo int default 0 not null,
	primary key(cod_indicador, cod_empresa, periodo)
);

CREATE TABLE IF NOT EXISTS indicadores_respostas(
	cod_indicador int references indicadores,
	cod_empregado int references empregados,
	periodo date,
	resposta varchar,
	primary key(cod_indicador, cod_empregado, periodo)
);

CREATE TABLE IF NOT EXISTS atrasos(
	codigo serial primary key,
	nome varchar,
	email varchar,
	horario_esperado varchar,
	data_hora_atraso timestamp,
	cod_empregado int references empregados,
	cod_empresa int references empresas
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

INSERT INTO indicadores VALUES 
(DEFAULT, 
'Necessidade de hora extra',
'Não tenho necessidade regular de realizar tarefas relacionadas ao trabalho no meu tempo livre.'),
(DEFAULT, 
'Horário flexível',
'Posso ajustar meu horário de trabalho para acomodar compromissos pessoais.'),
(DEFAULT, 
'Desenvolvimento pessoal',
'A empresa proporciona oportunidades de desenvolvimento pessoal.'),
(DEFAULT, 
'Treinamento',
'Tenho acesso ao treinamento necessário para ser produtivo na minha posição atual.'),
(DEFAULT, 
'Plano de carreira',
'Está claro o que devo fazer para evoluir com minha carreira dentro da empresa.'),
(DEFAULT, 
'Carga de trabalho',
'Minha carga de trabalho é administrável.'),
(DEFAULT, 
'Dedicação e satisfação',
'O meu trabalho é desafiador e me sinto inspirado a sempre fazer o meu melhor.'),
(DEFAULT, 
'Absorção e distração',
'O tempo voa quando estou no trabalho e esqueço de tudo ao meu redor.')
;

INSERT INTO indicadores_ativados VALUES (1,1);

INSERT INTO indicadores_resultados VALUES 
(1,1,'2019-01-01',10,2,7),
(1,1,'2019-02-01',9,4,6),
(1,1,'2019-03-01',15,2,2),
(1,1,'2019-04-01',10,2,7),
(1,1,'2019-05-01',9,4,6),
(1,1,'2019-06-01',15,2,2),
(1,1,'2019-07-01',10,2,7),
(1,1,'2019-08-01',9,4,6),
(1,1,'2019-09-01',15,2,2),
(1,1,'2019-10-01',10,2,7),
(1,1,'2019-11-01',9,4,6),
(1,1,'2019-12-01',15,2,2),
(1,1,'2020-01-01',10,2,7),
(1,1,'2020-02-01',9,4,6),
(1,1,'2020-03-01',15,2,2),

(2,1,'2020-01-01',10,2,7),
(2,1,'2020-02-01',1,2,16),
(2,1,'2020-03-01',7,2,10),

(3,1,'2020-01-01',10,2,7),
(3,1,'2020-02-01',1,2,16),
(3,1,'2020-03-01',7,2,10),

(4,1,'2020-01-01',10,2,7),
(4,1,'2020-02-01',1,2,16),
(4,1,'2020-03-01',7,2,10),

(5,1,'2020-01-01',10,2,7),
(5,1,'2020-02-01',1,2,16),
(5,1,'2020-03-01',7,2,10),

(6,1,'2020-01-01',10,2,7),
(6,1,'2020-02-01',1,2,16),
(6,1,'2020-03-01',7,2,10),

(7,1,'2020-01-01',10,2,7),
(7,1,'2020-02-01',1,2,16),
(7,1,'2020-03-01',7,2,10),

(8,1,'2020-01-01',10,2,7),
(8,1,'2020-02-01',1,2,16),
(8,1,'2020-03-01',7,2,10);


INSERT INTO atrasos values (
	DEFAULT,
	'Renata Diniz Almeida',	
	'renata2019@gmail.com',
	'08:00:00',
	'2019-12-02T09:45:00.000000',
	2,
	1
);