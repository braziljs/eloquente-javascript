{{meta {load_files: ["code/chapter/12_language.js"], zip: "node/html"}}}

# Projeto: Uma Linguagem de Programação

{{quote {author: "Hal Abelson and Gerald Sussman", title: "Structure and Interpretation of Computer Programs", chapter: true}

The evaluator, which determines the meaning of expressions in a programming language, is just another program.

quote}}

{{index "Abelson, Hal", "Sussman, Gerald", SICP, "project chapter"}}

{{figure {url: "img/chapter_picture_12.jpg", alt: "Illustration showing an egg with holes in it, showing smaller eggs inside, which in turn have even smaller eggs in them, and so on", chapter: "framed"}}}

Construir sua própria ((linguagem de programação)) é surpreendentemente fácil (desde que você não mire muito alto) e muito esclarecedor.

A principal coisa que quero mostrar neste capítulo é que não há nenhuma ((mágica)) envolvida na construção de uma linguagem de programação. Muitas vezes senti que algumas invenções humanas eram tão imensamente inteligentes e complicadas que eu nunca seria capaz de entendê-las. Mas com um pouco de leitura e experimentação, elas frequentemente se revelam bastante comuns.

{{index "Egg language", [abstraction, "in Egg"]}}

Vamos construir uma linguagem de programação chamada Egg. Será uma linguagem minúscula e simples — mas poderosa o suficiente para expressar qualquer computação que você possa imaginar. Ela permitirá ((abstração)) simples baseada em ((função))ões.

{{id parsing}}

## Análise Sintática

{{index parsing, validation, [syntax, "of Egg"]}}

A parte mais imediatamente visível de uma linguagem de programação é sua _sintaxe_, ou notação. Um _parser_ é um programa que lê um trecho de texto e produz uma estrutura de dados que reflete a estrutura do programa contido naquele texto. Se o texto não formar um programa válido, o parser deve apontar o erro.

{{index "special form", [function, application]}}

Nossa linguagem terá uma sintaxe simples e uniforme. Tudo em Egg é uma ((expressão)). Uma expressão pode ser o nome de uma vinculação, um número, uma string, ou uma _aplicação_. Aplicações são usadas para chamadas de função, mas também para construções como `if` ou `while`.

{{index "double-quote character", parsing, [escaping, "in strings"], [whitespace, syntax]}}

Para manter o parser simples, strings em Egg não suportam nada como sequências de escape com barra invertida. Uma string é simplesmente uma sequência de caracteres que não são aspas duplas, envolvida por aspas duplas. Um número é uma sequência de dígitos. Nomes de vinculações podem consistir de qualquer caractere que não seja espaço em branco e que não tenha um significado especial na sintaxe.

{{index "comma character", [parentheses, arguments]}}

Aplicações são escritas da mesma forma que em JavaScript, colocando parênteses após uma expressão e tendo qualquer número de ((argumento))s entre esses parênteses, separados por vírgulas.

```{lang: null}
do(define(x, 10),
   if(>(x, 5),
      print("large"),
      print("small")))
```

{{index block, [syntax, "of Egg"]}}

A ((uniformidade)) da ((linguagem Egg)) significa que coisas que são ((operador))es em JavaScript (como `>`) são vinculações normais nesta linguagem, aplicadas assim como outras ((função))ões. Como a sintaxe não tem o conceito de bloco, precisamos de uma construção `do` para representar a execução de múltiplas coisas em sequência.

{{index "type property", parsing, ["data structure", tree]}}

A estrutura de dados que o parser usará para descrever um programa consiste em objetos de ((expressão)), cada um com uma propriedade `type` indicando o tipo de expressão, e outras propriedades para descrever seu conteúdo.

{{index identifier}}

Expressões do tipo `"value"` representam strings ou números literais. Sua propriedade `value` contém o valor da string ou número que representam. Expressões do tipo `"word"` são usadas para identificadores (nomes). Tais objetos têm uma propriedade `name` que contém o nome do identificador como uma string. Finalmente, expressões `"apply"` representam aplicações. Elas têm uma propriedade `operator` que se refere à expressão que está sendo aplicada, assim como uma propriedade `args` que contém um array de expressões de argumento.

A parte `>(x, 5)` do programa anterior seria representada assim:

```{lang: "json"}
{
  type: "apply",
  operator: {type: "word", name: ">"},
  args: [
    {type: "word", name: "x"},
    {type: "value", value: 5}
  ]
}
```

{{indexsee "abstract syntax tree", "syntax tree", ["data structure", tree]}}

Tal estrutura de dados é chamada de _((árvore sintática))_. Se você imaginar os objetos como pontos e as ligações entre eles como linhas entre esses pontos, conforme mostrado no diagrama a seguir, a estrutura tem uma forma de ((árvore)). O fato de que expressões contêm outras expressões, que por sua vez podem conter mais expressões, é similar à maneira como galhos de árvores se dividem e se dividem novamente.

{{figure {url: "img/syntax_tree.svg", alt: "A diagram showing the structure of the syntax tree for the example program. The root is labeled 'do' and has two children, one labeled 'define' and one labeled 'if'. Those in turn have more children, describing their content.", width: "5cm"}}}

{{index parsing}}

Compare isso com o parser que escrevemos para o formato de arquivo de configuração no [Capítulo ?](regexp#ini), que tinha uma estrutura simples: ele dividia a entrada em linhas e tratava essas linhas uma de cada vez. Havia apenas algumas formas simples que uma linha podia ter.

{{index recursion, [nesting, "of expressions"]}}

Aqui precisamos encontrar uma abordagem diferente. Expressões não são separadas em linhas e têm uma estrutura recursiva. Expressões de aplicação _contêm_ outras expressões.

{{index elegance}}

Felizmente, esse problema pode ser resolvido muito bem escrevendo uma função de parser que é recursiva de uma forma que reflete a natureza recursiva da linguagem.

{{index "parseExpression function", "syntax tree"}}

Definimos uma função `parseExpression` que recebe uma string como entrada. Ela retorna um objeto contendo a estrutura de dados para a expressão no início da string, junto com a parte da string restante após a análise dessa expressão. Ao analisar subexpressões (o argumento de uma aplicação, por exemplo), essa função pode ser chamada novamente, produzindo a expressão do argumento assim como o texto que resta. Esse texto pode, por sua vez, conter mais argumentos ou ser o parêntese de fechamento que termina a lista de argumentos.

Esta é a primeira parte do parser:

```{includeCode: true}
function parseExpression(program) {
  program = skipSpace(program);
  let match, expr;
  if (match = /^"([^"]*)"/.exec(program)) {
    expr = {type: "value", value: match[1]};
  } else if (match = /^\d+\b/.exec(program)) {
    expr = {type: "value", value: Number(match[0])};
  } else if (match = /^[^\s(),#"]+/.exec(program)) {
    expr = {type: "word", name: match[0]};
  } else {
    throw new SyntaxError("Unexpected syntax: " + program);
  }

  return parseApply(expr, program.slice(match[0].length));
}

function skipSpace(string) {
  let first = string.search(/\S/);
  if (first == -1) return "";
  return string.slice(first);
}
```

{{index "skipSpace function", [whitespace, syntax]}}

Como Egg, assim como JavaScript, permite qualquer quantidade de espaço em branco entre seus elementos, temos que cortar repetidamente o espaço em branco do início da string do programa. A função `skipSpace` ajuda com isso.

{{index "literal expression", "SyntaxError type"}}

Depois de pular qualquer espaço inicial, `parseExpression` usa três ((expressões regulares)) para identificar os três elementos atômicos que Egg suporta: strings, números e palavras. O parser constrói um tipo diferente de estrutura de dados dependendo de qual expressão corresponde. Se a entrada não corresponder a nenhuma dessas três formas, não é uma expressão válida, e o parser lança um erro. Usamos o construtor `SyntaxError` aqui. Esta é uma classe de exceção definida pelo padrão, como `Error`, mas mais específica.

{{index "parseApply function"}}

Em seguida, cortamos a parte que correspondeu da string do programa e passamos isso, junto com o objeto da expressão, para `parseApply`, que verifica se a expressão é uma aplicação. Se for, ela analisa uma lista de argumentos entre parênteses.

```{includeCode: true}
function parseApply(expr, program) {
  program = skipSpace(program);
  if (program[0] != "(") {
    return {expr: expr, rest: program};
  }

  program = skipSpace(program.slice(1));
  expr = {type: "apply", operator: expr, args: []};
  while (program[0] != ")") {
    let arg = parseExpression(program);
    expr.args.push(arg.expr);
    program = skipSpace(arg.rest);
    if (program[0] == ",") {
      program = skipSpace(program.slice(1));
    } else if (program[0] != ")") {
      throw new SyntaxError("Expected ',' or ')'");
    }
  }
  return parseApply(expr, program.slice(1));
}
```

{{index parsing, recursion}}

Se o próximo caractere no programa não for um parêntese de abertura, isso não é uma aplicação, e `parseApply` retorna a expressão que recebeu. Caso contrário, ela pula o parêntese de abertura e cria o objeto de ((árvore sintática)) para essa expressão de aplicação. Em seguida, chama recursivamente `parseExpression` para analisar cada argumento até que um parêntese de fechamento seja encontrado. A recursão é indireta, através de `parseApply` e `parseExpression` chamando uma à outra.

Como uma expressão de aplicação pode ela mesma ser aplicada (como em `multiplier(2)(1)`), `parseApply` deve, após ter analisado uma aplicação, chamar a si mesma novamente para verificar se outro par de parênteses segue.

{{index "syntax tree", "Egg language", "parse function"}}

Isso é tudo que precisamos para analisar Egg. Encapsulamos isso em uma função conveniente `parse` que verifica que alcançamos o final da string de entrada após analisar a expressão (um programa Egg é uma única expressão), e que nos dá a estrutura de dados do programa.

```{includeCode: strip_log, test: join}
function parse(program) {
  let {expr, rest} = parseExpression(program);
  if (skipSpace(rest).length > 0) {
    throw new SyntaxError("Unexpected text after program");
  }
  return expr;
}

console.log(parse("+(a, 10)"));
// → {type: "apply",
//    operator: {type: "word", name: "+"},
//    args: [{type: "word", name: "a"},
//           {type: "value", value: 10}]}
```

{{index "error message"}}

Funciona! Não nos dá informações muito úteis quando falha e não armazena a linha e coluna onde cada expressão começa, o que poderia ser útil ao reportar erros depois, mas é bom o suficiente para nossos propósitos.

## O avaliador

{{index "evaluate function", evaluation, interpretation, "syntax tree", "Egg language"}}

O que podemos fazer com a árvore sintática de um programa? Executá-la, é claro! E é isso que o avaliador faz. Você dá a ele uma árvore sintática e um objeto de escopo que associa nomes a valores, e ele avaliará a expressão que a árvore representa e retornará o valor que isso produz.

```{includeCode: true}
const specialForms = Object.create(null);

function evaluate(expr, scope) {
  if (expr.type == "value") {
    return expr.value;
  } else if (expr.type == "word") {
    if (expr.name in scope) {
      return scope[expr.name];
    } else {
      throw new ReferenceError(
        `Undefined binding: ${expr.name}`);
    }
  } else if (expr.type == "apply") {
    let {operator, args} = expr;
    if (operator.type == "word" &&
        operator.name in specialForms) {
      return specialForms[operator.name](expr.args, scope);
    } else {
      let op = evaluate(operator, scope);
      if (typeof op == "function") {
        return op(...args.map(arg => evaluate(arg, scope)));
      } else {
        throw new TypeError("Applying a non-function.");
      }
    }
  }
}
```

{{index "literal expression", scope}}

O avaliador tem código para cada um dos tipos de ((expressão)). Uma expressão de valor literal produz seu valor. (Por exemplo, a expressão `100` avalia para o número 100.) Para uma vinculação, devemos verificar se ela está realmente definida no escopo e, se estiver, buscar o valor da vinculação.

{{index [function, application]}}

Aplicações são mais envolvidas. Se são uma ((forma especial)), como `if`, não avaliamos nada — apenas passamos as expressões dos argumentos, junto com o escopo, para a função que trata essa forma. Se é uma chamada normal, avaliamos o operador, verificamos que é uma função e a chamamos com os argumentos avaliados.

Usamos valores de função JavaScript simples para representar os valores de função de Egg. Voltaremos a isso [mais adiante](language#egg_fun), quando a forma especial `fun` for definida.

{{index readability, "evaluate function", recursion, parsing}}

A estrutura recursiva de `evaluate` se assemelha à estrutura do parser, e ambas espelham a estrutura da própria linguagem. Também seria possível combinar o parser e o avaliador em uma única função e avaliar durante a análise, mas separá-los dessa forma torna o programa mais claro e flexível.

{{index "Egg language", interpretation}}

Isso é realmente tudo o que é necessário para interpretar Egg. É simples assim. Mas sem definir algumas formas especiais e adicionar alguns valores úteis ao ((ambiente)), você não pode fazer muita coisa com essa linguagem ainda.

## Formas especiais

{{index "special form", "specialForms object"}}

O objeto `specialForms` é usado para definir sintaxe especial em Egg. Ele associa palavras a funções que avaliam tais formas. Atualmente está vazio. Vamos adicionar `if`.

```{includeCode: true}
specialForms.if = (args, scope) => {
  if (args.length != 3) {
    throw new SyntaxError("Wrong number of args to if");
  } else if (evaluate(args[0], scope) !== false) {
    return evaluate(args[1], scope);
  } else {
    return evaluate(args[2], scope);
  }
};
```

{{index "conditional execution", "ternary operator", "?: operator", "conditional operator"}}

A construção `if` de Egg espera exatamente três argumentos. Ela avaliará o primeiro e, se o resultado não for o valor `false`, avaliará o segundo. Caso contrário, o terceiro é avaliado. Essa forma `if` é mais similar ao operador ternário `?:` de JavaScript do que ao `if` de JavaScript. É uma expressão, não uma instrução, e produz um valor — a saber, o resultado do segundo ou terceiro argumento.

{{index Boolean}}

Egg também difere de JavaScript na forma como trata o valor da condição para `if`. Ele tratará apenas o valor `false` como falso, não coisas como zero ou a string vazia.

{{index "short-circuit evaluation"}}

A razão pela qual precisamos representar `if` como uma forma especial em vez de uma função regular é que todos os argumentos de funções são avaliados antes que a função seja chamada, enquanto `if` deve avaliar apenas _ou_ seu segundo _ou_ seu terceiro argumento, dependendo do valor do primeiro.

A forma `while` é similar.

```{includeCode: true}
specialForms.while = (args, scope) => {
  if (args.length != 2) {
    throw new SyntaxError("Wrong number of args to while");
  }
  while (evaluate(args[0], scope) !== false) {
    evaluate(args[1], scope);
  }

  // Como undefined não existe em Egg, retornamos false,
  // por falta de um resultado significativo
  return false;
};
```

Outro bloco de construção básico é `do`, que executa todos os seus argumentos de cima para baixo. Seu valor é o valor produzido pelo último argumento.

```{includeCode: true}
specialForms.do = (args, scope) => {
  let value = false;
  for (let arg of args) {
    value = evaluate(arg, scope);
  }
  return value;
};
```

{{index ["= operator", "in Egg"], [binding, "in Egg"]}}

Para poder criar vinculações e dar-lhes novos valores, também criamos uma forma chamada `define`. Ela espera uma palavra como seu primeiro argumento e uma expressão que produz o valor a ser atribuído àquela palavra como seu segundo argumento. Como `define`, como tudo mais, é uma expressão, ela deve retornar um valor. Faremos com que retorne o valor que foi atribuído (assim como o operador `=` de JavaScript).

```{includeCode: true}
specialForms.define = (args, scope) => {
  if (args.length != 2 || args[0].type != "word") {
    throw new SyntaxError("Incorrect use of define");
  }
  let value = evaluate(args[1], scope);
  scope[args[0].name] = value;
  return value;
};
```

## O ambiente

{{index "Egg language", "evaluate function", [binding, "in Egg"]}}

O ((escopo)) aceito por `evaluate` é um objeto com propriedades cujos nomes correspondem a nomes de vinculações e cujos valores correspondem aos valores a que essas vinculações estão ligadas. Vamos definir um objeto para representar o ((escopo global)).

Para poder usar a construção `if` que acabamos de definir, devemos ter acesso a valores ((Booleano))s. Como existem apenas dois valores booleanos, não precisamos de sintaxe especial para eles. Simplesmente vinculamos dois nomes aos valores `true` e `false` e os usamos.

```{includeCode: true}
const topScope = Object.create(null);

topScope.true = true;
topScope.false = false;
```

Agora podemos avaliar uma expressão simples que nega um valor booleano.

```
let prog = parse(`if(true, false, true)`);
console.log(evaluate(prog, topScope));
// → false
```

{{index arithmetic, "Function constructor"}}

Para fornecer ((operador))es básicos de ((aritmética)) e ((comparação)), também adicionaremos alguns valores de função ao ((escopo)). No interesse de manter o código curto, usaremos `Function` para sintetizar um conjunto de funções de operador em um loop, em vez de defini-las individualmente.

```{includeCode: true}
for (let op of ["+", "-", "*", "/", "==", "<", ">"]) {
  topScope[op] = Function("a, b", `return a ${op} b;`);
}
```

Também é útil ter uma forma de ((imprimir)) valores, então encapsularemos `console.log` em uma função e a chamaremos de `print`.

```{includeCode: true}
topScope.print = value => {
  console.log(value);
  return value;
};
```

{{index parsing, "run function"}}

Isso nos dá ferramentas elementares suficientes para escrever programas simples. A função a seguir fornece uma forma conveniente de analisar um programa e executá-lo em um escopo novo:

```{includeCode: true}
function run(program) {
  return evaluate(parse(program), Object.create(topScope));
}
```

{{index "Object.create function", prototype}}

Usaremos cadeias de protótipos de objetos para representar escopos aninhados, de forma que o programa possa adicionar vinculações ao seu escopo local sem alterar o escopo de nível superior.

```
run(`
do(define(total, 0),
   define(count, 1),
   while(<(count, 11),
         do(define(total, +(total, count)),
            define(count, +(count, 1)))),
   print(total))
`);
// → 55
```

{{index "summing example", "Egg language"}}

Este é o programa que já vimos várias vezes antes, que calcula a soma dos números de 1 a 10, expresso em Egg. É claramente mais feio do que o programa JavaScript equivalente — mas nada mal para uma linguagem implementada em menos de 150 ((linhas de código)).

{{id egg_fun}}

## Funções

{{index function, "Egg language"}}

Uma linguagem de programação sem funções é uma linguagem de programação pobre, de fato. Felizmente, não é difícil adicionar uma construção `fun`, que trata seu último argumento como o corpo da função e usa todos os argumentos antes dele como os nomes dos parâmetros da função.

```{includeCode: true}
specialForms.fun = (args, scope) => {
  if (!args.length) {
    throw new SyntaxError("Functions need a body");
  }
  let body = args[args.length - 1];
  let params = args.slice(0, args.length - 1).map(expr => {
    if (expr.type != "word") {
      throw new SyntaxError("Parameter names must be words");
    }
    return expr.name;
  });

  return function(...args) {
    if (args.length != params.length) {
      throw new TypeError("Wrong number of arguments");
    }
    let localScope = Object.create(scope);
    for (let i = 0; i < args.length; i++) {
      localScope[params[i]] = args[i];
    }
    return evaluate(body, localScope);
  };
};
```

{{index "local scope"}}

Funções em Egg obtêm seu próprio escopo local. A função produzida pela forma `fun` cria esse escopo local e adiciona as vinculações dos argumentos a ele. Em seguida, avalia o corpo da função nesse escopo e retorna o resultado.

```{startCode: true}
run(`
do(define(plusOne, fun(a, +(a, 1))),
   print(plusOne(10)))
`);
// → 11

run(`
do(define(pow, fun(base, exp,
     if(==(exp, 0),
        1,
        *(base, pow(base, -(exp, 1)))))),
   print(pow(2, 10)))
`);
// → 1024
```

## Compilação

{{index interpretation, compilation}}

O que construímos é um interpretador. Durante a avaliação, ele atua diretamente sobre a representação do programa produzida pelo parser.

{{index efficiency, performance, [binding, definition], [memory, speed]}}

_Compilação_ é o processo de adicionar outro passo entre a análise e a execução de um programa, que transforma o programa em algo que pode ser avaliado mais eficientemente fazendo o máximo de trabalho possível antecipadamente. Por exemplo, em linguagens bem projetadas, é óbvio, para cada uso de uma vinculação, a qual vinculação se está referindo, sem realmente executar o programa. Isso pode ser usado para evitar procurar a vinculação pelo nome toda vez que ela é acessada, buscando-a diretamente de alguma localização de memória predeterminada.

Tradicionalmente, a ((compilação)) envolve converter o programa em ((código de máquina)), o formato bruto que o processador de um computador pode executar. Mas qualquer processo que converta um programa em uma representação diferente pode ser considerado compilação.

{{index simplicity, "Function constructor", transpilation}}

Seria possível escrever uma estratégia de ((avaliação)) alternativa para Egg, uma que primeiro converta o programa em um programa JavaScript, use `Function` para invocar o compilador JavaScript nele, e execute o resultado. Quando feito corretamente, isso faria Egg rodar muito rápido, enquanto ainda seria bastante simples de implementar.

Se você está interessado nesse tópico e disposto a dedicar algum tempo a isso, encorajo você a tentar implementar tal compilador como um exercício.

## Trapaceando

{{index "Egg language"}}

Quando definimos `if` e `while`, você provavelmente notou que eram wrappers mais ou menos triviais em torno do próprio `if` e `while` de JavaScript. Da mesma forma, os valores em Egg são apenas valores JavaScript comuns. Preencher a lacuna até um sistema mais primitivo, como o código de máquina que o processador entende, requer mais esforço — mas a forma como funciona se assemelha ao que estamos fazendo aqui.

Embora a linguagem de brinquedo neste capítulo não faça nada que não poderia ser feito melhor em JavaScript, _existem_ situações em que escrever pequenas linguagens ajuda a realizar trabalho real.

Tal linguagem não precisa se parecer com uma linguagem de programação típica. Se JavaScript não viesse equipado com expressões regulares, por exemplo, você poderia escrever seu próprio parser e avaliador para expressões regulares.

{{index "parser generator"}}

Ou imagine que você está construindo um programa que torna possível criar parsers rapidamente fornecendo uma descrição lógica da linguagem que eles precisam analisar. Você poderia definir uma notação específica para isso, e um compilador que a compila em um programa de parser.

```{lang: null}
expr = number | string | name | application

number = digit+

name = letter+

string = '"' (! '"')* '"'

application = expr '(' (expr (',' expr)*)? ')'
```

{{index expressivity}}

Isso é o que normalmente se chama de _((linguagem de domínio específico))_, uma linguagem feita sob medida para expressar um domínio estreito de conhecimento. Tal linguagem pode ser mais expressiva do que uma linguagem de propósito geral porque é projetada para descrever exatamente as coisas que precisam ser descritas em seu domínio e nada mais.

## Exercícios

### Arrays

{{index "Egg language", "arrays in egg (exercise)", [array, "in Egg"]}}

Adicione suporte para arrays em Egg adicionando as três funções a seguir ao escopo global: `array(...values)` para construir um array contendo os valores dos argumentos, `length(array)` para obter o comprimento de um array, e `element(array, n)` para buscar o *n*-ésimo elemento de um array.

{{if interactive

```{test: no}
// Modifique estas definições...

topScope.array = "...";

topScope.length = "...";

topScope.element = "...";

run(`
do(define(sum, fun(array,
     do(define(i, 0),
        define(sum, 0),
        while(<(i, length(array)),
          do(define(sum, +(sum, element(array, i))),
             define(i, +(i, 1)))),
        sum))),
   print(sum(array(1, 2, 3))))
`);
// → 6
```

if}}

{{hint

{{index "arrays in egg (exercise)"}}

A maneira mais fácil de fazer isso é representar arrays de Egg com arrays de JavaScript.

{{index "slice method"}}

Os valores adicionados ao escopo global devem ser funções. Usando um argumento rest (com notação de três pontos), a definição de `array` pode ser _muito_ simples.

hint}}

### Closure

{{index closure, [function, scope], "closure in egg (exercise)"}}

A forma como definimos `fun` permite que funções em Egg referenciem o escopo ao redor, permitindo que o corpo da função use valores locais que eram visíveis no momento em que a função foi definida, assim como funções JavaScript fazem.

O programa a seguir ilustra isso: a função `f` retorna uma função que adiciona seu argumento ao argumento de `f`, o que significa que ela precisa de acesso ao ((escopo)) local dentro de `f` para poder usar a vinculação `a`.

```
run(`
do(define(f, fun(a, fun(b, +(a, b)))),
   print(f(4)(5)))
`);
// → 9
```

Volte à definição da forma `fun` e explique qual mecanismo faz isso funcionar.

{{hint

{{index closure, "closure in egg (exercise)"}}

Mais uma vez, estamos nos apoiando em um mecanismo JavaScript para obter a funcionalidade equivalente em Egg. Formas especiais recebem o escopo local em que são avaliadas para que possam avaliar suas subformas nesse escopo. A função retornada por `fun` tem acesso ao argumento `scope` dado à sua função envolvente e usa isso para criar o ((escopo)) local da função quando ela é chamada.

{{index compilation}}

Isso significa que o ((protótipo)) do escopo local será o escopo em que a função foi criada, o que torna possível acessar vinculações naquele escopo a partir da função. Isso é tudo o que é necessário para implementar closure (embora para compilá-lo de forma realmente eficiente, seria preciso fazer um pouco mais de trabalho).

hint}}

### Comentários

{{index "hash character", "Egg language", "comments in egg (exercise)"}}

Seria bom se pudéssemos escrever ((comentário))s em Egg. Por exemplo, sempre que encontrarmos um sinal de cerquilha (`#`), poderíamos tratar o resto da linha como um comentário e ignorá-lo, similar ao `//` em JavaScript.

{{index "skipSpace function"}}

Não precisamos fazer grandes mudanças no parser para suportar isso. Podemos simplesmente mudar `skipSpace` para pular comentários como se fossem ((espaço em branco)), de forma que todos os pontos onde `skipSpace` é chamado agora também pularão comentários. Faça essa mudança.

{{if interactive

```{test: no}
// Este é o skipSpace antigo. Modifique-o...
function skipSpace(string) {
  let first = string.search(/\S/);
  if (first == -1) return "";
  return string.slice(first);
}

console.log(parse("# hello\nx"));
// → {type: "word", name: "x"}

console.log(parse("a # one\n   # two\n()"));
// → {type: "apply",
//    operator: {type: "word", name: "a"},
//    args: []}
```
if}}

{{hint

{{index "comments in egg (exercise)", [whitespace, syntax]}}

Certifique-se de que sua solução lida com múltiplos comentários seguidos, com espaço em branco potencialmente entre ou após eles.

Uma ((expressão regular)) é provavelmente a forma mais fácil de resolver isso. Escreva algo que corresponda a "espaço em branco ou um comentário, zero ou mais vezes". Use o método `exec` ou `match` e observe o comprimento do primeiro elemento no array retornado (a correspondência completa) para descobrir quantos caracteres cortar.

hint}}

### Corrigindo o escopo

{{index [binding, definition], assignment, "fixing scope (exercise)"}}

Atualmente, a única forma de atribuir um valor a uma vinculação é `define`. Essa construção age como uma forma tanto de definir novas vinculações quanto de dar a vinculações existentes um novo valor.

{{index "local binding"}}

Essa ((ambiguidade)) causa um problema. Quando você tenta dar a uma vinculação não-local um novo valor, você acaba definindo uma local com o mesmo nome em vez disso. Algumas linguagens funcionam assim por design, mas sempre achei essa uma forma estranha de lidar com ((escopo)).

{{index "ReferenceError type"}}

Adicione uma forma especial `set`, similar a `define`, que dá a uma vinculação um novo valor, atualizando a vinculação em um escopo externo se ela não existir no escopo interno. Se a vinculação não estiver definida de forma alguma, lance um `ReferenceError` (outro tipo de erro padrão).

{{index "hasOwn function", prototype, "getPrototypeOf function"}}

A técnica de representar escopos como objetos simples, que tem tornado as coisas convenientes até agora, vai atrapalhar um pouco neste ponto. Você pode querer usar a função `Object.getPrototypeOf`, que retorna o protótipo de um objeto. Lembre-se também que você pode usar `Object.hasOwn` para descobrir se um dado objeto possui uma propriedade.

{{if interactive

```{test: no}
specialForms.set = (args, scope) => {
  // Seu código aqui.
};

run(`
do(define(x, 4),
   define(setx, fun(val, set(x, val))),
   setx(50),
   print(x))
`);
// → 50
run(`set(quux, true)`);
// → Algum tipo de ReferenceError
```
if}}

{{hint

{{index [binding, "compilation of"], assignment, "getPrototypeOf function", "hasOwn function", "fixing scope (exercise)"}}

Você terá que percorrer um ((escopo)) de cada vez, usando `Object.getPrototypeOf` para ir ao próximo escopo externo. Para cada escopo, use `Object.hasOwn` para descobrir se a vinculação, indicada pela propriedade `name` do primeiro argumento de `set`, existe naquele escopo. Se existir, defina-a como o resultado da avaliação do segundo argumento de `set` e retorne esse valor.

{{index "global scope", "run-time error"}}

Se o escopo mais externo for alcançado (`Object.getPrototypeOf` retorna `null`) e ainda não encontramos a vinculação, ela não existe e um erro deve ser lançado.

hint}}
