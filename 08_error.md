{{meta {load_files: ["code/chapter/08_error.js"]}}}

# Bugs e erros

{{quote {author: "Brian Kernighan and P.J. Plauger", title: "The Elements of Programming Style", chapter: true}

Depurar é duas vezes mais difícil que escrever o código da primeira vez.
Portanto, se você escrever o código mais inteligente possível, por definição,
você não é inteligente o suficiente para depurá-lo.

quote}}

{{figure {url: "img/chapter_picture_8.jpg", alt: "Figura de uma coleção de bugs", chapter: framed}}}

{{index "Kernighan, Brian", "Plauger, P.J.", debugging, "error handling"}}

Falhas em programas de computador são geralmente chamadas de _((bug))s_. Isso faz
os programadores se sentirem bem imaginando eles como pequenas coisas que apenas
acontecem no nosso trabalho. Na realidade, é claro, nós os colocamos 
lá nós mesmos.

Se um programa é um pensamento cristalizado, você pode grosseiramente categorizar os bugs
naqueles causados por pensamentos confusos e aqueles causados por
erros introduzidos ao converter um pensamento em código. O primeiro
tipo é geralmente mais difícil de diagnosticar e consertar que o último.

## Linguagem

{{index parsing, analysis}}

Muitos erros poderiam ser apontados para nós automaticamente pelo
computador, se ele soubesse realmente o que estamos tentando fazer. Mas aqui
a liberdade do JavaScript é um obstáculo. Seu conceito de atribuições e
propriedades é vago o suficiente para raramente identificar ((erros de digitação)) antes
de realmente executar o programa. E até, permite que você faça algumas
coisas claramente sem sentido sem objeção, como o cálculo
`true * "monkey"`.

{{index syntax}}

Existem algumas coisas que o Javascript incomoda. Escrever um
programa que não segue a ((gramática)) da linguagem vai
fazer o computador imediatamente reclamar. Outras coisas, como chamar
algo que não é uma função ou acessar uma ((propriedade)) em um
valor que esteja ((indefinido)), vai causar um erro quando o
programa tentar executar a ação.

{{index NaN, error}}

Mas algumas vezes, seus cálculos absurdos vão resultar apenas `NaN` (not a
number) ou um valor undefined (indefinido), enquanto o programa alegrente continua,
convencido que está fazendo alguma coisa importante. O erro se
manifestará só mais tarde, depois que o valor falso viajou através  
de várias funções. Isso pode não desencadear um erro mas silenciosamente
fazer com que a saída do programa esteja errada. Encontrar a fonte de tais
pode ser difícil.

O processo de encontrar erros ou bugs em programas é chamado de
_((debugging))_.

## Mode estrito

{{index "strict mode", syntax, function}}

{{indexsee "use strict", "strict mode"}}

JavaScript pode ser um _pouco_ mais rigoroso habilitando-se o _modo estrito_ ou 
_strict mode_. Isto é feito colocando-se a string `"use strict"` no início de
um arquivo ou do corpo de uma função. Aqui está um exemplo:

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

{{index "let keyword", [binding, global]}}

Normalmente, quando você esquece de colocar `let` na frente da sua declaração, como
com `counter` no exemplo, JavaScript silenciosamente cria uma declaração
global e usa isso. No modo estrito ao contrário, um ((erro)) é lançado.
Isso é muito útil. Deve-se notar, porém, que isso
não funciona quando a declaração em questão já existe como uma declaração
global. Nesse caso, o loop irá silenciosamente sobreescrever o valor
da declaração.

{{index this, "global object", undefined, "strict mode"}}

Outra mudança no modo estrito é que o `this` possui o
valor `undefined` nas funções que não são chamadas como ((métodos)).
Quando fazer tal chamada fora do modo estrito, `this` refere-se ao
escopo do objeto global, que é um objeto cuja as propriedades são as
variáveis globais. Então se você acidentalmente chmar um método ou construtor
incorretamente no modo estrito, o JavaScript irá lançar um erro assim
que tentar ler algo de `this`, ao invés de simplesmenete escrever
no escopo global.

Por exemplo, considere o código a seguir, o qual chama um
((construtor)) sem a palavra-chave `new` de modo que seu `this`
_não_ irá se referir ao objeto recem criado:

```
function Person(name) { this.name = name; }
let ferdinand = Person("Ferdinand"); // oops
console.log(name);
// → Ferdinand
```

{{index error}}

Então a chamada falsa para `Pessoa` ocorreu mas retornou um valor 
indefinido e criou uma variável global `name`. No modo estrito, o 
resultado é outro.

```{test: "error \"TypeError: Cannot set property 'name' of undefined\""}
"use strict";
function Person(name) { this.name = name; }
let ferdinand = Person("Ferdinand"); // esquecido new
// → TypeError: Cannot set property 'name' of undefined
```

Nos somos avisados imediatamente que algo está errado. Isso é útil.

Felizmente, os contrutores criados com a notação `class` vão
sempre reclamar se eles são chamados sem `new`, fazendo isso menos
problemático mesmo não utilizando o modo estrito.
a problem even in non-strict mode.

{{index parameter, [binding, naming], "with statement"}}

O mode estrito faz mais algumas coisas. Não permite passar a uma função 
vários parâmetros com o mesmo nome e remove certos problemas
caraterísticos da linguagem ao todo (como a declaração `with`, que é tão
errado que não é mais discutido neste livro).

{{index debugging}}

Em resumo, colocando `"use strict"` no começo do seu programa raramente
dói e pode ajudá-lo a indentificar um problema.

## Tipos

Algumas linguagens querem saber os tipos de todas as suas variáveis e
expressões antes mesmo de executar um programa. Elas vão te dizer 
imediatamente quando um tipo é usado de forma inconsistente. JavaScript considera
os tipos apenas quando realmente executa o programa, e as vezes até mesmo
tenta converter implicitamente valores para o tipo esperado, portanto não é
grande ajuda.

Ainda assim, os tipos fornecem uma estrutura útil falando de programas. Muitos
erros surgem ao você ficar confuso sobre que tipo de valor 
entra ou sai de uma função. Se você tiver essa informação
escrita, é menos provável que você fique confuso.

Voce poderia adicionar um comentário como o seguinte antes da função
`goalOrientedRobot` do capítulo anterior para descrever seu tipo:

```
// (VillageState, Array) → {direction: string, memory: Array}
function goalOrientedRobot(state, memory) {
  // ...
}
```

Existem muitas convenções diferentes para anotar programas em JavaScript
com tipos.

Algo sobre os tipos é que eles introduzem sua própria
complexidade para poder descrever o código o suficiente para ser útil. O que 
você acha que seria o tipo da função `ramdomPick` que retorna
um elemento aleatório de uma array? Você precisaria passar uma _((variável
tipo))_, _T_, que pode ser de qualquer tipo, de modo que você pode
passar a `randomPick` um tipo como `([T]) → T` (função de um array de
*T*s para um *T*).

{{index "type checking", TypeScript}}

{{id typing}}

Quando os tipos de um programa são conhecidos, é possível para o computador
verificar eles para você, apontando erros antes do programa ser
executado. Existem vários dialetos JavaScript que adicionam tipos para a
linguagem e os verificam. O mais popular é chamado
[TypeScript](https://www.typescriptlang.org/). Se você estiver interessado
em adicionar mais rigor ao seus programas, eu recomendo que você experimente.


Neste livro, nos continuaremos utilizando o bruto, perigoso e não tipado
código JavaScript puro.

## Testando

{{index "test suite", "run-time error", automation, testing}}

Se a linguagem não vai fazer muito para nos ajudar a encontrar erros,
teremos que encontra-los da maneira mais difícil: executando o programa e 
verificando se ele fez a coisa certa.

Fazendo isso manualmente, de novo e de novo, é realmente uma má ideia. Não é apenas
irritante, mas também tende a ser ineficiente, pois leva muito
tempo para testar tudo exaustivamente sempre que você fizer uma mudança.

Computadores são bons em tarefas repetitivas, e testar é a tarefa
repetitiva ideal. Automatização de testes é o processo de escrever um programa
que testa outro programa. Escrever testes é um pouco mais trabalhoso que
testar manualmente, mas uma vez feito, você ganha uma espécie de
superpoder: leva apenas alguns segundos para verificar que seu
programa continua se comportando bem a todas as situações para as quais você escreveu
testes. Quando você quebra alguma coisa, você será avisado imediatamente, ao invés de
aleatoriamente, em algum momento depois.

{{index "toUpperCase method"}}

Testes normalmente tem a forma de pequenos programas que verificam
algum aspecto do seu código. Por exemplo, um conjunto de testes para o método
(padrão e provavelmente já testado por outra pessoa) `toUpperCase`
pode ser assim:

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

Escrever testes como este tende a produzir um código muito repetitivo
e desajeitado. Felizmente, existem softwares que ajudam você a escrever
e rodar coleções de testes (_((test suites))_) fornecendo uma
linguagem (na forma de funções e métodos) adequada para expressar
testes e gerando informações utéis quando o teste falha.
Estes são geralmente chamados de _((test runners))_.

{{index "persistent data structure"}}

Certos códigos são mais fáceis de tester que outros. Geralmente, quanto mais
objetos externos o código interage, mais difícil é configurar o contexto no qual
testá-lo. O estilo de programação mostrado no [capítulo anterior](robot), que usa valores
persistentes independentes em vez de alterar objetos, tenden a ser mais fácil de testar.

## Depuração

{{index debugging}}

Uma vez que você nota que há algo errado com o seu programa
porque ele se comporta mal ou produz erros, o próximo passo é descobrir
_qual_ é o problema.

Algumas vezes é óbvio. A mensagem de ((erro)) vai apontar para
a linha específica do seu programa, e se você olhar para a descrição
do erro e essa linha do código, você pode identificar, com frequência, o problema.

{{index "run-time error"}}

Nem sempre. Às vezes, a linha que desencadeou o problema
é simplesmente o primeiro lugar em que um valor esquisito produzido em outro lugar
é usado de maneira inválida. Se você tiver resolvido os ((exercícios)) nos
capítulos anteriores, provavelmente já terá experimentado tais
situações.

{{index "decimal number", "binary number"}}

O programa de exemplo a seguir tenta converter um número inteiro em uma
sequência de caracteres em uma determinada base (decimal, binário e assim por diante) repetidamente escolhendo o último ((dígito)) e, em seguida, dividindo o número para se livrar
desse dígito. Mas a saída estranha que ele atualmente produz
sugere que tem um ((bug)).

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

Mesmo se voce já veja o problema, finja por um momento que não.
Nos sabemos que o programa está funcionando mal e queremos descobrir
porquê.

{{index "trial and error"}}

É aqui que você deve resistir ao impulso de começar a fazer alterações
aleatórias no código para ver se isso o torna melhor. Em vez disso, _pense_ Analise
o que está acontecendo e crie uma ((teoria)) de porque isso pode estar
acontecendo. Em seguida, faça as observações adicionais para testar essa teoria - ou,
se você não ainda não tiver uma teoria, faça observações adicionais para ajudá-lo
a criar uma.

{{index "console.log", output, debugging, logging}}

Colocar algumas chamadas estratégicas de `console.log` no programa é uma boa
maneira de obter informações adicionais sobre o que o programa está fazendo. Neste
caso, queremos que `n` pegue os valores `13`, `1` e, em seguida, `0`. Vamos
escrever seu valor no início do loop.

```{lang: null}
13
1.3
0.13
0.013
…
1.5e-323
```

{{index rounding}}

_Certo_. Dividir 13 por 10 não produz um número inteiro. Ao invés de
`n /= base`, o que nós realmenten queremos é `n = Math.floor(n / base)` para
que o número seja apropriadamente arredondado para cima.

{{index "JavaScript console", "debugger statement"}}

Uma alternatia do uso de `console.log` para observar o comportamento
do programa é usar os recursos de depuração do seu navegador.
Navegadores vem com a capacidade de definir um _((breakpoint))_ em uma linha
especifica do seu código. Quando a execução do programa chega até uma linha
com um breakpoint, ela é pausada, e você pode inspecionar os valores atribuídos
naquele ponto. Eu não vou entrar em detalhes, como os depuradores diferem
de navegador para navegador, mas olhe no seu navegador ((ferramentas de
desenvolvedor)) ou pesquise na Web para obter mais informações.

Outra forma de definir um breakpoint é incluir uma declaração `debugger`
(consistindo simplesmente na palavra-chave) em seu programa. Se as
((ferramentas de desenvolvedor)) do seu navegador estiverem ativas,
o programa irá pausar sempre que atingir tal declaração.

## Propagação de erros

{{index input, output, "run-time error", error, validation}}

Nem todos os problemas podem ser evitados pelo programador, infelizmente. Se
o seu programa se comunica com o mundo externo de alguma forma, é
possível obter uma entrada malformada, sobrecarregar-se com trabalho, ou
fazer com que a rede falhe.

{{index "error recovery"}}

Se você está programando apenas para si mesmo, você pode simplesmente ignorar
tais problemas até que eles ocorram. Mas se você construir algo que
será usado por qualquer outra pessoa, você geralmente quer que o programa faça
melhor do que simplesmente travar. Às vezes, a coisa certa a fazer é pegar a
entrada incorreta no tranco e continuar executando. Em outros casos, é melhor
relatar ao usuário o que deu errado e desistir. Mas em qualquer
situação, o programa tem que ativamente fazer algo em resposta ao
problema.

{{index "promptInteger function", validation}}

Digamos que você tenha uma função `promptInteger` que solicita ao usuário um número
inteiro e o retorna. O que ela deve retornar se o usuário inserir
"laranja"?

{{index null, undefined, "return value", "special return value"}}

Uma opção é fazer retornar um valor especial. Escolhar comuns para
esses valores são  `null`, `undefined`, or -1.

```{test: no}
function promptNumber(question) {
  let result = Number(prompt(question));
  if (Number.isNaN(result)) return null;
  else return result;
}

console.log(promptNumber("How many trees do you see?"));
```

Agora qualquer código que chama `promptNumber` deve verificar se
um número real foi lido e, não sendo verdade, de alguma forma deve se recuperar - talvez
solicitando novamente ou definindo um valor padrão. Ou pode retornar novamente
um valor epecial para quem chamou para indicar que não conseguiu
fazer o que foi solicitado.

{{index "error handling"}}

Em muitas situações, principalmente quando ((erros))s são comuns e quem chama
deve expliciamente levá-los em conta, retornando um valor
especial é uma boa forma de indicar um erro. No entanto, tem suas
desvantagens. Primeiro, e se a função já puder retornar todo
o tipo possível valor? Em tal função, você terá que fazer
algo como embrulhar o resultado em um objeto para poder distinguir
sucesso de falha.

```
function lastElement(array) {
  if (array.length == 0) {
    return {failed: true};
  } else {
    return {element: array[array.length - 1]};
  }
}
```

{{index "special return value", readability}}

O segundo problema com o retorno de valores especiais é que isso pode levar a
códigos estranhos. Se uma parte do código chamar o `promptNumber` 10 vezes,
ele deve verificar 10 vezes se o valor `null` foi retornado. E se a sua
resposta para encontrar `null` é simplesmente retornar `null`, os chamadores
da função terão que checá-la, e assim por diante.

## Exceções

{{index "error handling"}}

Quando uma função não pode prosseguir normalmente, o que gostaríamos de fazer é
simplesmente parar o que estamos fazendo e imediatamente pular para um lugar que saiba
como lidar com o problema. Isso é o que a _((manipulação de execeções))_ faz.

{{index "control flow", "raising (exception)", "throw keyword", "call stack"}}

Exceções são um mecanismo que faz isso possível ao código executado
em um problema para alçar (ou lançar) uma exceção. Uma exceção pode
ser qualquer valor. Lança-las se assemelha um pouco a um retorno super-carregado
de uma função: ele salta não apenas da função atual,
mas também de quem a chamou, até a primeira chamada que
iniciou a execução atual. Isso é denominado de _((desenrolar da
pilha))_. Você pode se lembrar da pilha de chamadas que foi
mencionada no [Chapter ?](functions#stack). Uma exeção reduz
a pilha, descartando todos os contextos encontrados.

{{index "error handling", syntax, "catch keyword"}}

Se exceções fossem semprem lançadas até o final da pilha,
elas não seriam muito úteis. Elas apenas forneceriam uma nova maneira de explodir
seu programa. Seu poder reside no fato de que você pode definir
"obstáculos" ao longo da pilha para _pegar_ a exceção, pois ela está
subindo a pilha. Depois de detectar uma exceção, você pode fazer algo com ela para
resolver o problema e continuar a executar o programa.

Here's an example:

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

A palavra-chave `throw` é usada para lançar uma exceção. Capturar uma é
feito envolvendo um pedaço de código em um bloco `try`, seguindo pela
palavra-chave `catch`. Quando o código dentro do bloco `try` faz com que uma exceção
seja lançada, o bloco `catch` é avaliada, com o nome em
parenteses vinculado ao valor da exceção. Depois do bloco `catch`
terminar-ou se o bloco `try` terminar sem problemas-o programa
prossegue sob toda a instrução `try/catch`.

{{index debugging, "call stack", "Error type"}}

Neste caso, usamos o ((construtor)) `Error` para criar nosso
valor de exceção. Este é um construtor ((padrão)) do JavaScript que
cria um objeto com uma propriedade `message`. Na maioria dos ambientes
JavaScript, as instâncias desse construtor também reúnem informações
sobre a pilha de chamadas existente quando a exceção foi criada, o
chamado _((stack trace))_. Essa informação é armazenada na prepriedade
`stack` e pode ser útil ao tentar depurar um problema: ela nos
diz a função onde o problema ocorreu e quais funções fizeram a chamada
com falha.

{{index "exception handling"}}

Note que a função `look` ignora completamente a possibilidade que
`promptDirection` possa dar errado. Essa é a grande vantagem das
exceções: o código de tratamento de erros é necessário apenas no ponto em que
o erro ocorre e no ponto em que é manipulado. As funções
intermediárias podem esquecer tudo isso.

Bem, quase...

## Limpando após exceções

{{index "exception handling", "cleaning up"}}

O efeito de uma exceção é outro tipo de ((fluxo de controle)). Cada
ação pode causar uma exceção, que é praticamente toda
chamada de função e acesso a propriedade, pode fazer com que o controle saia
de repente do seu código.

Isso significa que quando o código tem vários efeitos colaterais, mesmo que o
fluxo de controle "regular" pareça que eles sempre acontecerão, uma
exceção pode impedir que alguns deles ocorram.

{{index "banking example"}}

Aqui está um código báncario ruim.

```{includeCode: true}
const accounts = {
  a: 100,
  b: 0,
  c: 20
};

function getAccount() {
  let accountName = prompt("Enter an account name");
  if (!accounts.hasOwnProperty(accountName)) {
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

A função `transfer` transfere a soma de dinheiro de uma dada conta
para outra, pedindo pelo nome da outra conta no processo.
Se um nome de conta inválido for informado, `getAccount` lança uma exceção.

Mas `transfer` _primeiro_ remove o dinheiro da conta e _então_
chama `getAccount` antes de adiciona-lo a outra conta. Se ele for
interrompido por uma exceção nesse ponto, isso fará com que o dinheiro
desapareça.

Esse código poderia ter sido escrito de forma um pouco mais inteligente, por exemplo,
chamando `getAccount` antes que de começar a movimentar o dinheiro.
Mas muitas vezes problemas como esse ocorrem de maneiras mais sutís. Até mesmo
funções que não parecem que lançarão uma exceção podem fazê-lo em
circunstâncias excepcionais ou quando elas contêm um erro do programador.

Uma maneira de resolver isso é usar menos efeitos colaterias. Novamente, um
estilo de programação que calcula novos valoress em de alterar os
dados existentes ajuda. Se um trecho de código parar de ser executado no meio da
criação de um novo valor, ninguém verá o valor incompleto,
e não haverá problema.

{{index block, "try keyword", "finally keyword"}}

Mas isso nem sempre é possível. Portanto, há outro recurso que
declarações `try` possuem. Elas podem ser seguidas por um bloco `finally`
em vez ou além de um bloco `catch`. Um bloco `finally`
diz que "não importa _o que_ aconteça, execute este código depois de tentar executar o
código no bloco `try`."

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

Essa versão da função monitora seu progresso, e se, ao
sair, perceber que foi interrompida em um ponto em que
criou um estado de programa inconsistente, ele repara o dano causado.

Note que mesmo que o código `finally` seja executado quando uma exceção
é lançada no bloco `try`, isso não interfere na execução.
Depois que o bloco `finally` é executado, a pilha continua se desenrolando.

{{index "exception safety"}}

Escrever programas que funcionem de forma confiável mesmo quando as
exceções surgem em locais inesperados é díficil. Muitas pessoas 
simplesmente não se incomodam, e porque
as exceções são normalmente reservadas para circunstâncias
excepcionais, o problema pode ocorrer tão raramente que nunca é
notado. Se isso é bom ou ruim, depende de quanto
dano o software causará quando falhar.

## Captura seletiva

{{index "uncaught exception", "exception handling", "JavaScript console", "developer tools", "call stack", error}}

Quando uma exceção chega até o final da pilha
sem ser capturada, ela é manipulada pelo ambiente. O que isto
significa difere entre os ambientes. Nos navegadores, uma descrição do
erro geralmente é gravada no console JavaScript (acessível
através do menu Ferramentas ou Desenvolvedor do navegador). Node.js, o
ambiente JavaScript sem navegador que discutiremos no [Chapter?](node),
é mais cuidadoso com a corrupção de dados. Ele aborta o processo
todo quando ocorre uma exceção não tratada.

{{index crash, "error handling"}}

Para erros de programação, apenas deixar passar o erro é geralmente
o melhor que você pode fazer. Uma exceção não tratada é uma maneira razoável de
de sinalizar um programa quebrado, e o console JavaScript fornecerá, em navegadores
modernos, algumas informações sobre quais chamadas de função
estavam na pilha quando o problema ocorreu.

{{index "user interface"}}

Para problemas que são _esperados_ durante o uso rotineiro,
travar com uma exceção não tratada é um estratégia terrível.

{{index syntax, [function, application], "exception handling", "Error type"}}

Usos inválidos da linguagem, como a referência a uma ((variável))
inexistente, procurar uma propriedade em um valor `null`, ou chamar algo
que não é uma função, também resultarão em exceções.
Tais exceções também podem ser capturadas.

{{index "catch keyword"}}

Quan um escopo `catch` é acessado, tudo que nos sabemos é que _algo_ no nosso
escopo `try` causou uma exceção. Mas nós não sabemos _o que_ causou ou _qual_ exceção
foi causada.

{{index "exception handling"}}

JavaScript (em uma omissão gritante) não fornece suporte
direto para capturar seletivamente exceções: ou você captura todas
ou você não captura nenhuma. Isso torna tentador _supor_ que a
exceção que você recebe é aquela em que você estava pensando quando escreveu
o bloco `catch`.

{{index "promptDirection function"}}

Mas pode não ser. Alguma outra ((suposição)) pode estar errada, ou
você pode ter introduzido um erro que está causando um exceção. Aqui está
um exemplo que _tenta_ continuar chamando `promptDirection`
até obter uma resposta válida.

```{test: no}
for (;;) {
  try {
    let dir = promtDirection("Where?"); // ← typo!
    console.log("You chose ", dir);
    break;
  } catch (e) {
    console.log("Not a valid direction. Try again.");
  }
}
```

{{index "infinite loop", "for loop", "catch keyword", debugging}}

A construção `for (;;)` é uma forma de criar intencionalmente um loop que
não termina sozinho. Nós saímos do loop apenas quando uma
direção valida é dada. _Mas_ nos escrevemos incorretamente `promptDirection`, o que
resultará em um erro de "varíavel indefinida". Como o bloco `catch`
ignora completamente seu valor de exceção (`e`), supondo que ele conhece
qual é o problema, ele erroneamente trata o erro de atribuição indicando
entrada inválida. Isso não apenas causa um loop infinito, mas
"oculta" a mensagem de erro útil sobre a atribuição incorreta.

Como regra geral, não cubra as exceções, a menos que seja com o
propósito de "direcionar" elas em algum lugar-por exemplo, pela rede, para
avisar a outro sistema que o nosso programa falhou. E, mesmo assim, pense
com cuidado sobre como você pode estar escondendo informações.

{{index "exception handling"}}

Então, nós queremos capturar um tipo _específico_ de exceção. Nós podemos fazer isso
verificando no bloco `catch` se a exceção que obtivemos é aquela em que
estamos interessados e relançando-a caso contrário. Mas como reconhecemos
uma exceção?

Nos poderíamos comparar sua propriedade `message` com a mensagem de ((erro))
que esperamos. Mas está é uma maneira instável de escrever código-estaríamos
usando informações destinadas ao consumo humano (a mensagem)
para tomar uma decisão programática. Assim que alguém alterar (ou
traduzir) a mensagem, o código deixará de funcionar.

{{index "Error type", "instanceof operator", "promptDirection function"}}

Em vez disso, vamos definir um novo tipo de erro e usar `instanceof` para
indenficá-lo.

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

O nova classe de erro extende `Error`. Ela não define seu próprio
construtor, o que significa que ele herda o construtor `Error`,
que espera uma mensagem string como argumento. De fato, ela não define
nada-a classe está vazia. Objetos `InputError` se comportam como
objetos `Error`, exceto que eles possuem uma classe diferente pela qual
podemos identifica-los.

{{index "exception handling"}}

Now the loop can catch these more carefully.

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

Isto irá capturar apenas instâncias de `InputError` e deixar exceções não
relacionadas. Se você reintroduzir o erro de digitação, o erro de atribuição
indefinida será reportado corretamente.

## Assertions

{{index "assert function", assertion, debugging}}

_Assertions_ are checks inside a program that verify that something is
the way it is supposed to be. They are used not to handle situations
that can come up in normal operation but to find programmer mistakes.

If, for example, `firstElement` is described as a function that should
never be called on empty arrays, we might write it like this:

```
function firstElement(array) {
  if (array.length == 0) {
    throw new Error("firstElement called with []");
  }
  return array[0];
}
```

{{index validation, "run-time error", crash, assumption, array}}

Now, instead of silently returning undefined (which you get when
reading an array property that does not exist), this will loudly blow
up your program as soon as you misuse it. This makes it less likely
for such mistakes to go unnoticed and easier to find their cause when
they occur.

I do not recommend trying to write assertions for every possible kind
of bad input. That'd be a lot of work and would lead to very noisy
code. You'll want to reserve them for mistakes that are easy to make
(or that you find yourself making).

## Summary

Mistakes and bad input are facts of life. An important part of
programming is finding, diagnosing, and fixing bugs. Problems can
become easier to notice if you have an automated test suite or add
assertions to your programs.

Problems caused by factors outside the program's control should
usually be handled gracefully. Sometimes, when the problem can be
handled locally, special return values are a good way to track them.
Otherwise, exceptions may be preferable.

Throwing an exception causes the call stack to be unwound until the
next enclosing `try/catch` block or until the bottom of the stack. The
exception value will be given to the `catch` block that catches it,
which should verify that it is actually the expected kind of exception
and then do something with it. To help address the unpredictable
control flow caused by exceptions, `finally` blocks can be used to
ensure that a piece of code _always_ runs when a block finishes.

## Exercises

### Retry

{{index "primitiveMultiply (exercise)", "exception handling", "throw keyword"}}

Say you have a function `primitiveMultiply` that in 20 percent of
cases multiplies two numbers and in the other 80 percent of cases raises an
exception of type `MultiplicatorUnitFailure`. Write a function that
wraps this clunky function and just keeps trying until a call
succeeds, after which it returns the result.

{{index "catch keyword"}}

Make sure you handle only the exceptions you are trying to handle.

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
  // Your code here.
}

console.log(reliableMultiply(8, 8));
// → 64
```
if}}

{{hint

{{index "primitiveMultiply (exercise)", "try keyword", "catch keyword", "throw keyword"}}

The call to `primitiveMultiply` should definitely happen in a `try`
block. The corresponding `catch` block should rethrow the exception
when it is not an instance of `MultiplicatorUnitFailure` and ensure
the call is retried when it is.

To do the retrying, you can either use a loop that stops only when a
call succeeds—as in the [`look` example](error#look) earlier in this
chapter—or use ((recursion)) and hope you don't get a string of
failures so long that it overflows the stack (which is a pretty safe
bet).

hint}}

### The locked box

{{index "locked box (exercise)"}}

Consider the following (rather contrived) object:

```
const box = {
  locked: true,
  unlock() { this.locked = false; },
  lock() { this.locked = true;  },
  _content: [],
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this._content;
  }
};
```

{{index "private property", "access control"}}

It is a ((box)) with a lock. There is an array in the box, but you can
get at it only when the box is unlocked. Directly accessing the
private `_content` property is forbidden.

{{index "finally keyword", "exception handling"}}

Write a function called `withBoxUnlocked` that takes a function value
as argument, unlocks the box, runs the function, and then ensures that
the box is locked again before returning, regardless of whether the
argument function returned normally or threw an exception.

{{if interactive

```
const box = {
  locked: true,
  unlock() { this.locked = false; },
  lock() { this.locked = true;  },
  _content: [],
  get content() {
    if (this.locked) throw new Error("Locked!");
    return this._content;
  }
};

function withBoxUnlocked(body) {
  // Your code here.
}

withBoxUnlocked(function() {
  box.content.push("gold piece");
});

try {
  withBoxUnlocked(function() {
    throw new Error("Pirates on the horizon! Abort!");
  });
} catch (e) {
  console.log("Error raised:", e);
}
console.log(box.locked);
// → true
```

For extra points, make sure that if you call `withBoxUnlocked` when
the box is already unlocked, the box stays unlocked.

if}}

{{hint

{{index "locked box (exercise)", "finally keyword", "try keyword"}}

This exercise calls for a `finally` block. Your function should first
unlock the box and then call the argument function from inside a `try`
body. The `finally` block after it should lock the box again.

To make sure we don't lock the box when it wasn't already locked,
check its lock at the start of the function and unlock and lock
it only when it started out locked.

hint}}
