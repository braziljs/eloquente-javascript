{{meta {load_files: ["code/chapter/12_language.js"], zip: "node/html"}}}

# O projeto: Uma Linguagem de Programação

{{quote {author: "Hal Abelson and Gerald Sussman", title: "Structure and Interpretation of Computer Programs", chapter: true}

O evaluator, que determina o significado de uma expressão em uma linguagem de programação, é apenas outro programa.

quote}}

{{index "Abelson, Hal", "Sussman, Gerald", SICP, "project chapter"}}

{{figure {url: "img/chapter_picture_12.jpg", alt: "Picture of an egg with smaller eggs inside", chapter: "framed"}}}

Construir sua própria ((linguagem de programação)) é surpreendentemente fácil (contanto que você não mire muito alto) e muito esclarecedor.

A principal coisa que quero mostrar neste capítulo é que não há ((mágica)) envolvida na construção de sua própria linguagem de programação. Eu geralmente sentia que algumas invenções humanas eram tão inteligentes e complicadas que eu nunca seria capaz de entendê-las. Mas, com um pouco de leitura e experimentação, elas geralmente se mostram bastante mundanas.

{{index "Egg language", [abstraction, "in Egg"]}}

Nós iremos construir uma linguagem de programação chamada *Egg*. Ela será uma minúscula e simples linguagem - mas uma que seja poderosa o suficiente para expressar qualquer cálculo que imaginar. Permitirá ((abstração)) simples baseadas em ((funções)).

{{id parsing}}

## Parsing

{{index parsing, validation, [syntax, "of Egg"]}}

A parte mais imediatamente visível de uma linguagem de programação é sua _sintaxe_, ou notação. Um _parser_ é um programa que lê um pedaço de texto e produz uma estrutura de dados que reflete a estrutura do programa contida naquele texto. Se o texto não formar um programa válido, o parser deverá apontar o erro.

{{index "special form", [function, application]}}

Nossa linguagem terá uma simples e uniforme sintaxe. Tudo em *Egg* é uma ((expressão)). Uma expressão pode ser o nome de uma variável, um número, uma *string* ou uma _função_. Funções são usadas para chamadas de função, mas também para construções como `if` ou `while`.

{{index "double-quote character", parsing, [escaping, "in strings"], [whitespace, syntax]}}

Para manter o *parser* simples, strings em *Egg* não suportam nada como escapes de barra invertida. Uma *string* é simplesmente uma sequência de caracteres que não são aspas duplas, envolvidas com aspas duplas. Um número é uma sequência de dígitos. Nomes de variáveis podem consistir de qualquer caractere que não seja espaço em branco e que não tenha um significado especial para a sintaxe.

{{index "comma character", [parentheses, arguments]}}

Funções são escritas da forma como são em JavaScript, colocando parênteses após a expressão e tendo qualquer número de ((argumento))s entre estes parênteses, separados por vírgulas.

```{lang: null}
do(define(x, 10),
   if(>(x, 5),
      print("large"),
      print("small")))
```

{{index block, [syntax, "of Egg"]}}

A ((uniformidade)) da ((linguagem *Egg*)) significa que coisas que são ((operador))es em JavaScript (como `>`) são variáveis normais nesta linguagem, aplicadas apenas como outras ((funções)). E uma vez que a sintaxe não tem o conceito de bloco, nós precisamos de um construtor `do` para representar que estamos fazendo múltiplas coisas em sequência.

{{index "type property", parsing, ["data structure", tree]}}

A estrutura de dados que o *parser* irá usar para descrever um programa consiste de objetos de ((expressão)), cada um dos quais com uma propriedade `type` indicando qual o tipo de expressão e outras propriedades para descrever seu conteúdo.

{{index identifier}}

Expressões do tipo `"value"` representam números e *string* literais. Suas propriedades `value` contém uma *string* ou o valor do número que eles representam. Expressões do tipo `"word"` são usadas para identificadores (nomes). Tais objetos tem uma propriedade `name` que contém o nome do identificador como uma *string*. Finalmente, expressões `"apply"` representam funções. Elas tem uma propriedade `operator` que se refere à expressão que está sendo aplicada, assim como a propriedade `args` que contem um *array* dos argumentos da expressão.

A parte `>(x, 5)` do programa anterior seria representado assim:

```{lang: "application/json"}
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

Essa estrutura de dados é chamada de _((syntax tree))_. Se você imaginar os objetos como pontos e as conexões entre eles como as linhas entre os pontos, ele terá uma forma de árvore. O fato de que expressões podem conter outras expressões, que por sua vez podem conter mais expressões, é semelhante à maneira como os galhos das árvores se dividem e se dividem novamente.

{{figure {url: "img/syntax_tree.svg", alt: "The structure of a syntax tree",width: "5cm"}}}

{{index parsing}}

Compare isso com o *parser* que nós escrevemos para o formato de arquivo de configuração no [Capítulo ?](regexp#ini), que tinha uma estrutura simples: ele dividia a entrada em linhas e tratava estas linhas uma de cada vez. Havia apenas algumas formas simples que uma linha podia ter.

{{index recursion, [nesting, "of expressions"]}}

Aqui, nós devemos encontrar uma abordagem diferente. Expressões não são separadas em linhas, e possuem uma estrutura recursiva. Expressões de funções _contém_ outras expressões.

{{index elegance}}

Felizmente, este problema pode ser muito bem resolvido escrevendo uma função de *parser* que seja recursiva de maneira que reflita a natureza recursiva da linguagem.

{{index "parseExpression function", "syntax tree"}}

Nós definimos uma função `parseExpression`, que pega uma *string* como entrada e retorna um objeto que contém a estrutura de dados da expressão no início da *string*, junto com a parte da *string* deixada após a análise dessa expressão. Ao analisar subexpressões (o argumento para uma função, por exemplo), essa função pode ser chamada novamente, produzindo a expressão do argumento e o texto restante. Este texto, por sua vez, pode conter mais argumentos ou pode ser o parêntese de fechamento que encerra a lista de argumentos.

Esta é a primeira parte do *parser*:

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

Como *Egg*, assim como JavaScript, permite qualquer quantidade de espaço em branco entre seus elementos, temos que cortar repetidamente o espaço em branco no início da string do programa. É com isso que a função `skipSpace` ajuda.

{{index "literal expression", "SyntaxError type"}}

Depois de pular qualquer espaço, `parseExpression` usa três expressões regulares para identificar os três elementos atômicos suportados por *Egg*: *string*, números e palavras. O *parser* constrói um tipo diferente de estrutura de dados, dependendo de qual deles corresponde. Se a entrada não corresponder a uma dessas três formas, não será uma expressão válida, e assim o *parser* emitirá um erro. Usamos `SyntaxError` em vez de `Error` como construtor de exceção, que é outro tipo de erro padrão, porque é um pouco mais específico - também é o tipo de erro emitido quando é feita uma tentativa de executar um programa JavaScript inválido.

{{index "parseApply function"}}

Em seguida, cortamos a parte correspondente à *string* do programa e a passamos, junto com o objeto da expressão, para `parseApply`, que verifica se a expressão é uma função. Neste caso, ele analisa a lista de argumentos dentro dos parênteses.

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

{{index parsing}}

Se o próximo caractere no programa não for um parêntese de abertura, este não será uma função e `parseApply` retornará a expressão que foi fornecida.

{{index recursion}}

Caso contrário, ignora o parêntese de abertura e cria o objeto da ((*syntax tree*)) para esta expressão da função. Em seguida, recursivamente chama `parseExpression` para analisar cada argumento até que um parêntese de fechamento seja encontrado. A recursão é indireta, através da chamada de `parseApply` e `parseExpression`.

Como a expressão de uma função pode ser aplicada a si mesma (como em `multiplier(2)(1)`), `parseApply` deve, após analisar uma função, chamar a si mesmo novamente para verificar se outro par de parênteses se segue.

{{index "syntax tree", "Egg language", "parse function"}}

Isso é tudo que precisamos para analisar *Egg*. Nós o envolvemos em uma conveniente função *parse* que verifica se atingiu o final da sequência de entrada após analisar a expressão (um programa *Egg* é uma única expressão) e que nos fornece a estrutura de dados do programa.

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

Funciona! Ele não nos fornece uma informação muito útil quando falha e não armazena a linha e a coluna em que cada expressão é iniciada, o que pode ser útil quando reportarmos erros mais tarde, mas está bom o suficiente para os nossos propósitos.

## O evaluator

{{index "evaluate function", evaluation, interpretation, "syntax tree", "Egg language"}}

O que nós podemos fazer com a árvore sintática de um programa? Executá-la, claro! E é isso que o *evaluator* faz. Você fornece a ele uma árvore sintática e um objeto de escopo que associa os nomes com valores, e ele avalia a expressão que a árvore representa e retorna o valor que esta produz.


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

O evaluator tem um código para cada um dos tipos de ((expressão)). Uma expressão de valor literal produz seu valor. (Por exemplo, a expressão `100` apenas avalia o número 100). Para uma variável, devemos verificar se ela está realmente definida no escopo e, se estiver, trazer o valor desta.

{{index [function, application]}}

Funções são mais complicadas. Se elas possuem um ((formato especial)), como `if`, não avaliamos nada e passamos as expressões de argumento, juntamente com o escopo, para a função que lida com esse formato. Se ela possuí uma forma normal, nós avaliamos o operador, comprovando que ele é um função, e chamamos ele com os argumentos avaliados.

Nós usamos valores de função no JavaScript simples para representar valores de funções no *Egg*. Nós iremos voltar nisso mais [tarde](language.md#egg_fun), quando a forma especial chamada `fun` é definida.

{{index readability, "evaluate function", recursion, parsing}}

A estrutura recursiva de `evaluate` se assemelha a estrutura do *parser*, e ambos espelham a estrutura da própria linguagem. Também seria possível integrar o *evaluate* ao *parser* e avaliarmos durante a análise, mas dividí-los dessa maneira torna o programa mais claro.

{{index "Egg language", interpretation}}

Isso é realmente tudo o que é necessário para interpretar *Egg*. Simples assim. Mas, sem definir algumas formas especiais e adicionar alguns valores úteis ao ((ambiente)), você ainda não pode fazer muito com essa linguagem.

## Formas especiais

{{index "special form", "specialForms object"}}

O objeto `specialForms` é usado para definir uma sintaxe especial em *Egg*. Ele associa palavras com funções que avaliam tais formas. Ele atualmente está vazio. Vamos adicionar o `if`.

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

O construtor `if` em *Egg* espera exatamente três argumentos. Ele irá avaliar o primeiro, e se o resultado do valor não for `false`, ele irá avaliar o segundo. Caso contrário, o terceiro argumento será avaliádo. Esta forma `if` é mais similar ao ternário do JavaScript `?:` que o `if` em JavaScript. Ele é uma expressão, não uma declaração, e produz um valor, isto é, o resultado do segundo ou do terceiro argumento.

{{index Boolean}}

*Egg* também difere de JavaScript em como ele lida com o valor do condicional `if`. Ele não tratará coisas como zero ou uma *string* vazia como falso, apenas o valor exato `false`.

{{index "short-circuit evaluation"}}

A razão para a qual precisamos representar `if` como uma forma especial, ao invés de uma função regular, é que todos os argumentos para as funções são avaliados antes que a função seja chamada, enquanto que `if` deve avaliar _apenas_ seu segundo _ou_ terceiro argumento, dependendo do valor do primeiro.

A forma `while` é similar.

```{includeCode: true}
specialForms.while = (args, scope) => {
  if (args.length != 2) {
    throw new SyntaxError("Wrong number of args to while");
  }
  while (evaluate(args[0], scope) !== false) {
    evaluate(args[1], scope);
  }

  // Since undefined does not exist in Egg, we return false,
  // for lack of a meaningful result.
  return false;
};
```

Outro componente básico é o `do`, que executa todos os seus argumentos de cima para baixo. Seu valor é o valor produzido pelo último argumento.

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

Para podermos criar variáveis e fornecer a elas novos valores, também criamos uma forma chamada `define`. Ela espera uma palavra como seu primeiro argumento e uma expressão produzindo o valor a ser atribuído a essa palavra como seu segundo argumento. Uma vez que `define`, como tudo, é uma expressão, ele apenas retorna um valor. Vamos fazer com que ele retorne o valor atribuído (assim como o operador `=` do JavaScript).

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

O ((escopo)) aceito pelo `evaluate` é um objeto com propriedades cujos nomes correspondem a nomes de variáveis e cujos valores correspondem aos valores aos quais essas variáveis estão associadas. Vamos definir um objeto para representar o ((escopo global)).

Para podermos usar a construção `if` que acabamos de definir, precisamos ter acesso aos valores ((Booleanos)). Como existem apenas dois valores Booleanos, não precisamos de uma sintaxe especial para eles. Nós simplesmente ligamos aos dois nomes os valores `true` e `false` e os usamos.

```{includeCode: true}
const topScope = Object.create(null);

topScope.true = true;
topScope.false = false;
```

Agora podemos avaliar uma simples expressão que nega um valor Booleano.

```
let prog = parse(`if(true, false, true)`);
console.log(evaluate(prog, topScope));
// → false
```

{{index arithmetic, "Function constructor"}}

Para fornecer ((operador))es ((aritméticos)) e ((de comparação)) básicos, também adicionaremos alguns valores de função ao ((escopo)). No interesse de manter o código curto, usaremos o construtor `Function` para sintetizar várias funções do operador em um loop, em vez de defini-las individualmente.

```{includeCode: true}
for (let op of ["+", "-", "*", "/", "==", "<", ">"]) {
  topScope[op] = Function("a, b", `return a ${op} b;`);
}
```

Uma maneira de ((visualizar)) os valores também é útil, portanto, agruparemos `console.log` em uma função e chamaremos de `print`.

```{includeCode: true}
topScope.print = value => {
  console.log(value);
  return value;
};
```

{{index parsing, "run function"}}

Isso nos fornece ferramentas elementares suficientes para escrever programas simples. A função a seguir fornece uma maneira prática de analisar um programa e executá-lo em um novo escopo:

```{includeCode: true}
function run(program) {
  return evaluate(parse(program), Object.create(topScope));
}
```

{{index "Object.create function", prototype}}

Usaremos cadeias de protótipos de objetos para representar escopos aninhados, para que o programa possa adicionar variáveis ao seu escopo local sem alterar o escopo de nível superior.

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

Este é o programa que vimos várias vezes antes, que calcula a soma dos números de 1 a 10, expresso em *Egg*. É claramente mais feio que o programa equivalente em JavaScript - mas não é tão ruim para uma linguagem implementada em menos de 150 ((linhas de código)).

{{id egg_fun}}

## Funções

{{index function, "Egg language"}}

Uma linguagem de programação sem funções é realmente uma pobre linguagem de programação.

Felizmente, não é difícil adicionar um construtor `fun`, que trata seu último argumento como o corpo da função e usa todos os argumentos anteriores como nomes dos parâmetros da função.

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

  return function() {
    if (arguments.length != params.length) {
      throw new TypeError("Wrong number of arguments");
    }
    let localScope = Object.create(scope);
    for (let i = 0; i < arguments.length; i++) {
      localScope[params[i]] = arguments[i];
    }
    return evaluate(body, localScope);
  };
};
```

{{index "local scope"}}

Funções em *Egg* possuem seu próprio escopo local. A função produzida por `fun` cria este escopo local e adiciona estes argumentos ligados a ele. Então ele avalia o corpo da função nesse escopo e retorna o resultado.

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

O que nós construímos é um interpretador. Durante a avaliação, ele age diretamente sobre a representação do programa produzido pelo `parser`.

{{index efficiency, performance, [binding, definition], [memory, speed]}}

_Compilação_ é o processo de adicionar uma outra etapa entre a análise e a execução do programa, que transforma este em algo que pode ser avaliado com mais eficiência, fazendo o máximo de trabalho possível com antecedência. Por exemplo, em linguagens bem projetadas é óbvio, para cada uso de uma variável, qual variável está sendo referida, sem realmente executar o programa. Isso pode ser usado para evitar procurar uma variável pelo nome sempre que ela for acessada, em vez de buscá-la diretamente em algum local da memória predeterminado.

Tradicionalmente, ((compilar)) envolve converter o programa em ((código de máquina)), o formato bruto que o processador de um computador pode executar. Mas, qualquer processo que converte um programa para uma diferente representação pode ser considerado como uma compilação.

{{index simplicity, "Function constructor", transpilation}}

Seria possível escrever uma alternativa à estratégia de ((análise)) para *Egg*, que primeiro converte o programa para um programa em JavaScript, usa `Function` para invocar o compilador JavaScript nele, e então executar o resultado. Quando bem feito, isso faria com que *Egg* executasse mais rápido e ainda assim fosse bastante simples de implementar.

Se você está interessado neste tópico e com força de vontade para investir mais tempo nele, eu encorajo você a tentar implementar um compilador como exercício.

## Trapaceando

{{index "Egg language"}}

Quando nós definimos `if` e `while`, você provavelmente notou que eles eram mais ou menos *wrappers* triviais em torno dos próprios `if` e `while` do JavaScript. Similarmente, os valores em *Egg* são apenas os velhos e regulares valores em JavaScript.

Se você comparar a implementação de *Egg*, construída em cima do JavaScript, com a quantidade de trabalho e complexidade necessárias para criar uma linguagem de programação diretamente em cima das funcionalidades brutas fornecida por uma máquina, a diferença é enorme. Independentemente disso, este exemplo deu uma impressão ideal de como as ((linguagens de programação)) funcionam.

E quando se trata de fazer algo, trapacear é mais eficaz do que fazer tudo sozinho. Embora a linguagem de brinquedo neste capítulo não faça nada que não poderia ser melhor em JavaScript, _há_ situações em que escrever pequenas linguagens ajuda a realizar um trabalho real.

Essa linguagem não precisa se parecer com uma típica linguagem de programação. Se JavaScript não vem equipado com expressões regulares, por exemplo, você poderá escrever seu próprio analisador e avaliador para expressões regulares.

{{index "artificial intelligence"}}

Ou imagine que você está construindo um robô ((dinossauro)) gigante e precisa programar seu ((comportamento)). Pode ser que JavaScript não seja a forma mais efetiva para fazer isso. Como alternativa, talvez você opte por uma linguagem que se pareça com isso:

```{lang: null}
behavior walk
  perform when
    destination ahead
  actions
    move left-foot
    move right-foot

behavior attack
  perform when
    Godzilla in-view
  actions
    fire laser-eyes
    launch arm-rockets
```

{{index expressivity}}

Isto é o que geralmente é chamado de uma _((linguagem de domínio específica))_, uma linguagem adaptada para expressar um domínio restrito de conhecimento. Essa linguagem pode ser mais expressiva do que uma linguagem de uso geral, porque foi projetada para descrever exatamente as coisas que precisam ser descritas em seu domínio e nada mais.

## Exercícios

### Arrays

{{index "Egg language", "arrays in egg (exercise)", [array, "in Egg"]}}

Adicione suporte para *arrays* em *Egg* adicionando as seguintes três funções ao topo do escopo: `array(...values)` para construir um *array* contendo os valores passados como argumento, `length(array)` para pegar o tamanho do *array*, e `element(array, n)` para capturar o enésimo elemento do *array*.

{{if interactive

```{test: no}
// Modify these definitions...

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

A maneira mais fácil de fazer isso é associar *arrays* em Egg com os *arrays* em JavaScript.

{{index "slice method"}}

Os valores adicionados ao topo do escopo devem ser funções. Usando um *rest argument* (notação de três pontos), a definição de *array* pode ser _muito_ simples.

hint}}

### Closure

{{index closure, [function, scope], "closure in egg (exercise)"}}

A maneira como definimos `fun` permite que as funções em *Egg* façam referência ao escopo ao redor delas, permitindo que o corpo da função use valores locais visíveis no momento em que a função foi definida, assim como as funções JavaScript.

O programa a seguir ilustra isso: a função `f` retorna uma função que adiciona seu argumento ao argumento de `f`, o que significa que ela precisa acessar o ((escopo)) local dentro de `f` para ser capaz de usar a variável `a`.

```
run(`
do(define(f, fun(a, fun(b, +(a, b)))),
   print(f(4)(5)))
`);
// → 9
```

Volte para a definição de `fun` e explique qual mecanismo faz com que isso funcione.

{{hint

{{index closure, "closure in egg (exercise)"}}

Mais uma vez, estamos usando um mecanismo em JavaScript para obter o mesmo recurso em *Egg*. Formas especiais recebem o escopo local na qual são avaliadas, para que possam avaliar suas sub-formas nesse escopo. A função retornada por `fun` tem acesso ao argumento de `escopo` fornecido à função que a envolve e o utiliza para criar o ((escopo)) local de sua função quando esta é chamada.

{{index compilation}}

Isso significa que o ((protótipo)) do escopo local será o escopo em que a função foi criada, o que torna possível acessar as variáveis nesse escopo a partir da função. Isso é tudo o que há para implementar um *clojure* (embora, para compilá-lo de uma maneira que seja realmente eficiente, você precisará trabalhar mais).

hint}}

### Comentários

{{index "hash character", "Egg language", "comments in egg (exercise)"}}

Seria interessante se pudéssemos escrever ((comentário))s em *Egg*. Por exemplo, se encontrássemos um símbolo *hash* (`#`), nós poderíamos tratar o resto da linha como um comentário e ignorá-lo, similar ao `//` do JavaScript.

{{index "skipSpace function"}}

Nós não temos que fazer nenhuma grande mudança para o analisador suportar isso. Nós podemos simplesmente mudar `skipSpace` para pular comentários como se fossem ((espaços em branco)), para que todos os locais em que `skipSpace` é chamado, também pule comentários agora. Faça essa mudança.

{{if interactive

```{test: no}
// This is the old skipSpace. Modify it...
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

Verifique se a sua solução lida com vários comentários seguidos, com potencial espaço em branco entre ou depois deles.

Uma expressão regular é provavelmente a forma mais fácil de solucionar isso. Escreva algo que encontre "espaços em branco ou um comentário, zero ou mais vezes". Use o método `exec` ou `match` e observe o tamanho do primeiro elemento no *array* retornado (a correspondência inteira) para descobrir quantos caracteres serão removidos.

hint}}

### Corrigindo escopo

{{index [binding, definition], assignment, "fixing scope (exercise)"}}

Atualmente, a única forma de atribuir à uma variável um valor é com `define`. Esta construção age como uma forma de, ao mesmo tempo, definir novas variáveis e dar a elas novos valores existentes.

{{index "local binding"}}

Esta ((ambiguidade)) causa um problema. Ao tentar atribuir um valor novo a uma variável não local, você acabará definindo um local com o mesmo nome. Algumas linguagens funcionam assim por design, mas sempre achei uma forma estranha de lidar com ((escopo)).

{{index "ReferenceError type"}}

Adicione uma forma especial `set`, similar ao `define`, que dê a uma variável um novo valor, atualizando a variável no escopo externo se ela não existir no escopo interno. Se a variável não estiver definida, dispare um `ReferenceError` (outro tipo de erro padrão).

{{index "hasOwnProperty method", prototype, "getPrototypeOf function"}}

A técnica de representar os escopos como objetos simples, o que tornou as coisas convenientes até agora, interferirá um pouco nesse ponto. Você pode usar a função `Object.getPrototypeOf`, que retorna o protótipo de um objeto. Lembre-se também que escopos não derivam de `Object.prototype`, então se você quiser chamar `hasOwnProperty` neles, você terá que usar esta expressão tosca:

```{test: no}
Object.prototype.hasOwnProperty.call(scope, name);
```

{{if interactive

```{test: no}
specialForms.set = (args, scope) => {
  // Your code here.
};

run(`
do(define(x, 4),
   define(setx, fun(val, set(x, val))),
   setx(50),
   print(x))
`);
// → 50
run(`set(quux, true)`);
// → Some kind of ReferenceError
```
if}}

{{hint

{{index [binding, "compilation of"], assignment, "getPrototypeOf function", "hasOwnProperty method", "fixing scope (exercise)"}}

Você terá que iterar um ((escopo)) por vez, usando `Object.getPrototypeOf` para ir até o escopo externo. Para cada escopo, use `hasOwnProperty` para descobrir se a variável, indicado pela propriedade `name` do primeiro argumento de `set`, existe naquele escopo. Se existir, insira-o como o resultado da avaliação do segundo argumento de `set` e, em seguida, retorne esse valor.

{{index "global scope", "run-time error"}}

Se o escopo mais externo for atingido (`Object.getPrototypeOf` retorna nulo) e ainda não encontramos a variável, então ela não existe, e um erro deve ser disparado.

hint}}
