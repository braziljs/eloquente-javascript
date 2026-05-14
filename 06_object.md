{{meta {load_files: ["code/chapter/06_object.js"], zip: "node/html"}}}

# A Vida Secreta dos Objetos

{{quote {author: "Barbara Liskov", title: "Programming with Abstract Data Types", chapter: true}

Um tipo abstrato de dados é realizado escrevendo-se um tipo especial de programa [...] que define o tipo em termos das operações que podem ser executadas sobre ele.

quote}}

{{index "Liskov, Barbara", "abstract data type"}}

{{figure {url: "img/chapter_picture_6.jpg", alt: "Illustration of a rabbit next to its prototype, a schematic representation of a rabbit", chapter: framed}}}

O [Capítulo ?](data) introduziu os objetos do JavaScript como contêineres que armazenam outros dados. Na cultura da programação, a _((programação orientada a objetos))_ é um conjunto de técnicas que usa objetos como princípio central de organização de programas. Embora ninguém realmente concorde sobre sua definição precisa, a programação orientada a objetos moldou o design de muitas linguagens de programação, incluindo o JavaScript. Este capítulo descreve como essas ideias podem ser aplicadas em JavaScript.

## Tipos Abstratos de Dados

{{index "abstract data type", type, "mixer example"}}

A ideia principal na programação orientada a objetos é usar objetos, ou melhor, _tipos_ de objetos, como unidade de organização de programas. Configurar um programa como um conjunto de tipos de objetos estritamente separados fornece uma maneira de pensar sobre sua estrutura e, assim, impor algum tipo de disciplina, evitando que tudo fique emaranhado.

A maneira de fazer isso é pensar em objetos de forma semelhante a como você pensaria em um liquidificador elétrico ou outro ((eletrodoméstico)). As pessoas que projetam e montam um liquidificador precisam fazer um trabalho especializado que requer ciência dos materiais e conhecimento de eletricidade. Elas cobrem tudo isso com uma carcaça plástica lisa para que as pessoas que só querem misturar massa de panqueca não precisem se preocupar com tudo aquilo — elas só precisam entender os poucos botões com os quais o liquidificador pode ser operado.

{{index "class"}}

De forma semelhante, um _tipo abstrato de dados_, ou _classe de objetos_, é um subprograma que pode conter código arbitrariamente complicado, mas expõe um conjunto limitado de métodos e propriedades que as pessoas que trabalham com ele devem usar. Isso permite que programas grandes sejam construídos a partir de vários tipos de eletrodomésticos, limitando o grau de emaranhamento entre essas diferentes partes ao exigir que interajam apenas de maneiras específicas.

{{index encapsulation, isolation, modularity}}

Se um problema é encontrado em uma dessas classes de objetos, frequentemente ele pode ser reparado ou até completamente reescrito sem impactar o restante do programa. Melhor ainda, pode ser possível usar classes de objetos em vários programas diferentes, evitando a necessidade de recriar sua funcionalidade do zero. Você pode pensar nas estruturas de dados embutidas do JavaScript, como *arrays* e *strings*, como esses tipos abstratos de dados reutilizáveis.

{{id interface}}
{{index [interface, object]}}

Cada tipo abstrato de dados tem uma _interface_, a coleção de operações que o código externo pode executar sobre ele. Quaisquer detalhes além dessa interface são _encapsulados_, tratados como internos ao tipo e sem importância para o restante do programa.

Até coisas básicas como números podem ser pensadas como um tipo abstrato de dados cuja interface nos permite somá-los, multiplicá-los, compará-los e assim por diante. Na verdade, a fixação em _objetos_ individuais como a unidade principal de organização na programação orientada a objetos clássica é um tanto infeliz, pois funcionalidades úteis frequentemente envolvem um grupo de diferentes classes de objetos trabalhando juntas.

{{id obj_methods}}

## Métodos

{{index "rabbit example", method, [property, access]}}

Em JavaScript, métodos são nada mais que propriedades que armazenam valores de função. Este é um método simples:

```{includeCode: "top_lines:6"}
function speak(line) {
  console.log(`The ${this.type} rabbit says '${line}'`);
}
let whiteRabbit = {type: "white", speak};
let hungryRabbit = {type: "hungry", speak};

whiteRabbit.speak("Oh my fur and whiskers");
// → The white rabbit says 'Oh my fur and whiskers'
hungryRabbit.speak("Got any carrots?");
// → The hungry rabbit says 'Got any carrots?'
```

{{index "this binding", "method call"}}

Normalmente, um método precisa fazer algo com o objeto no qual foi chamado. Quando uma função é chamada como método — pesquisada como propriedade e chamada imediatamente, como em `object.method()` — a *binding* chamada `this` em seu corpo aponta automaticamente para o objeto no qual foi chamada.

{{id call_method}}

{{index "call method"}}

Você pode pensar em `this` como um ((parâmetro)) extra que é passado para a função de uma maneira diferente dos parâmetros regulares. Se quiser fornecê-lo explicitamente, pode usar o método `call` de uma função, que recebe o valor de `this` como seu primeiro argumento e trata os argumentos adicionais como parâmetros normais.

```
speak.call(whiteRabbit, "Hurry");
// → The white rabbit says 'Hurry'
```

Como cada função tem sua própria *binding* `this`, cujo valor depende da maneira como é chamada, você não pode se referir ao `this` do escopo envolvente em uma função regular definida com a palavra-chave `function`.

{{index "this binding", "arrow function"}}

*Arrow functions* são diferentes — elas não vinculam seu próprio `this`, mas podem ver a *binding* `this` do escopo ao redor delas. Assim, você pode fazer algo como o código a seguir, que referencia `this` de dentro de uma função local:

```
let finder = {
  find(array) {
    return array.some(v => v == this.value);
  },
  value: 5
};
console.log(finder.find([4, 5]));
// → true
```

Uma propriedade como `find(array)` em uma expressão de objeto é uma forma abreviada de definir um método. Ela cria uma propriedade chamada `find` e dá a ela uma função como valor.

Se eu tivesse escrito o argumento de `some` usando a palavra-chave `function`, este código não funcionaria.

{{id prototypes}}

## Protótipos

Uma maneira de criar um tipo de objeto coelho com um método `speak` seria criar uma função auxiliar que recebe o tipo do coelho como parâmetro e retorna um objeto contendo isso como sua propriedade `type` e nossa função speak em sua propriedade `speak`.

Todos os coelhos compartilham esse mesmo método. Especialmente para tipos com muitos métodos, seria bom se houvesse uma maneira de manter os métodos de um tipo em um único lugar, em vez de adicioná-los a cada objeto individualmente.

{{index [property, inheritance], [object, property], "Object prototype"}}

Em JavaScript, _((protótipo))s_ são a maneira de fazer isso. Objetos podem ser vinculados a outros objetos, para magicamente obter todas as propriedades que o outro objeto tem. Objetos comuns criados com a notação `{}` são vinculados a um objeto chamado `Object.prototype`.

{{index "toString method"}}

```
let empty = {};
console.log(empty.toString);
// → function toString(){…}
console.log(empty.toString());
// → [object Object]
```

Parece que acabamos de extrair uma propriedade de um objeto vazio. Mas na verdade, `toString` é um método armazenado em `Object.prototype`, o que significa que ele está disponível na maioria dos objetos.

Quando um objeto recebe uma solicitação por uma propriedade que não possui, seu protótipo será pesquisado pela propriedade. Se esse não a tiver, o protótipo _do protótipo_ é pesquisado, e assim por diante até que um objeto sem protótipo seja alcançado (`Object.prototype` é um desses objetos).

```
console.log(Object.getPrototypeOf({}) == Object.prototype);
// → true
console.log(Object.getPrototypeOf(Object.prototype));
// → null
```

{{index "getPrototypeOf function"}}

Como você pode imaginar, `Object.getPrototypeOf` retorna o protótipo de um objeto.

{{index inheritance, "Function prototype", "Array prototype", "Object prototype"}}

Muitos objetos não têm `Object.prototype` diretamente como seu ((protótipo)), mas sim outro objeto que fornece um conjunto diferente de propriedades padrão. Funções derivam de `Function.prototype` e *arrays* derivam de `Array.prototype`.

```
console.log(Object.getPrototypeOf(Math.max) ==
            Function.prototype);
// → true
console.log(Object.getPrototypeOf([]) == Array.prototype);
// → true
```

{{index "Object prototype"}}

Esse objeto protótipo terá, ele próprio, um protótipo, frequentemente `Object.prototype`, de modo que ainda fornece indiretamente métodos como `toString`.

{{index "rabbit example", "Object.create function"}}

Você pode usar `Object.create` para criar um objeto com um ((protótipo)) específico.

```{includeCode: "top_lines: 7"}
let protoRabbit = {
  speak(line) {
    console.log(`The ${this.type} rabbit says '${line}'`);
  }
};
let blackRabbit = Object.create(protoRabbit);
blackRabbit.type = "black";
blackRabbit.speak("I am fear and darkness");
// → The black rabbit says 'I am fear and darkness'
```

{{index "shared property"}}

O coelho "proto" atua como um contêiner para as propriedades compartilhadas por todos os coelhos. Um objeto coelho individual, como o coelho preto, contém propriedades que se aplicam apenas a ele mesmo — neste caso, seu tipo — e deriva propriedades compartilhadas de seu protótipo.

{{id classes}}

## Classes

{{index "object-oriented programming", "abstract data type"}}

O sistema de ((protótipo))s do JavaScript pode ser interpretado como uma abordagem um tanto livre de tipos abstratos de dados ou ((classe))s. Uma _classe_ define a forma de um tipo de objeto — quais métodos e propriedades ele tem. Tal objeto é chamado de _((instância))_ da classe.

{{index [property, inheritance]}}

Protótipos são úteis para definir propriedades cujo valor é o mesmo para todas as instâncias de uma classe. Propriedades que diferem por instância, como a propriedade `type` dos nossos coelhos, precisam ser armazenadas diretamente nos próprios objetos.

{{id constructors}}

Para criar uma instância de uma dada classe, você precisa criar um objeto que derive do protótipo adequado, mas _também_ precisa garantir que ele próprio tenha as propriedades que instâncias dessa classe devem ter. É isso que uma função _((construtora))_ faz.

```
function makeRabbit(type) {
  let rabbit = Object.create(protoRabbit);
  rabbit.type = type;
  return rabbit;
}
```

A notação de ((classe)) do JavaScript facilita a definição desse tipo de função, juntamente com um objeto ((protótipo)).

{{index "rabbit example", constructor}}

```{includeCode: true}
class Rabbit {
  constructor(type) {
    this.type = type;
  }
  speak(line) {
    console.log(`The ${this.type} rabbit says '${line}'`);
  }
}
```

{{index "prototype property", [braces, class]}}

A palavra-chave `class` inicia uma ((declaração de classe)), que nos permite definir um construtor e um conjunto de métodos juntos. Qualquer número de métodos pode ser escrito dentro das chaves da declaração. Este código tem o efeito de definir uma *binding* chamada `Rabbit`, que armazena uma função que executa o código em `constructor` e tem uma propriedade `prototype` que contém o método `speak`.

{{index "new operator", "this binding", [object, creation]}}

Essa função não pode ser chamada como uma função normal. Construtores, em JavaScript, são chamados colocando a palavra-chave `new` na frente deles. Fazer isso cria um novo objeto instância cujo protótipo é o objeto encontrado na propriedade `prototype` da função, depois executa a função com `this` vinculado ao novo objeto e, finalmente, retorna o objeto.

```{includeCode: true}
let killerRabbit = new Rabbit("killer");
```

Na verdade, `class` foi introduzido apenas na edição de 2015 do JavaScript. Qualquer função pode ser usada como construtor, e antes de 2015, a maneira de definir uma classe era escrever uma função regular e depois manipular sua propriedade `prototype`.

```
function ArchaicRabbit(type) {
  this.type = type;
}
ArchaicRabbit.prototype.speak = function(line) {
  console.log(`The ${this.type} rabbit says '${line}'`);
};
let oldSchoolRabbit = new ArchaicRabbit("old school");
```

Por essa razão, todas as funções não-arrow começam com uma propriedade `prototype` contendo um objeto vazio.

{{index capitalization}}

Por convenção, os nomes dos construtores são capitalizados para que possam ser facilmente distinguidos de outras funções.

{{index "prototype property", "getPrototypeOf function"}}

É importante entender a distinção entre a maneira como um protótipo é associado a um construtor (através de sua propriedade `prototype`) e a maneira como objetos _têm_ um protótipo (que pode ser encontrado com `Object.getPrototypeOf`). O protótipo real de um construtor é `Function.prototype`, pois construtores são funções. A _propriedade_ `prototype` da função construtora contém o protótipo usado pelas instâncias criadas através dela.

```
console.log(Object.getPrototypeOf(Rabbit) ==
            Function.prototype);
// → true
console.log(Object.getPrototypeOf(killerRabbit) ==
            Rabbit.prototype);
// → true
```

{{index constructor}}

Construtores normalmente adicionam algumas propriedades por instância a `this`. Também é possível declarar propriedades diretamente na ((declaração de classe)). Diferentemente dos métodos, essas propriedades são adicionadas aos objetos ((instância)) e não ao protótipo.

```
class Particle {
  speed = 0;
  constructor(position) {
    this.position = position;
  }
}
```

Assim como `function`, `class` pode ser usado tanto em declarações quanto em expressões. Quando usado como expressão, não define uma *binding*, mas apenas produz o construtor como valor. Você pode omitir o nome da classe em uma expressão de classe.

```
let object = new class { getWord() { return "hello"; } };
console.log(object.getWord());
// → hello
```


## Propriedades Privadas

{{index [property, private], [property, public], "class declaration"}}

É comum que classes definam algumas propriedades e ((método))s para uso interno que não fazem parte de sua ((interface)). Estas são chamadas de propriedades _privadas_, em oposição às _públicas_, que fazem parte da interface externa do objeto.

{{index [method, private]}}

Para declarar um método privado, coloque um sinal `#` na frente de seu nome. Esses métodos podem ser chamados apenas de dentro da declaração `class` que os define.

```
class SecretiveObject {
  #getSecret() {
    return "I ate all the plums";
  }
  interrogate() {
    let shallISayIt = this.#getSecret();
    return "never";
  }
}
```

Quando uma classe não declara um construtor, ela receberá automaticamente um vazio.

Se você tentar chamar `#getSecret` de fora da classe, receberá um erro. Sua existência é inteiramente oculta dentro da declaração da classe.

Para usar propriedades de instância privadas, você deve declará-las. Propriedades regulares podem ser criadas simplesmente atribuindo a elas, mas propriedades privadas _devem_ ser declaradas na declaração da classe para estarem disponíveis.

Esta classe implementa um dispositivo para obter um número inteiro aleatório abaixo de um número máximo dado. Ela tem apenas uma propriedade ((pública)): `getNumber`.

```
class RandomSource {
  #max;
  constructor(max) {
    this.#max = max;
  }
  getNumber() {
    return Math.floor(Math.random() * this.#max);
  }
}
```

## Sobrescrevendo propriedades derivadas

{{index "shared property", overriding, [property, inheritance]}}

Quando você adiciona uma propriedade a um objeto, esteja ela presente no protótipo ou não, a propriedade é adicionada ao objeto _em si_. Se já existia uma propriedade com o mesmo nome no protótipo, essa propriedade não afetará mais o objeto, pois agora está oculta atrás da própria propriedade do objeto.

```
Rabbit.prototype.teeth = "small";
console.log(killerRabbit.teeth);
// → small
killerRabbit.teeth = "long, sharp, and bloody";
console.log(killerRabbit.teeth);
// → long, sharp, and bloody
console.log((new Rabbit("basic")).teeth);
// → small
console.log(Rabbit.prototype.teeth);
// → small
```

{{index [prototype, diagram]}}

O diagrama a seguir esboça a situação depois que esse código foi executado. Os ((protótipo))s `Rabbit` e `Object` ficam atrás de `killerRabbit` como uma espécie de pano de fundo, onde propriedades que não são encontradas no objeto em si podem ser consultadas.

{{figure {url: "img/rabbits.svg", alt: "A diagram showing the object structure of rabbits and their prototypes. There is a box for the 'killerRabbit' instance (holding instance properties like 'type'), with its two prototypes, 'Rabbit.prototype' (holding the 'speak' method) and 'Object.prototype' (holding methods like 'toString') stacked behind it.",width: "8cm"}}}

{{index "shared property"}}

Sobrescrever propriedades que existem em um protótipo pode ser algo útil. Como o exemplo dos dentes de coelho mostra, a sobrescrita pode ser usada para expressar propriedades excepcionais em instâncias de uma classe mais genérica de objetos, enquanto permite que os objetos não-excepcionais obtenham um valor padrão de seu protótipo.

{{index "toString method", "Array prototype", "Function prototype"}}

A sobrescrita também é usada para dar aos protótipos padrão de funções e *arrays* um método `toString` diferente daquele do protótipo básico de objeto.

```
console.log(Array.prototype.toString ==
            Object.prototype.toString);
// → false
console.log([1, 2].toString());
// → 1,2
```

{{index "toString method", "join method", "call method"}}

Chamar `toString` em um *array* produz um resultado semelhante a chamar `.join(",")` nele — coloca vírgulas entre os valores no *array*. Chamar diretamente `Object.prototype.toString` com um *array* produz uma *string* diferente. Essa função não sabe sobre *arrays*, então simplesmente coloca a palavra _object_ e o nome do tipo entre colchetes.

```
console.log(Object.prototype.toString.call([1, 2]));
// → [object Array]
```

## Maps

{{index "map method"}}

Vimos a palavra _map_ usada no [capítulo anterior](higher_order#map) para uma operação que transforma uma estrutura de dados aplicando uma função a seus elementos. Por mais confuso que seja, na programação a mesma palavra é usada para algo relacionado, mas bastante diferente.

{{index "map (data structure)", "ages example", ["data structure", map]}}

Um _map_ (substantivo) é uma estrutura de dados que associa valores (as chaves) a outros valores. Por exemplo, você pode querer mapear nomes para idades. É possível usar objetos para isso.

```
let ages = {
  Boris: 39,
  Liang: 22,
  Júlia: 62
};

console.log(`Júlia is ${ages["Júlia"]}`);
// → Júlia is 62
console.log("Is Jack's age known?", "Jack" in ages);
// → Is Jack's age known? false
console.log("Is toString's age known?", "toString" in ages);
// → Is toString's age known? true
```

{{index "Object.prototype", "toString method"}}

Aqui, os nomes das propriedades do objeto são os nomes das pessoas e os valores das propriedades são suas idades. Mas certamente não listamos ninguém chamado toString em nosso map. No entanto, como objetos comuns derivam de `Object.prototype`, parece que a propriedade está lá.

{{index "Object.create function", prototype}}

Por essa razão, usar objetos comuns como maps é perigoso. Existem várias maneiras possíveis de evitar esse problema. Primeiro, você pode criar objetos com _nenhum_ protótipo. Se passar `null` para `Object.create`, o objeto resultante não derivará de `Object.prototype` e poderá ser usado com segurança como um map.

```
console.log("toString" in Object.create(null));
// → false
```

{{index [property, naming]}}

Nomes de propriedades de objetos devem ser *strings*. Se você precisar de um map cujas chaves não possam ser facilmente convertidas em *strings* — como objetos — não pode usar um objeto como seu map.

{{index "Map class"}}

Felizmente, JavaScript vem com uma classe chamada `Map` que é escrita exatamente para esse propósito. Ela armazena um mapeamento e permite qualquer tipo de chave.

```
let ages = new Map();
ages.set("Boris", 39);
ages.set("Liang", 22);
ages.set("Júlia", 62);

console.log(`Júlia is ${ages.get("Júlia")}`);
// → Júlia is 62
console.log("Is Jack's age known?", ages.has("Jack"));
// → Is Jack's age known? false
console.log(ages.has("toString"));
// → false
```

{{index [interface, object], "set method", "get method", "has method", encapsulation}}

Os métodos `set`, `get` e `has` fazem parte da interface do objeto `Map`. Escrever uma estrutura de dados que possa rapidamente atualizar e pesquisar em um grande conjunto de valores não é fácil, mas não precisamos nos preocupar com isso. Alguém já fez isso por nós, e podemos usar essa interface simples para utilizar o trabalho dessa pessoa.

{{index "hasOwn function", "in operator"}}

Se você tiver um objeto comum que precise tratar como map por algum motivo, é útil saber que `Object.keys` retorna apenas as chaves _próprias_ de um objeto, não aquelas do protótipo. Como alternativa ao operador `in`, você pode usar a função `Object.hasOwn`, que ignora o protótipo do objeto.

```
console.log(Object.hasOwn({x: 1}, "x"));
// → true
console.log(Object.hasOwn({x: 1}, "toString"));
// → false
```

## Polimorfismo

{{index "toString method", "String function", polymorphism, overriding, "object-oriented programming"}}

Quando você chama a função `String` (que converte um valor em *string*) em um objeto, ela chama o método `toString` nesse objeto para tentar criar uma *string* significativa a partir dele. Mencionei que alguns dos protótipos padrão definem sua própria versão de `toString` para que possam criar uma *string* que contenha informações mais úteis do que `"[object Object]"`. Você também pode fazer isso.

```{includeCode: "top_lines: 3"}
Rabbit.prototype.toString = function() {
  return `a ${this.type} rabbit`;
};

console.log(String(killerRabbit));
// → a killer rabbit
```

{{index "object-oriented programming", [interface, object]}}

Este é um exemplo simples de uma ideia poderosa. Quando um trecho de código é escrito para trabalhar com objetos que possuem uma certa interface — neste caso, um método `toString` — qualquer tipo de objeto que suporte essa interface pode ser encaixado no código e funcionará com ele.

Essa técnica é chamada de _polimorfismo_. Código polimórfico pode trabalhar com valores de diferentes formas, desde que suportem a interface que ele espera.

{{index "forEach method"}}

Um exemplo de uma interface amplamente usada é a de ((objetos semelhantes a array))s que possuem uma propriedade `length` contendo um número e propriedades numeradas para cada um de seus elementos. Tanto *arrays* quanto *strings* suportam essa interface, assim como vários outros objetos, alguns dos quais veremos mais adiante nos capítulos sobre o *browser*. Nossa implementação de `forEach` do [Capítulo ?](higher_order) funciona em qualquer coisa que forneça essa interface. Na verdade, `Array.prototype.forEach` também funciona.

```
Array.prototype.forEach.call({
  length: 2,
  0: "A",
  1: "B"
}, elt => console.log(elt));
// → A
// → B
```

## Getters, setters e estáticos

{{index [interface, object], [property, definition], "Map class"}}

Interfaces frequentemente contêm propriedades simples, não apenas métodos. Por exemplo, objetos `Map` possuem uma propriedade `size` que informa quantas chaves estão armazenadas neles.

Não é necessário que tal objeto compute e armazene essa propriedade diretamente na instância. Até propriedades que são acessadas diretamente podem esconder uma chamada de método. Esses métodos são chamados de _((getter))s_ e são definidos escrevendo `get` na frente do nome do método em uma expressão de objeto ou declaração de classe.

```{test: no}
let varyingSize = {
  get size() {
    return Math.floor(Math.random() * 100);
  }
};

console.log(varyingSize.size);
// → 73
console.log(varyingSize.size);
// → 49
```

{{index "temperature example"}}

Sempre que alguém lê a propriedade `size` deste objeto, o método associado é chamado. Você pode fazer algo semelhante quando uma propriedade é escrita, usando um _((setter))_.

```{startCode: true, includeCode: "top_lines: 16"}
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }
  get fahrenheit() {
    return this.celsius * 1.8 + 32;
  }
  set fahrenheit(value) {
    this.celsius = (value - 32) / 1.8;
  }

  static fromFahrenheit(value) {
    return new Temperature((value - 32) / 1.8);
  }
}

let temp = new Temperature(22);
console.log(temp.fahrenheit);
// → 71.6
temp.fahrenheit = 86;
console.log(temp.celsius);
// → 30
```

A classe `Temperature` permite que você leia e escreva a temperatura em graus ((Celsius)) ou graus ((Fahrenheit)), mas internamente armazena apenas Celsius e automaticamente converte de e para Celsius no *getter* e *setter* de `fahrenheit`.

{{index "static method", "static property"}}

Às vezes você quer anexar algumas propriedades diretamente à sua função construtora em vez de ao protótipo. Esses métodos não terão acesso a uma instância de classe, mas podem, por exemplo, ser usados para fornecer maneiras adicionais de criar instâncias.

Dentro de uma declaração de classe, métodos ou propriedades que têm `static` escrito antes de seu nome são armazenados no construtor. Por exemplo, a classe `Temperature` permite que você escreva `Temperature.fromFahrenheit(100)` para criar uma temperatura usando graus Fahrenheit.

```
let boil = Temperature.fromFahrenheit(212);
console.log(boil.celsius);
// → 100
```

## Symbols

{{index "for/of loop", "iterator interface"}}

Mencionei no [Capítulo ?](data#for_of_loop) que um *loop* `for`/`of` pode iterar sobre vários tipos de estruturas de dados. Este é outro caso de polimorfismo — esses *loops* esperam que a estrutura de dados exponha uma interface específica, o que *arrays* e *strings* fazem. E podemos também adicionar essa interface aos nossos próprios objetos! Mas antes de podermos fazer isso, precisamos dar uma breve olhada no tipo *symbol*.

É possível que múltiplas interfaces usem o mesmo nome de propriedade para coisas diferentes. Por exemplo, em objetos semelhantes a *arrays*, `length` se refere ao número de elementos na coleção. Mas uma interface de objeto descrevendo uma rota de caminhada poderia usar `length` para fornecer o comprimento da rota em metros. Não seria possível para um objeto se conformar a ambas as interfaces.

Um objeto tentando ser uma rota e semelhante a um *array* (talvez para enumerar seus pontos de passagem) é um tanto rebuscado, e esse tipo de problema não é tão comum na prática. Para coisas como o protocolo de iteração, porém, os designers da linguagem precisavam de um tipo de propriedade que _realmente_ não conflitasse com nenhuma outra. Então, em 2015, _((symbol))s_ foram adicionados à linguagem.

{{index "Symbol function", [property, naming]}}

A maioria das propriedades, incluindo todas as que vimos até agora, são nomeadas com *strings*. Mas também é possível usar *symbols* como nomes de propriedades. *Symbols* são valores criados com a função `Symbol`. Diferentemente de *strings*, *symbols* recém-criados são únicos — você não pode criar o mesmo *symbol* duas vezes.

```
let sym = Symbol("name");
console.log(sym == Symbol("name"));
// → false
Rabbit.prototype[sym] = 55;
console.log(killerRabbit[sym]);
// → 55
```

A *string* que você passa para `Symbol` é incluída quando você o converte para *string* e pode facilitar o reconhecimento de um *symbol* quando, por exemplo, o mostra no console. Mas ela não tem significado além disso — múltiplos *symbols* podem ter o mesmo nome.

Ser tanto único quanto utilizável como nome de propriedade torna os *symbols* adequados para definir interfaces que podem coexistir pacificamente com outras propriedades, independentemente de seus nomes.

```{includeCode: "top_lines: 1"}
const length = Symbol("length");
Array.prototype[length] = 0;

console.log([1, 2].length);
// → 2
console.log([1, 2][length]);
// → 0
```

{{index [property, naming]}}

É possível incluir propriedades *symbol* em expressões de objetos e classes usando ((colchetes)) ao redor do nome da propriedade. Isso faz com que a expressão entre os colchetes seja avaliada para produzir o nome da propriedade, de forma análoga à notação de acesso a propriedade com colchetes.

```
let myTrip = {
  length: 2,
  0: "Lankwitz",
  1: "Babelsberg",
  [length]: 21500
};
console.log(myTrip[length], myTrip.length);
// → 21500 2
```

## A interface de iteração

{{index "iterable interface", "Symbol.iterator symbol", "for/of loop"}}

O objeto passado a um *loop* `for`/`of` deve ser _iterável_. Isso significa que ele tem um método nomeado com o *symbol* `Symbol.iterator` (um valor *symbol* definido pela linguagem, armazenado como uma propriedade da função `Symbol`).

{{index "iterator interface", "next method"}}

Quando chamado, esse método deve retornar um objeto que fornece uma segunda interface, o _iterador_. Este é o que realmente itera. Ele tem um método `next` que retorna o próximo resultado. Esse resultado deve ser um objeto com uma propriedade `value` que fornece o próximo valor, se houver um, e uma propriedade `done`, que deve ser `true` quando não houver mais resultados e `false` caso contrário.

Note que os nomes das propriedades `next`, `value` e `done` são *strings* comuns, não *symbols*. Apenas `Symbol.iterator`, que provavelmente será adicionado a _muitos_ objetos diferentes, é um *symbol* de verdade.

Podemos usar essa interface nós mesmos diretamente.

```
let okIterator = "OK"[Symbol.iterator]();
console.log(okIterator.next());
// → {value: "O", done: false}
console.log(okIterator.next());
// → {value: "K", done: false}
console.log(okIterator.next());
// → {value: undefined, done: true}
```

{{index ["data structure", list], "linked list", collection}}

Vamos implementar uma estrutura de dados iterável semelhante à lista encadeada do exercício no [Capítulo ?](data). Desta vez escreveremos a lista como uma classe.

```{includeCode: true}
class List {
  constructor(value, rest) {
    this.value = value;
    this.rest = rest;
  }

  get length() {
    return 1 + (this.rest ? this.rest.length : 0);
  }

  static fromArray(array) {
    let result = null;
    for (let i = array.length - 1; i >= 0; i--) {
      result = new this(array[i], result);
    }
    return result;
  }
}
```

Note que `this`, em um método estático, aponta para o construtor da classe, não para uma instância — não existe instância quando um método estático é chamado.

Iterar sobre uma lista deve retornar todos os elementos da lista do início ao fim. Escreveremos uma classe separada para o iterador.

{{index "ListIterator class"}}

```{includeCode: true}
class ListIterator {
  constructor(list) {
    this.list = list;
  }

  next() {
    if (this.list == null) {
      return {done: true};
    }
    let value = this.list.value;
    this.list = this.list.rest;
    return {value, done: false};
  }
}
```

A classe rastreia o progresso da iteração pela lista atualizando sua propriedade `list` para avançar ao próximo objeto da lista sempre que um valor é retornado, e indica que terminou quando essa lista está vazia (null).

Vamos configurar a classe `List` para ser iterável. Ao longo deste livro, ocasionalmente usarei manipulação de protótipo após o fato para adicionar métodos a classes, para que os trechos individuais de código permaneçam pequenos e autocontidos. Em um programa regular, onde não há necessidade de dividir o código em pequenos pedaços, você declararia esses métodos diretamente na classe.

```{includeCode: true}
List.prototype[Symbol.iterator] = function() {
  return new ListIterator(this);
};
```

{{index "for/of loop"}}

Agora podemos iterar sobre uma lista com `for`/`of`.

```
let list = List.fromArray([1, 2, 3]);
for (let element of list) {
  console.log(element);
}
// → 1
// → 2
// → 3
```

{{index spread}}

A sintaxe `...` em notação de *array* e chamadas de função funciona de forma semelhante com qualquer objeto iterável. Por exemplo, você pode usar `[...value]` para criar um *array* contendo os elementos de um objeto iterável arbitrário.

```
console.log([..."PCI"]);
// → ["P", "C", "I"]
```

## Herança

{{index inheritance, "linked list", "object-oriented programming", "LengthList class"}}

Imagine que precisamos de um tipo de lista muito parecido com a classe `List` que vimos antes, mas como pediremos seu comprimento o tempo todo, não queremos que ela tenha que percorrer seu `rest` a cada vez. Em vez disso, queremos armazenar o comprimento em cada instância para acesso eficiente.

{{index overriding, prototype}}

O sistema de protótipos do JavaScript torna possível criar uma _nova_ classe, muito parecida com a antiga, mas com novas definições para algumas de suas propriedades. O protótipo da nova classe deriva do antigo protótipo, mas adiciona uma nova definição para, digamos, o *getter* `length`.

Em termos de programação orientada a objetos, isso é chamado de _((herança))_. A nova classe herda propriedades e comportamento da antiga classe.

```{includeCode: "top_lines: 12"}
class LengthList extends List {
  #length;

  constructor(value, rest) {
    super(value, rest);
    this.#length = super.length;
  }

  get length() {
    return this.#length;
  }
}

console.log(LengthList.fromArray([1, 2, 3]).length);
// → 3
```

O uso da palavra `extends` indica que esta classe não deve ser baseada diretamente no protótipo padrão `Object`, mas em alguma outra classe. Esta é chamada de _((superclasse))_. A classe derivada é a _((subclasse))_.

Para inicializar uma instância de `LengthList`, o construtor chama o construtor de sua superclasse através da palavra-chave `super`. Isso é necessário porque, se esse novo objeto deve se comportar (aproximadamente) como uma `List`, ele vai precisar das propriedades de instância que listas possuem.

O construtor então armazena o comprimento da lista em uma propriedade privada. Se tivéssemos escrito `this.length` ali, o próprio *getter* da classe teria sido chamado, o que não funciona ainda, pois `#length` ainda não foi preenchido. Podemos usar `super.something` para chamar métodos e *getters* no protótipo da superclasse, o que frequentemente é útil.

A herança nos permite construir tipos de dados levemente diferentes a partir de tipos de dados existentes com relativamente pouco trabalho. Ela é uma parte fundamental da tradição orientada a objetos, junto com o encapsulamento e o polimorfismo. Mas enquanto os dois últimos são agora geralmente considerados ideias maravilhosas, a herança é mais controversa.

{{index complexity, reuse, "class hierarchy"}}

Enquanto o ((encapsulamento)) e o polimorfismo podem ser usados para _separar_ partes do código umas das outras, reduzindo o emaranhamento geral do programa, a ((herança)) fundamentalmente amarra classes entre si, criando _mais_ emaranhamento. Quando se herda de uma classe, geralmente é preciso saber mais sobre como ela funciona do que quando simplesmente a usa. A herança pode ser uma ferramenta útil para tornar alguns tipos de programas mais sucintos, mas não deveria ser a primeira ferramenta a que você recorre, e provavelmente não deveria procurar ativamente por oportunidades de construir hierarquias de classes (árvores genealógicas de classes).

## O operador instanceof

{{index type, "instanceof operator", constructor, object}}

Ocasionalmente é útil saber se um objeto foi derivado de uma classe específica. Para isso, JavaScript fornece um operador binário chamado `instanceof`.

```
console.log(
  new LengthList(1, null) instanceof LengthList);
// → true
console.log(new LengthList(2, null) instanceof List);
// → true
console.log(new List(3, null) instanceof LengthList);
// → false
console.log([1] instanceof Array);
// → true
```

{{index inheritance}}

O operador enxerga através dos tipos herdados, então uma `LengthList` é uma instância de `List`. O operador também pode ser aplicado a construtores padrão como `Array`. Quase todo objeto é uma instância de `Object`.

## Resumo

Objetos fazem mais do que apenas armazenar suas próprias propriedades. Eles possuem protótipos, que são outros objetos. Eles agirão como se tivessem propriedades que não possuem, desde que seu protótipo tenha essa propriedade. Objetos simples têm `Object.prototype` como seu protótipo.

Construtores, que são funções cujos nomes geralmente começam com letra maiúscula, podem ser usados com o operador `new` para criar novos objetos. O protótipo do novo objeto será o objeto encontrado na propriedade `prototype` do construtor. Você pode fazer bom uso disso colocando as propriedades que todos os valores de um dado tipo compartilham em seu protótipo. Existe uma notação `class` que fornece uma maneira clara de definir um construtor e seu protótipo.

Você pode definir *getters* e *setters* para chamar métodos secretamente toda vez que uma propriedade de um objeto é acessada. Métodos estáticos são métodos armazenados no construtor de uma classe em vez de em seu protótipo.

O operador `instanceof` pode, dado um objeto e um construtor, dizer se aquele objeto é uma instância daquele construtor.

Uma coisa útil a fazer com objetos é especificar uma interface para eles e dizer a todos que devem se comunicar com seu objeto apenas através dessa interface. O restante dos detalhes que compõem seu objeto são agora _encapsulados_, ocultos atrás da interface. Você pode usar propriedades privadas para esconder uma parte de seu objeto do mundo exterior.

Mais de um tipo pode implementar a mesma interface. Código escrito para usar uma interface automaticamente sabe como trabalhar com qualquer número de objetos diferentes que forneçam a interface. Isso é chamado de _polimorfismo_.

Quando se implementam múltiplas classes que diferem apenas em alguns detalhes, pode ser útil escrever as novas classes como _subclasses_ de uma classe existente, _herdando_ parte de seu comportamento.

## Exercícios

{{id exercise_vector}}

### Um tipo vetor

{{index dimensions, "Vec class", coordinates, "vector (exercise)"}}

Escreva uma ((classe)) `Vec` que represente um vetor em espaço bidimensional. Ela recebe parâmetros `x` e `y` (números), que salva em propriedades de mesmo nome.

{{index addition, subtraction}}

Dê ao protótipo de `Vec` dois métodos, `plus` e `minus`, que recebem outro vetor como parâmetro e retornam um novo vetor que tem a soma ou diferença dos valores _x_ e _y_ dos dois vetores (`this` e o parâmetro).

Adicione uma propriedade ((getter)) `length` ao protótipo que calcula o comprimento do vetor — ou seja, a distância do ponto (_x_, _y_) até a origem (0, 0).

{{if interactive

```{test: no}
// Seu código aqui.

console.log(new Vec(1, 2).plus(new Vec(2, 3)));
// → Vec{x: 3, y: 5}
console.log(new Vec(1, 2).minus(new Vec(2, 3)));
// → Vec{x: -1, y: -1}
console.log(new Vec(3, 4).length);
// → 5
```
if}}

{{hint

{{index "vector (exercise)"}}

Consulte o exemplo da classe `Rabbit` se não tiver certeza de como declarações `class` se parecem.

{{index Pythagoras, "defineProperty function", "square root", "Math.sqrt function"}}

Adicionar uma propriedade *getter* ao construtor pode ser feito colocando a palavra `get` antes do nome do método. Para calcular a distância de (0, 0) até (x, y), você pode usar o teorema de Pitágoras, que diz que o quadrado da distância que procuramos é igual ao quadrado da coordenada x mais o quadrado da coordenada y. Assim, [√(x^2^ + y^2^)]{if html}[[$\sqrt{x^2 + y^2}$]{latex}]{if tex} é o número que você quer. `Math.sqrt` é a maneira de calcular uma raiz quadrada em JavaScript e `x ** 2` pode ser usado para elevar um número ao quadrado.

hint}}

### Grupos

{{index "groups (exercise)", "Set class", "Group class", "set (data structure)"}}

{{id groups}}

O ambiente padrão do JavaScript fornece outra estrutura de dados chamada `Set`. Como uma instância de `Map`, um conjunto armazena uma coleção de valores. Diferentemente de `Map`, ele não associa outros valores a esses — ele apenas rastreia quais valores fazem parte do conjunto. Um valor pode fazer parte de um conjunto apenas uma vez — adicioná-lo novamente não tem efeito.

{{index "add method", "delete method", "has method"}}

Escreva uma classe chamada `Group` (já que `Set` já está em uso). Como `Set`, ela tem métodos `add`, `delete` e `has`. Seu construtor cria um grupo vazio, `add` adiciona um valor ao grupo (mas apenas se ele já não for um membro), `delete` remove seu argumento do grupo (se era um membro) e `has` retorna um valor booleano indicando se seu argumento é um membro do grupo.

{{index "=== operator", "indexOf method"}}

Use o operador `===`, ou algo equivalente como `indexOf`, para determinar se dois valores são iguais.

{{index "static method"}}

Dê à classe um método estático `from` que recebe um objeto iterável como argumento e cria um grupo que contém todos os valores produzidos pela iteração sobre ele.

{{if interactive

```{test: no}
class Group {
  // Seu código aqui.
}

let group = Group.from([10, 20]);
console.log(group.has(10));
// → true
console.log(group.has(30));
// → false
group.add(10);
group.delete(10);
console.log(group.has(10));
// → false
```

if}}

{{hint

{{index "groups (exercise)", "Group class", "indexOf method", "includes method"}}

A maneira mais fácil de fazer isso é armazenar um *array* de membros do grupo em uma propriedade de instância. Os métodos `includes` ou `indexOf` podem ser usados para verificar se um dado valor está no *array*.

{{index "push method"}}

O ((construtor)) da sua classe pode definir a coleção de membros como um *array* vazio. Quando `add` é chamado, ele deve verificar se o valor dado está no *array* ou adicioná-lo caso contrário, possivelmente usando `push`.

{{index "filter method"}}

Deletar um elemento de um *array*, no `delete`, é menos direto, mas você pode usar `filter` para criar um novo *array* sem o valor. Não esqueça de sobrescrever a propriedade que armazena os membros com a versão recém-filtrada do *array*.

{{index "for/of loop", "iterable interface"}}

O método `from` pode usar um *loop* `for`/`of` para obter os valores do objeto iterável e chamar `add` para colocá-los em um grupo recém-criado.

hint}}

### Grupos iteráveis

{{index "groups (exercise)", [interface, object], "iterator interface", "Group class"}}

{{id group_iterator}}

Torne a classe `Group` do exercício anterior iterável. Consulte a seção sobre a interface de iteração mais cedo neste capítulo se não tiver clareza sobre a forma exata da interface.

Se você usou um *array* para representar os membros do grupo, não retorne simplesmente o iterador criado chamando o método `Symbol.iterator` no *array*. Isso funcionaria, mas frustra o propósito deste exercício.

Não há problema se o seu iterador se comportar de forma estranha quando o grupo é modificado durante a iteração.

{{if interactive

```{test: no}
// Seu código aqui (e o código do exercício anterior)

for (let value of Group.from(["a", "b", "c"])) {
  console.log(value);
}
// → a
// → b
// → c
```

if}}

{{hint

{{index "groups (exercise)", "Group class", "next method"}}

Provavelmente vale a pena definir uma nova classe `GroupIterator`. Instâncias do iterador devem ter uma propriedade que rastreia a posição atual no grupo. Toda vez que `next` é chamado, ele verifica se terminou e, se não, avança além do valor atual e o retorna.

A própria classe `Group` recebe um método nomeado por `Symbol.iterator` que, quando chamado, retorna uma nova instância da classe iteradora para aquele grupo.

hint}}
