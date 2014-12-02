## Linguagem de programação

> O avaliador que determina qual o significado da expressões em uma linguagem de programação é apenas mais um programa.
>
> Hal Abelson e Gerald Sussman, Estrutura e Interpretação de Programas de Computador
>---

> Quando um estudante perguntou ao mestre sobre a natureza do ciclo de dados e controle Yuan-Ma respondeu: "Pense em um compilador compilando a si mesmo."
>
> Mestre Yuan-Ma, O Livro de Programação

Construir sua própria linguagem de programação é surpreendentemente fácil(desde que você não demasiado ambicioso) e muito esclarecedor.

A principal coisa que eu quero mostrar neste capítulo é que não há mágica envolvida na construção de seu própria linguagem. Eu sempre senti que algumas invenções humanas eram tão imensamente inteligentes e complicadas que eu nunca seria capaz de compreendê-los. Mas com um pouco de leitura e ajustes tais coisas muitas vezes acabam por ser muito simples.

Nós vamos construir uma linguagem de programação chamada **Egg**. Vai ser uma pequena e simples linguagem mas poderosa o suficiente para expressar qualquer computação que você possa imaginar. Ela também permite abstração simples baseadas em funções.

## Parsing

A parte imediatamente mais visível de uma linguagem de programação é sua sintaxe ou notação. Um analisador é um programa que lê um pedaço de texto e produz uma estrutura de dados que refletem a estrutura do programa contida nesse texto. Se o texto não faz um programa válido o analisador deve reclamar e apontar o erro.

Nossa língua terá uma sintaxe simples e uniforme. Tudo em **Egg** é uma expressão. Uma expressão pode ser uma variável, um número, uma corda, ou um aplicativo. Os aplicativos são usados para chamadas de função, mas também para construções como `if` ou `while`.

Para manter o analisador simples `String` em Egg não suportam qualquer coisa como escapes. A seqüência é simplesmente uma seqüência de caracteres que não são aspas duplas embrulhados em aspas duplas. Um número é uma sequência de dígitos. Os nomes das variáveis podem consistir de qualquer caractere que não seja um espaço em branco e não tem um significado especial na sintaxe.

Os aplicação será escrita da forma como é em JavaScript; colocando parênteses após uma expressão e com uma série de argumentos entre esses parênteses separados por vírgulas.

````javascript
do(define(x, 10),
   if(>(x, 5)),
      print("large"),
      print("small"))
````

A uniformidade da línguagem **Egg** significa coisas que são operadores de JavaScript(como >) nesta línguagem sera variáveis normais aplicado apenas como outras funções. E uma vez que a sintaxe não tem o conceito de um bloco precisamos construir um representador fazendo várias coisas em seqüência.

A estrutura de dados que o analisador irá usar para descrever um programa será composto de objetos de expressões cada um dos quais tem uma propriedade de tipo que indica, o tipo de expressão que é e as outras propriedades para descreverem o seu conteúdo.

Expressões do tipo "value" representam `Strings`, `literais` ou `Numbers`. O valor da propriedade  contém o valor da cadeia ou o número que ele representa. Expressões do tipo "word" são usados para identificadores(nomes). Esses objetos têm uma propriedade de nome que contém o nome do identificador de uma `String`. Por fim as expressões "apply" representam algo que é uma aplicação. Eles têm uma propriedade de operador que se refere à expressão que são aplicavéis e têm uma propriedade de `args` que refere-se a um conjunto de expressões de argumento.

A parte `>(x, 5)` do programa anterior seria representado assim:

````javascript
{
  type: "apply",
  operator: {type: "word", name: ">"},
  args: [
    {type: "word", name: "x"},
    {type: "value", value: 5}
  ]
}

````

Essa estrutura de dados é chamado de árvore de sintaxe. Se você imaginar os objetos como pontos de ligações entre eles e com linhas entre esses pontos, ele tem uma forma treelike. O fato de que as expressões contem outras expressões que por sua vez pode conter mais expressões é semelhante à maneira como dividir ramos e dividir novamente.

![syntax three](http://i.imgur.com/7xOSPt2.png)

Compare isso com o analisador que escrevemos para o formato de arquivo de configuração no capítulo 9 que tinha uma estrutura simples: dividir a entrada em linhas e tratar essas linhas uma de cada vez. Havia apenas algumas formas simples de mostrar que uma linha foi permitida.

Aqui temos de encontrar uma abordagem diferente. As expressões não são separados em linhas e elas têm uma estrutura recursiva. Expressões aplicadas contêm outras expressões.

Felizmente, este problema pode ser resolvido com elegância escrevendo uma função analisadora que é recursiva de uma forma que reflete a natureza recursiva da língua.

Nós definimos uma função `parseExpression` que recebe uma string como entrada e retorna um objeto que contém a estrutura de dados para a expressão no início da cadeia, depois junto com a parte da cadeia da esquerda para analisar esta expressão. Ao analisar essa `subexpressions`(o argumento para um aplicativo, por exemplo), esta função pode ser chamado novamente dando origem a expressão argumento bem como o texto nos mostram. Este texto pode por sua vez contêm mais argumentos ou pode ser o parêntese de fechamento, que da termino a lista de argumentos.

Esta é a primeira parte do analisador:

````javascript
function parseExpression(program) {
  program = skipSpace(program);
  var match, expr;
  if (match = /^"([^"]*)"/.exec(program))
    expr = {type: "value", value: match[1]};
  else if (match = /^\d+\b/.exec(program))
    expr = {type: "value", value: Number(match[0])};
  else if (match = /^[^\s(),"]+/.exec(program))
    expr = {type: "word", name: match[0]};
  else
    throw new SyntaxError("Unexpected syntax: " + program);

  return parseApply(expr, program.slice(match[0].length));
}

function skipSpace(string) {
  var first = string.search(/\S/);
  if (first == -1) return "";
  return string.slice(first);
}
````

Temos que remover os espaços em brancos repetidos no início de qualquer seqüência do programa pois o **Egg** permite qualquer quantidade de espaço em branco entre os seus elementos inseridos. Isto é a funcionalidade da funcão `skipSpace`.

Depois de pular qualquer espaço à esquerda, `parseExpression` usa três expressões regulares para detectar os três elementos simples(atômicas) que **Egg** suporta: `String`, `Number` e `words`. O analisador constrói um tipo diferente de estrutura de dados dependendo de sua correspondencia. Se a entrada não coincide com uma destas três formas não sera considerado uma expressão válida e o analisador gerara um erro. `SyntaxError` é um tipo de erro padrão de objeto que é gerado quando é feita uma tentativa de executar um programa em JavaScript inválido.

Podemos cortar algumas partes que nós comparamos a partir da seqüência e passar isso juntamente com o objeto para a expressão do `parseApply` que ira verificar se a expressão é uma aplicação. Se assim for ele analisa uma lista de argumentos entre parênteses.

````javascript
function parseApply(expr, program) {
  program = skipSpace(program);
  if (program[0] != "()"
    return {expr: expr, rest: program};

  program = skipSpace(program.slice(1));
  expr = {type: "apply", operator: expr, args: []};
  while (program[0] != ")") {
    var arg = parseExpression(program);
    expr.args.push(arg.expr);
    program = skipSpace(arg.rest);
    if (program[0] == ",")
      program = skipSpace(program.slice(1));
    else if (program[0] != ")")
      throw new SyntaxError("Expected ',' or ')'");
  }
  return parseApply(expr, program.slice(1));
}
````

Se o próximo caracter no programa não é um parêntese de abertura, este não é aplicável, e `parseApply` simplesmente retorna que a expressão foi proferida.

Caso contrário ele ignora o parêntese de abertura e cria o objeto da árvore de sintaxe para essa expressão aplicável. Em seguida ele chama recursivamente `parseExpression` para analisar cada argumento até o parêntese de fechamento ser encontrado. A recursividade é indireto através da função `parseApply` e  `parseExpression` chamando uns aos outros.

Como uma expressão da aplicação pode ser aplicado em si própria(como em `multiplier(2)(1)`); `parseApply` deve analisar um pedido depois chamar-se novamente para verificar se existe outro par de parênteses.

Isso é tudo que precisamos para o analisador do **Egg**. Nós vamos envolvê-lo em uma função de análise conveniente que verifica se ele chegou ao fim da cadeia de entrada após o análise da expressão(um programa de **Egg** é uma única expressão) e que nos dá estrutura de dados do programa.

````javascript
function parse(program) {
  var result = parseExpression(program);
  if (skipSpace(result.rest).length > 0)
    throw new SyntaxError("Unexpected text after program");
  return result.expr;
}

console.log(parse("+(a, 10)"));
// → {type: "apply",
//    operator: {type: "word", name: "+"},
//    args: [{type: "word", name: "a"},
//           {type: "value", value: 10}]}
````

Funcionou! Ele não nos dá informação muito útil quando ele falhar e não armazena a linha e coluna na qual cada expressão começa, o que pode ser útil ao relatar erros mais tarde mas é bom o suficiente para nossos propósitos.

## O avaliador