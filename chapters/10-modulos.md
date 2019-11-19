
Capítulo 10

# Módulos

> Um programador iniciante escreve seus programas como uma formiga constrói seu formigueiro, um pedaço de cada vez, sem pensar na estrutura maior. Seus programas irão parecer como areia solta. Eles podem durar um tempo, mas se crescem demais, desmoronam.
>
> Percebendo esse problema, o programador começará a gastar muito tempo pensando sobre a estrutura. Seus programas serão rigidamente estruturados, como esculturas em pedra. Eles são sólidos, mas quando precisam mudar, devem ser quebrados.

> O programador experiente sabe quando aplicar uma estrutura e quando deixar as coisas mais simples. Seus programas são como argila, sólidos mas ainda maleáveis.

> —Master Yuan-Ma, The Book of Programming

Todo programa possui uma forma. Em menor escala essa forma é determinada pela divisão em funções e os blocos dentro destas funções. Programadores têm muita liberdade na forma que dão aos seus programas. É determinado mais pelo bom (ou mau) gosto, do que pela funcionalidade planejada.

Quando olhamos um programa grande em seu todo, funções individuais começam a se misturar e seria bom possuir uma unidade maior de organização.

Módulos dividem programas em blocos de código, que por algum critério pertencem a uma mesma unidade. Este capítulo explora alguns dos benefícios que estes agrupamentos fornecem e mostra algumas técnicas para construção de módulos em JavaScript.

## Organização

Existem algumas razões porque autores dividem seus livros em capítulos e seções. Elas facilitam para o leitor entender como o livro foi feito ou achar uma parte específica em que está interessado. Elas também ajudam o autor, dando um foco claro para cada seção.

Os benefícios de dividir um programa em vários arquivos ou módulos são semelhantes, ajudam as pessoas que não estão familiarizadas com o código a achar o que elas buscam, e ajudam o programador a colocar coisas semelhantes juntas.

Alguns programas são organizados seguindo o modelo de um texto tradicional, com uma ordem bem definida que encoraja o leitor a percorrer o programa, e muito falatório (comentários) fornecendo uma descrição coerente do código. Isso faz o programa muito menos intimidador (ler código desconhecido é geralmente intimidador). Mas existe um lado ruim que é a maior quantidade de trabalho a fazer e dificulta um pouco as alterações, porque os comentários tendem a ser mais interligados do que o código em si.

Como regra geral, organização tem um custo, e é nos estágios iniciais do projeto, quando não sabemos com certeza aonde vamos e que tipo de módulos o programa precisará. Eu defendo uma estrutura minimalista, com pouca estrutura. Apenas coloque tudo em um simples arquivo até que o código esteja estabilizado. Dessa maneira, você não estará se sobrecarregando pensando em organização enquanto tem pouca informação, não perderá tempo fazendo e desfazendo coisas, e não irá acidentalmente travar-se em uma estrutura que não serve realmente para seu programa.

## Namespaces

A maioria das linguagens modernas de programação têm um nível de escopo entre "global" (todos podem ver) e "local" (só esta função pode ver isto). JavaScript não. Assim, por padrão, tudo o que precisa ser visível fora do pequeno escopo da função atual é visível em todos os lugares.

Poluição de Namespace, o problema de um monte de código não relacionado ter que compartilhar um único conjunto de nomes de variáveis globais, foi mencionado no capítulo 4, onde o objeto `Math` foi dado como um exemplo de um objeto que age como uma espécie de módulo por um agrupamento série de funcionalidades relacionadas com a matemática.

Embora JavaScript não possua a criação de módulos nativamente, objetos podem ser usados para criar sub-namespaces publicamente acessíveis, e funções podem ser usadas para criar um namespace privado dentro de um módulo. Vou demonstrar algumas técnicas que nos permitirão construir módulos namespace isolados bem convenientes.

## Reuso

Em um projeto "flat" (plano), não é claro quais partes do código são necessárias para se usar uma função em particular. Se, no meu programa para espionar inimigos (*spying on enemies*), eu escrever uma função para ler os arquivos de  configuração, e agora eu uso essa função novamente em outro projeto, eu devo ir e copiar as partes do programa antigo que são relevantes para a funcionalidade que eu preciso, e colá-las no meu novo programa. Então, se eu encontrar um erro nesse código, eu vou consertar isso neste programa que eu estava trabalhando no momento, e esquecer de também consertar no outro programa.

Uma vez que você tenha muitos pedaços de código compartilhados e duplicados, você vai se encontrar perdendo uma grande quantidade de tempo e energia organizá-los e mantê-los atualizados.

Quando partes de funcionalidades que são independentes são colocadas em arquivos e módulos separados, elas podem ser rastreadas mais facilmente, atualizadas quando uma nova versão for criada, ou até mesmo compartilhadas, tendo várias partes do código que desejam usá-las carregando o mesmo arquivo.

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

```javascript
var names = ["Sunday", "Monday", "Tuesday", "Wednesday",
             "Thursday", "Friday", "Saturday"];
function dayName(number) {
  return names[number];
}

console.log(dayName(1));
// → Monday
```

A função `dayName` é parte desta interface, mas a variável `names` não. Nós preferimos não deixá-la no escopo global.

Podemos fazer isso:

```javascript
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

```javascript
(function() {
  function square(x) { return x * x; }
  var hundred = 100;

  console.log(square(hundred));
})();
// → 10000
```

Este código simplesmente imprime o quadrado de cem (no mundo real, este poderia ser um módulo que adiciona um método a algum prototype, ou configura algum *widget* em uma página da web). Ele encapsula seu código em uma função para, novamente, prevenir que as variáveis que ele usa internamente estejam no escopo global.

Por que a função namespace está encapsulada em uma par de parênteses? Isso tem relação com um truque da sintaxe JavaScript. Se uma expressão começa com a palavra-chave `function`, ela é uma expressão de função. Entretanto, se uma declaração inicia com esta palavra-chave, será uma declaração de função, que requer um nome e não pode ser chamada imediatamente. Mesmo que uma declaração comece com uma expressão, a segunda regra tem precedência, e se os parênteses extras foram esquecidos no exemplo acima, isso irá produzir um erro de sintaxe. Você pode imaginá-los como um truco para forçar a linguagem a entender que nós queremos escrever uma expressão.

## Objetos como namespaces

Agora imagine que o módulo dia-da-semana (*day-of-the-week*) precise fornecer não uma, mas duas funções, porque nós adicionamos uma função `dayNumber` que vai de um nome para um número. Nós podemos mais simplesmente retornar a função, mas devemos encapsular as duas funções em um objeto.

```javascript
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

```javascript
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

Com um pequeno encanamento, nós podemos criar um sistema que permite que aos módulos requererem diretamente por interfaces de objetos de outros módulos que eles precisem de acessar, sem precisarmos usar o escopo global. Isso resolve os problemas mencionados acima e tem um benefício adicional de ser explícito sobre suas dependências, tornando difícil usar acidentalmente algum módulo sem declarar que você precisa dele.

Nosso objetivo é uma função 'require' que, quando dado o nome de um módulo, vai carregar esse arquivo (do disco ou da web, dependendo da plataforma que estivermos rodando), e retornar o valor apropriado da interface.

Para isso nós precisamos de pelo menos duas coisas. Primeiramente, nós vamos imaginar que temos uma função `readFile` (que não está presente por padrão no JavaScript), que retorna o conteúdo do arquivo com um nome fornecido. Existem formas de acessar a web com JavaScript no navegador, e acessar o disco rígido com outras plataformas JavaScript, mas elas são mais envolvidas. Por agora, nós apenas pretendemos desta simples função.

Em segundo lugar, nós precisamos de ser capazes, quando tivermos uma string contendo o código (lida do arquivo), de realmente executar o código como um programa JavaScript.

## Avaliando dados como código

Existem várias formas de se pegar dados (uma `string` de código) e rodá-los no contexto do programa atual.

A mais óbvia maneira é o operador padrão especial `eval`, que vai executar a string de código no escopo atual. Isso usualmente é uma ideia muito ruim, porque quebra algumas propriedades que escopos normalmente tem (ser isolado do mundo externo é a mais notável).

```javascript
function evalAndReturnX(code) {
  eval(code);
  return x;
}

console.log(evalAndReturnX("var x = 2"));
// → 2
```

A melhor forma de converter dados dentro do programa é usar uma função construtora. Ela recebe como argumentos uma lista de nomes de argumentos separados por vírgula, e então uma string contendo o corpo da função.

```javascript
var plusOne = new Function("n", "return n + 1;");
console.log(plusOne(4));
// → 5
```

Isso é precisamente o que precisamos - podemos encapsular o código para um módulo em uma função, com este escopo de função se tornando nosso escopo de módulo.

## Require

Se a nova função construtora, usada pelo nosso módulo de carregamento, encapsula o código em uma função de qualquer forma, nós podemos omitir a função *namespace* encapsuladora atual dos arquivos. Nós também vamos fazer `exports` um argumento à função módulo, então o módulo não precisará de declarar isso. Isso remove um monte de barulho supérfluo do nosso módulo de exemplo:

```javascript
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

```javascript
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

```javascript
var weekDay = require("weekDay");
var today = require("today");

console.log(weekDay.name(today.dayNumber()));
```

A implementação de require acima tem diversos problemas. Primeiro, ela vai carregar e rodar um módulo todas as vezes que este for "require-d" (requisitado), então se diversos módulos têm a mesma dependência, ou uma chamada require é colocada dentro de uma função que vai ser chamada múltiplas vezes, tempo e energia serão desperdiçados.

Isso pode ser resolvido armazenando os módulos que já tenham sido carregados em um objeto, e simplesmente retornando o valor existente se eles forem carregados novamente.

O segundo problema é que não é possível para um módulo expor diretamente um valor simples. Por exemplo, um módulo pode querer exportar apenas o construtor do tipo do objeto que ele define. Por agora, isso não pode ser feito, porque `require` sempre vai usar o objeto `exports` que ele cria como o valor exportado.

A solução tradicional para isso é fornecer outra variável, `module`, que é um objeto que tem a propriedade `exports`. Essa propriedade inicialmente aponta para o objeto vazio criado por require, mas pode ser sobrescrita com outro valor para exportar algo a mais.

```javascript
function require(name) {
  if (name in require.cache)
    return require.cache[name];

  var code = new Function("exports, module", readFile(name));
  var exports = {}, module = {exports: exports};
  code(exports, module);

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

```javascript
define(["weekDay", "today"], function(weekDay, today) {
  console.log(weekDay.name(today.dayNumber()));
});
```

A função `define` é o conceito central nessa abordagem. Ela primeiro recebe um array com nomes de módulos, e então uma função que recebe um argumento para cada dependência. Ela vai carregar as dependências (se elas ainda não tiverem sido carregadas) em segundo plano, permitindo que a página continue a trabalhar em quanto está esperando. Uma vez que todas as dependências estejam carregadas, ela vai carregar a função que foi passada, com as interfaces das dependências como argumentos.

Os módulos que são carregados dessa forma devem conter uma chamada a `define`. O valor usado para sua interface é qualquer valor retornado pela função que é o segundo argumento passado nessa chamada. Aqui está o módulo `weekDay` de novo.

```javascript
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

```javascript
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

## Projeto de interfaces

Projetar interfaces para módulos e tipos de objeto é um dos aspectos sutis da programação. Qualquer pedaço não trivial de funcionalidade pode ser modelada de formas diferentes. Encontrar um caminho que funciona bem requer perspicácia e previdência.

A melhor forma de aprender o valor de um bom projeto de interface é usar várias interfaces, algumas boas, algumas horríveis. Experiência vai ensinar a você o que funciona e o que não funciona. Nunca assuma que uma interface dolorosa de se usar é "da forma que ela deve ser". Conserte-a, ou encapsule-a em uma nova interface de forma que funcione melhor para você.

### Previsilibidade

Se programadores podem prever a forma que a interface vai funcionar, eles (ou você) não vão ser desviados frequentemente pela necessidade de checar como trabalhar com esta interface. Portanto, tente seguir convenções (por exemplo, quando se trata da capitalização de nomes). Quando existe outro módulo ou parte do ambiente padrão JavaScript que faz algo similar ao que você está implementando, é uma boa ideia fazer sua interface se assemelhar a interface existente. Dessa forma, as pessoas que conhecem a interface existente vão se sentir em casa.

Outra área que previsibilidade é importante é no comportamento do seu código. Pode ser tentador "empilhar inteligência" com a justificativa que isso torna a interface fácil de ser utilizada. Por exemplo, aceitando todos os diferentes tipos e combinações de argumentos, e fazendo "a coisa certa" para todos eles, ou fornecendo dezenas de diferentes funções especializadas por "conveniência" que fornecem pequenas alterações do sabor da funcionalidade do seu módulo. Isso pode tornar o código construído em cima da sua interface um pouco menor, mas isso vai também tornar o código muito mais difícil para as pessoas manterem um modelo mental do comportamento do módulo em suas cabeças.

### "Componibilidade"

Em suas interfaces, tente usar as estruturas de dados mais simples que funcionem e crie funções que façam algo simples e claro - sempre que possível, crie funções puras (veja capítulo 3).

Por exemplo, não é comum para módulos fornecerem suas próprias coleções de objetos similares a arrays, com sua própria interface para contar e extrair elementos. Tais objetos não terão os métodos `map` e `forEach`, e qualquer função existente que espere um array real não será capaz de trabalhar com estas coleções. Este é um exemplo de componibilidade (*composability*) ruim - o módulo não pode ser facilmente composto com outro código.

Outro exemplo seria um módulo verificação ortográfica de texto, que podemos necessitar se quisermos escrever um editor de texto. O verificador pode ser construído para funcionar diretamente em qualquer tipo complexo de estrutura de dados que o editor usa, e chamar funções internas diretamente no editor para que o usuário possa escolher entre as sugestões de ortografia. Se formos por esse caminho, o módulo não poderá ser usado com outros programas. De outra forma, se nós definirmos a interface do verificador ortográfico para que possamos passar simples strings e retornar a possível localização do erro, juntamente com um array de correções sugeridas, nós teremos uma interface que pode ser composta com outros sistemas, porque strings e arrays estarão sempre disponíveis.

### Interfaces em camadas

Quando projetando uma interface para uma complexa parte de funcionalidade - digo, enviar email - você geralmente se depara com um dilema. Em uma mão, você não quer sobrecarregar o usuário da sua interface com detalhes. Ele não deve estudar sua interface por 20 minutos antes de ser capaz de enviar um email. Na outra mão, você não quer esconder todos os detalhes - quando pessoas precisam fazer coisas complicadas com seu módulo, eles também devem ser capazes.

Normalmente a solução é oferecer duas interfaces: uma de "baixo nível" detalhada para situações complexas e uma de "alto nível" simples para uso rotineiro. A segunda pode ser construída de forma simples utilizando as ferramentas fornecidas pela primeira camada. No módulo de email, a interface de alto nível pode simplesmente ser uma função que recebe uma mensagem, um endereço de remetente, um endereço de destinatário e envia o email. A interface de baixo nível deve permitir um controle completo sobre os cabeçalhos do email, anexos, envio de email HTML, e por ai vai.

## Resumo

Módulos fornecem estrutura para programas grandes, separando o código em diferentes arquivos e *namespaces*. Dando a estes módulos interfaces bem definidas os tornam fáceis de se utilizar, reusando-os em contextos diferentes, e continuando os usando mesmo quando evoluem.

Mesmo que a linguagem JavaScript não auxilie muito quando se trata de módulos, as flexíveis funções e objetos que ela fornece fazem que seja possível definir úteis sistemas de módulo. Escopo de função pode ser utilizado como namespace interno para o módulo, e objetos podem ser usados para armazenar blocos de valores exportados.

Existem duas abordagens populares para tais módulos. Uma é chamada "Módulos CommonJS", e funciona em torno da função `require` que busca um módulo pelo seu nome e retorna sua interface. A outra abordagem é chamada "AMD", e usa a função assíncrona `define` que recebe um array de nome de módulos e uma função, e depois de carregar os módulos, roda a função com suas interfaces e argumentos.

## Exercícios

### Nomes dos meses

Escreva um simples módulo similar ao módulo `weekDay`, que pode converter os números dos meses (*zero-based*, assim como o tipo `Date`) para nomes, e nomes para números. Dê a este módulo seu próprio namespace, pois ele vai precisar de um array interno com o nome dos meses, mas use JavaScript puro, sem nenhum sistema de carregamento de módulos.

```javascript
// Your code here.

console.log(month.name(2));
// → March
console.log(month.number("November"));
// → 10
```

Ele vai seguir o módulo weekDay praticamente por inteiro. Uma função anônima, chamada imediatamente, encapsula a variável que contém o array de nomes, assim como as duas funções que precisam ser exportadas. As funções são colocadas em um objeto. A interface de objeto retornada é armazenada na variável `month`.

### Dependências circulares

Um assunto complicado na gestão de dependências é o de dependências circulares, onde módulo A depende do módulo B, e B também depende do módulo A. Muitos sistemas simplesmente proíbem isso. CommonJS permite uma forma limitada disso, onde isso funciona se os módulos não trocarem seus objetos exportados por padrão com outro valor, e somente começam a acessar a interface um do outro após terem finalizados seus carregamentos.

Você pode pensar em algo que dê suporte para essa funcionalidade ser implementada? Olhe anteriormente a definição de `require`, e considere o quê você deve fazer para permitir isso.

O segredo é adicionar o objeto `exports` criado por um módulo para requisitar o cache antes de rodar o módulo de fato. Isso significa que o módulo não teria tido ainda uma chance de sobrescrever `module.exports`, então não sabemos se ele deseja exportar outro valor. Depois de carregar, o objeto cache é sobrescrito com `module.exports`, que pode ser um valor diferente.

Mas se, no curso de carregar o módulo, um segundo módulo é carregado e solicita o primeiro módulo, seu objeto `exports` padrão, ainda vazio até este ponto, vai estar no cache, e o segundo módulo vai receber uma referência dele. Se ele não tentar fazer nada com o objeto até que o segundo módulo tenha terminado seu carregamento, as coisas vão funcionar.

### Um retorno a vida eletrônica

Esperando que o capítulo 7 ainda esteja um pouco fresco em sua mente, pense novamente no sistema projetado neste capítulo e elabore um separação em módulo para o código. Para refrescar sua memória, essas são as funções e tipos definidos naquele capítulo, em ordem de aparição.

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

Não exagere em criar muitos módulos. Um livro que começa um novo capítulo para cada página provavelmente vai te deixar nervoso, por todo espaço perdido com os títulos. De forma similar, ter que abrir dez arquivos para ler um pequeno projeto não é útil. Vise por três ou cinco módulos.

Você pode escolher ter algumas funções internas ao módulo, e então inacessíveis a outros módulos.

Não existe uma única solução correta aqui. Organização de módulos é meramente uma questão de gosto.

Aqui está o que eu fiz. Coloquei parenteses em torno de funções internas.

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

Eu reexportei o array `directions` do módulo `grid` para `world`, então módulos criados com eles (`ecosystems`) não precisam de saber ou se preocupar da existência do módulo `grid`.

Eu também dupliquei dois valores minúsculos e genéricos (`randomElement` e `Wall`) pois eles são usados como detalhes internos em contextos diferentes, e não pertencem nas interfaces destes módulos.
