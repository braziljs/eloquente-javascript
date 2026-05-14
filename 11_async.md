{{meta {load_files: ["code/hangar2.js", "code/chapter/11_async.js"], zip: "node/html"}}}

# Programação Assíncrona

{{quote {author: "Laozi", title: "Tao Te Ching", chapter: true}

Quem consegue esperar quieto enquanto a lama assenta?\
Quem consegue permanecer imóvel até o momento da ação?

quote}}

{{index "Laozi"}}

{{figure {url: "img/chapter_picture_11.jpg", alt: "Illustration showing two crows on a tree branch", chapter: framed}}}

A parte central de um computador, a parte que executa os passos individuais que compõem nossos programas, é chamada de _((processador))_. Os programas que vimos até agora manterão o processador ocupado até terminarem seu trabalho. A velocidade com que algo como um *loop* que manipula números pode ser executado depende quase inteiramente da velocidade do processador e da memória do computador.

{{index [memory, speed], [network, speed]}}

Mas muitos programas interagem com coisas fora do processador. Por exemplo, podem se comunicar por uma rede de computadores ou solicitar dados do ((disco rígido)) — que é muito mais lento do que obtê-los da memória.

Quando tal coisa está acontecendo, seria uma pena deixar o processador ocioso — pode haver outro trabalho que ele poderia fazer enquanto isso. Em parte, isso é tratado pelo seu sistema operacional, que alternará o processador entre múltiplos programas em execução. Mas isso não ajuda quando queremos que um _único_ programa consiga progredir enquanto espera por uma requisição de rede.

## Assincronicidade

{{index "synchronous programming"}}

Em um modelo de programação _síncrona_, as coisas acontecem uma de cada vez. Quando você chama uma função que realiza uma ação de longa duração, ela retorna somente quando a ação terminou e pode retornar o resultado. Isso paralisa seu programa pelo tempo que a ação leva.

{{index "asynchronous programming"}}

Um modelo _assíncrono_ permite que múltiplas coisas aconteçam ao mesmo tempo. Quando você inicia uma ação, seu programa continua executando. Quando a ação termina, o programa é informado e obtém acesso ao resultado (por exemplo, os dados lidos do disco).

Podemos comparar a programação síncrona e assíncrona usando um pequeno exemplo: um programa que faz duas requisições pela ((rede)) e depois combina os resultados.

{{index "synchronous programming"}}

Em um ambiente síncrono, onde a função de requisição retorna somente depois de ter feito seu trabalho, a maneira mais fácil de realizar essa tarefa é fazer as requisições uma após a outra. Isso tem a desvantagem de que a segunda requisição só será iniciada quando a primeira terminar. O tempo total levado será no mínimo a soma dos dois tempos de resposta.

{{index parallelism}}

A solução para esse problema, em um sistema síncrono, é iniciar ((thread))s adicionais de controle. Uma _thread_ é outro programa em execução cuja execução pode ser intercalada com outros programas pelo sistema operacional — já que a maioria dos computadores modernos contém múltiplos processadores, múltiplas threads podem até executar ao mesmo tempo, em processadores diferentes. Uma segunda thread poderia iniciar a segunda requisição, e então ambas as threads esperam seus resultados voltarem, após o que se ressincronizam para combinar seus resultados.

{{index CPU, blocking, "asynchronous programming", timeline, "callback function"}}

No diagrama a seguir, as linhas grossas representam o tempo que o programa gasta executando normalmente, e as linhas finas representam o tempo gasto esperando pela rede. No modelo síncrono, o tempo gasto pela rede é _parte_ da linha do tempo para uma dada thread de controle. No modelo assíncrono, iniciar uma ação de rede permite que o programa continue executando enquanto a comunicação de rede acontece ao lado dele, notificando o programa quando terminar.

{{figure {url: "img/control-io.svg", alt: "Diagram of showing control flow in synchronous and asynchronous programs. The first part shows a synchronous program, where the program's active and waiting phases all happen on a single, sequential line. The second part shows a multi-threaded synchronous program, with two parallel lines, on which the waiting parts happen alongside each other, causing the program to finish faster. The last part shows an asynchronous program, where the multiple asynchronous actions branch off from the main program, which at some point stops, and then resumes whenever the first thing it was waiting for finishes.",width: "8cm"}}}

{{index ["control flow", asynchronous], "asynchronous programming", verbosity, performance}}

Outra maneira de descrever a diferença é que esperar por ações terminarem é _implícito_ no modelo síncrono, enquanto é _explícito_ — sob nosso controle — no assíncrono.

A assincronicidade corta para os dois lados. Ela facilita expressar programas que não se encaixam no modelo linear de controle, mas também pode tornar mais estranho expressar programas que seguem uma linha reta. Veremos algumas maneiras de reduzir essa estranheza mais adiante no capítulo.

Ambas as plataformas proeminentes de programação JavaScript — ((browser))s e ((Node.js)) — tornam assíncronas operações que podem levar algum tempo, em vez de depender de ((thread))s. Como programar com threads é notoriamente difícil (entender o que um programa faz é muito mais difícil quando ele faz múltiplas coisas ao mesmo tempo), isso é geralmente considerado algo bom.

## Callbacks

{{indexsee [function, callback], "callback function"}}

Uma abordagem à ((programação assíncrona)) é fazer com que funções que precisam esperar por algo recebam um argumento extra, uma _((função de callback))_. A função assíncrona inicia um processo, configura as coisas para que a função de *callback* seja chamada quando o processo terminar e então retorna.

{{index "setTimeout function", waiting}}

Como exemplo, a função `setTimeout`, disponível tanto no Node.js quanto em *browsers*, espera um dado número de milissegundos e então chama uma função.

```{test: no}
setTimeout(() => console.log("Tick"), 500);
```

Esperar geralmente não é um trabalho importante, mas pode ser muito útil quando você precisa organizar algo para acontecer em um certo momento ou verificar se alguma ação está levando mais tempo do que o esperado.

{{index "readTextFile function"}}

Outro exemplo de uma operação assíncrona comum é ler um arquivo do armazenamento de um dispositivo. Imagine que você tem uma função `readTextFile` que lê o conteúdo de um arquivo como *string* e o passa para uma função de *callback*.

```
readTextFile("shopping_list.txt", content => {
  console.log(`Shopping List:\n${content}`);
});
// → Shopping List:
// → Peanut butter
// → Bananas
```

A função `readTextFile` não faz parte do JavaScript padrão. Veremos como ler arquivos no *browser* e no Node.js em capítulos posteriores.

Realizar múltiplas ações assíncronas em sequência usando *callbacks* significa que você precisa continuar passando novas funções para lidar com a ((continuação)) da computação após as ações. Uma função assíncrona que compara dois arquivos e produz um booleano indicando se o conteúdo deles é o mesmo poderia parecer assim:

```
function compareFiles(fileA, fileB, callback) {
  readTextFile(fileA, contentA => {
    readTextFile(fileB, contentB => {
      callback(contentA == contentB);
    });
  });
}
```

Esse estilo de programação é viável, mas o nível de indentação aumenta a cada ação assíncrona porque você acaba dentro de outra função. Fazer coisas mais complicadas, como envolver ações assíncronas em um *loop*, pode ficar estranho.

De certa forma, a assincronicidade é _contagiosa_. Qualquer função que chama uma função que funciona assincronamente deve ela própria ser assíncrona, usando um *callback* ou mecanismo semelhante para entregar seu resultado. Chamar um *callback* é um pouco mais complexo e propenso a erros do que simplesmente retornar um valor, então precisar estruturar grandes partes do seu programa dessa forma não é ótimo.

## Promises

Uma maneira ligeiramente diferente de construir um programa assíncrono é ter funções assíncronas que retornam um objeto que representa seu resultado (futuro) em vez de passar funções de *callback*. Dessa forma, tais funções realmente retornam algo significativo, e o formato do programa se assemelha mais ao de programas síncronos.

{{index "Promise class", "asynchronous programming", "resolving (a promise)", "then method", "callback function"}}

É para isso que serve a classe padrão `Promise`. Uma _promise_ é um recibo representando um valor que pode não estar disponível ainda. Ela fornece um método `then` que permite registrar uma função que deve ser chamada quando a ação que ela aguarda terminar. Quando a *promise* é _resolvida_, significando que seu valor se torna disponível, tais funções (pode haver múltiplas) são chamadas com o valor do resultado. É possível chamar `then` em uma *promise* que já foi resolvida — sua função ainda será chamada.

{{index "Promise.resolve function"}}

A maneira mais fácil de criar uma *promise* é chamando `Promise.resolve`. Essa função garante que o valor que você dá a ela seja envolvido em uma *promise*. Se já for uma *promise*, é simplesmente retornada. Caso contrário, você obtém uma nova *promise* que resolve imediatamente com seu valor como resultado.

```
let fifteen = Promise.resolve(15);
fifteen.then(value => console.log(`Got ${value}`));
// → Got 15
```

{{index "Promise class"}}

Para criar uma *promise* que não resolve imediatamente, você pode usar `Promise` como construtor. Ele tem uma interface um tanto estranha: o construtor espera uma função como argumento, que ele chama imediatamente, passando a ela uma função que ela pode usar para resolver a *promise*.

Por exemplo, é assim que você poderia criar uma interface baseada em *promises* para a função `readTextFile`:

{{index "textFile function"}}

```
function textFile(filename) {
  return new Promise(resolve => {
    readTextFile(filename, text => resolve(text));
  });
}

textFile("plans.txt").then(console.log);
```

Note como, em contraste com funções no estilo *callback*, esta função assíncrona retorna um valor significativo — uma *promise* de dar a você o conteúdo do arquivo em algum momento no futuro.

{{index "then method"}}

Uma coisa útil sobre o método `then` é que ele próprio retorna outra *promise*. Esta resolve para o valor retornado pela função de *callback* ou, se o valor retornado for uma *promise*, para o valor para o qual essa *promise* resolve. Assim, você pode "encadear" múltiplas chamadas a `then` para configurar uma sequência de ações assíncronas.

Esta função, que lê um arquivo cheio de nomes de arquivos e retorna o conteúdo de um arquivo aleatório naquela lista, mostra esse tipo de *pipeline* assíncrono de *promises*:

```
function randomFile(listFile) {
  return textFile(listFile)
    .then(content => content.trim().split("\n"))
    .then(ls => ls[Math.floor(Math.random() * ls.length)])
    .then(filename => textFile(filename));
}
```

A função retorna o resultado dessa cadeia de chamadas `then`. A *promise* inicial busca a lista de arquivos como *string*. A primeira chamada `then` transforma essa *string* em um *array* de linhas, produzindo uma nova *promise*. A segunda chamada `then` escolhe uma linha aleatória, produzindo uma terceira *promise* que contém um único nome de arquivo. A chamada `then` final lê esse arquivo, então o resultado da função como um todo é uma *promise* que retorna o conteúdo de um arquivo aleatório.

Nesse código, as funções usadas nas duas primeiras chamadas `then` retornam um valor regular que será imediatamente passado para a *promise* retornada por `then` quando a função retornar. A última chamada `then` retorna uma *promise* (`textFile(filename)`), tornando-a um passo assíncrono real.

Também teria sido possível realizar todos esses passos dentro de um único *callback* `then`, pois apenas o último passo é realmente assíncrono. Mas o tipo de wrappers `then` que apenas fazem alguma transformação síncrona de dados é frequentemente útil, como quando se quer retornar uma *promise* que produz uma versão processada de algum resultado assíncrono.

```
function jsonFile(filename) {
  return textFile(filename).then(JSON.parse);
}

jsonFile("package.json").then(console.log);
```

Geralmente, é útil pensar em uma *promise* como um dispositivo que permite ao código ignorar a questão de quando um valor vai chegar. Um valor normal precisa realmente existir antes de podermos referenciá-lo. Um valor prometido é um valor que _pode_ já estar lá ou pode aparecer em algum ponto no futuro. Computações definidas em termos de *promises*, conectando-as com chamadas `then`, são executadas assincronamente conforme suas entradas se tornam disponíveis.

## Falha

{{index "exception handling"}}

Computações JavaScript regulares podem falhar lançando uma exceção. Computações assíncronas frequentemente precisam de algo assim. Uma requisição de rede pode falhar, um arquivo pode não existir, ou algum código que faz parte da computação assíncrona pode lançar uma exceção.

{{index "callback function", error}}

Um dos problemas mais urgentes com o estilo *callback* de programação assíncrona é que torna extremamente difícil garantir que falhas sejam adequadamente reportadas aos *callbacks*.

Uma convenção comum é usar o primeiro argumento do *callback* para indicar que a ação falhou, e o segundo para passar o valor produzido pela ação quando foi bem-sucedida.

```
someAsyncFunction((error, value) => {
  if (error) handleError(error);
  else processValue(value);
});
```

Tais funções de *callback* devem sempre verificar se receberam uma exceção e garantir que quaisquer problemas que causem, incluindo exceções lançadas por funções que chamam, sejam capturados e dados à função correta.

{{index "rejecting (a promise)", "resolving (a promise)", "then method"}}

*Promises* tornam isso mais fácil. Elas podem ser resolvidas (a ação terminou com sucesso) ou rejeitadas (ela falhou). Handlers de resolução (registrados com `then`) são chamados apenas quando a ação é bem-sucedida, e rejeições são propagadas para a nova *promise* retornada por `then`. Quando um handler lança uma exceção, isso automaticamente faz com que a *promise* produzida por sua chamada `then` seja rejeitada. Se qualquer elemento em uma cadeia de ações assíncronas falhar, o resultado da cadeia inteira é marcado como rejeitado, e nenhum handler de sucesso é chamado além do ponto onde falhou.

{{index "Promise.reject function", "Promise class"}}

Assim como resolver uma *promise* fornece um valor, rejeitar uma também fornece um valor, geralmente chamado de _razão_ da rejeição. Quando uma exceção em uma função handler causa a rejeição, o valor da exceção é usado como razão. Da mesma forma, quando um handler retorna uma *promise* que é rejeitada, essa rejeição flui para a próxima *promise*. Existe uma função `Promise.reject` que cria uma nova *promise* imediatamente rejeitada.

{{index "catch method"}}

Para lidar explicitamente com tais rejeições, *promises* possuem um método `catch` que registra um handler para ser chamado quando a *promise* é rejeitada, semelhante a como handlers `then` lidam com resolução normal. Também é muito parecido com `then` no sentido de que retorna uma nova *promise*, que resolve para o valor da *promise* original quando resolve normalmente e para o resultado do handler `catch` caso contrário. Se um handler `catch` lança um erro, a nova *promise* também é rejeitada.

{{index "then method"}}

Como atalho, `then` também aceita um handler de rejeição como segundo argumento, para que você possa instalar ambos os tipos de handlers em uma única chamada de método: `.then(acceptHandler, rejectHandler)`.

Uma função passada ao construtor `Promise` recebe um segundo argumento, além da função de resolução, que pode usar para rejeitar a nova *promise*.

{{index "textFile function"}}

Quando nossa função `readTextFile` encontra um problema, ela passa o erro para sua função de *callback* como segundo argumento. Nosso wrapper `textFile` deveria na verdade verificar esse argumento para que uma falha faça a *promise* que retorna ser rejeitada.

```{includeCode: true}
function textFile(filename) {
  return new Promise((resolve, reject) => {
    readTextFile(filename, (text, error) => {
      if (error) reject(error);
      else resolve(text);
    });
  });
}
```

As cadeias de valores de *promise* criadas por chamadas a `then` e `catch` formam assim um *pipeline* através do qual valores assíncronos ou falhas se movem. Como tais cadeias são criadas registrando handlers, cada elo tem um handler de sucesso ou um handler de rejeição (ou ambos) associado a ele. Handlers que não correspondem ao tipo de resultado (sucesso ou falha) são ignorados. Handlers que correspondem são chamados, e seu resultado determina que tipo de valor vem em seguida — sucesso quando retornam um valor que não é *promise*, rejeição quando lançam uma exceção, e o resultado da *promise* quando retornam uma *promise*.

```{test: no}
new Promise((_, reject) => reject(new Error("Fail")))
  .then(value => console.log("Handler 1:", value))
  .catch(reason => {
    console.log("Caught failure " + reason);
    return "nothing";
  })
  .then(value => console.log("Handler 2:", value));
// → Caught failure Error: Fail
// → Handler 2: nothing
```

A primeira função handler `then` não é chamada porque nesse ponto do *pipeline* a *promise* contém uma rejeição. O handler `catch` lida com essa rejeição e retorna um valor, que é dado à segunda função handler `then`.

{{index "uncaught exception", "exception handling"}}

Assim como uma exceção não capturada é tratada pelo ambiente, ambientes JavaScript podem detectar quando uma rejeição de *promise* não é tratada e reportarão isso como um erro.

## Carla

{{index "Carla the crow"}}

É um dia ensolarado em Berlim. A pista do antigo aeroporto desativado está repleta de ciclistas e patinadores. Na grama perto de um contêiner de lixo, um bando de corvos ruidosamente se movimenta, tentando convencer um grupo de turistas a abrir mão de seus sanduíches.

Uma das corvos se destaca — uma fêmea grande e desgrenhada com algumas penas brancas na asa direita. Ela engana as pessoas com uma habilidade e confiança que sugerem que faz isso há muito tempo. Quando um senhor idoso é distraído pelas artimanhas de outra corvo, ela calmamente mergulha, agarra o pãozinho meio-comido da mão dele e voa embora.

Ao contrário do resto do grupo, que parece feliz em passar o dia fazendo palhaçadas ali, a corvo grande parece determinada. Carregando seu espólio, ela voa direto para o telhado do prédio do hangar, desaparecendo em uma abertura de ventilação.

Dentro do prédio, ouve-se um som estranho de batidas — suave, mas persistente. Ele vem de um espaço estreito sob o telhado de uma escadaria inacabada. A corvo está sentada ali, cercada por seus lanches roubados, meia dúzia de smartphones (vários dos quais estão ligados) e uma bagunça de cabos. Ela bate rapidamente na tela de um dos telefones com o bico. Palavras estão aparecendo nele. Se você não soubesse melhor, pensaria que ela está digitando.

Essa corvo é conhecida por seus pares como "cāāw-krö". Mas como esses sons são pouco adequados para cordas vocais humanas, vamos nos referir a ela como Carla.

Carla é uma corvo um tanto peculiar. Na juventude, era fascinada pela linguagem humana, bisbilhotando as pessoas até ter um bom domínio do que diziam. Mais tarde na vida, seu interesse mudou para a tecnologia humana, e ela começou a roubar telefones para estudá-los. Seu projeto atual é aprender a programar. O texto que está digitando em seu laboratório escondido é, na verdade, um trecho de código JavaScript assíncrono.

## Invadindo

{{index "Carla the crow"}}

Carla adora a internet. Infelizmente, o telefone em que está trabalhando está prestes a ficar sem dados pré-pagos. O prédio tem uma rede sem fio, mas requer um código para acessar.

Felizmente, os roteadores sem fio do prédio têm 20 anos e são mal protegidos. Pesquisando um pouco, Carla descobre que o mecanismo de autenticação da rede tem uma falha que ela pode usar. Ao entrar na rede, um dispositivo deve enviar a senha correta de seis dígitos. O ponto de acesso responderá com uma mensagem de sucesso ou falha dependendo de se o código correto foi fornecido. Porém, ao enviar um código parcial (digamos, apenas três dígitos), a resposta é diferente dependendo de se aqueles dígitos são o início correto do código ou não. Enviar números incorretos retorna imediatamente uma mensagem de falha. Ao enviar os corretos, o ponto de acesso espera por mais dígitos.

Isso torna possível acelerar enormemente a adivinhação do número. Carla pode encontrar o primeiro dígito tentando cada número por vez, até encontrar um que não retorne falha imediatamente. Tendo um dígito, ela pode encontrar o segundo da mesma forma, e assim por diante, até saber toda a senha.

Assuma que Carla tem uma função `joinWifi`. Dado o nome da rede e a senha (como *string*), a função tenta entrar na rede, retornando uma *promise* que resolve se bem-sucedida e rejeita se a autenticação falhou. A primeira coisa que ela precisa é uma maneira de envolver uma *promise* de modo que ela automaticamente rejeite se levar muito tempo, para permitir que o programa avance rapidamente se o ponto de acesso não responder.

```{includeCode: true}
function withTimeout(promise, time) {
  return new Promise((resolve, reject) => {
    promise.then(resolve, reject);
    setTimeout(() => reject("Timed out"), time);
  });
}
```

Isso usa o fato de que uma *promise* pode ser resolvida ou rejeitada apenas uma vez. Se a *promise* dada como argumento resolver ou rejeitar primeiro, esse resultado será o resultado da *promise* retornada por `withTimeout`. Se, por outro lado, o `setTimeout` disparar primeiro, rejeitando a *promise*, quaisquer chamadas posteriores de resolução ou rejeição são ignoradas.

Para encontrar a senha inteira, o programa precisa repetidamente procurar o próximo dígito tentando cada dígito. Se a autenticação tem sucesso, sabemos que encontramos o que procurávamos. Se falha imediatamente, sabemos que aquele dígito estava errado e devemos tentar o próximo. Se a requisição expira, encontramos outro dígito correto e devemos continuar adicionando outro dígito.

Como você não pode esperar por uma *promise* dentro de um *loop* `for`, Carla usa uma função recursiva para conduzir esse processo. A cada chamada, essa função recebe o código como o conhecemos até agora, bem como o próximo dígito a tentar. Dependendo do que acontece, ela pode retornar um código terminado ou chamar a si mesma, para começar a descobrir a próxima posição no código ou para tentar novamente com outro dígito.

```{includeCode: true}
function crackPasscode(networkID) {
  function nextDigit(code, digit) {
    let newCode = code + digit;
    return withTimeout(joinWifi(networkID, newCode), 50)
      .then(() => newCode)
      .catch(failure => {
        if (failure == "Timed out") {
          return nextDigit(newCode, 0);
        } else if (digit < 9) {
          return nextDigit(code, digit + 1);
        } else {
          throw failure;
        }
      });
  }
  return nextDigit("", 0);
}
```

O ponto de acesso tende a responder a requisições de autenticação inválidas em cerca de 20 milissegundos, então para segurança, esta função espera 50 milissegundos antes de expirar uma requisição.

```
crackPasscode("HANGAR 2").then(console.log);
// → 555555
```

Carla inclina a cabeça e suspira. Isso teria sido mais satisfatório se o código fosse um pouco mais difícil de adivinhar.

## Funções async

{{index "Promise class", recursion}}

Mesmo com *promises*, esse tipo de código assíncrono é irritante de escrever. *Promises* frequentemente precisam ser conectadas de maneiras verbosas e aparentemente arbitrárias. Para criar um *loop* assíncrono, Carla foi forçada a introduzir uma função recursiva.

{{index "synchronous programming", "asynchronous programming"}}

O que a função de quebra de senha realmente faz é completamente linear — ela sempre espera que a ação anterior complete antes de iniciar a próxima. Em um modelo de programação síncrona, seria mais direto de expressar.

{{index "async function", "await keyword"}}

A boa notícia é que o JavaScript permite escrever código pseudossíncrono para descrever computação assíncrona. Uma função `async` retorna implicitamente uma *promise* e pode, em seu corpo, usar `await` em outras *promises* de uma maneira que _parece_ síncrona.

{{index "findInStorage function"}}

Podemos reescrever `crackPasscode` assim:

```
async function crackPasscode(networkID) {
  for (let code = "";;) {
    for (let digit = 0;; digit++) {
      let newCode = code + digit;
      try {
        await withTimeout(joinWifi(networkID, newCode), 50);
        return newCode;
      } catch (failure) {
        if (failure == "Timed out") {
          code = newCode;
          break;
        } else if (digit == 9) {
          throw failure;
        }
      }
    }
  }
}
```

Essa versão mostra mais claramente a estrutura de *loop* duplo da função (o *loop* interno tenta os dígitos de 0 a 9 e o *loop* externo adiciona dígitos à senha).

{{index "async function", "return keyword", "exception handling"}}

Uma função `async` é marcada pela palavra `async` antes da palavra-chave `function`. Métodos também podem ser tornados `async` escrevendo `async` antes de seu nome. Quando tal função ou método é chamado, retorna uma *promise*. Assim que a função retorna algo, essa *promise* é resolvida. Se o corpo lança uma exceção, a *promise* é rejeitada.

{{index "await keyword", ["control flow", asynchronous]}}

Dentro de uma função `async`, a palavra `await` pode ser colocada na frente de uma expressão para esperar que uma *promise* resolva e só então continuar a execução da função. Se a *promise* rejeitar, uma exceção é levantada no ponto do `await`.

Tal função não executa mais do início ao fim de uma só vez como uma função JavaScript regular. Em vez disso, pode ser _congelada_ em qualquer ponto que tenha um `await` e retomada em um momento posterior.

Para a maioria do código assíncrono, essa notação é mais conveniente do que usar *promises* diretamente. Você ainda precisa de um entendimento de *promises*, já que em muitos casos ainda interagirá com elas diretamente. Mas ao conectá-las, funções `async` são geralmente mais agradáveis de escrever do que cadeias de chamadas `then`.

{{id generator}}

## Geradores

{{index "async function"}}

Essa capacidade de funções serem pausadas e depois retomadas não é exclusiva de funções `async`. O JavaScript também tem um recurso chamado funções _((geradora))s_. Essas são semelhantes, mas sem as *promises*.

Quando você define uma função com `function*` (colocando um asterisco após a palavra `function`), ela se torna um gerador. Quando você chama um gerador, ele retorna um ((iterador)), que já vimos no [Capítulo ?](object).

```
function* powers(n) {
  for (let current = n;; current *= n) {
    yield current;
  }
}

for (let power of powers(3)) {
  if (power > 50) break;
  console.log(power);
}
// → 3
// → 9
// → 27
```

{{index "next method", "yield keyword"}}

Inicialmente, quando você chama `powers`, a função é congelada em seu início. Toda vez que você chama `next` no iterador, a função executa até atingir uma expressão `yield`, que a pausa e faz com que o valor *yielded* se torne o próximo valor produzido pelo iterador. Quando a função retorna (a do exemplo nunca retorna), o iterador está concluído.

Escrever iteradores é frequentemente muito mais fácil quando se usam funções geradoras. O iterador para a classe `Group` (do exercício no [Capítulo ?](object#group_iterator)) pode ser escrito com este gerador:

{{index "Group class"}}

```
Group.prototype[Symbol.iterator] = function*() {
  for (let i = 0; i < this.members.length; i++) {
    yield this.members[i];
  }
};
```

```{hidden: true, includeCode: true}
class Group {
  constructor() { this.members = []; }
  add(m) { this.members.add(m); }
}
```

{{index [state, in iterator]}}

Não há mais necessidade de criar um objeto para armazenar o estado da iteração — geradores automaticamente salvam seu estado local toda vez que fazem *yield*.

Tais expressões `yield` podem ocorrer apenas diretamente na própria função geradora e não em uma função interna que você define dentro dela. O estado que um gerador salva ao fazer *yield* é apenas seu ambiente _local_ e a posição onde fez *yield*.

{{index "await keyword"}}

Uma função `async` é um tipo especial de gerador. Ela produz uma *promise* quando chamada, que é resolvida quando retorna (termina) e rejeitada quando lança uma exceção. Sempre que faz *yield* (espera) uma *promise*, o resultado dessa *promise* (valor ou exceção lançada) é o resultado da expressão `await`.

## Um Projeto de Arte Corvídea

{{index "Carla the crow"}}

Uma manhã, Carla acorda com um barulho desconhecido do asfalto do lado de fora de seu hangar. Pulando para a borda do telhado, ela vê que os humanos estão montando algo. Há muita fiação elétrica, um palco e algum tipo de grande parede preta sendo construída.

Sendo uma corvo curiosa, Carla examina a parede mais de perto. Ela parece consistir em vários dispositivos grandes com vidro frontal conectados a cabos. Na parte de trás, os dispositivos dizem "LedTec SIG-5030".

Uma rápida pesquisa na internet revela um manual do usuário para esses dispositivos. Eles parecem ser placas de trânsito, com uma matriz programável de LEDs âmbar. A intenção dos humanos é provavelmente exibir algum tipo de informação neles durante seu evento. Curiosamente, as telas podem ser programadas por uma rede sem fio. Será que estão conectadas à rede local do prédio?

Cada dispositivo em uma rede recebe um _endereço IP_, que outros dispositivos podem usar para enviar mensagens a ele. Falamos mais sobre isso no [Capítulo ?](browser). Carla percebe que seus próprios telefones recebem endereços como `10.0.0.20` ou `10.0.0.33`. Pode valer a pena tentar enviar mensagens para todos esses endereços e ver se algum responde à interface descrita no manual das placas.

O [Capítulo ?](http) mostra como fazer requisições reais em redes reais. Neste capítulo, usaremos uma função simplificada fictícia chamada `request` para comunicação de rede. Esta função recebe dois argumentos — um endereço de rede e uma mensagem, que pode ser qualquer coisa que possa ser enviada como JSON — e retorna uma *promise* que resolve para uma resposta da máquina no endereço dado, ou rejeita se houve um problema.

De acordo com o manual, você pode mudar o que é exibido em uma placa SIG-5030 enviando uma mensagem com conteúdo como `{"command": "display", "data": [0, 0, 3, …]}`, onde `data` contém um número por ponto LED, fornecendo seu brilho — 0 significa desligado, 3 significa brilho máximo. Cada placa tem 50 luzes de largura e 30 de altura, então um comando de atualização deve enviar 1.500 números.

Este código envia uma mensagem de atualização de exibição para todos os endereços na rede local, para ver o que pega. Cada um dos números em um endereço IP pode ir de 0 a 255. Nos dados enviados, ele ativa um número de luzes correspondente ao último número do endereço de rede.

```
for (let addr = 1; addr < 256; addr++) {
  let data = [];
  for (let n = 0; n < 1500; n++) {
    data.push(n < addr ? 3 : 0);
  }
  let ip = `10.0.0.${addr}`;
  request(ip, {command: "display", data})
    .then(() => console.log(`Request to ${ip} accepted`))
    .catch(() => {});
}
```

Como a maioria desses endereços não existirá ou não aceitará tais mensagens, a chamada `catch` garante que erros de rede não travem o programa. As requisições são todas enviadas imediatamente, sem esperar que outras terminem, para não desperdiçar tempo quando algumas máquinas não respondem.

Tendo disparado sua varredura de rede, Carla volta para fora para ver o resultado. Para sua alegria, todas as telas agora mostram uma faixa de luz em seus cantos superiores esquerdos. Elas _estão_ na rede local e _aceitam_ comandos. Ela rapidamente anota os números mostrados em cada tela. Há nove telas, dispostas em três de altura por três de largura. Elas têm os seguintes endereços de rede:

```{includeCode: true}
const screenAddresses = [
  "10.0.0.44", "10.0.0.45", "10.0.0.41",
  "10.0.0.31", "10.0.0.40", "10.0.0.42",
  "10.0.0.48", "10.0.0.47", "10.0.0.46"
];
```

Agora isso abre possibilidades para todo tipo de travessura. Ela poderia mostrar "corvos mandam, humanos babam" na parede em letras gigantes. Mas isso parece um pouco grosseiro. Em vez disso, ela planeja mostrar um vídeo de uma corvo voando cobrindo todas as telas à noite.

Carla encontra um clipe de vídeo adequado, no qual um segundo e meio de filmagem pode ser repetido para criar um vídeo em *loop* mostrando a batida de asa de uma corvo. Para caber nas nove telas (cada uma podendo mostrar 50x30 pixels), Carla corta e redimensiona os vídeos para obter uma série de imagens de 150x90, 10 por segundo. Cada uma é então cortada em nove retângulos e processada de modo que os pontos escuros no vídeo (onde a corvo está) mostrem uma luz brilhante, e os pontos claros (sem corvo) fiquem escuros, o que deve criar o efeito de uma corvo âmbar voando contra um fundo preto.

Ela configurou a variável `clipImages` para conter um *array* de quadros, onde cada quadro é representado com um *array* de nove conjuntos de pixels — um para cada tela — no formato que as placas esperam.

Para exibir um único quadro do vídeo, Carla precisa enviar uma requisição para todas as telas ao mesmo tempo. Mas ela também precisa esperar pelo resultado dessas requisições, tanto para não começar a enviar o próximo quadro antes que o atual tenha sido adequadamente enviado quanto para perceber quando requisições estão falhando.

{{index "Promise.all function"}}

`Promise` tem um método estático `all` que pode ser usado para converter um *array* de *promises* em uma única *promise* que resolve para um *array* de resultados. Isso fornece uma maneira conveniente de ter algumas ações assíncronas acontecendo lado a lado, esperar que todas terminem e então fazer algo com seus resultados (ou pelo menos esperar por elas para garantir que não falhem).

```{includeCode: true}
function displayFrame(frame) {
  return Promise.all(frame.map((data, i) => {
    return request(screenAddresses[i], {
      command: "display",
      data
    });
  }));
}
```

Isso mapeia sobre as imagens em `frame` (que é um *array* de *arrays* de dados de exibição) para criar um *array* de *promises* de requisição. Então retorna uma *promise* que combina todas elas.

Para poder parar um vídeo em reprodução, o processo é envolvido em uma classe. Essa classe tem um método assíncrono `play` que retorna uma *promise* que resolve apenas quando a reprodução é parada novamente via o método `stop`.

```{includeCode: true}
function wait(time) {
  return new Promise(accept => setTimeout(accept, time));
}

class VideoPlayer {
  constructor(frames, frameTime) {
    this.frames = frames;
    this.frameTime = frameTime;
    this.stopped = true;
  }

  async play() {
    this.stopped = false;
    for (let i = 0; !this.stopped; i++) {
      let nextFrame = wait(this.frameTime);
      await displayFrame(this.frames[i % this.frames.length]);
      await nextFrame;
    }
  }

  stop() {
    this.stopped = true;
  }
}
```

A função `wait` envolve `setTimeout` em uma *promise* que resolve após o número dado de milissegundos. Isso é útil para controlar a velocidade de reprodução.

```{startCode: true}
let video = new VideoPlayer(clipImages, 100);
video.play().catch(e => {
  console.log("Playback failed: " + e);
});
setTimeout(() => video.stop(), 15000);
```

Durante toda a semana que a parede de telas fica de pé, toda noite, quando escurece, um enorme pássaro laranja brilhante misteriosamente aparece nela.

## O loop de eventos

{{index "asynchronous programming", scheduling, "event loop", timeline}}

Um programa assíncrono começa executando seu script principal, que frequentemente configura *callbacks* para serem chamados depois. Esse script principal, assim como os *callbacks*, executam até o fim de uma só vez, sem interrupção. Mas entre eles, o programa pode ficar ocioso, esperando algo acontecer.

{{index "setTimeout function"}}

Então *callbacks* não são chamados diretamente pelo código que os agendou. Se eu chamar `setTimeout` de dentro de uma função, aquela função já terá retornado no momento em que a função de *callback* é chamada. E quando o *callback* retorna, o controle não volta para a função que o agendou.

{{index "Promise class", "catch keyword", "exception handling"}}

O comportamento assíncrono acontece em sua própria ((pilha de chamadas)) vazia. Esta é uma das razões pelas quais, sem *promises*, gerenciar exceções através de código assíncrono é tão difícil. Como cada *callback* começa com uma pilha praticamente vazia, seus handlers `catch` não estarão na pilha quando lançarem uma exceção.

```
try {
  setTimeout(() => {
    throw new Error("Woosh");
  }, 20);
} catch (e) {
  // Isso não executará
  console.log("Caught", e);
}
```

{{index thread, queue}}

Não importa quão próximos no tempo eventos — como timeouts ou requisições recebidas — aconteçam, um ambiente JavaScript executará apenas um programa por vez. Você pode pensar nisso como ele executando um grande *loop* _ao redor_ do seu programa, chamado de _loop de eventos_. Quando não há nada a ser feito, esse *loop* é pausado. Mas conforme eventos chegam, eles são adicionados a uma fila, e seu código é executado um após o outro. Como nada executa ao mesmo tempo, código de execução lenta pode atrasar o tratamento de outros eventos.

Este exemplo define um timeout mas então demora além do momento pretendido do timeout, fazendo o timeout atrasar.

```
let start = Date.now();
setTimeout(() => {
  console.log("Timeout ran at", Date.now() - start);
}, 20);
while (Date.now() < start + 50) {}
console.log("Wasted time until", Date.now() - start);
// → Wasted time until 50
// → Timeout ran at 55
```

{{index "resolving (a promise)", "rejecting (a promise)", "Promise class"}}

*Promises* sempre resolvem ou rejeitam como um novo evento. Mesmo se uma *promise* já estiver resolvida, esperar por ela fará com que seu *callback* execute após o script atual terminar, em vez de imediatamente.

```
Promise.resolve("Done").then(console.log);
console.log("Me first!");
// → Me first!
// → Done
```

Em capítulos posteriores veremos vários outros tipos de eventos que executam no *loop* de eventos.

## Bugs assíncronos

{{index "asynchronous programming", [state, transitions]}}

Quando seu programa executa sincronamente, de uma só vez, não há mudanças de estado acontecendo exceto aquelas que o próprio programa faz. Para programas assíncronos isso é diferente — eles podem ter _lacunas_ em sua execução durante as quais outro código pode executar.

Vejamos um exemplo. Esta é uma função que tenta reportar o tamanho de cada arquivo em um *array* de arquivos, garantindo que todos sejam lidos ao mesmo tempo em vez de em sequência.

{{index "fileSizes function"}}

```{includeCode: true}
async function fileSizes(files) {
  let list = "";
  await Promise.all(files.map(async fileName => {
    list += fileName + ": " +
      (await textFile(fileName)).length + "\n";
  }));
  return list;
}
```

{{index "async function"}}

A parte `async fileName =>` mostra como ((arrow function))s também podem ser tornadas `async` colocando a palavra `async` na frente delas.

{{index "Promise.all function"}}

O código não parece imediatamente suspeito... ele mapeia a *arrow function* `async` sobre o *array* de nomes, criando um *array* de *promises*, e então usa `Promise.all` para esperar por todas antes de retornar a lista que constroem.

Mas esse programa está completamente quebrado. Ele sempre retornará apenas uma única linha de saída, listando o arquivo que levou mais tempo para ser lido.

{{if interactive

```
fileSizes(["plans.txt", "shopping_list.txt"])
  .then(console.log);
```

if}}

Você consegue descobrir por quê?

{{index "+= operator"}}

O problema está no operador `+=`, que pega o valor _atual_ de `list` no momento em que a declaração começa a executar e então, quando o `await` termina, define a *binding* `list` como aquele valor mais a *string* adicionada.

{{index "await keyword"}}

Mas entre o momento em que a declaração começa a executar e o momento em que termina, há uma lacuna assíncrona. A expressão `map` executa antes de qualquer coisa ter sido adicionada à lista, então cada um dos operadores `+=` começa de uma *string* vazia e acaba, quando seu armazenamento termina, definindo `list` como o resultado de adicionar sua linha à *string* vazia.

{{index "side effect"}}

Isso poderia ter sido facilmente evitado retornando as linhas das *promises* mapeadas e chamando `join` no resultado de `Promise.all`, em vez de construir a lista alterando uma *binding*. Como de costume, computar novos valores é menos propenso a erros do que alterar valores existentes.

{{index "fileSizes function"}}

```
async function fileSizes(files) {
  let lines = files.map(async fileName => {
    return fileName + ": " +
      (await textFile(fileName)).length;
  });
  return (await Promise.all(lines)).join("\n");
}
```

Erros como esse são fáceis de cometer, especialmente quando se usa `await`, e você deve estar ciente de onde estão as lacunas em seu código. Uma vantagem da assincronicidade _explícita_ do JavaScript (seja através de *callbacks*, *promises* ou `await`) é que identificar essas lacunas é relativamente fácil.

## Resumo

A programação assíncrona torna possível expressar a espera por ações de longa duração sem congelar o programa todo. Ambientes JavaScript tipicamente implementam esse estilo de programação usando *callbacks*, funções que são chamadas quando as ações completam. Um *loop* de eventos agenda tais *callbacks* para serem chamados quando apropriado, um após o outro, para que suas execuções não se sobreponham.

Programar assincronamente é facilitado por *promises*, objetos que representam ações que podem completar no futuro, e funções `async`, que permitem escrever um programa assíncrono como se fosse síncrono.

## Exercícios

### Tempos Tranquilos

{{index "quiet times (exercise)", "security camera", "Carla the crow", "async function"}}

Há uma câmera de segurança perto do laboratório de Carla que é ativada por um sensor de movimento. Ela está conectada à rede e começa a enviar um fluxo de vídeo quando está ativa. Como prefere não ser descoberta, Carla montou um sistema que percebe esse tipo de tráfego de rede sem fio e acende uma luz em seu esconderijo sempre que há atividade do lado de fora, para que ela saiba quando ficar quieta.

{{index "Date class", "Date.now function", timestamp}}

Ela também tem registrado os horários em que a câmera é acionada por um tempo e quer usar essas informações para visualizar quais horários, em uma semana média, tendem a ser tranquilos e quais tendem a ser movimentados. O registro é armazenado em arquivos contendo um *timestamp* (como retornado por `Date.now()`) por linha.

```{lang: null}
1695709940692
1695701068331
1695701189163
```

O arquivo `"camera_logs.txt"` contém uma lista de arquivos de log. Escreva uma função assíncrona `activityTable(day)` que para um dado dia da semana retorna um *array* de 24 números, um para cada hora do dia, que contém o número de observações de tráfego de rede da câmera vistas naquela hora do dia. Dias são identificados por número usando o sistema de `Date.getDay`, onde domingo é 0 e sábado é 6.

A função `activityGraph`, fornecida pela *sandbox*, resume tal tabela em uma *string*.

{{index "textFile function"}}

Para ler os arquivos, use a função `textFile` definida anteriormente — dado um nome de arquivo, ela retorna uma *promise* que resolve para o conteúdo do arquivo. Lembre-se de que `new Date(timestamp)` cria um objeto `Date` para aquele momento, que tem métodos `getDay` e `getHours` retornando o dia da semana e a hora do dia.

Ambos os tipos de arquivos — a lista de arquivos de log e os arquivos de log em si — têm cada dado em sua própria linha, separados por caracteres de nova linha (`"\n"`).

{{if interactive

```{test: no}
async function activityTable(day) {
  let logFileList = await textFile("camera_logs.txt");
  // Seu código aqui
}

activityTable(1)
  .then(table => console.log(activityGraph(table)));
```

if}}

{{hint

{{index "quiet times (exercise)", "split method", "textFile function", "Date class"}}

Você precisará converter o conteúdo desses arquivos em um *array*. A maneira mais fácil de fazer isso é usar o método `split` na *string* produzida por `textFile`. Note que para os arquivos de log, isso ainda dará um *array* de *strings*, que você precisa converter em números antes de passá-los para `new Date`.

Resumir todos os pontos de tempo em uma tabela de horas pode ser feito criando uma tabela (*array*) que contém um número para cada hora do dia. Você pode então iterar sobre todos os *timestamps* (sobre os arquivos de log e os números em cada arquivo de log) e para cada um, se aconteceu no dia correto, pegar a hora em que ocorreu e somar um ao número correspondente na tabela.

{{index "async function", "await keyword", "Promise class"}}

Certifique-se de usar `await` no resultado de funções assíncronas antes de fazer qualquer coisa com ele, ou você acabará com uma `Promise` onde esperava uma *string*.

hint}}


### Promises Reais

{{index "real promises (exercise)", "Promise class"}}

Reescreva a função do exercício anterior sem `async`/`await`, usando métodos simples de `Promise`.

{{if interactive

```{test: no}
function activityTable(day) {
  // Seu código aqui
}

activityTable(6)
  .then(table => console.log(activityGraph(table)));
```

if}}

{{index "async function", "await keyword", performance}}

Neste estilo, usar `Promise.all` será mais conveniente do que tentar modelar um *loop* sobre os arquivos de log. Na função `async`, simplesmente usar `await` em um *loop* é mais simples. Se ler um arquivo leva algum tempo, qual dessas duas abordagens levará menos tempo para executar?

{{index "rejecting (a promise)"}}

Se um dos arquivos listados na lista de arquivos tiver um erro de digitação e a leitura falhar, como essa falha acaba no objeto `Promise` que sua função retorna?

{{hint

{{index "real promises (exercise)", "then method", "textFile function", "Promise.all function"}}

A abordagem mais direta para escrever esta função é usar uma cadeia de chamadas `then`. A primeira *promise* é produzida lendo a lista de arquivos de log. O primeiro *callback* pode dividir essa lista e mapear `textFile` sobre ela para obter um *array* de *promises* para passar a `Promise.all`. Pode retornar o objeto retornado por `Promise.all`, de modo que o que quer que aquilo retorne se torne o resultado do valor de retorno deste primeiro `then`.

{{index "asynchronous programming"}}

Agora temos uma *promise* que retorna um *array* de arquivos de log. Podemos chamar `then` novamente nela e colocar a lógica de contagem de *timestamps* ali. Algo assim:

```{test: no}
function activityTable(day) {
  return textFile("camera_logs.txt").then(files => {
    return Promise.all(files.split("\n").map(textFile));
  }).then(logs => {
    // analisar...
  });
}
```

Ou você poderia, para um agendamento de trabalho ainda melhor, colocar a análise de cada arquivo dentro de `Promise.all`, de modo que esse trabalho possa ser iniciado para o primeiro arquivo que voltar do disco, antes mesmo dos outros arquivos voltarem.

```{test: no}
function activityTable(day) {
  let table = []; // inicializar...
  return textFile("camera_logs.txt").then(files => {
    return Promise.all(files.split("\n").map(name => {
      return textFile(name).then(log => {
        // analisar...
      });
    }));
  }).then(() => table);
}
```

{{index "await keyword", scheduling}}

Isso mostra que a maneira como você estrutura suas *promises* pode ter um efeito real na maneira como o trabalho é agendado. Um simples *loop* com `await` torna o processo completamente linear — espera cada arquivo carregar antes de prosseguir. `Promise.all` torna possível que múltiplas tarefas sejam conceitualmente trabalhadas ao mesmo tempo, permitindo-lhes progredir enquanto arquivos ainda estão sendo carregados. Isso pode ser mais rápido, mas também torna a ordem em que as coisas acontecerão menos previsível. Neste caso, estamos apenas incrementando números em uma tabela, o que não é difícil de fazer de forma segura. Para outros tipos de problemas, pode ser muito mais difícil.

{{index "rejecting (a promise)", "then method"}}

Quando um arquivo na lista não existe, a *promise* retornada por `textFile` será rejeitada. Como `Promise.all` rejeita se qualquer uma das *promises* dadas a ela falhar, o valor de retorno do *callback* dado ao primeiro `then` também será uma *promise* rejeitada. Isso faz a *promise* retornada por `then` falhar, então o *callback* dado ao segundo `then` nem sequer é chamado, e uma *promise* rejeitada é retornada da função.

hint}}

### Construindo Promise.all

{{index "Promise class", "Promise.all function", "building Promise.all (exercise)"}}

Como vimos, dado um *array* de ((promise))s, `Promise.all` retorna uma *promise* que espera todas as *promises* no *array* terminarem. Ela então tem sucesso, produzindo um *array* de valores resultado. Se uma *promise* no *array* falhar, a *promise* retornada por `all` também falha, passando adiante a razão da falha da *promise* que falhou.

Implemente algo assim você mesmo como uma função regular chamada `Promise_all`.

Lembre-se de que depois que uma *promise* tem sucesso ou falha, ela não pode ter sucesso ou falhar novamente, e chamadas adicionais às funções que a resolvem são ignoradas. Isso pode simplificar a maneira como você lida com a falha da sua *promise*.

{{if interactive

```{test: no}
function Promise_all(promises) {
  return new Promise((resolve, reject) => {
    // Seu código aqui.
  });
}

// Código de teste.
Promise_all([]).then(array => {
  console.log("This should be []:", array);
});
function soon(val) {
  return new Promise(resolve => {
    setTimeout(() => resolve(val), Math.random() * 500);
  });
}
Promise_all([soon(1), soon(2), soon(3)]).then(array => {
  console.log("This should be [1, 2, 3]:", array);
});
Promise_all([soon(1), Promise.reject("X"), soon(3)])
  .then(array => {
    console.log("We should not get here");
  })
  .catch(error => {
    if (error != "X") {
      console.log("Unexpected failure:", error);
    }
  });
```

if}}

{{hint

{{index "Promise.all function", "Promise class", "then method", "building Promise.all (exercise)"}}

A função passada ao construtor `Promise` terá que chamar `then` em cada uma das *promises* no *array* dado. Quando uma delas tem sucesso, duas coisas precisam acontecer. O valor resultante precisa ser armazenado na posição correta de um *array* de resultados, e precisamos verificar se esta era a última ((promise)) pendente e finalizar nossa própria *promise* se era.

{{index "counter variable"}}

Isso pode ser feito com um contador que é inicializado com o comprimento do *array* de entrada e do qual subtraímos 1 toda vez que uma *promise* tem sucesso. Quando chega a 0, terminamos. Certifique-se de levar em conta a situação onde o *array* de entrada está vazio (e portanto nenhuma *promise* jamais resolverá).

Lidar com falha requer alguma reflexão, mas acaba sendo extremamente simples. Basta passar a função `reject` da *promise* wrapper para cada uma das *promises* no *array* como handler de `catch` ou como segundo argumento para `then`, de modo que uma falha em uma delas dispare a rejeição da *promise* wrapper inteira.

hint}}
