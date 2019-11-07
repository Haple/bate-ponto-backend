# Instruções

## Instale em sua máquina o seguinte

 - [NodeJS](https://nodejs.org/en/download/)
 - [Yarn](https://yarnpkg.com/pt-BR/docs/install)

## Configurações
Tem um arquivo na raiz do projeto chamado ".env.exemplo".
Preencha com as informações do banco de dados que você
quer utilizar. A última variável pode ser um código aleatório
(se quiser deixar o que está no exemplo, tudo bem).
Após terminar, renomeie o arquivo para ".env"

## Instalar dependências

```
yarn install

```

## Executar o projeto

```
yarn dev
```

Abra o navegador ou faça uma requisição GET na url http://localhost:3000/
para confirmar que a aplicação está de pé.


# Tarefas

- [X] Definição e especificação de requisitos
	- [X] 1.1 Identificação e contexto
	- [X] 1.2 Propósito e motivação
	- [X] 1.3 Escopo
	- [X] 1.4 Usuário-chave (público alvo)
	- [X] 1.5 Referências
	- [X] 2.0 Descrição do sistema
	- [X] 2.1 Requisitos funcionais
	- [X] 2.2 Requisitos não funcionais
	- [X] 2.3 Diagrama de Entidade e Relacionamento 
	- [X] 3.0 Restrições iniciais
	- [X] 4.0 Equipe do projeto 

- [X] Divisão de tarefas

- [ ] Mobile
	- [X] Login empregado (Aleph)
	- [ ] Bater ponto (Mobile: Gabriel, Backend: Daniel)
	- [ ] Listar pontos (Gabriel)
	- [ ] Pedir abono (Daniel)
	- [ ] (Opcional) Lembrete de ponto
	
- [ ] Web
	- [X] Cadastro empresa (Aleph)
	- [X] Login admin (Aleph)
	- [ ] Listar abonos (Daniel)
	- [ ] Avaliar abono (Gabriel)
	- [X] Cadastrar empregado (Aleph)
	- [X] Listar empregados (Aleph)
	- [ ] (Opcional) Relatório de pontos
	- [ ] (Opcional) Enviar relatório automático
	- [ ] (Opcional) Alerta de atrasos

# Módulos e rotas
```

empresa [OK]
	Web
		POST /empresas - cadastrar empresa

confirmacao [OK]
	Web
		GET /confirmacoes/{id_confirmacao}

sessao [OK]
	Web
		POST /sessoes - login usuários

empregado [OK]
	Web
		POST /empregado - cadastrar empregado
		PUT /empregado/{id_empregado} - atualizar empregado
		GET /empregados - listar empregados
		DELETE /empregado/{id_empregado} - excluir empregado
		GET /empregado/{id_empregado} - exibir empregado

jornada [OK]
	Web
		GET /jornadas - listar jornadas da empresa
		POST /jornadas - criar jornada
		DELETE /jornadas/{id_jornada} - excluir jornada

ponto
	Web
		GET /pontos  - listar pontos do empregado
		POST /pontos - bater ponto

abono
	Web
		GET /abonos?todos - listar abonos do empregado ou todos da empresa (se for admin)
		POST /abonos - pedir abono

	avaliacao
		Web
			POST /abonos/{id_abono}/avaliacoes - criar avaliação p/ um abono

```


# Pseudocódigos

## bate ponto

```

registra novo ponto
busca qtd de horas diarias do empregado
busca os pontos que o empregado já bateu hoje
pontos = [
		{hora:7,...},
		{hora:11,...},
		{hora:13,...},
		{hora:18,...}		
	]
separa em entradas e saidas
entradas = [{hora:7},{hora:13}]
saidas = [{hora:11},{hora:18}]
horas trabalhadas = 0
se a qtd de saidas for maior que 0
	para cada saida
		horas trabalhadas += saida - entrada
saldo do dia = horas trabalhadas - horas diarias
atualiza banco de horas do empregado
		
```

Senhas fortes: https://www.grc.com/passwords.htm
