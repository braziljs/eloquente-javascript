{{meta {load_files: ["code/journal.js", "code/chapter/04_data.js"], zip: "node/html"}}}

# Estruturas de Dados: Objetos e Arrays

{{quote {author: "Charles Babbage", title: "Passages from the Life of a Philosopher (1864)", chapter: true}

On two occasions I have been asked, 'Pray, Mr. Babbage, if you put into the machine wrong figures, will the right answers come out?' [...] I am not able rightly to apprehend the kind of confusion of ideas that could provoke such a question.

quote}}

{{index "Babbage, Charles"}}

{{figure {url: "img/chapter_picture_4.jpg", alt: "Illustration of a squirrel next to a pile of books and a pair of glasses. A moon and stars are visible in the background.", chapter: framed}}}

{{index object, "data structure"}}

Números, booleanos e strings são os átomos a partir dos quais estruturas de ((dados)) são construídas. Muitos tipos de informação requerem mais de um átomo, porém. _Objetos_ nos permitem agrupar valores — incluindo outros objetos — para construir estruturas mais complexas.

Os programas que construímos até agora foram limitados pelo fato de que operavam apenas sobre tipos de dados simples. Após aprender o básico de estruturas de dados neste capítulo, você saberá o suficiente para começar a escrever programas úteis.

O capítulo trabalhará com um exemplo de programação mais ou menos realista, introduzindo conceitos conforme se aplicam ao problema em questão. O código de exemplo frequentemente se apoiará em funções e bindings introduzidos anteriormente no livro.

{{if book

O ((sandbox)) de codificação online para o livro ([_https://eloquentjavascript.net/code_](https://eloquentjavascript.net/code)) fornece uma forma de executar código no contexto de um capítulo específico. Se decidir trabalhar nos exemplos em outro ambiente, certifique-se de primeiro baixar o código completo deste capítulo da página do sandbox.

if}}

## O lobisomem-esquilo

{{index "weresquirrel example", lycanthropy}}

De vez em quando, geralmente entre 20h e 22h, ((Jacques)) se vê transformando em um pequeno roedor peludo com uma cauda espessa.

Por um lado, Jacques está bastante contente por não ter licantropia clássica. Transformar-se em um esquilo causa menos problemas do que transformar-se em um lobo. Em vez de ter que se preocupar em acidentalmente comer o vizinho (_isso_ seria constrangedor), ele se preocupa em ser comido pelo gato do vizinho. Depois de duas ocasiões de acordar em um galho precariamente fino na copa de um carvalho, nu e desorientado, ele passou a trancar as portas e janelas do seu quarto à noite e colocar algumas nozes no chão para se manter ocupado.

Mas Jacques preferiria se livrar totalmente de sua condição. As ocorrências irregulares da transformação o fazem suspeitar que podem ser desencadeadas por algo. Por um tempo, ele acreditou que acontecia apenas em dias em que estivera perto de carvalhos. Porém, evitar carvalhos não resolveu o problema.

{{index journal}}

Mudando para uma abordagem mais científica, Jacques começou a manter um registro diário de tudo que faz em um dado dia e se mudou de forma. Com esses dados, ele espera restringir as condições que desencadeiam as transformações.

A primeira coisa de que ele precisa é uma estrutura de dados para armazenar essa informação.

## Conjuntos de dados

{{index ["data structure", collection], [memory, organization]}}

Para trabalhar com um pedaço de dados digitais, primeiro precisamos encontrar uma forma de representá-lo na memória da nossa máquina. Digamos, por exemplo, que queremos representar uma ((coleção)) dos números 2, 3, 5, 7 e 11.

{{index string}}

Poderíamos ser criativos com strings — afinal, strings podem ter qualquer comprimento, então podemos colocar muitos dados nelas — e usar `"2 3 5 7 11"` como nossa representação. Mas isso é desajeitado. Teríamos que de alguma forma extrair os dígitos e convertê-los de volta para números para acessá-los.

{{index [array, creation], "[] (array)"}}

Felizmente, JavaScript fornece um tipo de dado especificamente para armazenar sequências de valores. É chamado de _array_ e é escrito como uma lista de valores entre ((colchetes)), separados por vírgulas.

```
let listOfNumbers = [2, 3, 5, 7, 11];
console.log(listOfNumbers[2]);
// → 5
console.log(listOfNumbers[0]);
// → 2
console.log(listOfNumbers[2 - 1]);
// → 3
```

{{index "[] (subscript)", [array, indexing]}}

A notação para acessar os elementos dentro de um array também usa ((colchetes)). Um par de colchetes imediatamente após uma expressão, com outra expressão dentro deles, procurará o elemento na expressão à esquerda que corresponde ao _((índice))_ dado pela expressão entre colchetes.

{{id array_indexing}}
{{index "zero-based counting"}}

O primeiro índice de um array é zero, não um, então o primeiro elemento é obtido com `listOfNumbers[0]`. A contagem baseada em zero tem uma longa tradição em tecnologia e de certas formas faz muito sentido, mas leva algum tempo para se acostumar. Pense no índice como o número de itens a pular, contando a partir do início do array.

{{id properties}}

## Propriedades

{{index "Math object", "Math.max function", ["length property", "for string"], [object, property], "period character", [property, access]}}

Vimos algumas expressões como `myString.length` (para obter o comprimento de uma string) e `Math.max` (a função de máximo) em capítulos anteriores. Essas expressões acessam uma _propriedade_ de algum valor. No primeiro caso, acessamos a propriedade `length` do valor em `myString`. No segundo, acessamos a propriedade chamada `max` no objeto `Math` (que é uma coleção de constantes e funções relacionadas à matemática).

{{index [property, access], null, undefined}}

Quase todos os valores JavaScript têm propriedades. As exceções são `null` e `undefined`. Se você tentar acessar uma propriedade em um desses não-valores, obterá um erro:

```{test: no}
null.length;
// → TypeError: null has no properties
```

{{indexsee "dot character", "period character"}}
{{index "[] (subscript)", "period character", "square brackets", "computed property", [property, access]}}

As duas principais formas de acessar propriedades em JavaScript são com um ponto e com colchetes. Tanto `value.x` quanto `value[x]` acessam uma propriedade em `value` — mas não necessariamente a mesma propriedade. A diferença está em como `x` é interpretado. Ao usar um ponto, a palavra após o ponto é o nome literal da propriedade. Ao usar colchetes, a expressão entre os colchetes é _avaliada_ para obter o nome da propriedade. Enquanto `value.x` busca a propriedade de `value` chamada "x", `value[x]` pega o valor da variável chamada `x` e o usa, convertido para string, como nome da propriedade.

Se você sabe que a propriedade em que está interessado se chama _color_, você diz `value.color`. Se quer extrair a propriedade nomeada pelo valor mantido no binding `i`, você diz `value[i]`. Nomes de propriedades são strings. Podem ser qualquer string, mas a notação de ponto funciona apenas com nomes que parecem nomes válidos de binding — começando com uma letra ou sublinhado, e contendo apenas letras, números e sublinhados. Se quiser acessar uma propriedade chamada _2_ ou _John Doe_, deve usar colchetes: `value[2]` ou `value["John Doe"]`.

Os elementos em um ((array)) são armazenados como propriedades do array, usando números como nomes de propriedades. Como você não pode usar a notação de ponto com números e geralmente quer usar um binding que contém o índice de qualquer forma, precisa usar a notação de colchetes para acessá-los.

{{index ["length property", "for array"], [array, "length of"]}}

Assim como strings, arrays têm uma propriedade `length` que nos diz quantos elementos o array tem.

{{id methods}}

## Métodos

{{index [function, "as property"], method, string}}

Tanto valores de string quanto de array contêm, além da propriedade `length`, uma série de propriedades que contêm valores de função.

```
let doh = "Doh";
console.log(typeof doh.toUpperCase);
// → function
console.log(doh.toUpperCase());
// → DOH
```

{{index "case conversion", "toUpperCase method", "toLowerCase method"}}

Toda string tem uma propriedade `toUpperCase`. Quando chamada, retornará uma cópia da string em que todas as letras foram convertidas para maiúsculas. Existe também `toLowerCase`, que faz o inverso.

{{index "this binding"}}

Curiosamente, embora a chamada a `toUpperCase` não passe nenhum argumento, a função de alguma forma tem acesso à string `"Doh"`, o valor cuja propriedade chamamos. Você descobrirá como isso funciona no [Capítulo ?](object#obj_methods).

Propriedades que contêm funções são geralmente chamadas de _métodos_ do valor a que pertencem, como em "`toUpperCase` é um método de uma string".

{{id array_methods}}

Este exemplo demonstra dois métodos que você pode usar para manipular arrays.

```
let sequence = [1, 2, 3];
sequence.push(4);
sequence.push(5);
console.log(sequence);
// → [1, 2, 3, 4, 5]
console.log(sequence.pop());
// → 5
console.log(sequence);
// → [1, 2, 3, 4]
```

{{index collection, array, "push method", "pop method"}}

O método `push` adiciona valores ao final de um array. O método `pop` faz o oposto, removendo o último valor do array e retornando-o.

{{index ["data structure", stack]}}

Esses nomes um tanto bobos são os termos tradicionais para operações em uma _((pilha))_. Uma pilha, em programação, é uma estrutura de dados que permite empurrar valores para dentro dela e retirá-los na ordem inversa, de modo que o que foi adicionado por último é removido primeiro. Pilhas são comuns em programação — você pode lembrar da ((pilha de chamadas)) de funções do [capítulo anterior](functions#stack), que é um exemplo da mesma ideia.

## Objetos

{{index journal, "weresquirrel example", array, record}}

De volta ao lobisomem-esquilo. Um conjunto de entradas de registro diário pode ser representado como um array, mas as entradas não consistem apenas de um número ou uma string — cada entrada precisa armazenar uma lista de atividades e um valor booleano que indica se Jacques se transformou em esquilo ou não. Idealmente, gostaríamos de agrupar estes juntos em um único valor e então colocar esses valores agrupados em um array de entradas de registro.

{{index [syntax, object], [property, definition], [braces, object], "{} (object)"}}

Valores do tipo _((objeto))_ são coleções arbitrárias de propriedades. Uma forma de criar um objeto é usando chaves como uma expressão.

```
let day1 = {
  squirrel: false,
  events: ["work", "touched tree", "pizza", "running"]
};
console.log(day1.squirrel);
// → false
console.log(day1.wolf);
// → undefined
day1.wolf = false;
console.log(day1.wolf);
// → false
```

{{index [quoting, "of object properties"], "colon character"}}

Dentro das chaves, você escreve uma lista de propriedades separadas por vírgulas. Cada propriedade tem um nome seguido de dois-pontos e um valor. Quando um objeto é escrito em múltiplas linhas, indentá-lo como mostrado neste exemplo ajuda na legibilidade. Propriedades cujos nomes não são nomes válidos de binding ou números válidos devem ser colocados entre aspas:

```
let descriptions = {
  work: "Went to work",
  "touched tree": "Touched a tree"
};
```

{{index [braces, object]}}

Isso significa que chaves têm _dois_ significados em JavaScript. No início de uma ((instrução)), elas iniciam um ((bloco)) de instruções. Em qualquer outra posição, elas descrevem um objeto. Felizmente, raramente é útil iniciar uma instrução com um objeto em chaves, então a ambiguidade entre esses dois não é um grande problema. O único caso em que isso surge é quando você quer retornar um objeto de uma arrow function abreviada — você não pode escrever `n => {prop: n}` pois as chaves serão interpretadas como um corpo de função. Em vez disso, você precisa colocar parênteses ao redor do objeto para deixar claro que é uma expressão.

{{index undefined}}

Ler uma propriedade que não existe lhe dará o valor `undefined`.

{{index [property, assignment], mutability, "= operator"}}

É possível atribuir um valor a uma expressão de propriedade com o operador `=`. Isso substituirá o valor da propriedade se ela já existia ou criará uma nova propriedade no objeto se não existia.

{{index "tentacle (analogy)", [property, "model of"], [binding, "model of"]}}

Para retornar brevemente ao nosso modelo de tentáculos de ((binding))s — bindings de propriedades são similares. Eles _agarram_ valores, mas outros bindings e propriedades podem estar segurando esses mesmos valores. Você pode pensar em objetos como polvos com qualquer número de tentáculos, cada um com um nome escrito nele.

{{index "delete operator", [property, deletion]}}

O operador `delete` corta um tentáculo de tal polvo. É um operador unário que, quando aplicado a uma propriedade de objeto, removerá a propriedade nomeada do objeto. Isso não é algo comum de se fazer, mas é possível.

```
let anObject = {left: 1, right: 2};
console.log(anObject.left);
// → 1
delete anObject.left;
console.log(anObject.left);
// → undefined
console.log("left" in anObject);
// → false
console.log("right" in anObject);
// → true
```

{{index "in operator", [property, "testing for"], object}}

O operador binário `in`, quando aplicado a uma string e um objeto, lhe diz se aquele objeto tem uma propriedade com aquele nome. A diferença entre definir uma propriedade como `undefined` e realmente deletá-la é que, no primeiro caso, o objeto ainda _tem_ a propriedade (ela simplesmente não tem um valor muito interessante), enquanto no segundo caso, a propriedade não está mais presente e `in` retornará `false`.

{{index "Object.keys function"}}

Para descobrir quais propriedades um objeto tem, você pode usar a função `Object.keys`. Dê a ela um objeto e ela retornará um array de strings — os nomes das propriedades do objeto:

```
console.log(Object.keys({x: 0, y: 0, z: 2}));
// → ["x", "y", "z"]
```

Há uma função `Object.assign` que copia todas as propriedades de um objeto para outro:

```
let objectA = {a: 1, b: 2};
Object.assign(objectA, {b: 3, c: 4});
console.log(objectA);
// → {a: 1, b: 3, c: 4}
```

{{index array, collection}}

Arrays, então, são apenas um tipo de objeto especializado para armazenar sequências de coisas. Se você avaliar `typeof []`, ele produz `"object"`. Você pode visualizar arrays como polvos longos e achatados com todos os seus tentáculos em uma fileira organizada, rotulados com números.

{{index journal, "weresquirrel example"}}

Jacques representará o diário que ele mantém como um array de objetos:

```{test: wrap}
let journal = [
  {events: ["work", "touched tree", "pizza",
            "running", "television"],
   squirrel: false},
  {events: ["work", "ice cream", "cauliflower",
            "lasagna", "touched tree", "brushed teeth"],
   squirrel: false},
  {events: ["weekend", "cycling", "break", "peanuts",
            "beer"],
   squirrel: true},
  /* E assim por diante... */
];
```

## Mutabilidade

Em breve chegaremos à programação de verdade, mas primeiro, há mais um pedaço de teoria para entender.

{{index mutability, "side effect", number, string, Boolean, [object, mutability]}}

Vimos que valores de objetos podem ser modificados. Os tipos de valores discutidos em capítulos anteriores, como números, strings e booleanos, são todos _((imutáveis))_ — é impossível mudar valores desses tipos. Você pode combiná-los e derivar novos valores deles, mas quando você pega um valor de string específico, esse valor sempre permanecerá o mesmo. O texto dentro dele não pode ser alterado. Se você tem uma string que contém `"cat"`, não é possível que outro código mude um caractere na sua string para fazê-la dizer `"rat"`.

Objetos funcionam de forma diferente. Você _pode_ mudar suas propriedades, fazendo com que um único valor de objeto tenha conteúdo diferente em momentos diferentes.

{{index [object, identity], identity, [memory, organization], mutability}}

Quando temos dois números, 120 e 120, podemos considerá-los precisamente o mesmo número, quer se refiram ou não aos mesmos bits físicos. Com objetos, há uma diferença entre ter duas referências ao mesmo objeto e ter dois objetos diferentes que contêm as mesmas propriedades. Considere o seguinte código:

```
let object1 = {value: 10};
let object2 = object1;
let object3 = {value: 10};

console.log(object1 == object2);
// → true
console.log(object1 == object3);
// → false

object1.value = 15;
console.log(object2.value);
// → 15
console.log(object3.value);
// → 10
```

{{index "tentacle (analogy)", [binding, "model of"]}}

Os bindings `object1` e `object2` agarram o _mesmo_ objeto, razão pela qual mudar `object1` também muda o valor de `object2`. Diz-se que eles têm a mesma _identidade_. O binding `object3` aponta para um objeto diferente, que inicialmente contém as mesmas propriedades que `object1` mas vive uma vida separada.

{{index "const keyword", "let keyword", [binding, "as state"]}}

Bindings também podem ser mutáveis ou constantes, mas isso é separado da forma como seus valores se comportam. Embora valores numéricos não mudem, você pode usar um binding `let` para acompanhar um número que muda, mudando o valor para o qual o binding aponta. Similarmente, embora um binding `const` para um objeto não possa ser mudado e continuará a apontar para o mesmo objeto, o _conteúdo_ desse objeto pode mudar.

```{test: no}
const score = {visitors: 0, home: 0};
// Isso é ok
score.visitors = 1;
// Isso não é permitido
score = {visitors: 1, home: 1};
```

{{index "== operator", [comparison, "of objects"], "deep comparison"}}

Quando você compara objetos com o operador `==` do JavaScript, ele compara por identidade: produzirá `true` apenas se ambos os objetos forem precisamente o mesmo valor. Comparar objetos diferentes retornará `false`, mesmo que tenham propriedades idênticas. Não há operação de comparação "profunda" embutida no JavaScript que compare objetos por conteúdo, mas é possível escrevê-la você mesmo (que é um dos [exercícios](data#exercise_deep_compare) no final deste capítulo).

## O registro do licantropo

{{index "weresquirrel example", lycanthropy, "addEntry function"}}

Jacques inicia seu interpretador JavaScript e configura o ambiente necessário para manter seu ((diário)):

```{includeCode: true}
let journal = [];

function addEntry(events, squirrel) {
  journal.push({events, squirrel});
}
```

{{index [braces, object], "{} (object)", [property, definition]}}

Note que o objeto adicionado ao diário parece um pouco estranho. Em vez de declarar propriedades como `events: events`, ele apenas dá um nome de propriedade: `events`. Isso é uma abreviação que significa a mesma coisa — se um nome de propriedade em notação de chaves não é seguido por um valor, seu valor é tomado do binding com o mesmo nome.

Toda noite às 22h — ou às vezes na manhã seguinte, após descer da prateleira mais alta de sua estante — Jacques registra o dia:

```
addEntry(["work", "touched tree", "pizza", "running",
          "television"], false);
addEntry(["work", "ice cream", "cauliflower", "lasagna",
          "touched tree", "brushed teeth"], false);
addEntry(["weekend", "cycling", "break", "peanuts",
          "beer"], true);
```

Uma vez que tenha pontos de dados suficientes, pretende usar estatística para descobrir quais desses eventos podem estar relacionados às esquilificações.

{{index correlation}}

_Correlação_ é uma medida de ((dependência)) entre variáveis estatísticas. Uma variável estatística não é exatamente a mesma coisa que uma variável de programação. Em estatística, você tipicamente tem um conjunto de _medições_, e cada variável é medida para cada medição. Correlação entre variáveis é geralmente expressa como um valor que varia de -1 a 1. Correlação zero significa que as variáveis não estão relacionadas. Uma correlação de 1 indica que as duas são perfeitamente relacionadas — se você sabe uma, também sabe a outra. Menos 1 também significa que as variáveis são perfeitamente relacionadas mas são opostas — quando uma é verdadeira, a outra é falsa.

{{index "phi coefficient"}}

Para calcular a medida de correlação entre duas variáveis booleanas, podemos usar o _coeficiente phi_ (_ϕ_). Esta é uma fórmula cuja entrada é uma ((tabela de frequência)) contendo o número de vezes que as diferentes combinações das variáveis foram observadas. A saída da fórmula é um número entre -1 e 1 que descreve a correlação.

Poderíamos pegar o evento de comer ((pizza)) e colocá-lo em uma tabela de frequência como esta, onde cada número indica o número de vezes que essa combinação ocorreu em nossas medições.

{{figure {url: "img/pizza-squirrel.svg", alt: "A two-by-two table showing the pizza variable on the horizontal, and the squirrel variable on the vertical axis. Each cell show how many time that combination occurred. In 76 cases, neither happened. In 9 cases, only pizza was true. In 4 cases only squirrel was true. And in one case both occurred.", width: "7cm"}}}

Se chamarmos essa tabela de _n_, podemos calcular _ϕ_ usando a seguinte fórmula:

{{if html

<div> <table style="border-collapse: collapse; margin-left: 1em;"><tr>   <td style="vertical-align: middle"><em>ϕ</em> =</td>   <td style="padding-left: .5em">     <div style="border-bottom: 1px solid black; padding: 0 7px;"><em>n</em><sub>11</sub><em>n</em><sub>00</sub> −       <em>n</em><sub>10</sub><em>n</em><sub>01</sub></div>     <div style="padding: 0 7px;">√<span style="border-top: 1px solid black; position: relative; top: 2px;">       <span style="position: relative; top: -4px"><em>n</em><sub>1•</sub><em>n</em><sub>0•</sub><em>n</em><sub>•1</sub><em>n</em><sub>•0</sub></span>     </span></div>   </td> </tr></table> </div>

if}}

{{if tex

[\begin{equation}\varphi = \frac{n_{11}n_{00}-n_{10}n_{01}}{\sqrt{n_{1\bullet}n_{0\bullet}n_{\bullet1}n_{\bullet0}}}\end{equation}]{latex}

if}}

(Se neste ponto você está largando o livro para focar em um terrível flashback de aulas de matemática do ensino médio — espere! Não tenho a intenção de torturá-lo com páginas infinitas de notação críptica — é apenas essa fórmula por enquanto. E mesmo com essa, tudo que fazemos é transformá-la em JavaScript.)

A notação [_n_~01~]{if html}[[$n_{01}$]{latex}]{if tex} indica o número de medições onde a primeira variável (esquilidade) é falsa (0) e a segunda variável (pizza) é verdadeira (1). Na tabela de pizza, [_n_~01~]{if html}[[$n_{01}$]{latex}]{if tex} é 9.

O valor [_n_~1•~]{if html}[[$n_{1\bullet}$]{latex}]{if tex} se refere à soma de todas as medições onde a primeira variável é verdadeira, que é 5 na tabela de exemplo. Da mesma forma, [_n_~•0~]{if html}[[$n_{\bullet0}$]{latex}]{if tex} se refere à soma das medições onde a segunda variável é falsa.

{{index correlation, "phi coefficient"}}

Então para a tabela de pizza, a parte acima da linha de divisão (o dividendo) seria 1×76−4×9 = 40, e a parte abaixo (o divisor) seria a raiz quadrada de 5×85×10×80, ou [√340.000]{if html}[[$\sqrt{340,000}$]{latex}]{if tex}. Isso resulta em _ϕ_ ≈ 0,069, que é minúsculo. Comer ((pizza)) não parece ter influência nas transformações.

## Calculando correlação

{{index [array, "as table"], [nesting, "of arrays"]}}

Podemos representar uma ((tabela)) dois-por-dois em JavaScript com um array de quatro elementos (`[76, 9, 4, 1]`). Poderíamos também usar outras representações, como um array contendo dois arrays de dois elementos (`[[76, 9], [4, 1]]`) ou um objeto com nomes de propriedade como `"11"` e `"01"`, mas o array plano é simples e torna as expressões que acessam a tabela agradavelmente curtas. Interpretaremos os índices do array como ((número))s ((binário))s de dois ((bit))s, onde o dígito mais à esquerda (mais significativo) se refere à variável esquilo e o dígito mais à direita (menos significativo) se refere à variável do evento. Por exemplo, o número binário `10` se refere ao caso em que Jacques se transformou em esquilo, mas o evento (digamos, "pizza") não ocorreu. Isso aconteceu quatro vezes. E como o binário `10` é 2 em notação decimal, armazenaremos esse número no índice 2 do array.

{{index "phi coefficient", "phi function"}}

{{id phi_function}}

Esta é a função que calcula o coeficiente _ϕ_ a partir de tal array:

```{includeCode: strip_log, test: clip}
function phi(table) {
  return (table[3] * table[0] - table[2] * table[1]) /
    Math.sqrt((table[2] + table[3]) *
              (table[0] + table[1]) *
              (table[1] + table[3]) *
              (table[0] + table[2]));
}

console.log(phi([76, 9, 4, 1]));
// → 0.068599434
```

{{index "square root", "Math.sqrt function"}}

Esta é uma tradução direta da fórmula _ϕ_ para JavaScript. `Math.sqrt` é a função de raiz quadrada, conforme fornecida pelo objeto `Math` em um ambiente JavaScript padrão. Temos que adicionar dois campos da tabela para obter campos como [n~1•~]{if html}[[$n_{1\bullet}$]{latex}]{if tex} porque as somas de linhas ou colunas não são armazenadas diretamente em nossa estrutura de dados.

{{index "JOURNAL dataset"}}

Jacques mantém seu diário por três meses. O ((conjunto de dados)) resultante está disponível no [sandbox de codificação](https://eloquentjavascript.net/code#4) para este capítulo[ ([_https://eloquentjavascript.net/code#4_](https://eloquentjavascript.net/code#4))]{if book}, onde é armazenado no binding `JOURNAL`, e em um [arquivo](https://eloquentjavascript.net/code/journal.js) para download.

{{index "tableFor function"}}

Para extrair uma ((tabela)) dois-por-dois para um evento específico do diário, devemos percorrer todas as entradas e contabilizar quantas vezes o evento ocorre em relação às transformações em esquilo:

```{includeCode: strip_log}
function tableFor(event, journal) {
  let table = [0, 0, 0, 0];
  for (let i = 0; i < journal.length; i++) {
    let entry = journal[i], index = 0;
    if (entry.events.includes(event)) index += 1;
    if (entry.squirrel) index += 2;
    table[index] += 1;
  }
  return table;
}

console.log(tableFor("pizza", JOURNAL));
// → [76, 9, 4, 1]
```

{{index [array, searching], "includes method"}}

Arrays têm um método `includes` que verifica se um dado valor existe no array. A função usa isso para determinar se o nome do evento em que está interessada faz parte da lista de eventos para um dado dia.

{{index [array, indexing]}}

O corpo do loop em `tableFor` descobre em qual caixa da tabela cada entrada do diário se encaixa verificando se a entrada contém o evento específico em que está interessada e se o evento acontece junto com um incidente de esquilo. O loop então adiciona um à caixa correta na tabela.

Agora temos as ferramentas necessárias para calcular ((correlações)) individuais. O único passo restante é encontrar uma correlação para cada tipo de evento que foi registrado e ver se algo se destaca.

{{id for_of_loop}}

## Loops de array

{{index "for loop", loop, [array, iteration]}}

Na função `tableFor`, há um loop assim:

```
for (let i = 0; i < JOURNAL.length; i++) {
  let entry = JOURNAL[i];
  // Fazer algo com entry
}
```

Esse tipo de loop é comum no JavaScript clássico — percorrer arrays um elemento de cada vez é algo que surge muito, e para fazer isso você executa um contador pelo comprimento do array e seleciona cada elemento por vez.

Há uma forma mais simples de escrever tais loops no JavaScript moderno:

```
for (let entry of JOURNAL) {
  console.log(`${entry.events.length} events.`);
}
```

{{index "for/of loop"}}

Quando um loop `for` usa a palavra `of` após sua definição de variável, ele percorrerá os elementos do valor dado após `of`. Isso funciona não apenas para arrays mas também para strings e algumas outras estruturas de dados. Discutiremos _como_ funciona no [Capítulo ?](object).

{{id analysis}}

## A análise final

{{index journal, "weresquirrel example", "journalEvents function"}}

Precisamos calcular uma correlação para cada tipo de evento que ocorre no conjunto de dados. Para fazer isso, primeiro precisamos _encontrar_ cada tipo de evento.

{{index "includes method", "push method"}}

```{includeCode: "strip_log"}
function journalEvents(journal) {
  let events = [];
  for (let entry of journal) {
    for (let event of entry.events) {
      if (!events.includes(event)) {
        events.push(event);
      }
    }
  }
  return events;
}

console.log(journalEvents(JOURNAL));
// → ["carrot", "exercise", "weekend", "bread", …]
```

Adicionando quaisquer nomes de eventos que ainda não estão nele ao array `events`, a função coleta cada tipo de evento.

Usando essa função, podemos ver todas as ((correlações)):

```{test: no}
for (let event of journalEvents(JOURNAL)) {
  console.log(event + ":", phi(tableFor(event, JOURNAL)));
}
// → carrot:   0.0140970969
// → exercise: 0.0685994341
// → weekend:  0.1371988681
// → bread:   -0.0757554019
// → pudding: -0.0648203724
// E assim por diante...
```

A maioria das correlações parece estar perto de zero. Comer cenouras, pão ou pudim aparentemente não desencadeia a licantropia-esquilo. As transformações _parecem_ ocorrer um pouco mais nos finais de semana. Vamos filtrar os resultados para mostrar apenas correlações maiores que 0,1 ou menores que -0,1:

```{test: no, startCode: true}
for (let event of journalEvents(JOURNAL)) {
  let correlation = phi(tableFor(event, JOURNAL));
  if (correlation > 0.1 || correlation < -0.1) {
    console.log(event + ":", correlation);
  }
}
// → weekend:        0.1371988681
// → brushed teeth: -0.3805211953
// → candy:          0.1296407447
// → work:          -0.1371988681
// → spaghetti:      0.2425356250
// → reading:        0.1106828054
// → peanuts:        0.5902679812
```

Ahá! Há dois fatores com uma ((correlação)) claramente mais forte que os outros. Comer ((amendoins)) tem um forte efeito positivo na chance de se transformar em esquilo, enquanto escovar os dentes tem um significativo efeito negativo.

Interessante. Vamos tentar algo.

```
for (let entry of JOURNAL) {
  if (entry.events.includes("peanuts") &&
     !entry.events.includes("brushed teeth")) {
    entry.events.push("peanut teeth");
  }
}
console.log(phi(tableFor("peanut teeth", JOURNAL)));
// → 1
```

É um resultado forte. O fenômeno ocorre precisamente quando Jacques come ((amendoins)) e não escova os dentes. Se pelo menos ele não fosse tão desleixado com a higiene dental, nem teria notado sua aflição.

Sabendo disso, Jacques para de comer amendoins completamente e descobre que suas transformações param.

{{index "weresquirrel example"}}

Mas são necessários apenas alguns meses para ele notar que algo está faltando nessa forma inteiramente humana de viver. Sem suas aventuras selvagens, Jacques quase não se sente vivo. Ele decide que prefere ser um animal selvagem em tempo integral. Depois de construir uma bela casinha na árvore na floresta e equipá-la com um dispensador de pasta de amendoim e um suprimento de pasta de amendoim para dez anos, ele se transforma uma última vez, e vive a curta e energética vida de um esquilo.

## Mais sobre arrays

{{index [array, methods], [method, array]}}

Antes de terminar o capítulo, quero apresentar mais alguns conceitos relacionados a objetos. Começarei com alguns métodos de array geralmente úteis.

{{index "push method", "pop method", "shift method", "unshift method"}}

Vimos `push` e `pop`, que adicionam e removem elementos no final de um array, [mais cedo](data#array_methods) neste capítulo. Os métodos correspondentes para adicionar e remover coisas no início de um array são chamados `unshift` e `shift`.

```
let todoList = [];
function remember(task) {
  todoList.push(task);
}
function getTask() {
  return todoList.shift();
}
function rememberUrgently(task) {
  todoList.unshift(task);
}
```

{{index "task management example"}}

Esse programa gerencia uma fila de tarefas. Você adiciona tarefas ao final da fila chamando `remember("groceries")`, e quando está pronto para fazer algo, chama `getTask()` para obter (e remover) o item da frente da fila. A função `rememberUrgently` também adiciona uma tarefa, mas a adiciona à frente em vez do final da fila.

{{index [array, searching], "indexOf method", "lastIndexOf method"}}

Para buscar um valor específico, arrays fornecem um método `indexOf`. O método busca pelo array do início ao fim e retorna o índice em que o valor solicitado foi encontrado — ou -1 se não foi encontrado. Para buscar do final em vez do início, há um método similar chamado `lastIndexOf`:

```
console.log([1, 2, 3, 2, 1].indexOf(2));
// → 1
console.log([1, 2, 3, 2, 1].lastIndexOf(2));
// → 3
```

Tanto `indexOf` quanto `lastIndexOf` aceitam um segundo argumento opcional que indica de onde começar a busca.

{{index "slice method", [array, indexing]}}

Outro método fundamental de array é `slice`, que recebe índices de início e fim e retorna um array que contém apenas os elementos entre eles. O índice de início é inclusivo e o índice de fim é exclusivo.

```
console.log([0, 1, 2, 3, 4].slice(2, 4));
// → [2, 3]
console.log([0, 1, 2, 3, 4].slice(2));
// → [2, 3, 4]
```

{{index [string, indexing]}}

Quando o índice de fim não é dado, `slice` pegará todos os elementos após o índice de início. Você também pode omitir o índice de início para copiar o array inteiro.

{{index concatenation, "concat method"}}

O método `concat` pode ser usado para juntar arrays e criar um novo array, similar ao que o operador `+` faz para strings.

O exemplo a seguir mostra tanto `concat` quanto `slice` em ação. Ele recebe um array e um índice e retorna um novo array que é uma cópia do array original com o elemento no índice dado removido:

```
function remove(array, index) {
  return array.slice(0, index)
    .concat(array.slice(index + 1));
}
console.log(remove(["a", "b", "c", "d", "e"], 2));
// → ["a", "b", "d", "e"]
```

Se você passar a `concat` um argumento que não é um array, esse valor será adicionado ao novo array como se fosse um array de um elemento.

## Strings e suas propriedades

{{index [string, properties]}}

Podemos ler propriedades como `length` e `toUpperCase` de valores de string. Mas se tentarmos adicionar uma nova propriedade, ela não persiste.

```
let kim = "Kim";
kim.age = 88;
console.log(kim.age);
// → undefined
```

Valores do tipo string, number e Boolean não são objetos, e embora a linguagem não reclame se você tentar definir novas propriedades neles, na verdade não armazena essas propriedades. Como mencionado antes, tais valores são imutáveis e não podem ser alterados.

{{index [string, methods], "slice method", "indexOf method", [string, searching]}}

Mas esses tipos têm propriedades embutidas. Toda string tem uma série de métodos. Alguns muito úteis são `slice` e `indexOf`, que se assemelham aos métodos de array com o mesmo nome:

```
console.log("coconuts".slice(4, 7));
// → nut
console.log("coconut".indexOf("u"));
// → 5
```

Uma diferença é que o `indexOf` de uma string pode buscar uma string contendo mais de um caractere, enquanto o método de array correspondente busca apenas um único elemento:

```
console.log("one two three".indexOf("ee"));
// → 11
```

{{index [whitespace, trimming], "trim method"}}

O método `trim` remove espaços em branco (espaços, novas linhas, tabulações e caracteres similares) do início e do final de uma string:

```
console.log("  okay \n ".trim());
// → okay
```

{{id padStart}}

A função `zeroPad` do [capítulo anterior](functions) também existe como método. É chamada `padStart` e recebe o comprimento desejado e o caractere de preenchimento como argumentos:

```
console.log(String(6).padStart(3, "0"));
// → 006
```

{{id split}}

{{index "split method"}}

Você pode dividir uma string em cada ocorrência de outra string com `split` e juntá-la novamente com `join`:

```
let sentence = "Secretarybirds specialize in stomping";
let words = sentence.split(" ");
console.log(words);
// → ["Secretarybirds", "specialize", "in", "stomping"]
console.log(words.join(". "));
// → Secretarybirds. specialize. in. stomping
```

{{index "repeat method"}}

Uma string pode ser repetida com o método `repeat`, que cria uma nova string contendo múltiplas cópias da string original, coladas juntas:

```
console.log("LA".repeat(3));
// → LALALA
```

{{index ["length property", "for string"], [string, indexing]}}

Já vimos a propriedade `length` do tipo string. Acessar os caracteres individuais em uma string se parece com acessar elementos de um array (com uma complicação que discutiremos no [Capítulo ?](higher_order#code_units)).

```
let string = "abc";
console.log(string.length);
// → 3
console.log(string[1]);
// → b
```

{{id rest_parameters}}

## Parâmetros rest

{{index "Math.max function", "period character", "max example", spread, [array, "of rest arguments"]}}

Pode ser útil para uma função aceitar qualquer número de ((argumento))s. Por exemplo, `Math.max` calcula o máximo de _todos_ os argumentos que recebe. Para escrever tal função, você coloca três pontos antes do último ((parâmetro)) da função, assim:

```{includeCode: strip_log}
function max(...numbers) {
  let result = -Infinity;
  for (let number of numbers) {
    if (number > result) result = number;
  }
  return result;
}
console.log(max(4, 1, 9, -2));
// → 9
```

Quando tal função é chamada, o _((parâmetro rest))_ é vinculado a um array contendo todos os argumentos subsequentes. Se houver outros parâmetros antes dele, seus valores não fazem parte desse array. Quando, como em `max`, é o único parâmetro, ele conterá todos os argumentos.

{{index [function, application]}}

Você pode usar uma notação similar de três pontos para _chamar_ uma função com um array de argumentos.

```
let numbers = [5, 1, 7];
console.log(max(...numbers));
// → 7
```

Isso "((espalha))" o array na chamada de função, passando seus elementos como argumentos separados. É possível incluir um array assim junto com outros argumentos, como em `max(9, ...numbers, 2)`.

{{index "[] (array)"}}

A notação de colchetes de array similarmente permite que o operador de três pontos espalhe outro array no novo array:

```
let words = ["never", "fully"];
console.log(["will", ...words, "understand"]);
// → ["will", "never", "fully", "understand"]
```

{{index "{} (object)"}}

Isso funciona até em objetos com chaves, onde adiciona todas as propriedades de outro objeto. Se uma propriedade é adicionada múltiplas vezes, o último valor a ser adicionado vence:

```
let coordinates = {x: 10, y: 0};
console.log({...coordinates, y: 5, z: 1});
// → {x: 10, y: 5, z: 1}
```

## O objeto Math

{{index "Math object", "Math.min function", "Math.max function", "Math.sqrt function", minimum, maximum, "square root"}}

Como já vimos, `Math` é um saco de utilidades numéricas, como `Math.max` (máximo), `Math.min` (mínimo) e `Math.sqrt` (raiz quadrada).

{{index namespace, [object, property]}}

{{id namespace_pollution}}

O objeto `Math` é usado como contêiner para agrupar funcionalidades relacionadas. Há apenas um objeto `Math`, e ele quase nunca é útil como valor. Em vez disso, ele fornece um _namespace_ para que todas essas funções e valores não precisem ser bindings globais.

{{index [binding, naming]}}

Ter muitos bindings globais "polui" o namespace. Quanto mais nomes forem tomados, mais provável é que você acidentalmente sobrescreva o valor de algum binding existente. Por exemplo, não é improvável que você queira nomear algo como `max` em um de seus programas. Como a função `max` embutida do JavaScript está guardada com segurança dentro do objeto `Math`, você não precisa se preocupar em sobrescrevê-la.

{{index "let keyword", "const keyword"}}

Muitas linguagens irão pará-lo, ou pelo menos avisá-lo, quando você estiver definindo um binding com um nome que já está tomado. JavaScript faz isso para bindings que você declarou com `let` ou `const` mas — perversamente — não para bindings padrão nem para bindings declarados com `var` ou `function`.

{{index "Math.cos function", "Math.sin function", "Math.tan function", "Math.acos function", "Math.asin function", "Math.atan function", "Math.PI constant", cosine, sine, tangent, "PI constant", pi}}

De volta ao objeto `Math`. Se precisar fazer ((trigonometria)), `Math` pode ajudar. Ele contém `cos` (cosseno), `sin` (seno) e `tan` (tangente), bem como suas funções inversas, `acos`, `asin` e `atan`, respectivamente. O número π (pi) — ou pelo menos a aproximação mais próxima que cabe em um número JavaScript — está disponível como `Math.PI`. Há uma velha tradição de programação de escrever os nomes de valores ((constante))s em letras maiúsculas.

```{test: no}
function randomPointOnCircle(radius) {
  let angle = Math.random() * 2 * Math.PI;
  return {x: radius * Math.cos(angle),
          y: radius * Math.sin(angle)};
}
console.log(randomPointOnCircle(2));
// → {x: 0.3667, y: 1.966}
```

Se você não está familiarizado com senos e cossenos, não se preocupe. Vou explicá-los quando forem usados no [Capítulo ?](dom#sin_cos).

{{index "Math.random function", "random number"}}

O exemplo anterior usou `Math.random`. Esta é uma função que retorna um novo número pseudoaleatório entre 0 (inclusivo) e 1 (exclusivo) toda vez que você a chama:

```{test: no}
console.log(Math.random());
// → 0.36993729369714856
console.log(Math.random());
// → 0.727367032552138
console.log(Math.random());
// → 0.40180766698904335
```

{{index "pseudorandom number", "random number"}}

Embora computadores sejam máquinas determinísticas — sempre reagem da mesma forma dado o mesmo input — é possível fazê-los produzir números que parecem aleatórios. Para fazer isso, a máquina mantém algum valor oculto, e sempre que você pede um novo número aleatório, ela realiza computações complicadas nesse valor oculto para criar um novo valor. Ela armazena um novo valor e retorna algum número derivado dele. Dessa forma, pode produzir números sempre novos e difíceis de prever de uma forma que _parece_ aleatória.

{{index rounding, "Math.floor function"}}

Se quisermos um número inteiro aleatório em vez de um fracionário, podemos usar `Math.floor` (que arredonda para baixo até o número inteiro mais próximo) no resultado de `Math.random`:

```{test: no}
console.log(Math.floor(Math.random() * 10));
// → 2
```

Multiplicar o número aleatório por 10 nos dá um número maior ou igual a 0 e menor que 10. Como `Math.floor` arredonda para baixo, essa expressão produzirá, com chance igual, qualquer número de 0 a 9.

{{index "Math.ceil function", "Math.round function", "Math.abs function", "absolute value"}}

Há também as funções `Math.ceil` (de "ceiling" ou "teto", que arredonda para cima até um número inteiro), `Math.round` (para o número inteiro mais próximo) e `Math.abs`, que pega o valor absoluto de um número, significando que nega valores negativos mas deixa os positivos como estão.

## Desestruturação

{{index "phi function"}}

Vamos retornar à função `phi` por um momento.

```{test: wrap}
function phi(table) {
  return (table[3] * table[0] - table[2] * table[1]) /
    Math.sqrt((table[2] + table[3]) *
              (table[0] + table[1]) *
              (table[1] + table[3]) *
              (table[0] + table[2]));
}
```

{{index "destructuring binding", parameter}}

Uma razão pela qual esta função é desajeitada de ler é que temos um binding apontando para nosso array, mas preferiríamos muito ter bindings para os _elementos_ do array — ou seja, `let n00 = table[0]` e assim por diante. Felizmente, há uma forma sucinta de fazer isso em JavaScript:

```
function phi([n00, n01, n10, n11]) {
  return (n11 * n00 - n10 * n01) /
    Math.sqrt((n10 + n11) * (n00 + n01) *
              (n01 + n11) * (n00 + n10));
}
```

{{index "let keyword", "var keyword", "const keyword", [binding, destructuring]}}

Isso também funciona para bindings criados com `let`, `var` ou `const`. Se você sabe que o valor que está vinculando é um array, pode usar ((colchetes)) para "olhar dentro" do valor, vinculando seu conteúdo.

{{index [object, property], [braces, object]}}

Um truque similar funciona para objetos, usando chaves em vez de colchetes.

```
let {name} = {name: "Faraji", age: 23};
console.log(name);
// → Faraji
```

{{index null, undefined}}

Note que se você tentar desestruturar `null` ou `undefined`, obterá um erro, assim como obteria se tentasse acessar diretamente uma propriedade desses valores.

## Acesso opcional a propriedades

{{index "optional chaining", "period character"}}

Quando você não tem certeza se um dado valor produz um objeto, mas ainda quer ler uma propriedade dele quando produz, pode usar uma variante da notação de ponto: `object?.property`.

```
function city(object) {
  return object.address?.city;
}
console.log(city({address: {city: "Toronto"}}));
// → Toronto
console.log(city({name: "Vera"}));
// → undefined
```

A expressão `a?.b` significa o mesmo que `a.b` quando `a` não é null nem undefined. Quando é, ela avalia para `undefined`. Isso pode ser conveniente quando, como no exemplo, você não tem certeza de que uma dada propriedade existe ou quando uma variável pode conter um valor indefinido.

Uma notação similar pode ser usada com acesso por colchetes, e até com chamadas de função, colocando `?.` na frente dos parênteses ou colchetes:

```
console.log("string".notAMethod?.());
// → undefined
console.log({}.arrayProp?.[0]);
// → undefined
```

## JSON

{{index [array, representation], [object, representation], "data format", [memory, organization]}}

Como propriedades agarram seu valor em vez de contê-lo, objetos e arrays são armazenados na memória do computador como sequências de bits contendo os _((endereço))s_ — o lugar na memória — de seu conteúdo. Um array com outro array dentro dele consiste em (pelo menos) uma região de memória para o array interno e outra para o array externo, contendo (entre outras coisas) um número que representa o endereço do array interno.

Se você quer salvar dados em um arquivo para uso posterior ou enviá-los para outro computador pela rede, precisa de alguma forma converter esses emaranhados de endereços de memória em uma descrição que possa ser armazenada ou enviada. Você _poderia_ enviar toda a memória do seu computador junto com o endereço do valor em que está interessado, suponho, mas essa não parece ser a melhor abordagem.

{{indexsee "JavaScript Object Notation", JSON}}

{{index serialization, "World Wide Web"}}

O que podemos fazer é _serializar_ os dados. Isso significa convertê-los em uma descrição plana. Um formato de serialização popular é chamado _((JSON))_ (pronuncia-se "Jason"), que significa JavaScript Object Notation. É amplamente usado como formato de armazenamento e comunicação de dados na web, mesmo com linguagens diferentes de JavaScript.

{{index [array, notation], [object, creation], [quoting, "in JSON"], comment}}

JSON se parece com a forma do JavaScript de escrever arrays e objetos, com algumas restrições. Todos os nomes de propriedades devem estar entre aspas duplas, e apenas expressões de dados simples são permitidas — sem chamadas de função, bindings ou qualquer coisa que envolva computação real. Comentários não são permitidos em JSON.

Uma entrada de diário pode parecer assim quando representada como dados JSON:

```{lang: "json"}
{
  "squirrel": false,
  "events": ["work", "touched tree", "pizza", "running"]
}
```

{{index "JSON.stringify function", "JSON.parse function", serialization, deserialization, parsing}}

JavaScript nos dá as funções `JSON.stringify` e `JSON.parse` para converter dados de e para esse formato. A primeira recebe um valor JavaScript e retorna uma string codificada em JSON. A segunda recebe tal string e a converte no valor que ela codifica:

```
let string = JSON.stringify({squirrel: false,
                             events: ["weekend"]});
console.log(string);
// → {"squirrel":false,"events":["weekend"]}
console.log(JSON.parse(string).events);
// → ["weekend"]
```

## Resumo

Objetos e arrays fornecem formas de agrupar vários valores em um único valor. Isso nos permite colocar um monte de coisas relacionadas em um saco e correr com o saco em vez de envolver nossos braços ao redor de todas as coisas individuais e tentar segurá-las separadamente.

A maioria dos valores em JavaScript tem propriedades, com as exceções sendo `null` e `undefined`. Propriedades são acessadas usando `value.prop` ou `value["prop"]`. Objetos tendem a usar nomes para suas propriedades e armazenar um conjunto mais ou menos fixo delas. Arrays, por outro lado, geralmente contêm quantidades variáveis de valores conceitualmente idênticos e usam números (começando de 0) como nomes de suas propriedades.

_Existem_ algumas propriedades nomeadas em arrays, como `length` e uma série de métodos. Métodos são funções que vivem em propriedades e (geralmente) agem sobre o valor do qual são propriedade.

Você pode iterar sobre arrays usando um tipo especial de loop `for`: `for (let element of array)`.

## Exercícios

### A soma de um intervalo

{{index "summing (exercise)"}}

A [introdução](intro) deste livro aludiu ao seguinte como uma forma elegante de calcular a soma de um intervalo de números:

```{test: no}
console.log(sum(range(1, 10)));
```

{{index "range function", "sum function"}}

Escreva uma função `range` que recebe dois argumentos, `start` e `end`, e retorna um array contendo todos os números de `start` até e incluindo `end`.

Em seguida, escreva uma função `sum` que recebe um array de números e retorna a soma desses números. Execute o programa de exemplo e veja se ele de fato retorna 55.

{{index "optional argument"}}

Como tarefa bônus, modifique sua função `range` para receber um terceiro argumento opcional que indica o valor de "passo" usado ao construir o array. Se nenhum passo for dado, os elementos devem subir em incrementos de um, correspondendo ao comportamento antigo. A chamada de função `range(1, 10, 2)` deve retornar `[1, 3, 5, 7, 9]`. Certifique-se de que isso também funciona com valores de passo negativos para que `range(5, 2, -1)` produza `[5, 4, 3, 2]`.

{{if interactive

```{test: no}
// Seu código aqui.

console.log(range(1, 10));
// → [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
console.log(range(5, 2, -1));
// → [5, 4, 3, 2]
console.log(sum(range(1, 10)));
// → 55
```

if}}

{{hint

{{index "summing (exercise)", [array, creation], "square brackets"}}

Construir um array é mais facilmente feito inicializando primeiro um binding com `[]` (um novo array vazio) e chamando repetidamente seu método `push` para adicionar um valor. Não se esqueça de retornar o array no final da função.

{{index [array, indexing], comparison}}

Como o limite final é inclusivo, você precisará usar o operador `<=` em vez de `<` para verificar o final do seu loop.

O parâmetro de passo pode ser um parâmetro opcional que tem como padrão (usando o operador `=`) o valor 1.

{{index "range function", "for loop"}}

Fazer `range` entender valores de passo negativos é provavelmente melhor feito escrevendo dois loops separados — um para contar para cima e um para contar para baixo — porque a comparação que verifica se o loop terminou precisa ser `>=` em vez de `<=` quando contando para baixo.

Também pode valer a pena usar um passo padrão diferente, nomeadamente -1, quando o final do intervalo é menor que o início. Dessa forma, `range(5, 2)` retorna algo significativo em vez de ficar preso em um ((loop infinito)). É possível se referir a parâmetros anteriores no valor padrão de um parâmetro.

hint}}

### Invertendo um array

{{index "reversing (exercise)", "reverse method", [array, methods]}}

Arrays têm um método `reverse` que muda o array invertendo a ordem em que seus elementos aparecem. Para este exercício, escreva duas funções, `reverseArray` e `reverseArrayInPlace`. A primeira, `reverseArray`, deve receber um array como argumento e produzir um _novo_ array que tem os mesmos elementos na ordem inversa. A segunda, `reverseArrayInPlace`, deve fazer o que o método `reverse` faz: _modificar_ o array dado como argumento invertendo seus elementos. Nenhuma das duas pode usar o método `reverse` padrão.

{{index efficiency, "pure function", "side effect"}}

Pensando nas notas sobre efeitos colaterais e funções puras no [capítulo anterior](functions#pure), qual variante você espera ser útil em mais situações? Qual é mais rápida?

{{if interactive

```{test: no}
// Seu código aqui.

let myArray = ["A", "B", "C"];
console.log(reverseArray(myArray));
// → ["C", "B", "A"];
console.log(myArray);
// → ["A", "B", "C"];
let arrayValue = [1, 2, 3, 4, 5];
reverseArrayInPlace(arrayValue);
console.log(arrayValue);
// → [5, 4, 3, 2, 1]
```

if}}

{{hint

{{index "reversing (exercise)"}}

Existem duas formas óbvias de implementar `reverseArray`. A primeira é simplesmente percorrer o array de entrada da frente para trás e usar o método `unshift` no novo array para inserir cada elemento no seu início. A segunda é percorrer o array de entrada de trás para frente e usar o método `push`. Iterar sobre um array de trás para frente requer uma especificação `for` (um tanto desajeitada), como `(let i = array.length - 1; i >= 0; i--)`.

{{index "slice method"}}

Inverter o array no lugar é mais difícil. Você precisa ter cuidado para não sobrescrever elementos que precisará depois. Usar `reverseArray` ou copiar o array inteiro (`array.slice()` é uma boa forma de copiar um array) funciona mas é trapaça.

O truque é _trocar_ o primeiro e o último elementos, depois o segundo e o penúltimo, e assim por diante. Você pode fazer isso percorrendo metade do comprimento do array (use `Math.floor` para arredondar para baixo — você não precisa tocar o elemento do meio em um array com número ímpar de elementos) e trocando o elemento na posição `i` com o da posição `array.length - 1 - i`. Você pode usar um binding local para manter brevemente um dos elementos, sobrescrever aquele com sua imagem espelhada e então colocar o valor do binding local no lugar onde a imagem espelhada estava.

hint}}

{{id list}}

### Uma lista

{{index ["data structure", list], "list (exercise)", "linked list", array, collection}}

Como blobs genéricos de valores, objetos podem ser usados para construir todo tipo de estruturas de dados. Uma estrutura de dados comum é a _lista_ (não confundir com arrays). Uma lista é um conjunto aninhado de objetos, com o primeiro objeto contendo uma referência ao segundo, o segundo ao terceiro, e assim por diante:

```{includeCode: true}
let list = {
  value: 1,
  rest: {
    value: 2,
    rest: {
      value: 3,
      rest: null
    }
  }
};
```

Os objetos resultantes formam uma cadeia, como mostrado no diagrama a seguir:

{{figure {url: "img/linked-list.svg", alt: "A diagram showing the memory structure of a linked list. There are 3 cells, each with a value field holding a number, and a 'rest' field with an arrow to the rest of the list. The first cell's arrow points at the second cell, the second cell's arrow at the last cell, and the last cell's 'rest' field holds null.",width: "8cm"}}}

{{index "structure sharing", [memory, structure sharing]}}

Uma coisa legal sobre listas é que elas podem compartilhar partes de sua estrutura. Por exemplo, se eu criar dois novos valores `{value: 0, rest: list}` e `{value: -1, rest: list}` (com `list` se referindo ao binding definido antes), ambos são listas independentes, mas compartilham a estrutura que compõe seus últimos três elementos. A lista original também continua sendo uma lista válida de três elementos.

Escreva uma função `arrayToList` que constrói uma estrutura de lista como a mostrada quando recebe `[1, 2, 3]` como argumento. Também escreva uma função `listToArray` que produz um array a partir de uma lista. Adicione as funções auxiliares `prepend`, que recebe um elemento e uma lista e cria uma nova lista que adiciona o elemento à frente da lista de entrada, e `nth`, que recebe uma lista e um número e retorna o elemento na posição dada na lista (com zero se referindo ao primeiro elemento) ou `undefined` quando não há tal elemento.

{{index recursion}}

Se ainda não o fez, também escreva uma versão recursiva de `nth`.

{{if interactive

```{test: no}
// Seu código aqui.

console.log(arrayToList([10, 20]));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(listToArray(arrayToList([10, 20, 30])));
// → [10, 20, 30]
console.log(prepend(10, prepend(20, null)));
// → {value: 10, rest: {value: 20, rest: null}}
console.log(nth(arrayToList([10, 20, 30]), 1));
// → 20
```

if}}

{{hint

{{index "list (exercise)", "linked list"}}

Construir uma lista é mais fácil quando feito de trás para frente. Então `arrayToList` poderia iterar sobre o array de trás para frente (veja o exercício anterior) e, para cada elemento, adicionar um objeto à lista. Você pode usar um binding local para manter a parte da lista que foi construída até agora e usar uma atribuição como `list = {value: X, rest: list}` para adicionar um elemento.

{{index "for loop"}}

Para percorrer uma lista (em `listToArray` e `nth`), uma especificação de loop `for` como esta pode ser usada:

```
for (let node = list; node; node = node.rest) {}
```

Consegue ver como funciona? A cada iteração do loop, `node` aponta para a sublista atual, e o corpo pode ler sua propriedade `value` para obter o elemento atual. No final de uma iteração, `node` avança para a próxima sublista. Quando é `null`, chegamos ao final da lista, e o loop termina.

{{index recursion}}

A versão recursiva de `nth` vai, similarmente, olhar para uma parte cada vez menor da "cauda" da lista e ao mesmo tempo contar o índice para baixo até chegar a zero, momento em que pode retornar a propriedade `value` do nó que está olhando. Para obter o elemento zero de uma lista, basta pegar a propriedade `value` de seu nó cabeça. Para obter o elemento _N_ + 1, você pega o *N*-ésimo elemento da lista que está na propriedade `rest` desta lista.

hint}}

{{id exercise_deep_compare}}

### Comparação profunda

{{index "deep comparison (exercise)", [comparison, deep], "deep comparison", "== operator"}}

O operador `==` compara objetos por identidade, mas às vezes você prefere comparar os valores de suas propriedades reais.

Escreva uma função `deepEqual` que recebe dois valores e retorna `true` apenas se eles forem o mesmo valor ou forem objetos com as mesmas propriedades, onde os valores das propriedades são iguais quando comparados com uma chamada recursiva a `deepEqual`.

{{index null, "=== operator", "typeof operator"}}

Para descobrir se valores devem ser comparados diretamente (usando o operador `===` para isso) ou ter suas propriedades comparadas, você pode usar o operador `typeof`. Se ele produzir `"object"` para ambos os valores, você deve fazer uma comparação profunda. Mas precisa considerar uma exceção boba: por um acidente histórico, `typeof null` também produz `"object"`.

{{index "Object.keys function"}}

A função `Object.keys` será útil quando você precisar percorrer as propriedades dos objetos para compará-los.

{{if interactive

```{test: no}
// Seu código aqui.

let obj = {here: {is: "an"}, object: 2};
console.log(deepEqual(obj, obj));
// → true
console.log(deepEqual(obj, {here: 1, object: 2}));
// → false
console.log(deepEqual(obj, {here: {is: "an"}, object: 2}));
// → true
```

if}}

{{hint

{{index "deep comparison (exercise)", [comparison, deep], "typeof operator", "=== operator"}}

Seu teste para se você está lidando com um objeto real se parecerá com algo como `typeof x == "object" && x != null`. Tenha cuidado para comparar propriedades apenas quando _ambos_ os argumentos forem objetos. Em todos os outros casos, você pode simplesmente retornar imediatamente o resultado de aplicar `===`.

{{index "Object.keys function"}}

Use `Object.keys` para percorrer as propriedades. Você precisa testar se ambos os objetos têm o mesmo conjunto de nomes de propriedades e se essas propriedades têm valores idênticos. Uma forma de fazer isso é garantir que ambos os objetos tenham o mesmo número de propriedades (os comprimentos das listas de propriedades são os mesmos). E então, ao percorrer as propriedades de um dos objetos para compará-las, sempre primeiro certifique-se de que o outro realmente tem uma propriedade com aquele nome. Se tiverem o mesmo número de propriedades e todas as propriedades de um também existirem no outro, eles têm o mesmo conjunto de nomes de propriedades.

{{index "return value"}}

Retornar o valor correto da função é melhor feito retornando imediatamente `false` quando uma diferença é encontrada e retornando `true` no final da função.

hint}}
