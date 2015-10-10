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

## Functions as namespaces

Functions are the only construct in JavaScript that creates a new scope. So if we want our modules to have their own scope, we will have to base them on functions somehow.

Consider this trivial module for associating names with the day-of-the-week numbers returned by a date object’s getDay method:

```
var names = ["Sunday", "Monday", "Tuesday", "Wednesday",
             "Thursday", "Friday", "Saturday"];
function dayName(number) {
  return names[number];
}

console.log(dayName(1));
// → Monday
```

The dayName function is part of its interface, but the names variable is not. We would prefer not to spill it into the global scope.

We can do this:

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

Now names is a local variable in an (anonymous) function. This function is created and immediately called, and its return value (the actual dayName function) is stored in a variable. We could have pages and pages of code in this function, creating a hundred local variables. They would all be internal to our module, visible to the module itself, but not to outside code.

A similar pattern is used to isolate code from the outside world entirely. The module below just has some effect, but does not actually provide any values for other modules to use.

```
(function() {
  function square(x) { return x * x; }
  var hundred = 100;

  console.log(square(hundred));
})();
// → 10000
```

This code simply outputs the square of one hundred (in the real world, it could be a module that adds a method to some prototype, or sets up some widget on a web page). It wraps its code in a function to, again, prevent the variables it uses internally from sitting in the global scope.

Why is the namespace function wrapped in a pair of parentheses? This has to do with a quirk in JavaScript’s syntax. If an expression starts with the keyword function, it is a function expression. However, if a statement starts with that keyword, it is a function declaration, which requires a name and cannot be immediately called. Even though a statement may start with an expression, the second rule takes precedence, and if the extra parentheses were left out in the example above, it would produce a syntax error. You can think of them as a trick to force the language to understand that we are writing an expression.

## Objects as namespaces

Now imagine that the day-of-the-week module needs to provide not one, but two functions, because we add a dayNumber function that goes from a name to a number. We can’t simply return the function anymore, but must wrap the two functions in an object.

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

For bigger modules, gathering all the exported values into an object at the end of the function becomes awkward, and often requires us to repeat ourselves. This can be improved by declaring an object, usually named exports, and adding properties to that whenever we are defining something that needs to be exported. This object can then be returned, or accepted as a parameter and stored somewhere by the code outside the module.

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

## Detaching from the global scope

The above pattern is commonly used by JavaScript modules intended for the browser. They will claim a single, known global name, and wrap their code in a function in order to have their own private namespace.

There is still a problem when multiple modules happen to claim the same name, or when you want, for whatever reason, to load two versions of a module alongside each other.

With a little plumbing, we can create a system that allows modules to directly ask for the interface objects of other modules they need access to, without going through the global scope. This solves the problems mentioned above, and has the added benefit of being explicit about those dependencies, making it harder to accidentally use some module without stating that you need it.

Our goal is a function require which, when given a module name, will load that file (from disk or the web, depending on the platform we are running on), and return the appropriate interface value.

For this we need at least two things. Firstly, we will imagine that we have a function readFile (which is not present in standard JavaScript), which returns the content of the file with the given name. There are ways to access the web from JavaScript in the browser, and to access the hard disk from other JavaScript platforms, but they are more involved. For now, we just pretend we have this simple function.

Secondly, we need to be able, when we have a string containing code (as read from the file), to actually execute this code as a JavaScript program.

## Evaluating data as code

There are several ways to take data (a string of code) and run it in the context of the current program.

The most obvious is the special standard operator eval, which will execute a string of code in the current scope. That is usually a rather bad idea, because it breaks some of the sane properties that scopes normally have (being isolated from the outside world, most notably).

```
function evalAndReturnX(code) {
  eval(code);
  return x;
}

console.log(evalAndReturnX("var x = 2"));
// → 2
```

A better way of converting data into program is to use the Function constructor. This takes as arguments first a string containing a comma-separated list of argument names, and then a string containing the function’s body.

```
var plusOne = new Function("n", "return n + 1;");
console.log(plusOne(4));
// → 5
```

This is precisely what we need—we can wrap the code for a module in a function, with that function’s scope becoming our module scope.

## Require

If the new Function constructor, used by our module loader, wraps the code in a function anyway, we can omit the actual wrapping namespace function from the files itself. We will also make exports an argument to the module function, so that the module does not have to declare it. That removes a lot of the superfluous noise from our example module:

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

The following is a very minimal implementation of require:

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

When using this system, a module typically starts with a few variable declarations that load the modules it depends on.

```
var weekDay = require("weekDay");
var today = require("today");

console.log(weekDay.name(today.dayNumber()));
```

The simplistic implementation of require given above has several problems. For one, it will load and run a module every time it is require-d, so if several modules have the same dependency, or a require call is put inside of a function that will be called multiple times, time and energy will be wasted.

This can be solved by storing the modules that have already been loaded in an object, and simply returning the existing value if they are loaded again.

The second problem is that it is not possible for a module to directly export a single value. For example, a module might want to only export the constructor of the object type it defines. Right now, it can not do that, because require always uses the exports object it creates as the exported value.

The traditional solution for this is to provide another variable, module, which is an object that has a property exports. This property initially points at the empty object created by require, but can be overwritten with another value in order to export something else.

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

We now have a module system that uses a single global variable (require) to allow modules to find and use each other without going through the global scope.

This style of module system is called CommonJS Modules, after the pseudo-standard that first specified it. It is built into the node.js system. Real implementations do a lot more than the example I showed. Most importantly, they have a much more intelligent way of going from a module name to an actual piece of code, allowing both relative paths and “globally” registered module names.

## Slow-loading modules

Though it is possible to use the style above in JavaScript written for the browser, it is somewhat involved. The reason for this is that reading a file (module) from the web is a lot slower than reading it from your hard disk. Browser JavaScript is required to behave in such a way that, while a script is running, nothing else can happen to the web site in which it runs. This means that if every require call would go and load something from some far-away web server, the page would freeze for a painfully long time during startup.

There are ways to work around this, for example by running another program (such as Browserify) on your program in advance, which would gather all the dependencies by looking for calls to require, and put everything together in a big file.

Another solution to wrap your module in a function, load the modules it depends on in the background, and only run this function when all its dependencies have been loaded. That is what the “Asynchronous Module Definition” (AMD) style of module system does.

Our trivial program with dependencies, in AMD, would looks like this:

```
define(["weekDay", "today"], function(weekDay, today) {
  console.log(weekDay.name(today.dayNumber()));
});
```

The define function is the central concept in this approach. It takes first an array of module names, and then a function that takes one argument for each dependency. It will load the dependencies (if they haven’t already been loaded) in the background, allowing the page to continue working while it is waiting. Once all dependencies are loaded, it will call the function it was given, with the interfaces of those dependencies as arguments.

The modules that are loaded this way must themselves contain a call to define. The value used as their interface is whatever was returned by the function that is the second argument in this call. Here is the weekDay module again.

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

In order to show a simple implementation of define, let us pretend we also have a backgroundReadFile function, which takes a file name and a function, and will call the function with the content of the file as soon as it has finished loading it.

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

This is a lot harder to follow than the require function. Its execution does not follow a simple, predictable path. Instead, multiple operations are set up to happen at some unspecified time in the future (when modules finish loading), which obscures the way the code executes.

The main problem this code deals with is gathering the interface values for the module’s dependencies. To track modules, and their state, an object is created for each module that is loaded by define. This object stores the module’s exported value, a boolean indicating whether the module has fully loaded already, and an array of function to call when the module does finish loading.

A cache is used to prevent loading modules multiple time, just like we did for require. When define is called, we first build up an array of module objects that represent the dependencies of this module. If the name of a dependency corresponds to a cached module, we use the existing object. Otherwise, we create a new object (with loaded set to false) and store that in the cache. We also start loading the module, using the backgroundReadFile function. Once the file has loaded, its content is run using the Function constructor.

It is assumed that this file also contains a (single) call to define. The define.currentModule property is used to tell this call about the module object that is currently being loaded, so that we can update it once it finishes loading.

This is handled in the runIfDepsLoaded function, which is called once immediately (in case no dependencies need to be loaded) and once for every dependency that finishes loading. When all dependencies are there, we call the moduleFunction, passing it the appropriate exported values. If there is a current module object, the return value from the function is stored in there, the object is marked as loaded, and the functions in its onLoad array are called. This will notify any modules that are waiting for this one that their dependency has finished loading.

A real AMD implementation is, again, quite a lot more clever about resolving module names to actual URLs, and generally more robust. The RequireJS (http://requirejs.org) project provides a popular implementation of this style of module loader.

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


