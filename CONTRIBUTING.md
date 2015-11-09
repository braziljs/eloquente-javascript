# Contribuições

### Por onde começar?

**1.** Faça o _fork_ do projeto.

**2.** [Entenda nosso fluxo](#fluxo).

**3.** [Leia e pratique as boas práticas](#boas-pr%C3%A1ticas).

### Fluxo

É muito fácil contribuir para o projeto. Qualquer tipo de ajuda (seja ela grande ou pequena) é bem-vinda. Se encontrar qualquer parte do livro que possa ser melhorada, essa é uma grande oportunidade para participar ([aqui](https://github.com/braziljs/eloquente-javascript/issues?q=is%3Aopen+is%3Aissue+label%3Amelhorias) é um ótimo lugar para achar coisas que possam ser melhoradas). Caso não saiba por onde começar:

**1.** Faça referência ao repositório oficial após o _fork_

```
git remote add upstream git@github.com:braziljs/eloquente-javascript.git
```

**2.** Antes de iniciar o processo de contribuição, crie uma nova branch para fazer suas alterações.

Alguns exemplos:

- Para tradução: `git checkout -b traducaoCapX`
- Para revisões: `git checkout -b revisaoCapX`
- Para erros: `git checkout -b correcaoCapX`

> Use qualquer nome que seja coerente com a contribuição que está sendo feita.
> `X` representa o número do capítulo.

**3.** Após realizar as alterações, é hora de fazer um commit com uma mensagem coerente do que foi feito. Exemplo:

```
git add --all
git commit -am ‘Adiciona tradução/revisão/melhoria capítulo X linha/linhas Y’
git push origin traducaoCapX
```

**4.** Envie um _Pull Request_ com as alterações feitas, fazendo referência para o `master` do repositório oficial.

**5.** Sua contribuição será analisada pela comunidade. Em alguns casos pediremos algumas alterações antes de dar merge.

Após o merge:

- Delete a branch utilizada:

```
git checkout master
git push origin :traducaoCapX
git branch -D traducaoCapX
```

- Atualize seu repositório com o repositório oficial:

```
git fetch upstream
git rebase upstream/master
git push -f origin master
```

**6.** Quando iniciar uma nova contribuição, inicie repita o processo pelo passo 2.

### Boas práticas

- **Não traduza termos técnicos e blocos de código**
- Antes de enviar sua contribuição, certifique-se de que está enviando apenas um **único** commit que represente o que foi feito. Caso tenha feito vários commits, [esmague-os](http://gitready.com/advanced/2009/02/10/squashing-commits-with-rebase.html) antes de fazer o _Pull Request_.
- Caso tenha qualquer tipo de dúvida, abre uma _Issue_ que faremos o possível para te ajudar.
- Não adicione comentários nas issues de “log”. Elas tem apenas a finalidade de armazenar referências ao trabalho de cada capítulo.
- Contribua com as discussões.
- Delimitação para títulos de obras: Utilizar o travessão (—) para o início da frase, nome do autor e logo após o nome da obra, sem alterar nenhum valor. Exemplo:

> — Master Yuan-Ma, The Book of Programming

- Estrangeirismo: Utilizar o formato itálico. Exemplo: _bug_
- Sentido Figurado: Sempre destacar com aspas duplas.
- Citação: Aspas duplas com o sinal de >. Exemplo:

> “Foo bar”

- Marcação para código: Utilizar um apóstrofe (\`) para indicar um pedaço de código no meio de um texto (`var foo = undefined`). Ou três apóstrofe com o nome da linguagem de programação na frente (\`\`\`js), para indicar um bloco de código:

```js
var foo;
foo = undefined;
```

### Dúvidas em tradução de termos, palavras, expressões etc…

Quando estiver em uma situação em que você não sabe exatamente como traduzir uma palavra, termo ou expressão, nós recomendamos que siga os seguintes passos:

**1.** Abra uma _Issue_ com um título descritivo como por exemplo: “_Como traduzir a palavra/termo “x”?_” e coloque uma descrição fazendo referência à linha e o capítulo que esteja trabalhando.

**2.** Adicione uma tag `[TODO: ref #<número-da-issue-da-discussão>]<palavra/termo não traduzido>[/TODO]` e continue trabalhando no arquivo enquanto não há uma conclusão na _Issue_. Esse processo é importante para facilitar o acesso a itens pendentes e ter uma referência clara onde está ocorrendo a discussão.

**3.** Após a conclusão da discussão na _Issue_, feche a mesma. Em seguida, remova a tag adicionada no passo 2 e atualize a palavra/termo não traduzido.

**4.** Como mantemos um arquivo de [glossário](https://github.com/braziljs/eloquente-javascript/blob/master/glossario.md), faça um _Pull Request_ adicionando o novo termo, colocando a referência `#<número-da-issue>` no termo/palavra em questão para fácil acesso no futuro.

***

Obrigado! :heart: :heart: :heart:

