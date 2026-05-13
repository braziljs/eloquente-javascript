{{meta {load_files: ["code/chapter/08_error.js"]}}}

# Bugs e Erros

{{quote {author: "Brian Kernighan and P.J. Plauger", title: "The Elements of Programming Style", chapter: true}

Depurar é duas vezes mais difícil do que escrever o código. Portanto, se você escreve o código da maneira mais inteligente possível, você é, por definição, não inteligente o suficiente para depurá-lo.

quote}}

{{figure {url: "img/chapter_picture_8.jpg", alt: "Illustration showing various insects and a centipede", chapter: framed}}}

{{index "Kernighan, Brian", "Plauger, P.J.", debugging, "error handling"}}

Falhas em programas de computador são geralmente chamadas de _((bug))s_. Faz os programadores se sentirem bem imaginar que são coisinhas que simplesmente se esgueiram para dentro do nosso trabalho. Na realidade, é claro, somos nós que as colocamos lá.

Se um programa é pensamento cristalizado, podemos categorizar *bugs* grosseiramente entre aqueles causados por pensamentos confusos e aqueles causados por erros introduzidos ao converter um pensamento em código. O primeiro tipo é geralmente mais difícil de diagnosticar e corrigir do que o segundo.

## Linguagem

{{index parsing, analysis}}

Muitos erros poderiam ser apontados automaticamente pelo computador se ele soubesse o suficiente sobre o que estamos tentando fazer. Mas aqui, a flexibilidade do JavaScript é um empecilho. Seu conceito de *bindings* e propriedades é vago o suficiente para que raramente detecte ((erros de digitação)) antes de realmente executar o programa. Mesmo então, ele permite que você faça algumas coisas claramente absurdas sem reclamar, como calcular `true * "monkey"`.

{{index [syntax, error], [property, access]}}

Há algumas coisas sobre as quais o JavaScript reclama. Escrever um programa que não segue a ((gramática)) da linguagem fará o computador reclamar imediatamente. Outras coisas, como chamar algo que não é uma função ou procurar uma propriedade em um valor ((undefined)), causarão um erro quando o programa tentar executar a ação.

{{index NaN, error}}

Frequentemente, porém, seu cálculo sem sentido simplesmente produzirá `NaN` (não é um número) ou um valor undefined, enquanto o programa alegremente continua, convencido de que está fazendo algo significativo. O erro se manifestará apenas mais tarde, depois que o valor falso tiver viajado por várias funções. Ele pode não gerar nenhum erro, mas silenciosamente causar uma saída errada do programa. Encontrar a fonte desses problemas pode ser difícil.

O processo de encontrar erros — *bugs* — em programas é chamado de _((depuração))_.

## Modo estrito

{{index "strict mode", [syntax, error], function}}

{{indexsee "use strict", "strict mode"}}

O JavaScript pode ser tornado um _pouco_ mais estrito habilitando o _modo estrito_. Isso pode ser feito colocando a *string* `"use strict"` no topo de um arquivo ou corpo de função. Aqui está um exemplo:

```{test: "error \"ReferenceError: counter is not defined\""}
function canYouSpotTheProblem() {
  "use strict";
  for (counter = 0; counter < 10; counter++) {
    console.log("Happy happy");
  }
}

canYouSpotTheProblem();
// → ReferenceError: counter is not defined
```

{{index ECMAScript, compatibility}}

Código dentro de classes e módulos (que discutiremos no [Capítulo ?](modules)) é automaticamente estrito. O antigo comportamento não-estrito ainda existe apenas porque algum código antigo pode depender dele, e os designers da linguagem trabalham duro para evitar quebrar quaisquer programas existentes.

{{index "let keyword", [binding, global]}}

Normalmente, quando você esquece de colocar `let` na frente de sua *binding*, como com `counter` no exemplo, o JavaScript silenciosamente cria uma *binding* global e a usa. No modo estrito, um ((erro)) é reportado em vez disso. Isso é muito útil. Deve-se notar, porém, que isso não funciona quando a *binding* em questão já existe em algum lugar no escopo. Nesse caso, o *loop* ainda sobrescreverá silenciosamente o valor da *binding*.

{{index "this binding", "global object", undefined, "strict mode"}}

Outra mudança no modo estrito é que a *binding* `this` mantém o valor `undefined` em funções que não são chamadas como ((método))s. Ao fazer tal chamada fora do modo estrito, `this` se refere ao objeto de escopo global, que é um objeto cujas propriedades são as *bindings* globais. Então, se você acidentalmente chamar um método ou construtor incorretamente no modo estrito, o JavaScript produzirá um erro assim que tentar ler algo de `this`, em vez de alegremente escrever no escopo global.

Por exemplo, considere o código a seguir, que chama uma função ((construtora)) sem a palavra-chave `new` de modo que seu `this` _não_ se referirá a um objeto recém-construído:

```
function Person(name) { this.name = name; }
let ferdinand = Person("Ferdinand"); // ops
console.log(name);
// → Ferdinand
```

{{index error}}

A chamada falsa a `Person` teve sucesso, mas retornou um valor undefined e criou a *binding* global `name`. No modo estrito, o resultado é diferente.

```{test: "error \"TypeError: Cannot set properties of undefined (setting 'name')\""}
"use strict";
function Person(name) { this.name = name; }
let ferdinand = Person("Ferdinand"); // esqueceu new
// → TypeError: Cannot set property 'name' of undefined
```

Somos imediatamente informados de que algo está errado. Isso é útil.

Felizmente, construtores criados com a notação `class` sempre reclamam se são chamados sem `new`, tornando isso menos problemático mesmo no modo não-estrito.

{{index parameter, [binding, naming], "with statement"}}

O modo estrito faz mais algumas coisas. Ele proíbe dar a uma função múltiplos parâmetros com o mesmo nome e remove certas funcionalidades problemáticas da linguagem inteiramente (como a declaração `with`, que é tão errada que não é discutida mais neste livro).

{{index debugging}}

Em resumo, colocar `"use strict"` no topo do seu programa raramente prejudica e pode ajudá-lo a identificar um problema.

## Tipos

Algumas linguagens querem saber os tipos de todas as suas *bindings* e expressões antes mesmo de executar o programa. Elas dirão imediatamente quando um tipo é usado de maneira inconsistente. O JavaScript considera tipos apenas ao realmente executar o programa e, mesmo assim, frequentemente tenta converter implicitamente valores para o tipo que espera, então não ajuda muito.

Ainda assim, tipos fornecem um *framework* útil para falar sobre programas. Muitos erros vêm de confusão sobre que tipo de valor entra ou sai de uma função. Se você tiver essa informação anotada, é menos provável que fique confuso.

Você poderia adicionar um comentário como o seguinte antes da função `findRoute` do capítulo anterior para descrever seu tipo:

```
// (graph: Object, from: string, to: string) => string[]
function findRoute(graph, from, to) {
  // ...
}
```

Há diversas convenções diferentes para anotar programas JavaScript com tipos.

Uma coisa sobre tipos é que eles precisam introduzir sua própria complexidade para serem capazes de descrever código suficiente para serem úteis. Qual você acha que seria o tipo da função `randomPick` que retorna um elemento aleatório de um *array*? Você precisaria introduzir uma _((variável de tipo))_, _T_, que pode substituir qualquer tipo, para poder dar a `randomPick` um tipo como `(T[]) → T` (função de um *array* de *T*s para um *T*).

{{index "type checking", TypeScript}}

{{id typing}}

Quando os tipos de um programa são conhecidos, é possível para o computador _verificá-los_ para você, apontando erros antes que o programa seja executado. Existem vários dialetos de JavaScript que adicionam tipos à linguagem e os verificam. O mais popular é chamado [TypeScript](https://www.typescriptlang.org/). Se você tem interesse em adicionar mais rigor aos seus programas, recomendo que experimente.

Neste livro, continuaremos usando código JavaScript cru, perigoso e não-tipado.

## Testes

{{index "test suite", "run-time error", automation, testing}}

Se a linguagem não vai fazer muito para nos ajudar a encontrar erros, teremos que encontrá-los da maneira difícil: executando o programa e vendo se ele faz a coisa certa.

Fazer isso manualmente, de novo e de novo, é uma péssima ideia. Além de ser irritante, também tende a ser ineficaz, já que leva muito tempo para testar tudo exaustivamente toda vez que você faz uma alteração.

Computadores são bons em tarefas repetitivas, e testar é a tarefa repetitiva ideal. Testes automatizados são o processo de escrever um programa que testa outro programa. Escrever testes dá um pouco mais de trabalho do que testar manualmente, mas uma vez que você o fez, ganha uma espécie de superpoder: leva apenas alguns segundos para verificar que seu programa ainda se comporta corretamente em todas as situações para as quais escreveu testes. Quando você quebra algo, perceberá imediatamente em vez de esbarrar nisso aleatoriamente em algum momento posterior.

{{index "toUpperCase method"}}

Testes geralmente tomam a forma de pequenos programas rotulados que verificam algum aspecto do seu código. Por exemplo, um conjunto de testes para o método `toUpperCase` (padrão, provavelmente já testado por outra pessoa) poderia parecer com isto:

```
function test(label, body) {
  if (!body()) console.log(`Failed: ${label}`);
}

test("convert Latin text to uppercase", () => {
  return "hello".toUpperCase() == "HELLO";
});
test("convert Greek text to uppercase", () => {
  return "Χαίρετε".toUpperCase() == "ΧΑΊΡΕΤΕ";
});
test("don't convert case-less characters", () => {
  return "مرحبا".toUpperCase() == "مرحبا";
});
```

{{index "domain-specific language"}}

Escrever testes assim tende a produzir código bastante repetitivo e estranho. Felizmente, existem softwares que ajudam você a construir e executar coleções de testes (_((suítes de teste))_) fornecendo uma linguagem (na forma de funções e métodos) adequada para expressar testes e produzindo informações úteis quando um teste falha. Estes são geralmente chamados de _((test runners))_.

{{index "persistent data structure"}}

Algum código é mais fácil de testar do que outro. Geralmente, quanto mais objetos externos o código interage, mais difícil é configurar o contexto no qual testá-lo. O estilo de programação mostrado no [capítulo anterior](robot), que usa valores persistentes autocontidos em vez de objetos mutáveis, tende a ser fácil de testar.

## Depuração

{{index debugging}}

Uma vez que você percebe que há algo errado com seu programa porque ele se comporta mal ou produz erros, o próximo passo é descobrir _qual_ é o problema.

Às vezes é óbvio. A mensagem de ((erro)) apontará para uma linha específica do seu programa e, se você olhar para a descrição do erro e aquela linha de código, frequentemente poderá ver o problema.

{{index "run-time error"}}

Mas nem sempre. Às vezes, a linha que disparou o problema é simplesmente o primeiro lugar onde um valor problemático produzido em outro lugar é usado de maneira inválida. Se você tem resolvido os ((exercícios)) dos capítulos anteriores, provavelmente já experimentou tais situações.

{{index "decimal number", "binary number"}}

O programa de exemplo a seguir tenta converter um número inteiro em uma *string* em uma dada base (decimal, binário, e assim por diante) repetidamente extraindo o último ((dígito)) e depois dividindo o número para se livrar desse dígito. Mas a saída estranha que ele atualmente produz sugere que tem um ((bug)).

```
function numberToString(n, base = 10) {
  let result = "", sign = "";
  if (n < 0) {
    sign = "-";
    n = -n;
  }
  do {
    result = String(n % base) + result;
    n /= base;
  } while (n > 0);
  return sign + result;
}
console.log(numberToString(13, 10));
// → 1.5e-3231.3e-3221.3e-3211.3e-3201.3e-3191.3e-3181.3…
```

{{index analysis}}

Mesmo se você já vê o problema, finja por um momento que não vê. Sabemos que nosso programa está funcionando mal e queremos descobrir por quê.

{{index "trial and error"}}

É aqui que você deve resistir à vontade de começar a fazer mudanças aleatórias no código para ver se isso melhora. Em vez disso, _pense_. Analise o que está acontecendo e elabore uma ((teoria)) de por que isso pode estar acontecendo. Então faça observações adicionais para testar essa teoria — ou, se ainda não tiver uma teoria, faça observações adicionais para ajudá-lo a elaborar uma.

{{index "console.log", output, debugging, logging}}

Colocar algumas chamadas estratégicas a `console.log` no programa é uma boa maneira de obter informações adicionais sobre o que o programa está fazendo. Neste caso, queremos que `n` assuma os valores `13`, `1` e depois `0`. Vamos imprimir seu valor no início do *loop*.

```{lang: null}
13
1.3
0.13
0.013
…
1.5e-323
```

{{index rounding}}

_Certo_. Dividir 13 por 10 não produz um número inteiro. Em vez de `n /= base`, o que realmente queremos é `n = Math.floor(n / base)` para que o número seja adequadamente "deslocado" para a direita.

{{index "JavaScript console", "debugger statement"}}

Uma alternativa ao uso de `console.log` para espiar o comportamento do programa é usar as capacidades do _depurador_ do seu *browser*. *Browsers* vêm com a capacidade de definir um _((breakpoint))_ em uma linha específica do seu código. Quando a execução do programa atinge uma linha com um *breakpoint*, ela é pausada e você pode inspecionar os valores das *bindings* naquele ponto. Não entrarei em detalhes, pois depuradores diferem de *browser* para *browser*, mas procure nas ((ferramentas de desenvolvedor)) do seu *browser* ou pesquise na web por instruções.

Outra maneira de definir um *breakpoint* é incluir uma declaração `debugger` (consistindo simplesmente dessa palavra-chave) no seu programa. Se as ((ferramentas de desenvolvedor)) do seu *browser* estiverem ativas, o programa será pausado sempre que atingir tal declaração.

## Propagação de erros

{{index input, output, "run-time error", error, validation}}

Nem todos os problemas podem ser prevenidos pelo programador, infelizmente. Se seu programa se comunica com o mundo exterior de alguma forma, é possível receber entrada malformada, ficar sobrecarregado de trabalho ou ter a rede falhando.

{{index "error recovery"}}

Se você está programando apenas para si mesmo, pode se dar ao luxo de simplesmente ignorar tais problemas até que ocorram. Mas se você constrói algo que será usado por qualquer outra pessoa, geralmente quer que o programa faça melhor do que simplesmente travar. Às vezes, a coisa certa a fazer é aceitar a entrada ruim e continuar executando. Em outros casos, é melhor reportar ao usuário o que deu errado e então desistir. Em qualquer situação, o programa precisa ativamente fazer algo em resposta ao problema.

{{index "promptNumber function", validation}}

Digamos que você tenha uma função `promptNumber` que pede ao usuário um número e o retorna. O que ela deveria retornar se o usuário digitar "orange"?

{{index null, undefined, "return value", "special return value"}}

Uma opção é fazer com que retorne um valor especial. Escolhas comuns para tais valores são `null`, `undefined` ou `-1`.

```{test: no}
function promptNumber(question) {
  let result = Number(prompt(question));
  if (Number.isNaN(result)) return null;
  else return result;
}

console.log(promptNumber("How many trees do you see?"));
```

Agora qualquer código que chame `promptNumber` deve verificar se um número real foi lido e, caso contrário, deve de alguma forma se recuperar — talvez perguntando novamente ou preenchendo um valor padrão. Ou poderia novamente retornar um valor especial para _seu_ chamador para indicar que falhou em fazer o que foi pedido.

{{index "error handling"}}

Em muitas situações, principalmente quando ((erro))s são comuns e o chamador deve explicitamente levá-los em conta, retornar um valor especial é uma boa maneira de indicar um erro. Porém, isso tem suas desvantagens. Primeiro, e se a função já pode retornar todo tipo possível de valor? Em tal função, você terá que fazer algo como envolver o resultado em um objeto para poder distinguir sucesso de falha, como o método `next` na interface do iterador faz.

```
function lastElement(array) {
  if (array.length == 0) {
    return {failed: true};
  } else {
    return {value: array[array.length - 1]};
  }
}
```

{{index "special return value", readability}}

O segundo problema com retornar valores especiais é que pode levar a código estranho. Se um trecho de código chama `promptNumber` 10 vezes, ele precisa verificar 10 vezes se `null` foi retornado. Se sua resposta ao encontrar `null` é simplesmente retornar `null` ele mesmo, os chamadores da função terão por sua vez que verificar, e assim por diante.

## Exceções

{{index "error handling"}}

Quando uma função não pode prosseguir normalmente, o que frequentemente _gostaríamos_ de fazer é simplesmente parar o que estamos fazendo e imediatamente pular para um lugar que saiba como lidar com o problema. É isso que o _((tratamento de exceções))_ faz.

{{index ["control flow", exceptions], "raising (exception)", "throw keyword", "call stack"}}

Exceções são um mecanismo que torna possível para código que encontra um problema _lançar_ (ou _throw_) uma exceção. Uma exceção pode ser qualquer valor. Lançar uma se assemelha a um retorno superpotente de uma função: ela salta para fora não apenas da função atual, mas também de seus chamadores, descendo até a primeira chamada que iniciou a execução atual. Isso é chamado de _((desenrolar a pilha))_. Você deve se lembrar da pilha de chamadas de função mencionada no [Capítulo ?](functions#stack). Uma exceção desce essa pilha, descartando todos os contextos de chamada que encontra.

{{index "error handling", [syntax, statement], "catch keyword"}}

Se exceções sempre descessem direto até o fundo da pilha, elas não seriam muito úteis. Seriam apenas uma maneira nova de explodir seu programa. Seu poder está no fato de que você pode colocar "obstáculos" ao longo da pilha para _capturar_ a exceção enquanto ela desce. Uma vez que você captura uma exceção, pode fazer algo com ela para resolver o problema e então continuar a executar o programa.

Aqui está um exemplo:

{{id look}}
```
function promptDirection(question) {
  let result = prompt(question);
  if (result.toLowerCase() == "left") return "L";
  if (result.toLowerCase() == "right") return "R";
  throw new Error("Invalid direction: " + result);
}

function look() {
  if (promptDirection("Which way?") == "L") {
    return "a house";
  } else {
    return "two angry bears";
  }
}

try {
  console.log("You see", look());
} catch (error) {
  console.log("Something went wrong: " + error);
}
```

{{index "exception handling", block, "throw keyword", "try keyword", "catch keyword"}}

A palavra-chave `throw` é usada para lançar uma exceção. A captura é feita envolvendo um trecho de código em um bloco `try`, seguido pela palavra-chave `catch`. Quando o código no bloco `try` causa uma exceção, o bloco `catch` é avaliado, com o nome entre parênteses vinculado ao valor da exceção. Após o bloco `catch` terminar — ou se o bloco `try` terminar sem problemas — o programa continua abaixo de toda a declaração `try/catch`.

{{index debugging, "call stack", "Error type"}}

Neste caso, usamos o ((construtor)) `Error` para criar nosso valor de exceção. Este é um construtor ((padrão)) do JavaScript que cria um objeto com uma propriedade `message`. Instâncias de `Error` também coletam informações sobre a pilha de chamadas que existia quando a exceção foi criada, um chamado _((rastreamento de pilha))_. Essa informação é armazenada na propriedade `stack` e pode ser útil ao tentar depurar um problema: ela nos diz em qual função o problema ocorreu e quais funções fizeram a chamada que falhou.

{{index "exception handling"}}

Note que a função `look` ignora completamente a possibilidade de que `promptDirection` possa dar errado. Esta é a grande vantagem das exceções: o código de tratamento de erros é necessário apenas no ponto onde o erro ocorre e no ponto onde ele é tratado. As funções intermediárias podem esquecer tudo sobre isso.

Bem, quase...

## Limpando depois de exceções

{{index "exception handling", "cleaning up", ["control flow", exceptions]}}

O efeito de uma exceção é outro tipo de fluxo de controle. Cada ação que pode causar uma exceção, que é praticamente toda chamada de função e acesso a propriedade, pode fazer com que o controle deixe seu código repentinamente.

Isso significa que quando o código tem vários efeitos colaterais, mesmo que seu fluxo de controle "regular" pareça que todos sempre acontecerão, uma exceção pode impedir que alguns deles ocorram.

{{index "banking example"}}

Aqui está um código bancário realmente ruim:

```{includeCode: true}
const accounts = {
  a: 100,
  b: 0,
  c: 20
};

function getAccount() {
  let accountName = prompt("Enter an account name");
  if (!Object.hasOwn(accounts, accountName)) {
    throw new Error(`No such account: ${accountName}`);
  }
  return accountName;
}

function transfer(from, amount) {
  if (accounts[from] < amount) return;
  accounts[from] -= amount;
  accounts[getAccount()] += amount;
}
```

A função `transfer` transfere uma quantia de dinheiro de uma dada conta para outra, pedindo o nome da outra conta no processo. Se receber um nome de conta inválido, `getAccount` lança uma exceção.

Mas `transfer` _primeiro_ remove o dinheiro da conta e _depois_ chama `getAccount` antes de adicioná-lo a outra conta. Se for interrompido por uma exceção nesse ponto, o dinheiro simplesmente desaparecerá.

Esse código poderia ter sido escrito de forma um pouco mais inteligente, por exemplo chamando `getAccount` antes de começar a mover dinheiro. Mas frequentemente problemas assim ocorrem de formas mais sutis. Até funções que não parecem que vão lançar uma exceção podem fazê-lo em circunstâncias excepcionais ou quando contêm um erro do programador.

Uma maneira de abordar isso é usar menos efeitos colaterais. Novamente, um estilo de programação que computa novos valores em vez de alterar dados existentes ajuda. Se um trecho de código para de executar no meio da criação de um novo valor, nenhuma estrutura de dados existente foi danificada, facilitando a recuperação.

{{index block, "try keyword", "finally keyword"}}

Como isso nem sempre é prático, declarações `try` têm outra funcionalidade: elas podem ser seguidas por um bloco `finally` em vez de ou em adição a um bloco `catch`. Um bloco `finally` diz "não importa _o que_ aconteça, execute este código após tentar executar o código no bloco `try`."

```{includeCode: true}
function transfer(from, amount) {
  if (accounts[from] < amount) return;
  let progress = 0;
  try {
    accounts[from] -= amount;
    progress = 1;
    accounts[getAccount()] += amount;
    progress = 2;
  } finally {
    if (progress == 1) {
      accounts[from] += amount;
    }
  }
}
```

Esta versão da função rastreia seu progresso e, se ao sair perceber que foi abortada em um ponto onde criou um estado inconsistente, repara o dano que fez.

Note que mesmo que o código `finally` seja executado quando uma exceção é lançada no bloco `try`, ele não interfere com a exceção. Após o bloco `finally` ser executado, a pilha continua se desenrolando.

{{index "exception safety"}}

Escrever programas que operam de forma confiável mesmo quando exceções surgem em lugares inesperados é difícil. Muitas pessoas simplesmente não se incomodam, e como exceções são tipicamente reservadas para circunstâncias excepcionais, o problema pode ocorrer tão raramente que nunca é sequer notado. Se isso é uma coisa boa ou realmente ruim depende de quanto dano o software causará quando falhar.

## Captura seletiva

{{index "uncaught exception", "exception handling", "JavaScript console", "developer tools", "call stack", error}}

Quando uma exceção percorre todo o caminho até o fundo da pilha sem ser capturada, ela é tratada pelo ambiente. O que isso significa difere entre ambientes. Nos *browsers*, uma descrição do erro é tipicamente escrita no console JavaScript (acessível através do menu Ferramentas ou Desenvolvedor do *browser*). O Node.js, o ambiente JavaScript sem *browser* que discutiremos no [Capítulo ?](node), é mais cuidadoso com a corrupção de dados. Ele aborta todo o processo quando uma exceção não tratada ocorre.

{{index crash, "error handling"}}

Para erros do programador, simplesmente deixar o erro passar é frequentemente o melhor que se pode fazer. Uma exceção não tratada é uma maneira razoável de sinalizar um programa quebrado, e o console JavaScript, em *browsers* modernos, fornecerá informações sobre quais chamadas de função estavam na pilha quando o problema ocorreu.

{{index "user interface"}}

Para problemas que se _espera_ que aconteçam durante o uso rotineiro, travar com uma exceção não tratada é uma estratégia terrível.

{{index [function, application], "exception handling", "Error type", [binding, undefined]}}

Usos inválidos da linguagem, como referenciar uma *binding* inexistente, procurar uma propriedade em `null` ou chamar algo que não é uma função, também resultarão em exceções sendo lançadas. Tais exceções também podem ser capturadas.

{{index "catch keyword"}}

Quando um corpo `catch` é atingido, tudo o que sabemos é que _algo_ no nosso corpo `try` causou uma exceção. Mas não sabemos _o que_ causou ou _qual_ exceção causou.

{{index "exception handling"}}

O JavaScript (em uma omissão bastante flagrante) não fornece suporte direto para capturar exceções seletivamente: ou você captura todas ou não captura nenhuma. Isso torna tentador _supor_ que a exceção que você obtém é aquela em que estava pensando quando escreveu o bloco `catch`.

{{index "promptDirection function"}}

Mas pode não ser. Alguma outra ((suposição)) pode ter sido violada, ou você pode ter introduzido um *bug* que está causando uma exceção. Aqui está um exemplo que _tenta_ continuar chamando `promptDirection` até obter uma resposta válida:

```{test: no}
for (;;) {
  try {
    let dir = promtDirection("Where?"); // ← erro de digitação!
    console.log("You chose ", dir);
    break;
  } catch (e) {
    console.log("Not a valid direction. Try again.");
  }
}
```

{{index "infinite loop", "for loop", "catch keyword", debugging}}

A construção `for (;;)` é uma maneira de criar intencionalmente um *loop* que não termina por conta própria. Saímos do *loop* apenas quando uma direção válida é dada. Infelizmente, escrevemos errado `promptDirection`, o que resultará em um erro de "variável indefinida". Como o bloco `catch` ignora completamente o valor de sua exceção (`e`), assumindo que sabe qual é o problema, ele erroneamente trata o erro de *binding* como indicando entrada ruim. Isso não só causa um *loop* infinito como também "enterra" a mensagem de erro útil sobre a *binding* mal escrita.

Como regra geral, não capture exceções indiscriminadamente a menos que seja com o propósito de "roteá-las" para algum lugar — por exemplo, através da rede para informar outro sistema que nosso programa travou. E mesmo assim, pense cuidadosamente sobre como pode estar escondendo informações.

{{index "exception handling"}}

Queremos capturar um tipo _específico_ de exceção. Podemos fazer isso verificando no bloco `catch` se a exceção que obtivemos é aquela em que estamos interessados e, se não, relançá-la. Mas como reconhecemos uma exceção?

Poderíamos comparar sua propriedade `message` com a mensagem de ((erro)) que esperamos. Mas essa é uma maneira frágil de escrever código — estaríamos usando informação destinada ao consumo humano (a mensagem) para tomar uma decisão programática. Assim que alguém muda (ou traduz) a mensagem, o código parará de funcionar.

{{index "Error type", "instanceof operator", "promptDirection function"}}

Em vez disso, vamos definir um novo tipo de erro e usar `instanceof` para identificá-lo.

```{includeCode: true}
class InputError extends Error {}

function promptDirection(question) {
  let result = prompt(question);
  if (result.toLowerCase() == "left") return "L";
  if (result.toLowerCase() == "right") return "R";
  throw new InputError("Invalid direction: " + result);
}
```

{{index "throw keyword", inheritance}}

A nova classe de erro estende `Error`. Ela não define seu próprio construtor, o que significa que herda o construtor de `Error`, que espera uma mensagem *string* como argumento. Na verdade, ela não define nada — a classe está vazia. Objetos `InputError` se comportam como objetos `Error`, exceto que têm uma classe diferente pela qual podemos reconhecê-los.

{{index "exception handling"}}

Agora o *loop* pode capturá-los mais cuidadosamente.

```{test: no}
for (;;) {
  try {
    let dir = promptDirection("Where?");
    console.log("You chose ", dir);
    break;
  } catch (e) {
    if (e instanceof InputError) {
      console.log("Not a valid direction. Try again.");
    } else {
      throw e;
    }
  }
}
```

{{index debugging}}

Isso capturará apenas instâncias de `InputError` e deixará exceções não relacionadas passarem. Se você reintroduzir o erro de digitação, o erro de *binding* indefinida será adequadamente reportado.

## Asserções

{{index "assert function", assertion, debugging}}

_Asserções_ são verificações dentro de um programa que verificam que algo é como deveria ser. Elas são usadas não para lidar com situações que podem surgir em operação normal, mas para encontrar erros do programador.

Se, por exemplo, `firstElement` é descrita como uma função que nunca deve ser chamada em *arrays* vazios, poderíamos escrevê-la assim:

```
function firstElement(array) {
  if (array.length == 0) {
    throw new Error("firstElement called with []");
  }
  return array[0];
}
```

{{index validation, "run-time error", crash, assumption}}

Agora, em vez de silenciosamente retornar undefined (que é o que você obtém ao ler uma propriedade de *array* que não existe), isso explodirá ruidosamente seu programa assim que você usá-lo indevidamente. Isso torna menos provável que tais erros passem despercebidos e mais fácil encontrar sua causa quando ocorrem.

Não recomendo tentar escrever asserções para todo tipo possível de entrada ruim. Isso daria muito trabalho e levaria a código muito ruidoso. Você vai querer reservá-las para erros que são fáceis de cometer (ou que você se pega cometendo).

## Resumo

Uma parte importante da programação é encontrar, diagnosticar e corrigir *bugs*. Problemas podem se tornar mais fáceis de notar se você tiver uma suíte de testes automatizada ou adicionar asserções aos seus programas.

Problemas causados por fatores fora do controle do programa geralmente devem ser ativamente planejados. Às vezes, quando o problema pode ser tratado localmente, valores de retorno especiais são uma boa maneira de rastreá-los. Caso contrário, exceções podem ser preferíveis.

Lançar uma exceção faz com que a pilha de chamadas seja desenrolada até o próximo bloco `try/catch` envolvente ou até o fundo da pilha. O valor da exceção será dado ao bloco `catch` que a captura, que deve verificar que é realmente o tipo esperado de exceção e então fazer algo com ela. Para ajudar a lidar com o fluxo de controle imprevisível causado por exceções, blocos `finally` podem ser usados para garantir que um trecho de código _sempre_ execute quando um bloco termina.

## Exercícios

### Repetir

{{index "primitiveMultiply (exercise)", "exception handling", "throw keyword"}}

Digamos que você tenha uma função `primitiveMultiply` que em 20% dos casos multiplica dois números e nos outros 80% dos casos lança uma exceção do tipo `MultiplicatorUnitFailure`. Escreva uma função que envolva essa função desajeitada e continue tentando até que uma chamada tenha sucesso, retornando então o resultado.

{{index "catch keyword"}}

Certifique-se de tratar apenas as exceções que está tentando tratar.

{{if interactive

```{test: no}
class MultiplicatorUnitFailure extends Error {}

function primitiveMultiply(a, b) {
  if (Math.random() < 0.2) {
    return a * b;
  } else {
    throw new MultiplicatorUnitFailure("Klunk");
  }
}

function reliableMultiply(a, b) {
  // Seu código aqui.
}

console.log(reliableMultiply(8, 8));
// → 64
```
if}}

{{hint

{{index "primitiveMultiply (exercise)", "try keyword", "catch keyword", "throw keyword"}}

A chamada a `primitiveMultiply` definitivamente deve acontecer em um bloco `try`. O bloco `catch` correspondente deve relançar a exceção quando ela não for uma instância de `MultiplicatorUnitFailure` e garantir que a chamada seja repetida quando for.

Para fazer a repetição, você pode usar um *loop* que para apenas quando uma chamada tem sucesso — como no [exemplo `look`](error#look) anteriormente neste capítulo — ou usar ((recursão)) e esperar que não receba uma sequência de falhas tão longa que transborde a pilha (o que é uma aposta bem segura).

hint}}

### A caixa trancada

{{index "locked box (exercise)"}}

Considere o seguinte objeto (um tanto artificial):

```
const box = new class {
  locked = true;
  #content = [];

  unlock() { this.locked = false; }
  lock() { this.locked = true;  }
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this.#content;
  }
};
```

{{index "private property", "access control"}}

É uma ((caixa)) com uma tranca. Há um *array* na caixa, mas você só pode acessá-lo quando a caixa estiver destrancada.

{{index "finally keyword", "exception handling"}}

Escreva uma função chamada `withBoxUnlocked` que recebe um valor de função como argumento, destranca a caixa, executa a função e então garante que a caixa seja trancada novamente antes de retornar, independentemente de a função argumento ter retornado normalmente ou lançado uma exceção.

{{if interactive

```
const box = new class {
  locked = true;
  #content = [];

  unlock() { this.locked = false; }
  lock() { this.locked = true;  }
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this.#content;
  }
};

function withBoxUnlocked(body) {
  // Seu código aqui.
}

withBoxUnlocked(() => {
  box.content.push("gold piece");
});

try {
  withBoxUnlocked(() => {
    throw new Error("Pirates on the horizon! Abort!");
  });
} catch (e) {
  console.log("Error raised: " + e);
}
console.log(box.locked);
// → true
```

if}}

Para pontos extras, certifique-se de que se você chamar `withBoxUnlocked` quando a caixa já estiver destrancada, a caixa permaneça destrancada.

{{hint

{{index "locked box (exercise)", "finally keyword", "try keyword"}}

Este exercício pede um bloco `finally`. Sua função deve primeiro destrancar a caixa e depois chamar a função argumento de dentro de um corpo `try`. O bloco `finally` após ele deve trancar a caixa novamente.

Para garantir que não trancamos a caixa quando ela já não estava trancada, verifique sua tranca no início da função e destranque e tranque apenas quando ela começou trancada.

hint}}
