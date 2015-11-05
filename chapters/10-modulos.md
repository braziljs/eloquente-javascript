Capítulo 10

# Módulos

> Um programador iniciante escreve seus programas como uma formiga constrói seu formigueiro, um pedaço de cada vez, sem pensar na estrutura maior. Seus programas irão parecer como areia solta. Eles podem durar um tempo, mas se crescem demais, desmoronam.
>
> Percebendo esse problema, o programador começará a gastar muito tempo pensando sobre a estrutura. Seus programas serão rigidamente estruturados, como esculturas em pedra. Eles são sólidos, mas quando precisam mudar, devem ser quebrados.

> O programador experiente sabe quando aplicar uma estrutura e quando deixar as coisas mais simples. Seus programas são como argila, sólidos mas ainda maleáveis.

> —Master Yuan-Ma, The Book of Programming

Todo programa possui uma forma. Em menor escala essa forma é determinada pela divisão em funções e os blocos dentro destas funções. Programadores têm muita liberdade na forma que dão aos seus programas. É determinado mais pelo bom (ou mau) gosto, do que pela funcionalidade planejada.

Quando olhamos um programa grande em seu todo, funções individuais começam a se misturar e seria bom possuir uma unidade maior de organização.

Módulos dividem programas em blocos de código, que por algum critério pertencem a uma mesma unidade. Este capítulo explora alguns dos benefícios que estes agrupamentos fornecem e mostra algumas técnicas para construção de módulos em Javascript.

## Organização

Existem algumas razões porque autores dividem seus livros em capítulos e seções. Elas facilitam para o leitor entender como o livro foi feito ou achar uma parte específica em que está interessado. Elas também ajudam o autor, dando um foco claro para cada seção.

Os benefícios de dividir um programa em vários arquivos ou módulos são semelhantes, ajudam as pessoas que não estão familiarizadas com o código a achar o que elas buscam, e ajudam o programador a colocar coisas semelhantes juntas.

Alguns programas são organizados seguindo o modelo de um texto tradicional, com uma ordem bem definida que encoraja o leitor a percorrer o programa, e muito falatório (comentários) fornecendo uma descrição coerente do código. Isso faz o programa muito menos intimidador (ler código desconhecido é geralmente intimidador). Mas existe um lado ruim que é a maior quantidade de trabalho a fazer e dificulta um pouco as alterações, porque os comentários tendem a ser mais interligados do que o código em si.

Como regra geral, organização tem um custo, e é nos estágios iniciais do projeto, quando não sabemos com certeza aonde vamos e que tipo de módulos o programa precisará. Eu defendo uma estrutura minimalista, com pouca estrutura. Apenas coloque tudo em um simples arquivo até que o código esteja estabilizado. Dessa maneira, você não estará se sobrecarregando pensando em organização enquanto tem pouca informação, não perderá tempo fazendo e desfazendo coisas, e não irá acidentalmente travar-se em uma estrutura que não serve realmente para seu programa.

## Namespaces

A maioria das linguagens modernas de programação têm um nível de escopo entre "global" (todos podem ver) e "local" (só esta função pode ver isto). JavaScript não. Assim, por padrão, tudo o que precisa ser visível fora do pequeno escopo da função atual é visível em todos os lugares.

Poluição de Namespace, o problema de um monte de código não relacionado ter que compartilhar um único conjunto de nomes de variáveis globais, foi mencionado no capítulo 4, onde o objeto `Math` foi dado como um exemplo de um objeto que age como uma espécie de módulo por um agrupamento série de funcionalidades relacionadas com a matemática.

Embora Javascript não possua a criação de módulos nativamente, objetos podem ser usados para criar sub-namespaces publicamente acessíveis, e funções podem ser usadas para criar um namespace privado dentro de um módulo. Vou demonstrar algumas técnicas que nos permitirão construir módulos namespace isolados bem convenientes.

## Reuso

Em um projeto "flat" (plano), não é claro quais partes do código são necessárias para se usar uma função em particular. Se, no meu programa para espionar inimigos (*spying on enemies*), eu escrever uma função para ler os arquivos de  configuração, e agora eu uso essa função novamente em outro projeto, eu devo ir e copiar as partes do programa antigo que são relevantes para a funcionalidade que eu preciso, e colá-las no meu novo programa. Então, se eu encontrar um erro nesse código, eu vou consertar isso neste programa que eu estava trabalhando no momento, e esquecer de também consertar no outro programa.

Uma vez que você tenha muitos pedaços de código compartilhados e duplicados, você vai se encontrar perdendo uma grande quantidade de tempo e energia organizá-los e mantê-los atualizados.

Quando partes de funcionalidades que são independentes são colocadas em arquivos e módulos separados, elas podem ser rastreiadas mais facilmente, atualizadas quando uma nova versão for criada, ou até mesmo compartilhadas, tendo várias partes do código que desejam usá-las carregando o mesmo arquivo.

Essa idea fica ainda mais poderosa quando as relações entre os módulos - onde outros módulos cada módulo depende - são explicitamente especificados. Você pode então automatizar o processo de instalação e atualização de módulos externos.

E, levando isso ainda mais longe, imagine um serviço online que rastreia e distribui centenas de milhares destes módulos, permitindo a você buscar pela funcionalidade que deseja, e, uma vez que você a encontre, configure-a no seu projeto para ser baixada automaticamente.

Este serviço existe. É chamado NPM (npmjs.org). NPM consiste em um banco de dados online de módulos, e uma ferramenta para download e atualização dos módulos que seu programa depende. Ele cresceu com o Node.js. o ambiente JavaScript *browser-less* (que não depende do navegador), discutido no capítulo 20, mas também pode ser usado quando programando para o navegador.

## Desacoplamento

Outro importante papel dos módulos é os de isolar partes de código um do outro, da mesma forma que as interfaces dos objetos no capítulo 6 fazem. Um módulo bem desenvolvido fornece uma interface para uso de códigos externos, e mesmo que o módulo continue sendo trabalhado (bugs consertados, funcionalidades adicionadas) a interface existente permanece estável, assim outro módulos podem usar uma nova e melhorada versão sem qualquer alteração neles mesmos.

Note que uma interface estável não significa que novos elementos não são adicionados. Isso apenas significa que elementos existentes não serão removidos ou seus significados não serão alterados.

Construir a interface de um módulo que permite que este cresça sem quebras na antiga interface significa encontrar um balanço entre expor a menor quantidade de conceitos internos ao mundo exterior quanto possível, e ainda assim criar uma "linguagem" exposta pela interface que seja poderosa e flexível o suficiente para ser aplicada em uma vasta variedade de situações.

Para interfaces que expões um único e focado conceito, como um arquivo leitor de configuração, isso é natural. Para as outras interfaces, como um componente editor de texto, onde código externo precisa acessar vários conceitos diferentes, isso requer cuidado no projeto.

## Funções como namespaces

Funções são o único construtor em JavaScript que criam um novo escopo. Então se nós desejamos que nossos módulos tenham um escopo próprio, teremos que colocá-los em funções de alguma forma.

Considere este módulo trivial que associa nomes com o número dos dias da semana retornado pelo método `getDay` de um objeto *date*.

```
var names = ["Sunday", "Monday", "Tuesday", "Wednesday",
             "Thursday", "Friday", "Saturday"];
function dayName(number) {
  return names[number];
}

console.log(dayName(1));
// → Monday
```

A função `dayName` é parte desta interface, mas a variável `names` não. Nós prefirimos não deixá-la no escopo global.

Podemos fazer isso:

```
var dayName = function() {
  var names = ["Sunday", "Monday", "Tuesday", "Wednesday",
               "Thursday", "Friday", "Saturday"];
  return function(number) {
    return names[number];
  };
}();

console.log(dayName(3));
// → Wednesday
```

Agora `names` é uma variável local dentro de uma função (anônima). Esta função é criada e chamada imediatamente, e seu valor retornado (a função `dayName`) é armazenada em uma variável. Podemos ter páginas e mais páginas de código nessa função, criando centenas de variáveis locais. Elas serão todas internas ao módulo, visíveis ao próprio módulo, mas não visível a códigos externos.

Um padrão similar é usado para isolar inteiramente código do mundo exterior. O módulo abaixo tem algum efeito, mas não fornece qualquer valor para outros módulos usarem.

```
(function() {
  function square(x) { return x * x; }
  var hundred = 100;

  console.log(square(hundred));
})();
// → 10000
```

Este código simplesmente imprime o quadrado de cem (no mundo real, este poderia ser um módulo que adiciona um método a algum prototype, ou configura algum *widget* em uma página da web). Ele encapsula seu código em uma função para, novamente, prevenir que as variáveis que ele usa internamente estejam no escopo global.

Por que a função namespace está encapsulada em uma par de parênteses? Isso tem relação com um truque da sintaxe JavaScript. Se uma expressão começa com a palavra-chave `function`, ela é uma expressão de função. Entretanto, se uma declaração inicia com esta palavra-chave, será uma declaração de função, que requer um nome e não pode ser chamada imediatamente. Mesmo que uma declaração comece com uma expressão, a segunda regra tem precedência, e se os parênteses extras foram esquecidos no exemplo acima, isso irá produzir um erro de sintaxe. Você pode imaginá-los como um truco para forçar a linguagem a enteder que nós queremos escrever uma expressão.

## Objetos como namespaces

Agora imagine que o módulo dia-da-semana (*day-of-the-week*) precise fornecer não uma, mas duas funções, porque nós adicionamos uma função `dayNumber` que vai de um nome para um número. Nós podemos mais simplesmente retornar a função, mas devemos encapsular as duas funções em um objeto.

```
var weekDay = function() {
  var names = ["Sunday", "Monday", "Tuesday", "Wednesday",
               "Thursday", "Friday", "Saturday"];
  return {
    name: function(number) { return names[number]; },
    number: function(name) { return names.indexOf(name); }
  };
}();

console.log(weekDay.name(weekDay.number("Sunday")));
// → Sunday
```

Para módulos maiores, juntar todos os módulos exportados em um objeto no fim da função se torna algo incômodo, e geralmente requer que façamos algo repetido. Isso pode ser melhorado declarando um objeto, usualmente nomeado `exports`, e adicionando propriedades a este objeto sempre que nós definirmos algo que precise ser exportado. Este objeto pode então ser retornado, ou aceito como um parâmetro armazenado em algum lugar pelo código exterior ao módulo.

```
(function(exports) {
  var names = ["Sunday", "Monday", "Tuesday", "Wednesday",
               "Thursday", "Friday", "Saturday"];

  exports.name = function(number) {
    return names[number];
  };
  exports.number = function(name) {
    return names.indexOf(name);
  };
})(window.weekDay = {});

console.log(weekDay.name(weekDay.number("Saturday")));
// → Saturday
```

## Removendo do escopo global

O padrão acima é usado normalmente em módulos JavaScript criados para o navegador. Eles requerem um simples e conhecido nome global, e encapsular seu código em uma função para ter seu namespace privado próprio.

Ainda existe um problema quando múltiplos módulos reivindicam o mesmo nome, ou quando você quer, por qualquer motivo, carregar duas versões do mesmo módulo de forma conjunta.

Com um pequeno encanamento, nós podemos criar um sistema que permite que aos módulos requerirem diretamente por interfaces de objetos de outros módulos que eles precisem de acessar, sem precisarmos usar o escopo global. Isso resolve os problemas mencionados acima e tem um benefício adicional de ser explícito sobre suas dependências, tornando difícil usar acidentalmente algum módulo sem declarar que você precisa dele.

Nosso objetivo é uma função 'require' que, quando dado o nome de um módulo, vai carregar esse arquivo (do disco ou da web, dependendo da plataforma que estivermos rodando), e retornar o valor apropriado da interface.

Para isso nós precisamos de pelo menos duas coisas. Primeiramente, nós vamos imaginar que temos uma função `readFile` (que não está presente por padrão no JavaScript), que retorna o conteúdo do arquivo com um nome fornecido. Existem formas de acessar a web com JavaScript no navegador, e acessar o disco rígido com outras plataformas JavaScript, mas elas são mais envolvidas. Por agora, nós apenas pretendemos desta simples função.

Em segundo lugar, nós precisamos de ser capazes, quando tivermos uma string contendo o código (lida do arquivo), de realmente executar o código como um programa JavaScript.

## Avaliando dados como código

Existem várias formas de se pegar dados (uma `string` de código) e rodá-los no contexto do programa atual.

A mais óbvia maneira é o operador padrão especial `eval`, que vai executar a string de código no escopo atual. Isso usualmente é uma ideia muito ruim, porque quebra algumas propriedades que escopos normalmente tem (ser isolado do mundo externo é a mais notável).

```
function evalAndReturnX(code) {
  eval(code);
  return x;
}

console.log(evalAndReturnX("var x = 2"));
// → 2
```

A melhor forma de converter dados dentro do programa é usar uma função construtora. Ela recebe como argumentos uma lista de nomes de argumentos separados por vírgula, e então uma string contendo o corpo da função.

```
var plusOne = new Function("n", "return n + 1;");
console.log(plusOne(4));
// → 5
```

Isso é precisamente o que precisamos - podemos encapsular o código para um módulo em uma função, com este escopo de função se tornando nosso escopo de módulo.

## Require

Se a nova função construtora, usada pelo nosso módulo de carregamento, encapsula o código em uma função de qualquer forma, nós podemos omitir a função *namespace* encapsuladora atual dos arquivos. Nós também vamos fazer `exports` um argumento à função módulo, então o módulo não precisará de declarar isso. Isso remove um monte de barulho supérfluo do nosso módulo de exemplo:

```
var names = ["Sunday", "Monday", "Tuesday", "Wednesday",
             "Thursday", "Friday", "Saturday"];

exports.name = function(number) {
  return names[number];
};
exports.number = function(name) {
  return names.indexOf(name);
};
```

Essa é uma implementação mínima de `require`:

```
function require(name) {
  var code = new Function("exports", readFile(name));
  var exports = {};
  code(exports);
  return exports;
}

console.log(require("weekDay").name(1));
// → Monday
```

Quando usando este sistema, um módulo tipicamente começa com pequenas declarações de variáveis que carregam os módulos que ele precisa.

```
var weekDay = require("weekDay");
var today = require("today");

console.log(weekDay.name(today.dayNumber()));
```

A implementação de require acima tem diversos problemas. Primeiro, ela vai carregar e rodar um módulo todas as vezes que este for "require-d" (requisitado), então se diversos módulos têm a mesma dependência, ou uma chamada require é colocada dentro de uma função que vai ser chamada múltiplas vezes, tempo e energia serão disperdiçados.

Isso pode ser resolvido armazenando os módulos que já tenham sido carregados em um objeto, e simplesmente retornando o valor existente se eles forem carregados novamente.

O segundo problema é que não é possível para um módulo expor diretamente um valor simples. Por exemplo, um módulo pode querer exportar apenas o construtor do tipo do objeto que ele define. Por agora, isso não pode ser feito, porque `require` sempre vai usar o objeto `exports` que ele cria como o valor exportado.

A solução tradicional para isso é fornecer outra variável, `module`, que é um objeto que tem a propriedade `exports`. Essa propriedade inicialmente aponta para o objeto vazio criado por require, mas pode ser sobrescrita com outro valor para exportar algo a mais.

```
function require(name) {
  if (name in require.cache)
    return require.cache[name];

  var code = new Function("exports, module", readFile(name));
  var exports = {}, mod = {exports: exports};
  code(exports, mod);

  require.cache[name] = module.exports;
  return module.exports;
}
require.cache = Object.create(null);
```

Agora temos um sistema de módulo que usa uma simples variável global (`require`) para permitir que módulos encontrem e usem um ao outro sem ter que ir para o escopo global.

Este estilo de sistema de módulos é chamado "Módulos CommonJS", após o pseudo-padrão que o implementou pela primeira vez. Ele também é feito dentro do Node.js. Implementações reais fazem bem mais do que o exemplo que eu mostrei. Mais importante, eles tem uma forma muito mais inteligente de ir de um nome de módulo para uma parte de código real, permitindo ambos caminhos relativos e nomes de módulos registrados "globalmente".

## Carregando módulos lentamente

Embora seja possível usar a técnica acima para carregar JavaScript no navegador, isso é um pouco complicado. A razão para isso é que ler um arquivo (módulo) na web é muito mais lento que ler este mesmo arquivo do seu disco rígido. JavaScript no navegador é obrigado a se comportar de tal forma que, enquanto um script esteja rodando, nada mais pode acontecer no site que ele está rodando. Isso significa que se todas as chamadas `require` carregarem algo em algum servidor web distante, a página vai ficar congelada por um doloroso longo período durante sua inicialização.

Existem maneiras de se trabalhar isso, por exemplo, rodando outro programa (como o Browserify) em seu programa antes, que irá concatenar todas as dependências olhando todas as chamadas `require`, e colocando-as em juntas em um grande arquivo.

Outra solução é encapsular seu módulo em uma função, carregar os módulos que ela depende em segundo plano, e apenas rodas essa função quando todas suas dependências forem carregadas. Isso é o que o sistema de módulos AMD ("Asynchronous Module Definition") faz.

Nosso programa trivial com dependências, em AMD, se parece com isso:

```
define(["weekDay", "today"], function(weekDay, today) {
  console.log(weekDay.name(today.dayNumber()));
});
```

A função `define` é o conceito central nessa abordagem. Ela primeiro recebe um array com nomes de módulos, e então uma função que recebe um argumento para cada dependência. Ela vai carregar as dependências (se elas ainda não tiverem sido carregadas) em segundo plano, permitindo que a página continue a trabalhar em quanto está esperando. Uma vez que todas as dependências estejam carregadas, ela vai carregar a função que foi passada, com as interfaces das dependências como argumentos.

Os módulos que são carregados dessa forma devem conter uma chamada a `define`. O valor usado para sua interface é qualquer valor retornado pela função que é o segundo argumento passado nessa chamada. Aqui está o módulo `weekDay` de novo.

```
define([], function() {
  var names = ["Sunday", "Monday", "Tuesday", "Wednesday",
               "Thursday", "Friday", "Saturday"];
  return {
    name: function(number) { return names[number]; },
    number: function(name) { return names.indexOf(name); }
  };
});
```

Para mostrar uma simples implementação de `define`, vamos supor que também temos uma função `backgroundReadFile`, que pega o nome do arquivo e uma função, e vai chamar a função com o conteúdo do arquivo assim que este for carregado.

```
function define(depNames, moduleFunction) {
  var deps = [], myMod = define.currentModule;

  depNames.forEach(function(name) {
    if (name in define.cache) {
      var depMod = define.cache[name];
    } else {
      var depMod = {exports: null,
                    loaded: false,
                    onLoad: []};
      define.cache[name] = depMod;
      backgroundReadFile(name, function(code) {
        define.currentModule = depMod;
        new Function("", code)();
      });
    }
    deps.push(depMod);
    if (!depMod.loaded)
      depMod.onLoad.push(runIfDepsLoaded);
  });

  function runIfDepsLoaded() {
    if (!deps.every(function(m) { return m.loaded; }))
      return;

    var args = deps.map(function(m) { return m.exports; });
    var exports = moduleFunction.apply(null, args);
    if (myMod) {
      myMod.exports = exports;
      myMod.loaded = true;
      myMod.onLoad.every(function(f) { f(); });
    }
  }
  runIfDepsLoaded();
}
define.cache = Object.create(null);
```

Isso é muito mais difícil de seguir que a função `require`. Sua execução não segue um caminho simples e previsível. Ao invés disso, múltiplas operações são definidas para acontecerem em algum tempo não especificado no futuro (quando o módulo for carregado), que obscurece a forma que o código é executado.

O maior problema que este código lida é coletar os valores das interfaces das dependências do módulo. Para rastrear os módulos, e seus estados, um objeto é criado para cada módulo que é carregado por `define`. Este objeto armazena o valor exportado pelo módulo, um booleano indicando se o módulo já foi completamente carregado e um array de funções para ser chamado quando o módulo tiver sido carregado.

Um *cache* é usado para prevenir o carregamento de módulos múltiplas vezes, assim como fizemos para o `require`. Quando `define` é chamada, nós primeiro construímos um array de módulos de objetos que representam as dependências deste módulo. Se o nome da dependência corresponde com o nome de um módulo *cacheado*, nós usamos o objeto existente. Caso contrário, nós criamos um novo objeto (com o valor de `loaded` igual a `false`) e armazenamos isso em cache. Nós também começamos a carregar o módulo, usando a função `backgroundReadFile`. Uma vez que o arquivo tenha sido carregado, seu conteúdo é rodado usando o construtor `Function`.

É assumido que este arquivo também contenha uma (única) chamada a `define`. A propriedade `define.currentModule` é usada para informar a esta chamada sobre o módulo objeto que está sendo carregado atualmente, dessa forma podemos atualizá-lo umas vez e terminar o carregamento.

Isso é manipulado na função `runIfDepsLoaded`, que é chamada uma vez imediatamente (no caso de não ser necessário carregar nenhuma dependência) e uma vez para cada dependência que termina seu carregamento. Quando todas as dependências estão lá, nós chamamos `moduleFunction`, passando para ela os valores exportados apropriados. Se existe um módulo objeto, o valor retornado da função é armazenado, o objeto é marcado como carregado (*loaded*), e as funções em seu array `onLoad` são chamadas. Isso vai notificar qualquer módulo que esteja esperando que suas dependências sejam carregadas completamente.

Uma implementação real do AMD é, novamente, bem mais inteligente em relação a resolução dos nomes e suas URLs, e genericamente mais robusta. O projeto RequireJS (http://requirejs.org) fornece uma implementação popular deste estilo que carregamento de módulos.

## Interface design

Designing interfaces for modules and object types is one of the subtler aspects of programming. Any non-trivial piece functionality can be modeled in different ways. Finding a way that works well requires insight and foresight.

The best way to learn the value of good interface design is to use lots of interfaces, some good, some horrible. Experience will teach you what works and what doesn’t. Never assume that a painful interface is “just the way it is”. Fix it, or wrap it in a new interface that works better for you.

### Predictability

If programmers can predict the way your interface works, they (or you) won’t get sidetracked as often by the need to look up how to work with it. Thus, try to follow conventions (for example when it comes to capitalization of names). When there is another module or part of the standard JavaScript environment that does something similar to what you are implementing, it might be a good idea to make your interface resemble the existing interface. That way, people who know the existing interface will feel right at home.

Another area where predictability is important is the actual behavior of your code. It can be tempting to pile up cleverness with the justification that it makes the interface convenient to use. For example, by accepting all kinds of different types and combinations of arguments, and doing “the right thing” for all of them, or providing dozens of specialized “convenience” functions that provide slightly different flavors of your module’s functionality. These might make code that builds on your interface slightly shorter, but they will also make it much harder for people to keep a mental model of the module’s behavior in their head.

### Composability

In your interfaces, try to use the simplest data structures that work and make functions do a single, clear thing—whenever practical, make them pure functions (see Chapter 3).

For example, it is not uncommon for modules to provide their own array-like collection objects, with their own interface for counting and extracting elements. Such objects won’t have map or forEach methods, and any existing function that expects a real array won’t be able to work with them. This is an example of bad composability—the module cannot be easily composed with other code.

Another example would be a module for spell-checking text, which we might need when we want to write a text editor. The spell-checker could be made to operate directly on whichever complicated data structures the editor uses, and directly call internal functions in the editor to have the user choose between spelling suggestions. If we go that way, the module cannot be used with any other programs. On the other hand, if we define the spell-checking interface so that you can pass it a simple string and it will return the position in the string where it found a possible misspelling, along with an array of suggested corrections, then we have an interface that could also be composed with other systems, because strings and arrays are always available.

### Layered interfaces

When designing an interface for a complex piece of functionality—say, sending email—you often run into something of a dilemma. On the one hand, you do not want to overload the user of your interface with details. They shouldn’t have to study your interface for 20 minutes before they can send an email. On the other hand, you do not want to hide all the details either—when people need to do complicated things with your module, that should also be possible.

Often the solution is to provide two interfaces: a detailed “low-level” one for complex situations and a simple “high-level” one for routine use. The second one can usually be built very easily using the tools provided by the first one. In the email module, the high-level interface could just be a function that takes a message, a sender address, and a receiver address, and sends the email. The low-level interface would allow full control over email headers, attachments, sending HTML mail, and so on.

## Summary

Modules provide such structure to bigger programs, by separating the code into different files and namespaces. Giving these modules well-defined interfaces makes it easier to use them, reuse them in different contexts, and keep using them as the module itself evolves.

Though the JavaScript language itself is characteristically unhelpful when it comes to modules, the flexible functions and objects it provides make it possible to define rather nice module systems. Function scopes can be used as internal namespaces for the module, and objects can be used to store sets of exported values.

There are two popular, well-defined approaches to such modules. One is called “CommonJS Modules”, and revolves around a require function that fetches a module by name and returns its interface. The other is called “AMD”, and uses an asynchronous define function that takes an array of module names and a function, and, after loading the modules, runs the function with their interfaces as arguments.

## Exercises

### Month names

Write a simple module similar to the weekDay module, which can convert month numbers (zero-based, as in the Date type) to names, and names back to numbers. Give it its own namespace, since it will need an internal array of month names, but use plain JavaScript, without any module loader system.

```
// Your code here.

console.log(month.name(2));
// → March
console.log(month.number("November"));
// → 10
```

This follows the weekDay module almost exactly. An anonymous function, called immediately, wraps the variable that holds the array of names, along with the two functions that must be exported. The functions are put in an object, and returned. The returned interface object is stored in the month variable.

### Circular dependencies

A tricky subject in dependency management is circular dependencies, where module A depends on B, and B also depends on A. Many module systems simply forbid this. CommonJS allows a limited form of this, where it works as long as the modules do not replace their default exports object with another value, and only start accessing each other’s interface after they finish loading.

Can you think of a way in which support for this feature could be implemented? Look back to the definition of require, and consider what the could would have to do to allow this.

The trick is to add the exports object created for a module to require's cache before actually running the module. This means the module will not yet have had a chance to override module.exports, so we do not know whether it may want to export some other value. After loading, the cache object is overridden with module.exports, which may be a different value.

But if, in the course of loading the module, a second module is loaded that asks for the first module, its default exports object, likely still empty at this point, will be in the cache, and the second module will receive a reference to it. If it doesn’t try to do anything with the object until the first module has finished loading, things will work.

### A return to electronic life

Hoping that Chapter 7 is still somewhat fresh in your mind, think back to the system designed in that chapter and come up with a separation into modules of the code. To refresh your memory, these are the functions and types defined in that chapter, in order of appearance.

- Point
- Grid
- directions
- randomElement
- BouncingCritter
- elementFromChar
- World
- charFromElement
- Wall
- View
- directionNames
- WallFollower
- dirPlus
- LifeLikeWorld
- Plant
- PlantEater
- SmartPlantEater
- Tiger

Do not exaggerate and create too many modules. A book that starts a new chapter for every page would probably get on your nerves, if only because of all the space wasted on titles. Similarly, having to open ten files to read a tiny project isn’t helpful. Aim for three to five modules.

You can choose to have some functions become internal to their module, and thus inaccessible to other modules.

There is no single correct solution here. Module organization is largely a matter of taste.

Here is what I came up with. I’ve put parentheses around internal functions.

- Module "grid"
	+ Point
	+ Grid
	+ directions
- Module "world"
	+ (randomElement)
	+ (elementFromChar)
	+ (charFromElement)
	+ View
	+ World
	+ LifeLikeWorld
	+ directions [re-exported]
- Module "simple_ecosystem"
	+ (randomElement) [duplicated]
	+ (directionNames)
	+ (dirPlus)
	+ Wall
	+ BouncingCritter
	+ WallFollower
- Module "ecosystem"
	+ Wall [duplicated]
	+ Plant
	+ PlantEater
	+ SmartPlantEater
	+ Tiger

I have re-exported the directions array from the grid module from world, so that modules built on that (the ecosystems) don’t have to know or worry about the existence of the grid module.

I also duplicated two generic and tiny helper values (randomElement and Wall) since they are used as internal details in different contexts, and do not belong in the interfaces for these modules.


