
# Tarefas

- [ ] Definição e especificação de requisitos
	- [X] 1.1 Identificação e contexto
	- [X] 1.2 Propósito e motivação
	- [X] 1.3 Escopo
	- [X] 1.4 Usuário-chave (público alvo)
	- [X] 1.5 Referências
	- [X] 2.0 Descrição do sistema
	- [ ] 2.1 Requisitos funcionais
	- [ ] 2.2 Requisitos não funcionais
	- [X] 2.3 Diagrama de Entidade e Relacionamento 
	- [X] 3.0 Restrições iniciais
	- [X] 4.0 Equipe do projeto 

- [X] Divisão de tarefas

- [ ] Mobile
	- [ ] Login empregado (Aleph)
	- [ ] Bater ponto (Mobile: Gabriel, Backend: Daniel)
	- [ ] Listar pontos (Gabriel)
	- [ ] Pedir abono (Daniel)
	- [ ] (Opcional) Lembrete de ponto
	
- [ ] Web
	- [ ] Cadastro empresa (Aleph)
	- [ ] Login admin (Aleph)
	- [ ] Listar abonos (Daniel)
	- [ ] Avaliar abono (Gabriel)
	- [ ] Cadastrar empregado (Aleph)
	- [ ] Listar empregados (Aleph)
	- [ ] (Opcional) Relatório de pontos
	- [ ] (Opcional) Enviar relatório automático
	- [ ] (Opcional) Alerta de atrasos

# Pastas, controllers e métodos
```

empresa
	EmpresaController
	-store: cadastrar empresa

sessao
	SessaoController
	-store: login usuários

empresa
	EmpregadoController
	-index: listar empregados
	-show: exibir empregado
	-store: cadastrar empregado
	-update: atualizar empregado
	-destroy: excluir empregado

jornada
	JornadaController
	-index: listar jornadas da empresa
	-store: criar jornada
	-destroy: excluir jornada

ponto
	PontoController
	-index: listar pontos do empregado
	-store: bater ponto

abono
	AbonoController
	-index: listar abonos do empregado
	-store: pedir abono

	AdminAbonoController
	-index: listar abonos da empresa
	-store: criar avaliação p/ um abono

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
