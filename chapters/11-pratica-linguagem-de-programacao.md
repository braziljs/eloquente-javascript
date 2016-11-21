# Linguagem de programação

> "O avaliador que determina qual o significado da expressões em uma linguagem de programação é apenas mais um programa."
>
> `Hal Abelson e Gerald Sussman, Estrutura e Interpretação de Programas de Computador`


---


> "Quando um estudante perguntou ao mestre sobre a natureza do ciclo de dados e controle, Yuan-Ma respondeu: 'Pense em um compilador compilando a si mesmo.'"
>
> `Mestre Yuan-Ma, O Livro de Programação`

Construir sua própria linguagem de programação é surpreendentemente fácil(desde que você não seja ambicioso demais) e bastante esclarecedor.

A principal coisa que eu quero mostrar neste capítulo é que não há mágica envolvida na construção de sua própria linguagem. Eu sempre senti que algumas invenções humanas eram imensamente inteligentes e complicadas que eu nunca seria capaz de compreendê-las. Mas com um pouco de leitura e ajustes; tais coisas muitas vezes acabam por ser muito simples.

Iremos construir uma linguagem de programação chamada **Egg**. Vai ser uma pequena e simples linguagem mas poderosa o suficiente para expressar qualquer computação que você possa imaginar. Ela também permite abstração simples baseadas em funções.

## Parsing

A parte imediatamente mais visível de uma linguagem de programação é sua sintaxe ou notação. Um analisador é um programa que lê um pedaço de texto e produz uma estrutura de dados que refletem a estrutura do programa contida nesse texto. Se o texto não faz um programa válido o analisador deve reclamar e apontar o erro.

Nossa linguagem terá uma sintaxe simples e uniforme. Tudo em **Egg** é uma expressão. Uma expressão pode ser uma variável, um `Number`, uma `String`, ou uma aplicação. As aplicações são usados para chamadas de função, mas também para construções como `if` ou `while`.

Para manter o analisador simples, `String` em **Egg** não suportam qualquer coisa como escapes e uma sequência simplesmente de caracteres que não são aspas duplas envolvidas em aspas duplas. Um número é uma sequência de dígitos. Os nomes das variáveis podem consistir de qualquer caractere que não seja um espaço em branco e não tem um significado especial na sintaxe.

As aplicação será escrita da forma como é em JavaScript; colocando parênteses após uma expressão e com uma série de argumentos entre esses parênteses separados por vírgulas.

````javascript
do(define(x, 10),
   if(>(x, 5)),
      print("large"),
      print("small"))
````

A uniformidade da línguagem **Egg** significa coisas que são operadores de JavaScript(como >) nesta línguagem será apenas variáveis normais aplicado apenas como outras funções. E uma vez que a sintaxe também não tem o conceito de um bloco precisamos construir um representador fazendo várias coisas em seqüência.

A estrutura de dados que o analisador irá usar para descrever um programa será composto de objetos de expressões cada um dos quais tem uma propriedade de tipo que indica o tipo de expressão que é; e as outras propriedades para descreverem o seu conteúdo.

Expressões do tipo **"value"** representam `Strings`, `literais` ou `Numbers`. O valor da propriedade  contém o valor da cadeia ou o número que ele representa. Expressões do tipo **"word"** são usados para identificadores(nomes). Esses objetos têm uma propriedade que contém o nome do identificador de uma `String`. Por fim as expressões **"apply"** representam algo que é uma aplicação. Eles têm uma propriedade de operador que se refere à expressão que são aplicavéis e têm uma propriedade de `args` que refere-se a um conjunto de expressões de argumento.

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

![Syntax three](../img/syntax_tree.png)

Compare isso com o analisador que escrevemos para o formato de arquivo de configuração no capítulo 9 que tinha uma estrutura simples: dividir a entrada em linhas e tratar essas linhas uma de cada vez. Havia apenas algumas formas simples de mostrar que uma linha foi permitida.

Aqui temos de encontrar uma abordagem diferente. As expressões não são separados em linhas e elas têm uma estrutura recursiva. Expressões aplicadas contêm outras expressões.

Felizmente, este problema pode ser resolvido com elegância escrevendo uma função analisadora que é recursiva de uma forma que reflete a natureza recursiva da linguagem.

Nós definimos uma função `parseExpression` que recebe uma string como entrada e retorna um objeto que contém a estrutura de dados para a expressão no início da cadeia, depois é feito a junção com a parte da cadeia da esquerda para analisar esta expressão. Ao analisar essa `subexpressions`(o argumento para um aplicativo, por exemplo) esta função pode ser chamado novamente dando origem a expressão argumento bem como o texto nos mostra. Este texto pode por sua vez contêm mais argumentos ou pode ser o parêntese de fechamento, que da termino a lista de argumentos.

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

Temos que remover os espaços em brancos repetidos no início de qualquer seqüência do programa pois o **Egg** permite qualquer quantidade de espaço em branco entre os seus elementos inseridos. Quem tem essa funcionalidade é a da funcão `skipSpace`.

Depois de pular qualquer espaço à esquerda `parseExpression` usa três expressões regulares para detectar os três elementos simples(atômicas) que **Egg** suporta: `String`, `Number` e `words`. O analisador constrói um tipo diferente de estrutura de dados dependendo de sua correspondencia. Se a entrada não coincide com uma destas três formas não será considerado uma expressão válida e o analisador gerara um erro. `SyntaxError` é um tipo de erro padrão de objeto que é gerado quando é feita uma tentativa de executar um programa em JavaScript inválido.

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

Caso contrário ele ignora o parêntese de abertura e cria o objeto na árvore de sintaxe para essa expressão aplicável. Em seguida ele chama recursivamente `parseExpression` para analisar cada argumento até o parêntese de fechamento ser encontrado. A recursividade é indireta através da função `parseApply` e  `parseExpression` chamando uns aos outros.

Uma expressão de aplicação pode ser aplicado em si própria(como em `multiplier(2)(1)`); `parseApply` deve analisar um pedido depois chamar-se novamente para verificar se existe outro par de parênteses.

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

Funcionou! Ele não nos dá informação muito útil quando há falhas e não armazena a linha e coluna na qual cada expressão começa, o que pode ser útil ao relatar erros mais tarde mas é bom o suficiente para nossos propósitos.

## O avaliador

O que podemos fazer com uma árvore de sintaxe de um programa? Executá-lo é claro! E é isso que o avaliador faz. Você entrega-lhe uma árvore de sintaxe e um objeto do `environment` que associa nomes com os valores, e ele irá avaliar a expressão que a árvore representa e retornar o valor que esta produz.

````js
function evaluate(expr, env) {
  switch(expr.type) {
    case "value":
      return expr.value;

    case "word":
      if (expr.name in env)
        return env[expr.name];
      else
        throw new ReferenceError("Undefined variable: " +
                                 expr.name);
    case "apply":
      if (expr.operator.type == "word" &&
          expr.operator.name in specialForms)
        return specialForms[expr.operator.name](expr.args,
                                                env);
      var op = evaluate(expr.operator, env);
      if (typeof op != "function")
        throw new TypeError("Applying a non-function.");
      return op.apply(null, expr.args.map(function(arg) {
        return evaluate(arg, env);
      }));
  }
}

var specialForms = Object.create(null);
````

O avaliador possui código para cada um dos tipos de expressão. A expressão de valor literal simplesmente produz o seu valor(por exemplo, a expressão 100 apenas avalia para o número 100). Para uma variável é preciso verificar se ele está realmente definido no `environment atual`, se estiver, buscar o valor da variável.

As aplicações são mais envolvidas. Se eles são de uma forma especial, nós não avaliamos nada e simplesmente passamos as expressões como argumento junto com o `environment` para a função que lida com essa forma. Se for uma chamada normal nós avaliamos o operador verificamos se ele é uma função e chamamos com o resultado da avaliação dos argumentos.

Iremos usar os valores de uma função simples em JavaScript para representar os valores de função em **Egg**. Voltaremos a falar sobre isso mais tarde quando o `specialForm` chamado `fun` estiver definido.

A estrutura recursiva de um avaliador se assemelha à estrutura de um analisador. Ambos espelham a estrutura da própria linguagem. Além disso, seria possível integrar o analisador com o avaliador e avaliar durante a análise, mas dividindo-se desta forma torna o programa mais legível.

Isso é tudo que precisamos para interpretar Egg. É simples assim. Mas sem definir algumas formas especiais e adicionar alguns valores úteis para o `environment` você não pode fazer nada com essa linguagem ainda.

## Formas especiais

O objecto `specialForms` é utilizado para definir sintaxe especial em **Egg**. Ele associa palavras com funções que avaliam essas formas especiais. Atualmente ele está vazio. Vamos adicionar algumas formas.

````javascript
specialForms["if"] = function(args, env) {
  if (args.length != 3)
    throw new SyntaxError("Bad number of args to if");

  if (evaluate(args[0], env) !== false)
    return evaluate(args[1], env);
  else
    return evaluate(args[2], env);
};
````

**Egg** - `if` espera exatamente três argumentos. Ele irá avaliar o primeiro, se o resultado não é o valor falso ele irá avaliar a segunda. Caso contrário a terceira fica avaliada. Esta é a forma mais semelhante ao ternário do JavaScript `?:` estes operadores tem o mesmo significado de `if/else` em JavaScript. Isso é uma expressão e não uma indicação que produz um valor, ou seja, o resultado do segundo ou terceiro argumento.

**Egg** difere de JavaScript na forma de como ele lida com o valor de um condição como o valor do `if`. Ele não vai tratar as coisas como zero ou cadeia vazia como falsa, somente valorores precisos são falsos.

A razão especial é que nós preciso representar o `if` como uma forma especial, ao invés de uma função regular onde todos os argumentos para funções são avaliadas antes que a função seja chamada, ao passo que se deve avaliar apenas seu segundo ou terceiro argumento, dependendo do valor do primeiro.

A forma `while` é semelhante.

````javascript
specialForms["while"] = function(args, env) {
  if (args.length != 2)
    throw new SyntaxError("Bad number of args to while");

  while (evaluate(args[0], env) !== false)
    evaluate(args[1], env);

  // Since undefined does not exist in Egg, we return false,
  // for lack of a meaningful result.
  return false;
};
````

Outro bloco na construção básico é fazer que executa todos os seus argumentos de cima para baixo. O seu valor é o valor produzido pelo último argumento.

````javascript
specialForms["do"] = function(args, env) {
  var value = false;
  args.forEach(function(arg) {
    value = evaluate(arg, env);
  });
  return value;
};
````

Para ser capaz de criar variáveis e dar-lhes novos valores, vamos criar um `specialForms` chamado `define`. Ele espera uma palavra como primeiro argumento de uma expressão que produz o valor a ser atribuído a essa palavra que sera seu segundo argumento. Vamos definir sendo tudo uma expressão e ela deve retornar um valor. Vamos fazê-lo retornar o valor que foi atribuído(igual ao operador `=` de JavaScript).

````javascript
specialForms["define"] = function(args, env) {
  if (args.length != 2 || args[0].type != "word")
    throw new SyntaxError("Bad use of define");
  var value = evaluate(args[1], env);
  env[args[0].name] = value;
  return value;
};
````

## Ambiente

O `environment` aceita avaliar um objeto com propriedades cujos nomes correspondem aos nomes de variáveis e cujos valores correspondem aos valores dessas variáveis. Vamos definir um objeto no environment para representar o escopo global.

Para ser capaz de usar `if` que acabamos de definir teremos de ter acesso aos valores `booleanos`. Uma vez que existem apenas dois valores `booleanos` nós não precisamos de sintaxe especial para eles. Nós simplesmente vamos ligar duas variáveis em `topEnv` para os valores verdadeiros e falsos e dai então usá-los.

````javascript
var topEnv = Object.create(null);

topEnv["true"] = true;
topEnv["false"] = false;
````

Agora podemos avaliar uma expressão simples que nega um valor `booleano`.

````javascript
var prog = parse("if(true, false, true)");
console.log(evaluate(prog, topEnv));
// → false
````

Para suprir os operadores aritméticos e comparações básicas vamos adicionar alguns valores para função de `environment`. No interesse de manter um código pequeno vamos utilizar uma nova função para sintetizar um monte de funções de operador em um loop ao invéz de definir todos eles individualmente.

````javascript
["+", "-", "*", "/", "==", "<", ">"].forEach(function(op) {
  topEnv[op] = new Function("a, b", "return a " + op + " b;");
});
````

É muito útil fazer uma maneira para que valores de saída sejam vizualidos, por isso vamos colocar alguns `console.log` na função e executa-lo para imprimir.

````javascript
topEnv["print"] = function(value) {
  console.log(value);
  return value;
};
````

Isso ja nos proporcionou uma ferramenta elementar e suficiente para escrever programas simples. A seguinte função `run` fornece uma maneira conveniente de escrever e executá-los. Ele cria um `enviroment` em tempo real, analisa e avalia as `String` que damos como um programa único.

````javascript
function run() {
  var env = Object.create(topEnv);
  var program = Array.prototype.slice
    .call(arguments, 0).join("\n");
  return evaluate(parse(program), env);
}
````

O uso de `Array.prototype.slice.call` é um truque para transformar um objeto de matriz como argumentos em uma matriz real; de modo que podemos chamar e juntar cada pedaço.
No exemplo abaixo iremos percorrer todos os argumentos dados e tratar cada linha do programa.

````javascript
run("do(define(total, 0),",
    "   define(count, 1),",
    "   while(<(count, 11),",
    "         do(define(total, +(total, count)),",
    "            define(count, +(count, 1)))),",
    "   print(total))");
// → 55
````

Este é o programa que já vimos várias vezes antes que calcula a soma dos números de 1 a 10 escrito em **Egg**. É evidente que é mais feio do que um programa em JavaScript, mas não é tão ruim para uma linguagem implementada em menos de 150 linhas de código.

## Funções

A linguagem de programação sem funções é uma linguagem de programação pobre.

Felizmente, não é difícil para adicionar `fun` a nossa linguagem, que vai tratar todos os argumentos antes do último como nomes de argumentos da função e seu último argumento como corpo da função.

````javascript
specialForms["fun"] = function(args, env) {
  if (!args.length)
    throw new SyntaxError("Functions need a body");
  function name(expr) {
    if (expr.type != "word")
      throw new SyntaxError("Arg names must be words");
    return expr.name;
  }
  var argNames = args.slice(0, args.length - 1).map(name);
  var body = args[args.length - 1];

  return function() {
    if (arguments.length != argNames.length)
      throw new TypeError("Wrong number of arguments");
    var localEnv = Object.create(env);
    for (var i = 0; i < arguments.length; i++)
      localEnv[argNames[i]] = arguments[i];
    return evaluate(body, localEnv);
  };
};
````

Funções em **Egg** tem seu próprio `enviroment` local assim como em JavaScript. Usamos `Object.create` para fazer um novo objeto que tem acesso às variáveis do ambiente externo(`prototype`) mas que também pode conter novas variáveis sem modificar esse escopo exterior.

A função criada pela `especialForm` `fun` cria em ambito local e adiciona as variáveis de argumento para isso. Em seguida ele avalia o corpo da função neste ambiente e retorna o resultado.

````javascript
run("do(define(plusOne, fun(a, +(a, 1))),",
    "   print(plusOne(10)))");
// → 11

run("do(define(pow, fun(base, exp,",
    "     if(==(exp, 0),",
    "        1,",
    "        *(base, pow(base, -(exp, 1)))))),",
    "   print(pow(2, 10)))");
// → 1024
````

## Compilação

O que nós construímos foi um intérprete. Durante a avaliação ele age diretamente sobre a representação do programa produzido pelo analisador.

A compilação é o processo de adicionar mais um passo entre a análise e a execução de um programa; que transforma o programa em algo que possa ser avaliado de forma mais eficiente fazendo o trabalho tanto quanto possível com antecedência.
Por exemplo, em línguas bem desenhadas, é óbvio para cada uso de uma variável ele verifica qual esta se referindo sem realmente executar o programa. Isso pode ser usado para evitar a procura de uma variável pelo nome sempre que é acessado ou buscado diretamente de algum local pré-determinado da memória.

Tradicionalmente, compilação envolve a conversão do programa para código de máquina no formato `raw` que o processador de um computador pode executar. Qualquer processo que converte um programa de uma representação diferente pode ser encarado como compilação.

Seria possível escrever uma estratégia de avaliação alternativa para **Egg**, aquele que primeiro converte o programa para um programa JavaScript utilizando a nova função para chamar o compilador JavaScript, e em seguida executar o resultado. Sendo feito assim **Egg** executaria muito mais rápido e continuaria bastante simples de implementar.

Se você está interessado e disposto neste assunto gaste algum tempo com isso, encorajo-vos a tentar implementar um compilador nos exercícios.

## Cheating

Quando definimos `if` e `while`, você provavelmente percebeu que eles eram invólucros triviais em torno do próprio JavaScript. Da mesma forma, os valores em **Egg** são antigos valores de JavaScript.

Se você comparar a execução de **Egg** que foi construída em alto nível utilizando a ajuda de JavaScript com a quantidade de trabalho e complexidade necessários para construir uma linguagem de programação utilizando diretamente a funcionalidade `raw` fornecido por uma máquina essa diferença é enorme. Independentemente disso este é apenas um exemplo; espero ter lhe dado uma impressão de que maneira as linguagens de programação trabalham.

E quando se trata de conseguir fazer algo, o `cheating` é  o jeito mais eficaz de fazer tudo sozinho. Embora a linguagem que brincamos neste capítulo não faz nada de melhor que o JavaScript possui, existem situações em que a escrever pequenas línguas ajuda no entendimento verdadeiro do trabalho.

Essa língua não possui semelhanças com uma linguagem típica de programação. Se o JavaScript não vêm equipado com expressões regulares você pode escrever seu próprio analisador e avaliador para tal sub linguagem.

Ou imagine que você está construindo um dinossauro robótico gigante e precisa programar o seu comportamento. JavaScript pode não ser a forma mais eficaz de fazer isso. Você pode optar por uma linguagem que se parece com isso:

````javascript
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
````

Isto é o que geralmente é chamado de linguagem de domínio específica, uma linguagem adaptada para expressar um estreito conhecimento de um domínio. Essa linguagem pode ser mais expressiva do que uma linguagem de um propósito geral. Isto porque ela é projetada para expressar exatamente as coisas que precisam serem expressadas no seu domínio e nada mais.

---

# Exercícios

## Arrays

Adicionar suporte para `array` em **Egg** construindo as três funções em `topEnv` do escopo: `array(...)` vai ser a construção de uma matriz contendo os argumentos como valores, `length(array)` para obter o comprimento de um `array` e `element(array, n)` buscar `n` elementos de uma matriz.


````javascript
// Modify these definitions...

topEnv["array"] = "...";

topEnv["length"] = "...";

topEnv["element"] = "...";

run("do(define(sum, fun(array,",
    "     do(define(i, 0),",
    "        define(sum, 0),",
    "        while(<(i, length(array)),",
    "          do(define(sum, +(sum, element(array, i))),",
    "             define(i, +(i, 1)))),",
    "        sum))),",
    "   print(sum(array(1, 2, 3))))");
// → 6
````

**Dica:**

A maneira mais fácil de fazer isso é representar as matrizes de **Egg** atravéz de matrizes do JavaScript.

Os valores adicionados ao `enviroment` no `topEnv` deve ser uma funções. `Array.prototype.slice`; pode ser utilizado para converter um `array` em um `object` de argumentos numa matriz regular.

[**Resolução**](https://gist.github.com/SauloSilva/7bef8ec6e6f9abd9529a#file-egg-js-L170)

## Closures

A maneira que definimos o `fun` é permitido que as funções em **Egg** se chamem em ambiente circundante, permitindo o corpo da função utilizar valores locais que eram visíveis no momento que a função foi definida, assim como as funções em JavaScript fazem.

O programa a seguir ilustra isso: função `f` retorna uma função que adiciona o seu argumento ao argumento de f, o que significa que ele precisa de acesso ao escopo local dentro de `f` para ser capaz de utilizar a variável.

````js
run("do(define(f, fun(a, fun(b, +(a, b)))),",
    "print(f(4)(5)))");
// → 9
````

Volte para a definição da forma `fun` e explique qual o mecanismo feito para que isso funcione.

**Dica:**

Mais uma vez, estamos cavalgando sobre um mecanismo de JavaScript para obter a função equivalente em **Egg**. Formas especiais são passados para o `enviroment` local de modo que eles possam ser avaliados pelas suas sub-formas do `enviroment`. A função retornada por `fun` se fecha sobre o argumento `env` dada a sua função de inclusão e usa isso para criar `enviroment` local da função quando é chamado.

Isto significa que o `prototype` do `enviroment` local será o `enviroment` em que a função foi criado, o que faz com que seja possível ter acesso as variáveis de `enviroment` da função. Isso é tudo o que há para implementar e finalizar(embora para compilá-lo de uma forma que é realmente eficiente, você precisa de um pouco mais de trabalho).

## Comentários

Seria bom se pudéssemos escrever comentários no **Egg**. Por exemplo, sempre que encontrar um cardinal `("#")`, poderíamos tratar o resto da linha como um comentário e ignorá-lo, semelhante que Javascript faz com o `"//"`.

Não temos de fazer quaisquer grandes mudanças para que o analisador suporte isto. Nós podemos simplesmente mudar o `skipSpace` para ignorar comentários assim como é feito com os espaços em branco; para que todos os pontos onde `skipSpace` é chamado agora também ira ignorar comentários. Vamos fazer essa alteração:

````javascript
// This is the old skipSpace. Modify it...
function skipSpace(string) {
  var first = string.search(/\S/);
  if (first == -1) return "";
  return string.slice(first);
}

console.log(parse("# hello\nx"));
// → {type: "word", name: "x"}

console.log(parse("a # one\n   # two\n()"));
// → {type: "apply",
//    operator: {type: "word", name: "a"},
//    args: []}
````

**Dica:**

Certifique-se de que sua solução é válida com vários comentários em uma linha e principalmente com espaço em branco entre ou depois deles.

Uma expressão regular é a maneira mais fácil de resolver isso. Faça algo que corresponda "espaços em branco ou um comentário, uma ou mais vezes". Use o método  `exec` ou `match` para olhar para o comprimento do primeiro elemento na matriz retornada(desde de o inicio) para saber quantos caracteres precisa para cortar.

[**Resolução**](https://gist.github.com/SauloSilva/7bef8ec6e6f9abd9529a#file-egg-js-L17)

## Corrigindo o escopo

Atualmente, a única maneira de atribuir uma variável um valor é utilizando o método `define`. Esta construção atua tanto como uma forma para definir novas variáveis e dar um novo valor para existentes.

Isto causa um problema de ambiguidade. Quando você tenta dar uma variável um novo valor que não esta local, você vai acabar definindo uma variável local com o mesmo nome em seu lugar(Algumas línguas funcionam assim por design, mas eu sempre achei uma maneira estranha de lidar com escopo).

Adicionar um `specialForm` similar ao `define` dara a variável um novo valor ou a atualização da variável em um escopo exterior se ele ainda não existir no âmbito interno. Se a variável não é definida em tudo lançar um `ReferenceError`(que é outro tipo de erro padrão).

A técnica de representar escopos como simples objetos tornou as coisas convenientes, até agora, e vai ficar um pouco no seu caminho neste momento. Você pode querer usar a função `Object.getPrototypeOf` que retorna os protótipos de um objeto. Lembre-se também que os escopos não derivam de `Object.prototype`, por isso, se você quiser chamar `hasOwnProperty` sobre eles,você tera que usar esta expressão não muito elegante:

````javascript
Object.prototype.hasOwnProperty.call(scope, name);
````

Este método(`hasOwnProperty`) busca o protótipo do objeto e depois chama-o em um objeto do escopo.

````javascript
specialForms["set"] = function(args, env) {
  // Your code here.
};

run("do(define(x, 4),",
    "   define(setx, fun(val, set(x, val))),",
    "   setx(50),",
    "   print(x))");
// → 50
run("set(quux, true)");
// → Some kind of ReferenceError
````

**Dica:**

Você vai ter que percorrer um escopo de cada vez usando `Object.getPrototypeOf` ate ir ao escopo externo. Para cada um dos escopos use `hasOwnProperty` para descobrir se a variável indicado pela propriedade `name` do primeiro argumento definida existe nesse escopo. Se isso acontecer defina-o como o resultado da avaliação do segundo argumento, e em seguida retorne esse valor.

Se o escopo mais externo é atingido(`Object.getPrototypeOf` retornando `null`) e não encontramos a variável, isto significa que não existe; então um erro deve ser acionado.

[**Resolução**](https://gist.github.com/SauloSilva/7bef8ec6e6f9abd9529a#file-egg-js-L156)
