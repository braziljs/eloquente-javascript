{{meta {load_files: ["code/packages_chapter_10.js", "code/chapter/07_robot.js"]}}}

# Módulos

{{quote {author: "Tef", title: "programming is terrible", chapter: true}

Escreva código que seja fácil de deletar, não fácil de estender.

quote}}

{{index "Yuan-Ma", "Book of Programming"}}

{{figure {url: "img/chapter_picture_10.jpg", alt: "Illustration of a complicated building built from modular pieces", chapter: framed}}}

{{index organization, [code, "structure of"]}}

Idealmente, um programa tem uma estrutura clara e direta. A maneira como funciona é fácil de explicar, e cada parte desempenha um papel bem definido.

{{index "organic growth"}}

Na prática, programas crescem organicamente. Funcionalidades são adicionadas conforme o programador identifica novas necessidades. Manter tal programa bem estruturado requer atenção e trabalho constantes. Este é um trabalho que só compensará no futuro, na _próxima_ vez que alguém trabalhar no programa, então é tentador negligenciá-lo e permitir que as várias partes do programa se tornem profundamente emaranhadas.

{{index readability, reuse, isolation}}

Isso causa dois problemas práticos. Primeiro, entender um sistema emaranhado é difícil. Se tudo pode tocar em tudo o mais, é difícil olhar para qualquer parte isoladamente. Você é forçado a construir um entendimento holístico da coisa toda. Segundo, se quiser usar qualquer funcionalidade de tal programa em outra situação, reescrevê-la pode ser mais fácil do que tentar desemaranhá-la de seu contexto.

A frase "((grande bola de lama))" é frequentemente usada para tais programas grandes e sem estrutura. Tudo gruda junto, e quando você tenta pegar um pedaço, a coisa toda desmorona e você só consegue fazer uma bagunça.

## Programas modulares

{{index dependency, [interface, module]}}

_Módulos_ são uma tentativa de evitar esses problemas. Um ((módulo)) é um pedaço de programa que especifica de quais outros pedaços ele depende e que funcionalidade fornece para outros módulos usarem (sua _interface_).

{{index "big ball of mud"}}

Interfaces de módulos têm muito em comum com interfaces de objetos, como vimos no [Capítulo ?](object#interface). Elas tornam parte do módulo disponível para o mundo exterior e mantêm o restante privado.

{{index dependency}}

Mas a interface que um módulo fornece para outros usarem é apenas metade da história. Um bom sistema de módulos também requer que módulos especifiquem qual código _eles_ usam de outros módulos. Essas relações são chamadas de _dependências_. Se o módulo A usa funcionalidade do módulo B, diz-se que _depende_ desse módulo. Quando estas são claramente especificadas no próprio módulo, podem ser usadas para descobrir quais outros módulos precisam estar presentes para poder usar um dado módulo e para carregar automaticamente as dependências.

Quando as maneiras como módulos interagem entre si são explícitas, um sistema se torna mais como ((LEGO)), onde peças interagem através de conectores bem definidos, e menos como lama, onde tudo se mistura com tudo.

{{id es}}

## Módulos ES

{{index "global scope", [binding, global]}}

A linguagem JavaScript original não tinha nenhum conceito de módulo. Todos os scripts rodavam no mesmo escopo, e acessar uma função definida em outro script era feito referenciando as *bindings* globais criadas por aquele script. Isso encorajava ativamente o emaranhamento acidental e difícil de ver do código e convidava problemas como scripts não relacionados tentando usar o mesmo nome de *binding*.

{{index "ES modules"}}

Desde o ECMAScript 2015, o JavaScript suporta dois tipos diferentes de programas. _Scripts_ se comportam da maneira antiga: suas *bindings* são definidas no escopo global e não têm como referenciar diretamente outros scripts. _Módulos_ obtêm seu próprio escopo separado e suportam as palavras-chave `import` e `export`, que não estão disponíveis em scripts, para declarar suas dependências e interface. Esse sistema de módulos é geralmente chamado de _módulos ES_ (onde _ES_ significa ECMAScript).

Um programa modular é composto por vários desses módulos, conectados via seus *imports* e *exports*.

{{index "Date class", "weekDay module"}}

O módulo de exemplo a seguir converte entre nomes de dias e números (como retornado pelo método `getDay` de `Date`). Ele define uma constante que não faz parte de sua interface e duas funções que fazem. Não tem dependências.

```
const names = ["Sunday", "Monday", "Tuesday", "Wednesday",
               "Thursday", "Friday", "Saturday"];

export function dayName(number) {
  return names[number];
}
export function dayNumber(name) {
  return names.indexOf(name);
}
```

A palavra-chave `export` pode ser colocada na frente de uma definição de função, classe ou *binding* para indicar que aquela *binding* faz parte da interface do módulo. Isso torna possível que outros módulos usem aquela *binding* importando-a.

```{test: no}
import {dayName} from "./dayname.js";
let now = new Date();
console.log(`Today is ${dayName(now.getDay())}`);
// → Today is Monday
```

{{index "import keyword", dependency, "ES modules"}}

A palavra-chave `import`, seguida de uma lista de nomes de *bindings* entre chaves, torna *bindings* de outro módulo disponíveis no módulo atual. Módulos são identificados por *strings* entre aspas.

{{index [module, resolution], resolution}}

Como tal nome de módulo é resolvido para um programa real difere por plataforma. O *browser* os trata como endereços web, enquanto o Node.js os resolve como arquivos. Quando você executa um módulo, todos os outros módulos dos quais ele depende — e os módulos dos quais _aqueles_ dependem — são carregados, e as *bindings* exportadas são disponibilizadas para os módulos que as importam.

Declarações de *import* e *export* não podem aparecer dentro de funções, *loops* ou outros blocos. Elas são resolvidas imediatamente quando o módulo é carregado, independentemente de como o código no módulo é executado. Para refletir isso, elas devem aparecer apenas no corpo externo do módulo.

Assim, a interface de um módulo consiste em uma coleção de *bindings* nomeadas, que outros módulos que dependem do módulo podem acessar. *Bindings* importadas podem ser renomeadas para receber um novo nome local usando `as` após seu nome.

```
import {dayName as nomDeJour} from "./dayname.js";
console.log(nomDeJour(3));
// → Wednesday
```

Um módulo também pode ter um *export* especial chamado `default`, que é frequentemente usado para módulos que exportam apenas uma única *binding*. Para definir um *export* padrão, escreva `export default` antes de uma expressão, declaração de função ou declaração de classe.

```
export default ["Winter", "Spring", "Summer", "Autumn"];
```

Tal *binding* é importada omitindo as chaves ao redor do nome do *import*.

```
import seasonNames from "./seasonname.js";
```

Para importar todas as *bindings* de um módulo de uma vez, você pode usar `import *`. Você fornece um nome, e esse nome será vinculado a um objeto contendo todas as exportações do módulo. Isso pode ser útil quando se usa muitas exportações diferentes.

```
import * as dayName from "./dayname.js";
console.log(dayName.dayName(3));
// → Wednesday
```

## Pacotes

{{index bug, dependency, structure, reuse}}

Uma das vantagens de construir um programa a partir de pedaços separados e poder executar alguns desses pedaços por conta própria é que você pode usar o mesmo pedaço em programas diferentes.

{{index "parseINI function"}}

Mas como configurar isso? Digamos que quero usar a função `parseINI` do [Capítulo ?](regexp#ini) em outro programa. Se está claro do que a função depende (neste caso, nada), posso simplesmente copiar aquele módulo para meu novo projeto e usá-lo. Mas então, se encontrar um erro no código, provavelmente o corrigirei no programa em que estiver trabalhando no momento e esquecerei de corrigi-lo no outro programa.

{{index duplication, "copy-paste programming"}}

Uma vez que você começa a duplicar código, rapidamente se verá desperdiçando tempo e energia movendo cópias e mantendo-as atualizadas. É aí que os _((pacote))s_ entram. Um pacote é um pedaço de código que pode ser distribuído (copiado e instalado). Ele pode conter um ou mais módulos e tem informações sobre de quais outros pacotes depende. Um pacote também geralmente vem com documentação explicando o que faz, para que pessoas que não o escreveram ainda possam usá-lo.

Quando um problema é encontrado em um pacote ou uma nova funcionalidade é adicionada, o pacote é atualizado. Agora os programas que dependem dele (que também podem ser pacotes) podem copiar a nova ((versão)) para obter as melhorias feitas no código.

{{id modules_npm}}

{{index installation, upgrading, "package manager", download, reuse}}

Trabalhar dessa forma requer ((infraestrutura)). Precisamos de um lugar para armazenar e encontrar pacotes e uma maneira conveniente de instalá-los e atualizá-los. No mundo JavaScript, essa infraestrutura é fornecida pelo ((NPM)) ([_https://npmjs.com_](https://npmjs.com)).

O NPM é duas coisas: um serviço online onde você pode baixar (e enviar) pacotes, e um programa (incluído com o Node.js) que ajuda a instalá-los e gerenciá-los.

{{index "ini package"}}

No momento da escrita, há mais de três milhões de pacotes diferentes disponíveis no NPM. Uma grande parte deles é lixo, para ser justo. Mas quase todo pacote JavaScript útil e publicamente disponível pode ser encontrado no NPM. Por exemplo, um analisador de arquivo INI, semelhante ao que construímos no [Capítulo ?](regexp), está disponível sob o nome de pacote `ini`.

{{index "command line"}}

O [Capítulo ?](node) mostrará como instalar tais pacotes localmente usando o programa de linha de comando `npm`.

Ter pacotes de qualidade disponíveis para download é extremamente valioso. Significa que frequentemente podemos evitar reinventar um programa que 100 pessoas já escreveram antes e obter uma implementação sólida e bem testada pressionando algumas teclas.

{{index maintenance}}

Software é barato de copiar, então uma vez que alguém o escreveu, distribuí-lo a outras pessoas é um processo eficiente. Escrevê-lo em primeiro lugar _é_ trabalho, porém, e responder a pessoas que encontraram problemas no código ou que querem propor novas funcionalidades é ainda mais trabalho.

Por padrão, você possui o ((copyright)) do código que escreve, e outras pessoas podem usá-lo apenas com sua permissão. Mas como algumas pessoas são simplesmente legais e porque publicar bom software pode ajudá-lo a se tornar um pouco famoso entre programadores, muitos pacotes são publicados sob uma ((licença)) que explicitamente permite que outras pessoas os usem.

A maioria do código no ((NPM)) é licenciado dessa forma. Algumas licenças exigem que você também publique código que constrói sobre o pacote sob a mesma licença. Outras são menos exigentes, requerendo apenas que você mantenha a licença com o código ao distribuí-lo. A comunidade JavaScript usa em grande parte o último tipo de licença. Ao usar pacotes de outras pessoas, certifique-se de estar ciente de suas licenças.

{{id modules_ini}}

{{index "ini package"}}

Agora, em vez de escrever nosso próprio analisador de arquivo INI, podemos usar um do ((NPM)).

```
import {parse} from "ini";

console.log(parse("x = 10\ny = 20"));
// → {x: "10", y: "20"}
```

{{id commonjs}}

## Módulos CommonJS

Antes de 2015, quando a linguagem JavaScript não tinha um sistema de módulos embutido, as pessoas já estavam construindo sistemas grandes em JavaScript. Para tornar isso viável, elas _precisavam_ de ((módulo))s.

{{index [function, scope], [interface, module], [object, as module]}}

A comunidade projetou seus próprios ((sistemas de módulo))s improvisados sobre a linguagem. Esses usam funções para criar um escopo local para os módulos e objetos regulares para representar interfaces de módulos.

Inicialmente, as pessoas simplesmente envolviam manualmente todo o seu módulo em uma "((expressão de função imediatamente invocada))" para criar o escopo do módulo e atribuíam seus objetos de interface a uma única variável global.

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

{{index dependency, [interface, module]}}

Esse estilo de módulos fornece ((isolamento)), até certo ponto, mas não declara dependências. Em vez disso, apenas coloca sua interface no ((escopo global)) e espera que suas dependências, se houver, façam o mesmo. Isso não é ideal.

{{index "CommonJS modules"}}

Se implementarmos nosso próprio carregador de módulos, podemos fazer melhor. A abordagem mais amplamente usada para módulos JavaScript acoplados é chamada de _módulos CommonJS_. O ((Node.js)) usou esse sistema de módulos desde o início (embora agora também saiba como carregar módulos ES), e é o sistema de módulos usado por muitos pacotes no ((NPM)).

{{index "require function", [interface, module], "exports object"}}

Um módulo CommonJS parece um script regular, mas tem acesso a duas *bindings* que usa para interagir com outros módulos. A primeira é uma função chamada `require`. Quando você a chama com o nome do módulo de sua dependência, ela garante que o módulo seja carregado e retorna sua interface. A segunda é um objeto chamado `exports`, que é o objeto de interface do módulo. Ele começa vazio e você adiciona propriedades a ele para definir valores exportados.

{{index "formatDate module", "Date class", "ordinal package", "date-names package"}}

Este módulo CommonJS de exemplo fornece uma função de formatação de data. Ele usa dois ((pacote))s do NPM — `ordinal` para converter números em *strings* como `"1st"` e `"2nd"`, e `date-names` para obter os nomes em inglês para dias da semana e meses. Ele exporta uma única função, `formatDate`, que recebe um objeto `Date` e uma *string* de ((template)).

A *string* de template pode conter códigos que direcionam o formato, como `YYYY` para o ano completo e `Do` para o dia ordinal do mês. Você poderia dar a ela uma *string* como `"MMMM Do YYYY"` para obter uma saída como `November 22nd 2017`.

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
```

{{index "destructuring binding"}}

A interface de `ordinal` é uma única função, enquanto `date-names` exporta um objeto contendo múltiplas coisas — `days` e `months` são *arrays* de nomes. A desestruturação é muito conveniente ao criar *bindings* para interfaces importadas.

O módulo adiciona sua função de interface a `exports` para que módulos que dependem dele tenham acesso a ela. Poderíamos usar o módulo assim:

```
const {formatDate} = require("./format-date.js");

console.log(formatDate(new Date(2017, 9, 13),
                       "dddd the Do"));
// → Friday the 13th
```

O CommonJS é implementado com um carregador de módulos que, ao carregar um módulo, envolve seu código em uma função (dando-lhe seu próprio escopo local) e passa as *bindings* `require` e `exports` para essa função como argumentos.

{{id require}}

{{index "require function", "CommonJS modules", "readFile function"}}

Se assumirmos que temos acesso a uma função `readFile` que lê um arquivo pelo nome e nos dá seu conteúdo, podemos definir uma forma simplificada de `require` assim:

```{test: wrap, sandbox: require}
function require(name) {
  if (!(name in require.cache)) {
    let code = readFile(name);
    let exports = require.cache[name] = {};
    let wrapper = Function("require, exports", code);
    wrapper(require, exports);
  }
  return require.cache[name];
}
require.cache = Object.create(null);
```

{{id eval}}

{{index "Function constructor", eval, security}}

`Function` é uma função embutida do JavaScript que recebe uma lista de argumentos (como uma *string* separada por vírgulas) e uma *string* contendo o corpo da função e retorna um valor de função com esses argumentos e esse corpo. Este é um conceito interessante — permite que um programa crie novos trechos de programa a partir de dados de *string* — mas também perigoso, pois se alguém puder enganar seu programa para colocar uma *string* que forneça em `Function`, poderá fazer o programa fazer qualquer coisa que quiser.

{{index [file, access]}}

O JavaScript padrão não fornece tal função como `readFile`, mas diferentes ambientes JavaScript, como o *browser* e o Node.js, fornecem suas próprias maneiras de acessar arquivos. O exemplo apenas finge que `readFile` existe.

Para evitar carregar o mesmo módulo múltiplas vezes, `require` mantém um armazenamento (cache) de módulos já carregados. Quando chamada, primeiro verifica se o módulo solicitado já foi carregado e, se não, o carrega. Isso envolve ler o código do módulo, envolvê-lo em uma função e chamá-la.

{{index "ordinal package", "exports object", "module object", [interface, module]}}

Ao definir `require` e `exports` como ((parâmetro))s para a função wrapper gerada (e passar os valores apropriados ao chamá-la), o carregador garante que essas *bindings* estejam disponíveis no ((escopo)) do módulo.

Uma diferença importante entre este sistema e os módulos ES é que os *imports* de módulos ES acontecem antes de o script de um módulo começar a executar, enquanto `require` é uma função normal, invocada quando o módulo já está em execução. Diferentemente das declarações `import`, chamadas a `require` _podem_ aparecer dentro de funções, e o nome da dependência pode ser qualquer expressão que avalie para uma *string*, enquanto `import` permite apenas *strings* simples entre aspas.

A transição da comunidade JavaScript do estilo CommonJS para módulos ES tem sido lenta e um tanto áspera. Felizmente, agora estamos em um ponto onde a maioria dos pacotes populares no NPM fornece seu código como módulos ES, e o Node.js permite que módulos ES importem de módulos CommonJS. Embora código CommonJS ainda seja algo que você encontrará, não há mais razão real para escrever novos programas nesse estilo.

## Construção e empacotamento

{{index compilation, "type checking"}}

Muitos pacotes JavaScript não são tecnicamente escritos em JavaScript. Extensões de linguagem como TypeScript, o ((dialeto)) de verificação de tipos mencionado no [Capítulo ?](error#typing), são amplamente usadas. As pessoas também frequentemente começam a usar funcionalidades planejadas da linguagem muito antes de serem adicionadas às plataformas que realmente executam JavaScript. Para tornar isso possível, elas _compilam_ seu código, traduzindo-o de seu dialeto JavaScript escolhido para JavaScript puro — ou até para uma versão anterior de JavaScript — para que ((browsers)) possam executá-lo.

{{index latency, performance, [file, access], [network, speed]}}

Incluir um programa modular que consiste em 200 arquivos diferentes em uma ((página web)) produz seus próprios problemas. Se buscar um único arquivo pela rede leva 50 milissegundos, carregar o programa inteiro leva 10 segundos, ou talvez metade disso se puder carregar vários arquivos simultaneamente. Isso é muito tempo desperdiçado. Como buscar um único arquivo grande tende a ser mais rápido do que buscar muitos pequenos, programadores web começaram a usar ferramentas que combinam seus programas (que eles meticulosamente dividiram em módulos) em um único arquivo grande antes de publicá-lo na web. Tais ferramentas são chamadas de _((bundler))s_.

{{index "file size"}}

E podemos ir mais longe. Além do número de arquivos, o _tamanho_ dos arquivos também determina a rapidez com que podem ser transferidos pela rede. Assim, a comunidade JavaScript inventou _((minificador))es_. Estas são ferramentas que pegam um programa JavaScript e o tornam menor, removendo automaticamente comentários e espaços em branco, renomeando *bindings* e substituindo trechos de código por código equivalente que ocupa menos espaço.

{{index pipeline, tool}}

Não é incomum que o código que você encontra em um pacote NPM ou que roda em uma página web tenha passado por _múltiplos_ estágios de transformação — convertendo de JavaScript moderno para JavaScript histórico, combinando os módulos em um único arquivo e minificando o código. Não entraremos nos detalhes dessas ferramentas neste livro, pois há muitas delas, e qual é popular muda regularmente. Apenas esteja ciente de que tais coisas existem e procure-as quando precisar.

## Design de módulos

{{index [module, design], [interface, module], [code, "structure of"]}}

Estruturar programas é um dos aspectos mais sutis da programação. Qualquer funcionalidade não-trivial pode ser organizada de várias maneiras.

O bom design de programa é subjetivo — há compensações envolvidas e questões de gosto. A melhor maneira de aprender o valor de um design bem estruturado é ler ou trabalhar em muitos programas e notar o que funciona e o que não funciona. Não assuma que uma bagunça dolorosa é "simplesmente assim". Você pode melhorar a estrutura de quase tudo colocando mais pensamento nisso.

{{index [interface, module]}}

Um aspecto do design de módulos é a facilidade de uso. Se você está projetando algo que pretende ser usado por múltiplas pessoas — ou até por você mesmo, em três meses quando não se lembrar mais dos detalhes do que fez — é útil que sua interface seja simples e previsível.

{{index "ini package", JSON}}

Isso pode significar seguir convenções existentes. Um bom exemplo é o pacote `ini`. Esse módulo imita o objeto padrão `JSON` fornecendo funções `parse` e `stringify` (para escrever um arquivo INI) e, como `JSON`, converte entre *strings* e objetos simples. A interface é pequena e familiar, e depois de trabalhar com ela uma vez, é provável que se lembre de como usá-la.

{{index "side effect", "hard disk", composability}}

Mesmo que não haja uma função padrão ou pacote amplamente usado para imitar, você pode manter seus módulos previsíveis usando ((estruturas de dados)) simples e fazendo uma única coisa focada. Muitos dos módulos de análise de arquivo INI no NPM fornecem uma função que lê diretamente tal arquivo do disco rígido e o analisa, por exemplo. Isso torna impossível usar tais módulos no *browser*, onde não temos acesso direto ao sistema de arquivos, e adiciona complexidade que seria melhor resolvida _compondo_ o módulo com alguma função de leitura de arquivo.

{{index "pure function"}}

Isso aponta para outro aspecto útil do design de módulos — a facilidade com que algo pode ser composto com outro código. Módulos focados que computam valores são aplicáveis em uma gama mais ampla de programas do que módulos maiores que realizam ações complicadas com efeitos colaterais. Um leitor de arquivo INI que insiste em ler o arquivo do disco é inútil em um cenário onde o conteúdo do arquivo vem de outra fonte.

{{index "object-oriented programming"}}

Relacionadamente, objetos com estado são às vezes úteis ou até necessários, mas se algo pode ser feito com uma função, use uma função. Vários dos leitores de arquivo INI no NPM fornecem um estilo de interface que requer que você primeiro crie um objeto, depois carregue o arquivo em seu objeto e finalmente use métodos especializados para obter os resultados. Esse tipo de coisa é comum na tradição orientada a objetos, e é terrível. Em vez de fazer uma única chamada de função e seguir em frente, você tem que realizar o ritual de mover seu objeto através de seus vários estados. E como os dados agora estão envolvidos em um tipo de objeto especializado, todo código que interage com ele precisa conhecer esse tipo, criando interdependências desnecessárias.

Frequentemente, definir novas estruturas de dados não pode ser evitado — apenas algumas básicas são fornecidas pelo padrão da linguagem, e muitos tipos de dados precisam ser mais complexos do que um *array* ou um map. Mas quando um *array* basta, use um *array*.

Um exemplo de uma estrutura de dados um pouco mais complexa é o grafo do [Capítulo ?](robot). Não há uma única maneira óbvia de representar um ((grafo)) em JavaScript. Naquele capítulo, usamos um objeto cujas propriedades armazenam *arrays* de *strings* — os outros nós alcançáveis a partir daquele nó.

Há vários pacotes de busca de caminho diferentes no ((NPM)), mas nenhum deles usa esse formato de grafo. Eles geralmente permitem que as arestas do grafo tenham um peso, que é o custo ou distância associado a ela. Isso não é possível em nossa representação.

{{index "Dijkstra, Edsger", pathfinding, "Dijkstra's algorithm", "dijkstrajs package"}}

Por exemplo, existe o pacote `dijkstrajs`. Uma abordagem bem conhecida para busca de caminho, bastante similar à nossa função `findRoute`, é chamada de _algoritmo de Dijkstra_, em homenagem a Edsger Dijkstra, que primeiro o escreveu. O sufixo `js` é frequentemente adicionado a nomes de pacotes para indicar que são escritos em JavaScript. Esse pacote `dijkstrajs` usa um formato de grafo semelhante ao nosso, mas em vez de *arrays*, usa objetos cujos valores de propriedade são números — os pesos das arestas.

Se quiséssemos usar esse pacote, teríamos que garantir que nosso grafo estivesse armazenado no formato que ele espera. Todas as arestas recebem o mesmo peso, já que nosso modelo simplificado trata cada estrada como tendo o mesmo custo (um turno).

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

Isso pode ser uma barreira à composição — quando vários pacotes usam estruturas de dados diferentes para descrever coisas semelhantes, combiná-los é difícil. Portanto, se quiser projetar para composabilidade, descubra quais ((estruturas de dados)) outras pessoas estão usando e, quando possível, siga o exemplo delas.

{{index design}}

Projetar uma estrutura de módulos adequada para um programa pode ser difícil. Na fase em que você ainda está explorando o problema, tentando coisas diferentes para ver o que funciona, pode querer não se preocupar muito com isso, pois manter tudo organizado pode ser uma grande distração. Uma vez que você tenha algo que pareça sólido, esse é um bom momento para dar um passo atrás e organizá-lo.

## Resumo

Módulos fornecem estrutura a programas maiores separando o código em pedaços com interfaces e dependências claras. A interface é a parte do módulo que é visível para outros módulos, e as dependências são os outros módulos que ele utiliza.

Como o JavaScript historicamente não fornecia um sistema de módulos, o sistema CommonJS foi construído sobre ele. Então, em algum momento, ele _ganhou_ um sistema embutido, que agora coexiste de forma desconfortável com o sistema CommonJS.

Um pacote é um pedaço de código que pode ser distribuído por conta própria. O NPM é um repositório de pacotes JavaScript. Você pode baixar todos os tipos de pacotes úteis (e inúteis) dele.

## Exercícios

### Um robô modular

{{index "modular robot (exercise)", module, robot, NPM}}

{{id modular_robot}}

Estas são as *bindings* que o projeto do [Capítulo ?](robot) cria:

```{lang: "null"}
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

Se você fosse escrever esse projeto como um programa modular, quais módulos criaria? Qual módulo dependeria de qual outro, e como seriam suas interfaces?

Quais peças provavelmente estariam disponíveis já prontas no NPM? Você preferiria usar um pacote NPM ou escrevê-las você mesmo?

{{hint

{{index "modular robot (exercise)"}}

Aqui está o que eu teria feito (mas novamente, não há uma única maneira _certa_ de projetar um dado módulo):

{{index "dijkstrajs package"}}

O código usado para construir o grafo de estradas vive no módulo `graph.js`. Como eu preferiria usar `dijkstrajs` do NPM em vez do nosso próprio código de busca de caminho, faremos isso construir o tipo de dados de grafo que `dijkstrajs` espera. Esse módulo exporta uma única função, `buildGraph`. Eu faria `buildGraph` aceitar um *array* de *arrays* de dois elementos, em vez de *strings* contendo hífens, para tornar o módulo menos dependente do formato de entrada.

O módulo `roads.js` contém os dados brutos de estradas (o *array* `roads`) e a *binding* `roadGraph`. Esse módulo depende de `./graph.js` e exporta o grafo de estradas.

{{index "random-item package"}}

A classe `VillageState` vive no módulo `state.js`. Ela depende do módulo `./roads.js` porque precisa verificar se uma dada estrada existe. Ela também precisa de `randomPick`. Como essa é uma função de três linhas, poderíamos simplesmente colocá-la no módulo `state.js` como uma função auxiliar interna. Mas `randomRobot` também precisa dela. Então teríamos que duplicá-la ou colocá-la em seu próprio módulo. Como essa função existe no NPM no pacote `random-item`, uma solução razoável é fazer ambos os módulos dependerem disso. Podemos adicionar a função `runRobot` a esse módulo também, já que é pequena e intimamente relacionada ao gerenciamento de estado. O módulo exporta tanto a classe `VillageState` quanto a função `runRobot`.

Finalmente, os robôs, junto com os valores dos quais dependem, como `mailRoute`, poderiam ir em um módulo `example-robots.js`, que depende de `./roads.js` e exporta as funções de robô. Para tornar possível que `goalOrientedRobot` faça busca de caminho, esse módulo também depende de `dijkstrajs`.

Ao delegar parte do trabalho a módulos ((NPM)), o código ficou um pouco menor. Cada módulo individual faz algo bastante simples e pode ser lido por conta própria. Dividir código em módulos também frequentemente sugere melhorias adicionais no design do programa. Neste caso, parece um pouco estranho que `VillageState` e os robôs dependam de um grafo de estradas específico. Poderia ser uma ideia melhor fazer o grafo ser um argumento para o construtor do estado e fazer os robôs lerem-no do objeto de estado — isso reduz dependências (o que é sempre bom) e torna possível executar simulações em mapas diferentes (o que é ainda melhor).

É uma boa ideia usar módulos NPM para coisas que poderíamos ter escrito nós mesmos? Em princípio, sim — para coisas não-triviais como a função de busca de caminho, é provável que você cometa erros e desperdice tempo escrevendo-as. Para funções minúsculas como `random-item`, escrevê-las você mesmo é fácil o suficiente. Mas adicioná-las sempre que precisar tende a poluir seus módulos.

Porém, você também não deve subestimar o trabalho envolvido em _encontrar_ um pacote NPM apropriado. E mesmo que encontre um, ele pode não funcionar bem ou pode estar faltando alguma funcionalidade que precisa. Além disso, depender de pacotes NPM significa que precisa garantir que estejam instalados, precisa distribuí-los com seu programa e pode ter que atualizá-los periodicamente.

Então, novamente, é uma compensação, e você pode decidir de qualquer forma dependendo de quanto um dado pacote realmente o ajuda.

hint}}

### Módulo de estradas

{{index "roads module (exercise)"}}

Escreva um módulo ES baseado no exemplo do [Capítulo ?](robot) que contenha o *array* de estradas e exporte a estrutura de dados de grafo que as representa como `roadGraph`. Ele depende de um módulo `./graph.js` que exporta uma função `buildGraph`, usada para construir o grafo. Essa função espera um *array* de *arrays* de dois elementos (os pontos de início e fim das estradas).

{{if interactive

```{test: no}
// Adicione dependências e exportações

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

Como este é um módulo ES, você precisa usar `import` para acessar o módulo de grafo. Ele foi descrito como exportando uma função `buildGraph`, que você pode extrair do objeto de interface com uma declaração `const` de desestruturação.

Para exportar `roadGraph`, coloque a palavra-chave `export` antes de sua definição. Como `buildGraph` recebe uma estrutura de dados que não corresponde precisamente a `roads`, a divisão das *strings* de estradas deve acontecer em seu módulo.

hint}}

### Dependências circulares

{{index dependency, "circular dependency", "require function"}}

Uma dependência circular é uma situação onde o módulo A depende de B, e B também, direta ou indiretamente, depende de A. Muitos sistemas de módulos simplesmente proíbem isso porque qualquer que seja a ordem que você escolha para carregar tais módulos, não pode garantir que as dependências de cada módulo tenham sido carregadas antes de ele executar.

((Módulos CommonJS)) permitem uma forma limitada de dependências cíclicas. Desde que os módulos não acessem a interface um do outro até que terminem de carregar, dependências cíclicas estão OK.

A função `require` fornecida [anteriormente neste capítulo](modules#require) suporta esse tipo de ciclo de dependência. Você consegue ver como ela lida com ciclos?

{{hint

{{index overriding, "circular dependency", "exports object"}}

O truque é que `require` adiciona o objeto de interface de um módulo ao seu cache _antes_ de começar a carregar o módulo. Dessa forma, se qualquer chamada a `require` feita enquanto ele está em execução tentar carregá-lo, ele já é conhecido, e a interface atual será retornada, em vez de começar a carregar o módulo mais uma vez (o que eventualmente transbordaria a pilha).

hint}}
