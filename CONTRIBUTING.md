# Contribuições

### Por onde começar?

**1.** Faça o _fork_ do projeto.

**2.** [Entenda nosso fluxo](#fluxo).

**3.** [Leia e pratique as boas práticas](#boas-pr%C3%A1ticas).

**4.** Veja nas [issues](https://github.com/braziljs/eloquente-javascript/issues) o status, através das *labels*, do capítulo que você deseja traduzir ou revisar.

**5.** Caso o capítulo ainda não esteja em tradução ou revisão, comente na _Issue_ correspondente que você irá iniciar tal tarefa, para que assim possamos atribuir o capítulo para você.

**IMPORTANTE:** Adquira a concessão para tradução de outro capítulo somente **APÓS** terminar o anterior solicitado.

### Entenda nossas __labels__

* **em tradução**: sinaliza que um arquivo está em tradução.
* **aguardando revisão**: sinaliza que o capítulo já foi traduzido e está esperando para ser revisado.
* **em revisão**: sinaliza que um arquivo traduzido está sendo revisado.
* **aguardando supervisão**: sinaliza que um arquivo que já foi traduzido e revisado está esperando uma última revisão antes de ser finalizado.
* **em supervisão**: sinaliza que um arquivo já traduzido e revisado está recebendo uma última revisão antes de ser finalizado.
* **dúvidas**: dúvidas, sugestões e outros.

### Etapas da _Isuue_

O andamento das _Issues_ está divido em **5 etapas** na ordem apresentada abaixo:

**`em tradução` > `aguardando revisão` > `em revisão` > `aguardando supervisão` > `em supervisão` > `fechamento da issue`**

### Fluxo

Ao mostrar-se interessado por uma _Issue_ seguiremos as regras:

**1.** A _Issue_ será atribuida ao interessado.

**2.** Colocaremos uma _milestone_ com o prazo de 2 semanas para entrega do _Pull Request_.

**3.** Quando o prazo da _milestone_ vencer, nós verificaremos a atividade da _Issue_, caso necessário estenderemos o prazo para mais 2 semanas.

**4.** Quando o prazo da _milestone_ vencer e não houver nenhuma atividade correspondente a _Issue_, entraremos em contato com responsável pela própria _Issue_. Caso a pessoa não se manifestar no prazo de **14 dias**, a _Issue_ retrocederá ao estado anterior, de acordo com as [etapas citadas acima](#etapas-da-isuue).

### Boas práticas

**1.** Faça referência ao repositório oficial após o _fork_ 

```
git remote add upstream git@github.com:braziljs/eloquente-javascript.git
```

**2.** Antes de iniciar o processo de tradução, crie uma branch com um nome coerente com o que estiver fazendo, Exemplo:

- Para tradução: 

```
git checkout -b c0x
``` 

- Para revisões: 

```
git checkout -b c0xr0y
```

> `x` representa o número do cápitulo e `y` o número da review.

**3.** Após a tradução ou revisão de um cápitulo é hora de fazer um commit com uma mensagem bem coerente do que foi feito. Exemplo:

```
git add --all
git commit -am 'Tradução do tópico foo do capítulo 1 #numero-da-issue'
git push origin c0xr0y
```

> **ps**: Lembre de **sempre** fazer a referência da issue que representa o capítulo em tradução/revisão na hora do commit.
>
> **Ex**: `git commit -m 'Tradução capítulo 13 - DOM #13'`

Caso queira enviar o _Pull Request_ do que foi feito, abra-o referenciando para a `master` do repositório oficial.

**4.** Após finalizar a tradução ou revisão de uma _Issue_ siga os passos:

- Delete a branch utilizada:

```
git checkout master
git push origin :c0xr0y
git branch -D c0xr0y
```

- Atualize seu repositório com o repositório oficial:

```
git fetch upstream
git rebase upstream/master
git push -f origin master
```

**5.** Quando for iniciar uma nova tradução ou revisão, inicie todo processo pelo passo 2.

### Dúvidas em tradução de termos, palavras, expressões etc...

Quando estiver em uma situação em que você não sabe exatamente como traduzir uma palavra, termo ou expressão, nós recomendamos que siga os seguintes passos:

**1.** Abra uma _Issue_ com um título descritivo como por exemplo: "_Como traduzir a palavra/termo "x"?_" e coloque uma descrição fazendo referência a _Issue_ do capítulo que você está trabalhando e explicando o contexto com informações relevantes.

**2.** Adicione um label `[TODO: ref #<número-da-issue-da-discussão>]<palavra/termo não traduzido>[/TODO]` e continue trabalhando no arquivo enquanto não há uma conclusão na _Issue_. Esse processo é importante para facilitar o acesso a itens pendentes e ter uma referência clara onde está ocorrendo a discussão.

**3.** Após a conclusão da discussão na _Issue_, feche a mesma. Em seguida, remova o label adicionado no passo 2 e atualize a palavra/termo não traduzido.

**4.** Como mantemos um arquivo de [glossário](https://github.com/braziljs/eloquente-javascript/blob/master/glossario.md), faça um _Pull Request_ adicionando o novo termo, colocando a referência `#<número-da-issue>` no termo/palavra em questão para fácil acesso no futuro.

### Definições para termos em geral

- Delimitação para títulos de obras: Utilizar o travessão para o início da frase, nome do autor e logo após o nome da obra, sem alterar nenhum valor. Exemplo:

> — Master Yuan-Ma, The Book of Programming

- Estrangeirismo: Utilizar o formato itálico. Exemplo: _bug_
- Sentido Figurado: Sempre destacar com aspas duplas.
- Citação: Aspas duplas com o sinal de >. Exemplo:

> "Foo bar"

- Marcação para código: Utilizar um apóstrofe (\`) para indicar um pedaço de código no meio de um texto (`var foo = undefined`). Ou três apóstrofe com o nome da linguagem de programação na frente (\`\`\`js), para indicar um bloco de código:

```js
var foo;
foo = undefined;
```

### Esmagando seus commits

Quando algum revisor achar que alguma mensagem de commit não estiver coerente, ele pode pedir para você esmagar seus commits. Mais informações você encontra [aqui](http://gitready.com/advanced/2009/02/10/squashing-commits-with-rebase.html).

### O que é traduzivél?

Apenas os textos, códigos e termos técnicos permanecem intactos.

Obrigado! :heart: :heart: :heart: