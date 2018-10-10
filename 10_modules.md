{{meta {load_files: ["code/packages_chapter_10.js", "code/chapter/07_robot.js"]}}}

# Módulos

{{quote {author: "Tef", title: "Programming is Terrible", chapter: true}

Escreva código que seja fácil de deletar, difícil de estender.

quote}}

{{index organization, "code structure", "Yuan-Ma", "Book of Programming"}}

O programa ideal tem uma estrutura limpa como cristal. É fácil de explicar como funciona
e cada parte tem um papel bem definido.

{{index "organic growth"}}

Um programa real típico cresce organicamente. Novas funcionalidades são adicionadas
conforme novas necessidades surgem. Estruturação e preservação da estrutura é um
trabalho adicional, trabalho que será pago somente no futuro, da próxima vez que 
alguém trabalhar no programa. Então é tentador negligenciar isso e permite as partes
do programa ficarem profundamente confusas.

{{index readability, reuse, isolation}}

Isso causa dois problemas práticos. Primeiro, entender este sistema é difícil. Se 
tudo puder tocar todo o resto, é difícil olhar uma determinada parte isolada. Você
é forçado a construir uma compreensão holística de toda coisa. Segundo, se você quer 
usar qualquer funcionalidade do programa em outra situação, re-escrever será mais
fácil do que tentar desenrolar a função de seu contexto.

O termo "((grande bola de lama))" geralmente é usado para programas grandes e sem 
estrutura. Tudo fica junto e quando você tenta pegar uma parte, toda a coisa despenca 
e você fica com as mãos sujas.

## Módulos

{{index dependency}}

_Módulos_ são uma tentativa de evitar estes problemas. Um ((módulo)) é uma parte de 
programa que especifica quais partes ele depende (são as _dependências_) em que as 
funcionalidades ele fornece para outros módulos (são as _((interfaces))_).

{{index "big ball of mud"}}

Interfaces de módulo têm muito em comum com interfaces de objetvo como vimos no 
[Capítulo ?](object#interface). Eles fazem parte do módulo disponível no mundo 
externo e mantém o resto privado. Restringindo o modo como os módulos interagem entre 
si, o sistema fica mais parecido com ((Lego)), onde as peças interagem através de 
conectores bem definidos e menos como lama, onde tudo se mistura.

{{index dependency}}

A relação entre módulos é chamada dependência. Quando um módulo precisa de outro 
módulo, é dito que ele depende daquele módulo. Quando este fato é claramente 
especificado no próprio módulo, pode ser utilizado para descobrir quais módulos 
devem estar presentes para que o módulo desejado seja utilizado e carregar automaticamente 
suas dependências.

Para separar módulos desta forma, cada um precisa de sua privacidade ((escopo)).

Apenas colocando seus arquivos JavaScript em diferentes ((arquivo))s não satisfaz esses 
requerimentos. Os arquivos ainda compartilham o mesmo _namespace_ global. Eles podem, 
intencionalmente ou acidentalmente, interferir uns com os outros e a estrutura de 
dependência permanece escondida. Podemos fazer melhor, como veremos mais tarde neste 
capítulo.

{{index design}}

Definir uma estrutura de módulo para um programa pode ser difícil. Na fase onde você 
está ainda explorando o problema, testar soluções diferentes para ver qual irá funcionar, 
você pode querer não se preocupar tanto com isso, pois pode ser uma grande distração. 
Quando você tiver algo que parece definitivo, é um bom momento dar um passo atrás e 
organizar o programa.

## Pacotes

{{index bug, dependency, structure, reuse}}

Uma das vantagens de construir um programa separando por partes e sendo possível executar 
essas partes separadamente é que você é capaz de executar as mesmas partes em diferentes 
programas.

{{index "parseINI function"}}

Mas como você faz isso? Digamos que eu queira usar a função `parseINI` do 
[Capítulo ?](regexp#ini) em outro programa. Se está claro no que esta função depende 
(neste caso, nada), podemos simplesmente copiar todo código necessário no novo projeto. 
Mas então se eu encontrar um erro no código, provavelmente irei corrigir no programa em
que estarei trabalhando e esqueço de corrigir no código de onde copiei.

{{index duplication, "copy-paste programming"}}

Quando você começa a duplicar código, se verá rapidamente perdendo tempo e energia movendo 
cópias e as mantendo atualizadas.

Aí que entram os _((pacotes))_. Um pacote é um pedaço de um código que pode ser 
distribuído (copiado e instalado). Pode conter um ou mais módulos e possui informação 
sobre outros pacotes que ele depende. Um pacote também costuma vir com documentação 
explicando o que ele faz, assim pessoas que não o escreveram também poderão utilizá-lo.

Quando um problema é encontrado no pacote ou uma nova funcionalidade é adicionada, o 
pacote é atualizado. Agora o programa que depende dele (que também podem ser pacotes) 
podem ser atualizados ((versão)).

{{id modules_npm}}

{{index installation, upgrading, "package manager", download, reuse}}

Trabalhar desta forma requer ((infra-estrutura)). Precisamos de um lugar para armazenar 
e encontrar os pacotes e uma forma conveniente de instalar e atualizá-los. No mundo 
JavaScript, essa infra-estrutura é fornecida pelo ((NPM)) ([_npmjs.org_](https://npmjs.org)).

NPM é duas coisas: um serviço online onde podemos fazer download (e upload) dos pacotes 
e programas (juntos com Node.js) que ajudam a instalá-los e gerenciá-los.

{{index "ini package"}}

No momento em que este texto foi escrito, há próximo de 1 milhão de diferentes pacotes 
disponíveis no NPM. Uma grande parte é lixo, devo dizer, mas quase todos os pacotes 
úteis estão disponíveis lá. Por exemplo, a função INI file parser, similar ao que 
foi construído no [Capítulo ?](regexp) está disponível como pacote `ini`.

[Capítulo ?](node) irá mostrar como instalar estes pacotes usando linha de comando 
`npm`.

Ter pacotes de alta qualidade disponíveis é extremamente valioso. Isso quer dizer 
que normalmente podemos evitar de ter que inventar um programa que diversas pessoas já 
escreveram antes e ter uma sólida e bem testada implementação apenas apertando 
alguns botões.

{{index maintenance}}

É barato copiar software, então quando alguém já escreveu, distribuir para outras 
pessoas é um processo eficiente. Escrevê-lo da primeira vez que _é_ o trabalho e 
responder a pessoas que encontraram problemas no código ou querem propor novas 
funcionalidades, é ainda mais trabalho.

Por padrão, você possui o ((copyright)) do seu código e outras pessoas podem apenas 
usá-lo com sua permissão. Mas como algumas pessoas são legais e porque publicar 
bons softwares podem te deixar um pouco mais famoso entre programadores, muitos 
pacotes são publicados sobre a ((licença)) que explicitamente permitem outras pessoas 
a utilizá-los.

A maioria dos códigos do ((NPM)) possui este tipo de licença. Algumas licenças 
requerem que você publique o código que você criou utilizando o pacote baixado 
sobre a mesma licença. Outros são menos exigentes, apenas requerindo que você 
mantenha a licença com o código conforme você o distribui. A maioria da comunidade 
JavaScript usa o último tipo de licença. Quando utilizar o pacote de outras pessoas, 
tenha certeza de conhecer sua licença.

## Improvised modules

Até 2015, a linguagem JavaScript não possuía nenhum sistema de módulos embutido. No
entanto, as pessoas têm construído grandes sistemas em JavaScript ao longo de uma
década, embora precisassem dos ((módulo))s.

{{index [function, scope]}}

Então desenvolveram seus próprios ((sistema de módulo))s para a linguagem. Você pode
usar as funções JavaScript para criar escopos locais e ((objeto))s para representar
sa interfaces de ((módulo))s.

{{index "Date class", "weekDay module"}}

Este é um módulo que irá entre os nomes e números dos dias (retornando como `Date` 
pelo método `getDate` ). Sua interface consiste do `weekDay.name` e `weekDay.Number`
e esconde sua ligação local `name` dentro do escopo da função que é imediatamente
chamada.

```
const weekDay = function() {
  const names = ["Sunday", "Monday", "Tuesday", "Wednesday",
                 "Thursday", "Friday", "Saturday"];
  return {
    name(number) { return names[number]; },
    number(name) { return names.indexOf(name); }
  };
}();

console.log(weekDay.name(weekDay.number("Sunday")));
// → Sunday
```

{{index dependency}}

Este estilo de módulos fornece ((isolamento)), até um certo poto, mas não declara 
dependências. Ao invés disso, apenas coloca sua ((interface)) no ((escopo global))
e espera suas dependências, se houver, que façam o mesmo. Por muito tempo esta foi 
a principal abordagem utilizada na programação web, mas a maior parte é obsoleta 
agora.

Se quiseremos fazer as relações de dependência parte do código, teremos que tomar 
controle das dependências de carregamento. Fazer isso requer ser capaz de executar
strings no código. JavaScript pode fazer isso.

{{id eval}}

## Evaluating data as code

{{index evaluation, interpretation}}

Há várias formas de obter dados (uma string de código) e executar como parte do 
programa atual.

{{index isolation, eval}}

A forma mais óbvia é com o operator especial `eval`, que irá executar uma string
no _atual_((escopo)). Geralmente é uma má idéia porque quebra algumas propriedades
que o escopo possui normalmente, tal como sendo facilmente previsível qual ligação
a qual um dado nome se refere.

```
const x = 1;
function evalAndReturnX(code) {
  eval(code);
  return x;
}

console.log(evalAndReturnX("var x = 2"));
// → 2
```

{{index "Function constructor"}}

Uma forma menos pavorosa de interpretar dados como código é utilizar `Function`
construtora. Ela leva dois argumentos: uma string contendo uma lista de nome de
argumentos separada por vírgula e uma string contendo o corpo da função.

```
let plusOne = Function("n", "return n + 1;");
console.log(plusOne(4));
// → 5
```

Isso é precisamente o que precisamos para um sistema de módulos. Podemos envolver
o código do módulo em uma função e usar o escopo dessa função como o ((escopo))
do módulo.

## CommonJS

{{id commonjs}}

{{index "CommonJS modules"}}

A abordagem mais utilizada de utilizar os módulos JavaScript é chamado 
_módulos JS comuns_. ((Node.js)) utiliza e é o sistema mais utilizado pelos pacotes
((NPM)).

{{index "require function"}}

O coneceito principal nós módulos JS comuns é uma função chamada `require`. 
Quando esta função é chamada com o nome do módulo de uma dependência, ele garante
que o módulo é carrgeado e retorna sua ((interface)).

{{index "exports object"}}

Como o carregamento envolve o código do módulo em uma função, módulos automaticamente
pegam seu próprio escopo local. A única coisa que eles têm que fazer é chamar 
`require` para acessar suas dependências e colocar sua interface no objeto ligado
ao `exports`.

{{index "formatDate module", "Date class", "ordinal package", "date-names package"}}

Este exemplo de módulo fornece uma função de formatação de data. Ele utiliza
dois ((pacotes))s do NPM-`ordinal` para converter os números em strings como `"1st`
e `"2nd` e `date-names` para pegar os nomes em inglês dos dias da semana e meses.
Ele exporta uma única função `formatDate`, que recebe um objeto `Date` e uma
string ((template)).

O template da String pode conter códigos que direcionam o formato, como `YYYY` para 
o ano completo e `Do` para o número ordinal do dia do mês. Você pode passar uma 
string como `"MMMM Do YYYY"`para receber um retorno como "Novembro 22nd 2017".

```
const ordinal = require("ordinal");
const {days, months} = require("date-names");

exports.formatDate = function(date, format) {
  return format.replace(/YYYY|M(MMM)?|Do?|dddd/g, tag => {
    if (tag == "YYYY") return date.getFullYear();
    if (tag == "M") return date.getMonth();
    if (tag == "MMMM") return months[date.getMonth()];
    if (tag == "D") return date.getDate();
    if (tag == "Do") return ordinal(date.getDate());
    if (tag == "dddd") return days[date.getDay()];
  });
};
````

{{index "destructuring binding"}}

A interface do `ordinal` é uma única função, enquanto `date-names` 
exporta um objeto contendo múltiplas coisas - os dois valores que
usamos são um array de nomes. Desestruturar é muito conveninente 
quando estamos criando ligações para interfaces importadas.

O módulo adiciona sua função de interface to `exports`, então o 
módulo que depende disso ganhará acesso. Podemos utilizar o módulo
deste forma:

```
const {formatDate} = require("./format-date");

console.log(formatDate(new Date(2017, 9, 13),
                       "dddd the Do"));
// → Friday the 13th
```

{{index "require function", "CommonJS modules", "readFile function"}}

{{id require}}

Podemos definir `require` na sua forma mínima, conforme abaixo:

```{test: wrap, sandbox: require}
require.cache = Object.create(null);

function require(name) {
  if (!(name in require.cache)) {
    let code = readFile(name);
    let module = {exports: {}};
    require.cache[name] = module;
    let wrapper = Function("require, exports, module", code);
    wrapper(require, module.exports, module);
  }
  return require.cache[name].exports;
}
```

Neste código, `readFile` é uma função inventada que irá lê um arquivo
e retornará seu conteúdo como string. JavaScript não fornece esta 
funcionalidade - mas ambientes JavaScript diferente, como browser e 
Node.js, fornece seu próprio modo de acessar ((file))s. O exemplo apenas
assume que `readFiles` existe.

{{index cache, "Function constructor"}}

Para evitar carregar o mesmo módulo várias vezes, `require` mantém um
armazenamento (cache) de módulos já carregados. Quando chamado, verifica
primeiro se o módulo requerido já foi carregado e se não, o carrega.
Isso envolve ler o código do módulo, envolvê-lo em uma função e chamá-lo.

{{index "ordinal package", "exports object", "module object"}}

A ((interface)) do pacote `ordinal` que vimos anteriormente não é um objeto,
mas sim uma função. Uma peculiaridade dos módulos CommonJS é que embora o 
sistema modular crie um objeto de interface vazio para você (vinculado ao 
`exports`), podemos substituir com qualquer valor sobrescrevendo
`module.exports`. Isso é feito por muitos módulos para exportar um único 
valor ao invés da interface objeto.

Definindo `require`, `exports` e `module` como ((parameter))s para a função
wrapper gerada (e passando os valores apropriados quando invocada), o 
carregamento garante que essas conexões estão disponíveis no módulo ((scope)).

{{index resolution, "relative path"}}

The way the string given to `require` is translated to an actual file
name or web address differs in different systems. When it starts with
`"./"` or `"../"`, it is generally interpreted as relative to the
current module's file name. So `"./format-date"` would be the file
named `format-date.js` in the same directory.

When the name isn't relative, Node.js will look for an installed
package by that name. In the example code in this chapter, we'll
interpret such names as refering to NPM packages. We'll go into more
detail on how to install and use NPM modules in [Chapter ?](node).

{{id modules_ini}}

{{index "ini package"}}

Now, instead of writing our own INI file parser, we can use one from
((NPM)):

```
const {parse} = require("ini");

console.log(parse("x = 10\ny = 20"));
// → {x: "10", y: "20"}
```

## ECMAScript modules

((CommonJS modules)) work quite well, and in combination with NPM they
have allowed the JavaScript community to start sharing code on a large
scale.

{{index "exports object", linter}}

But they remain a bit of a duct-tape ((hack)). The ((notation)) is
slightly awkward—the things you add to `exports` are not available in
the local ((scope)), for example. And because `require` is a normal
function call taking any kind of argument, not just a string literal,
it can be hard to determine the dependencies of a module without
running its code.

{{index "import keyword", dependency, "ES modules"}}

{{id es}}

This is why the JavaScript standard from 2015 introduces its own,
different module system. It is usually called _((ES modules))_, where
_ES_ stands for ((ECMAScript)). The main concepts of dependencies and
interfaces remain the same, but the details differ. For one thing, the
notation is now integrated into the language. Instead of calling a
function to access a dependency, you use a special `import` keyword.

```
import ordinal from "ordinal";
import {days, months} from "date-names";

export function formatDate(date, format) { /* ... */ }
```

{{index "export keyword", "formatDate module"}}

Similarly, the `export` keyword is used to export things. It may
appear in front of a function, class, or binding definition (`let`,
`const`, or `var`).

An ES module's interface is not a single value, but a set of named
((binding))s. The above module binds `formatDate` to a function. When
you import from another module, you import the _binding_, not the
value, which means an exporting module may change the value of the
binding at any time, and the modules that import it will see its new
value.

{{index "default export"}}

When there is a binding named `default`, it is treated as the module's
main exported value. If you import a module like `ordinal` in the
example, without braces around the binding name, you get its `default`
binding. Such modules can still export other bindings under different
names alongside their `default` export.

To create a default export, you write `export default` before an
expression, a function declaration, or a class declaration.

```
export default ["Winter", "Spring", "Summer", "Autumn"];
```

It is possible to rename imported binding using the word `as`.

```
import {days as dayNames} from "date-names";

console.log(dayNames.length);
// → 7
```

At the time of writing, the JavaScript community is in the process of
adopting this module style. But this has been a slow process. It took
a few years, after the format was specified, for browsers and Node.js
to start supporting it. And though they mostly support it now, this
support still has issues, and the discussion on how such modules
should be distributed through ((NPM)) is still ongoing.

Many projects are written using ES modules, and then automatically
converted to some other format when published. We are in a
transitional period in which two different module systems are used
side-by-side, and it is useful to be able to read and write code in
either of them.

## Building and bundling

{{index compilation, "type checking"}}

In fact, many JavaScript projects aren't even, technically, written in
JavaScript. There are extensions, such as the type checking
((dialect)) mentioned in [Chapter ?](error#typing), that are widely
used. People also often start using planned extensions to the language
long before they have been added to the platforms that actually run
JavaScript.

To make this possible, they _compile_ their code, translating it from
their chosen JavaScript dialect to plain old JavaScript—or even to a
past version of JavaScript so that old ((browsers)) can run it.

{{index latency, performance}}

Including a modular program that consists of two hundred different
files in a ((web page)) produces its own problems. If fetching a
single ((file)) over the ((network)) takes 50 milliseconds, loading
the whole program takes ten seconds, or maybe half that if you can
load several files simultaneously. That's a lot of wasted time.
Because fetching a single big file tends to be faster than fetching a
lot of tiny ones, web programmers have started using tools that roll
their programs (which they painstakingly split into modules) back into
a single big file before they publish it to the Web. Such tools are
called _((bundler))s_.

{{index "file size"}}

And we can go further. Apart from the number of files, the _size_ of
the files also determines how fast they can be transferred over the
network. Thus, the JavaScript community has invented _((minifier))s_.
These are tools that take a JavaScript program and make it smaller by
automatically removing comments and whitespace, renaming bindings, and
replacing pieces of code with equivalent code that take up less space.

{{index pipeline, tool}}

So it is not uncommon for the code that you find in an NPM package or
that runs on a web page to have gone through _multiple_ stages of
transformation—converted from modern JavaScript to historic
JavaScript, from ES module format to CommonJS, bundled, and minified.
We won't go into the details of these tools in this book, since they
tend to be boring and change rapidly. Just be aware that the
JavaScript code that you run is often not the code as it was written.

## Module design

{{index [module, design], interface, "code structure"}}

Structuring programs is one of the subtler aspects of programming. Any
nontrivial piece of functionality can be modeled in various ways.

Good program design is subjective—there are trade-offs involved, and
matters of taste. The best way to learn the value of well structured
design is to read or work on a lot of programs and notice what works
and what doesn't. Don't assume that a painful mess is "just the way it
is". You can improve the structure of almost everything by putting
more thought into it.

One aspect of module design is ease of use. If you are designing
something that is intended to be used by multiple people—or even by
yourself, in three months when you no longer remember the specifics of
what you did—it is helpful if your ((interface)) is simple and
predictable.

{{index "ini package", JSON}}

That may mean following existing conventions. A good example is the
`ini` package. This module imitates the standard `JSON` object by
providing `parse` and `stringify` (to write an INI file) functions,
and, like `JSON`, converts between strings and plain objects. So the
interface is small and familiar, and after you've worked with it once,
you're likely to remember how to use it.

{{index "side effect", "hard disk", composability}}

Even if there's no standard function or widely used package to
imitate, you can keep your modules predictable by using simple ((data
structure))s and doing a single, focused thing. Many of the INI file
parsing modules on NPM provide a function that directly reads such a
file from the hard disk and parses it, for example. This makes it
impossible to use such modules in the browser, where we don't have
direct file system access, and adds complexity that would have been
better addressed by _composing_ the module with some file-reading
function.

{{index "pure function"}}

Which points at another helpful aspect of module design—the ease with
which something can be composed with other code. Focused modules that
compute values are applicable in a wider range of programs than bigger
modules that perform complicated actions with side effects. An INI
file reader that insists on reading the file from disk is useless in a
scenario where the file's content comes from some other source.

{{index "object-oriented programming"}}

Relatedly, stateful objects are sometimes useful or even necessary,
but if something can be done with a function, use a function. Several
of the INI file readers on NPM provide an interface style that require
you to first create an object, then load the file into your object,
and finally use specialized methods to get at the results. This type
of thing is common in the object-oriented tradition, and it's
terrible. Instead of making a single function call and moving on, you
have to perform the ritual of moving your object through various
states. And because the data is now wrapped in a specialized object
type, all code that interacts with it has to know about that type,
creating unnecessary interdependencies.

Often defining new data structures can't be avoided—only a few very
basic ones are provided by the language standard, and many types of
data have to be more complex than an ((array)) or a map. But when an
array suffices, use an array.

An example of a slightly more complex data structure is the graph from
[Chapter ?](robot). There is no single obvious way to represent a
((graph)) in JavaScript. In that chapter, we used an object whose
properties hold arrays of strings—the other nodes reachable from that
node.

There are several different path-finding packages on ((NPM)), but none
of them use this graph format. They usually allow the graph's edges to
have a weight, the cost or distance associated with it, which isn't
possible in our representation.

{{index "Dijkstra, Edsger", pathfinding, "Dijkstra's algorithm", "dijkstrajs package"}}

For example, there's the `dijkstrajs` package. A well-known approach
to path finding, quite similar to our `findRoute` function, is called
_Dijkstra's algorithm_, after Edsger Dijkstra, who first wrote it
down. The `js` suffix is often added to package names to indicate the
fact that they are written in JavaScript. This `dijkstrajs` package
uses a graph format similar to ours, but instead of arrays, it uses
objects whose property values are numbers—the weights of the edges.

So if we wanted to use that package, we'd have to make sure that our
graph was stored in the format it expects.

```
const {find_path} = require("dijkstrajs");

let graph = {};
for (let node of Object.keys(roadGraph)) {
  let edges = graph[node] = {};
  for (let dest of roadGraph[node]) {
    edges[dest] = 1;
  }
}

console.log(find_path(graph, "Post Office", "Cabin"));
// → ["Post Office", "Alice's House", "Cabin"]
```

This can be a barrier to composition—when various packages are using
different data structures to describe similar things, it is difficult
to combine them. Therefore, if you want to design for composability,
find out what ((data structure))s other people are using, and when
possible, follow their example.

## Summary

Modules provide structure to bigger programs by separating the code
into pieces with clear interfaces and dependencies. The interface is
the part of the module that's visible from other modules, and the
dependencies are the other modules that it makes use of.

Because JavaScript historically did not provide a module system, the
CommonJS system was built on top of it. But at some point it _did_ get
a built-in system, which now coexists uneasily with the CommonJS
system.

A package is a chunk of code that can be distributed on its own. NPM
is a repository of JavaScript packages. You can download all kinds of
useful (and useless) packages from it.

## Exercises

### A modular robot

{{index "modular robot (exercise)", module, robot, NPM}}

{{id modular_robot}}

These are the bindings that the project from [Chapter ?](robot)
creates:

```{lang: "text/plain"}
roads
buildGraph
roadGraph
VillageState
runRobot
randomPick
randomRobot
mailRoute
routeRobot
findRoute
goalOrientedRobot
```

If you were to write that project as a modular program, what modules
would you create? Which module would depend on which other module, and
what would their interfaces look like?

Which pieces are likely to be available pre-written on NPM? Would you
prefer to use an NPM package or to write them yourself?

{{hint

{{index "modular robot (exercise)"}}

Here's what I would have done (but again, there is no single _right_
way to design a given module):

{{index "dijkstrajs package"}}

The code used to build the road graph lives in the `graph` module.
Because I'd rather use `dijkstrajs` from NPM than our own path-finding
code, we'll make this build the kind of graph data that `dijkstajs`
expects. This module exports a single function, `buildGraph`. I'd have
`buildGraph` accept an array of two-element arrays, rather than
strings containing dashes, to make the module less dependent on the
input format.

The `roads` module contains the raw road data (the `roads` array) and
the `roadGraph` binding. This module depends on `./graph` and exports
the road graph.

{{index "random-item package"}}

The `VillageState` class lives in the `state` module. It depends on
the `./roads` module, because it needs to be able to verify that a
given road exists. It also needs `randomPick`. Since that is a
three-line function, we could just put it into the `state` module as
an internal helper function. But `randomRobot` needs it too. So we'd
have to either duplicate it, or put it into its own module. Since this
function happens to exist on NPM in the `random-item` package, a good
solution is to just make both modules depend on that. We can add the
`runRobot` function to this module as well, since it's small and
closely related to state management. The module exports both the
`VillageState` class and the `runRobot` function.

Finally, the robots, along with the values they depend on such as
`mailRoute`, could go into an `example-robots` module, which depends
on `./roads` and exports the robot functions. To make it possible for
the `goalOrientedRobot` to do route-finding, this module also depends
on `dijkstrajs`.

By offloading some work to ((NPM)) modules, the code became a little
smaller. Each individual module does something rather simple, and can
be read on its own. Dividing code into modules also often suggests
further improvements to the program's design. In this case, it seems a
little odd that the `VillageState` and the robots depend on a specific
road graph. It might be a better idea to make the graph an argument to
the state's constructor and to make the robots read it from the state
object—this reduces dependencies (which is always good) and makes it
possible to run simulations on different maps (which is even better).

Is it a good idea to use NPM modules for things that we could have
written ourselves? In principle, yes—for nontrivial things like the
pathfinding function you are likely to make mistakes and waste time
writing them yourself. For tiny functions like `random-item`, writing
them yourself is easy enough. But adding them wherever you need them
does tend to clutter your modules.

However, you should also not underestimate the work involved in
_finding_ an appropriate NPM package. And even if you find one, it
might not work well, or be missing some feature that you need. On top
of that, depending on NPM packages means you have to make sure they
are installed, you have to distribute them with your program, and you
might have to periodically upgrade them.

So again, this is a trade-off, and you can decide either way depending
on how much the packages help you.

hint}}

### Roads module

{{index "roads module (exercise)"}}

Write a ((CommonJS module)), based on the example from [Chapter
?](robot), which contains the array of roads and exports the graph
data structure representing them as `roadGraph`. It should depend on a
module `./graph`, which exports a function `buildGraph` that is used
to build the graph. This function expects an array of two-element
arrays (the start and end points of the roads).

{{if interactive

```{test: no}
// Add dependencies and exports

const roads = [
  "Alice's House-Bob's House",   "Alice's House-Cabin",
  "Alice's House-Post Office",   "Bob's House-Town Hall",
  "Daria's House-Ernie's House", "Daria's House-Town Hall",
  "Ernie's House-Grete's House", "Grete's House-Farm",
  "Grete's House-Shop",          "Marketplace-Farm",
  "Marketplace-Post Office",     "Marketplace-Shop",
  "Marketplace-Town Hall",       "Shop-Town Hall"
];
```

if}}

{{hint

{{index "roads module (exercise)", "destructuring binding", "exports object"}}

Since this is a ((CommonJS module)), you have to use `require` to
import the graph module. That was described as exporting a
`buildGraph` function, which you can pick out of its interface object
with a destructuring `const` declaration.

To export `roadGraph`, you add a property to the `exports` object.
Because `buildGraph` takes a data structure that doesn't precisely
match `roads`, the splitting of the road strings must happen in your
module.

hint}}

### Circular dependencies

{{index dependency, "circular dependency", "require function"}}

A circular dependency is a situation where module A depends on B, and
B also, directly or indirectly, depends on A. Many module systems
simply forbid this because whichever order you choose for loading such
modules, you cannot make sure that each module's dependencies have
been loaded before it runs.

((CommonJS modules)) allow a limited form of cyclic dependencies. As
long as the modules do not replace their default `exports` object, and
don't access each other's interface until after they finish loading,
cyclic dependencies are okay.

The `require` function given [earlier in this
chapter](modules#require) supports this type of dependency cycles. Can
you see how it handles them? What would go wrong when a module in a
cycle _does_ replace its default `exports` object?

{{hint

{{index overriding, "circular dependency", "exports object"}}

The trick is that `require` adds modules to its cache _before_ it
starts loading the module. That way, if any `require` call made while
it is running tries to load it, it is already known and the current
interface will be returned, rather than starting to load the module
once more (which would eventually overflow the stack).

If a module overwrites its `module.exports` value, any other module
that has received its interface value before it finished loading will
have gotten hold of the default interface object (which is likely
empty), rather than the intended interface value.

hint}}
