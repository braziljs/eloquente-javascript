{{meta {load_files: ["code/crow-tech.js", "code/chapter/11_async.js"]}}}

# Programação Assíncrona

{{quote {author: "Laozi", title: "Tao Te Ching", chapter: true}

Quem pode esperar quieto enquanto a lama assenta?\
Quem pode permanecer parado até o momento de agir?

quote}}

{{index "Laozi"}}

{{figure {url: "img/chapter_picture_11.jpg", alt: "Picture of two crows on a branch", chapter: framed}}}

A parte central de um computador, a parte que dá os passos individuais que compõe os nossos programas é chamada de **processador**. Os programas que vimos até agora são do tipo que mantém o processador ocupado até que eles tenham terminado seu trabalho. A velocidade na qual um _loop_ que manipula números é executado depende inteiramente do processador.

{{index [memory, speed], [network, speed]}}

Porém, muitos programas interagem com coisas fora do processador. Por exemplo, eles podem se comunicar através de uma rede de computadores ou pedir dados do disco rígido, o que é muito mais lento do que acessar da memória.

Quando algo assim ocorre, seria uma pena deixar o processador ocioso — talvez tenha alguma tarefa que pode ser feita durante esse tempo. Em parte, o sistema operacional cuida dessa parte, ele fará com que o processador alterne entre os diversos programas que estão executando. Contudo, isso não ajuda quando queremos que um **único** programa faça progresso enquanto está esperando uma resposta da rede.

## Assincronicidade

{{index "synchronous programming"}}

Em um programa **síncrono**, as coisas acontecem uma de cada vez. Quando uma função com certo tempo de execução é chamada, o programa retorna apenas quando a ação tiver terminado e podemos retornar o resultado. Isso para o programa pelo tempo que a ação durar.

{{index "asynchronous programming"}}

Um modelo **assíncrono** permite que várias coisas aconteçam ao mesmo tempo. Quando você começa uma ação, o seu programa continua executando. Quando a ação termina, o programa é informado e recebe acesso ao resultado (por exemplo, ler dados do disco).

Nós podemos comparar programação síncrona e assíncrona usando o seguinte exemplo: um programa busca dois recursos da rede e depois combina os resultados.

{{index "synchronous programming"}}

Em um ambiente síncrono, uma função de _request_ retorna somente depois de fazer seu trabalho, assim a maneira mais fácil de realizar esse tipo de tarefa é ter uma _request_ após a outra. A desvantagem de fazer dessa forma é que a segunda _request_ irá começar apenas depois da primeira concluir. Portanto, o tempo total de execução será no mínimo a soma do tempo de resposta das duas _requests_.

{{index parallelism}}

A solução para esse problema, em um ambiente síncrono, é adicionar _threads_ de controle. Um _thread_ é um outro programa rodando cuja execução pode ser intercalada com outros programas pelo sistema operacional, já que a maioria dos computadores possuem múltiplos processadores, múltiplos _threads_  podem ser executados ao mesmo tempo em processadores diferentes. Um segundo _threads_  pode começar a segunda _request_ e então ambos os _threads_  esperam por seus resultados, após eles irão se ressincronizar e combinar seus resultados.

{{index CPU, blocking, "asynchronous programming", timeline, "callback function"}}

No diagrama a seguir, as linhas grossas representam o tempo que o programa gasta executando normalmente, e as linhas finas o tempo gasto esperando resposta da rede. No modelo síncrono, o tempo gasto pelas redes é parte da linha de tempo para um dado fio de controle. Já no modelo assíncrono, ao iniciar a ação nas redes ocorre conceitualmente uma divisão na linha do tempo. O programa que começou a ação continua executando e a ação ocorre em paralelo, notificando-o quando acabar

{{figure {url: "img/control-io.svg", alt: "Control flow for synchronous and asynchronous programming",width: "8cm"}}}

{{index ["control flow", asynchronous], "asynchronous programming", verbosity}}

Outro jeito de descrever essa diferença é que esperar a ação terminar está **implícita** no modelo síncrono, enquanto fica **explícito** e sob nosso controle no modelo assíncrono.

Assincronicidade possui aspectos positivos e negativos. Torna fazer programas que não se encaixam no modelo de linha reta mais fácil, porém faz com programas que seguem esse modelo linha reta fiquem mais estranhos. Vamos ver formas essa estranheza mais tarde neste capítulo.

Ambas as plataformas de programação importantes de Javascript — navegador (_browser_) e  Node.js — fazem operações que podem ser assíncronas, ao invés de utilizarem fios. E como programação com fios é notoriamente difícil (entender o que um programa faz é muito mais complicado quando ele faz mais de uma coisa ao mesmo tempo), isso geralmente é visto como algo positivo.

## Tecnologia dos Corvos

A maior parte das pessoas estão cientes de que os corvos são aves muito espertas. Eles podem usar ferramentas, planejar com antecedência, lembrar de coisas e até comunicar essas coisas entre si.

O que a maior parte das pessoas não sabem é que eles são capazes de muitas outras coisas que escondem de nós. Já me disseram por um respeitável ( e talvez excêntrico) especialista em corvídeos que a tecnologia dos corvos não está muito distante da humana, e eles estão nos alcançando.

Por exemplo, muitos bandos de corvos tem a habilidade de construir dispositivos computacionais. Estes não são eletrônicos, como os dos humanos são, mas operam através da ação de pequenos insetos, uma espécie próxima aos cupins, que desenvolveu uma relação simbiótica com os corvos. Desta forma, as aves fornecem alimento a eles e em retorno os insetos constroem e operam complexas colônias que, com a ajuda das criaturas que vivem dentro delas, performam computações.

Tais colônias geralmente estão localizadas em grandes e longevos ninhos. As aves e os insetos trabalham em conjunto para construir uma rede de bulbosas estruturas de barro, que ficam escondidas entre os galhos do ninho, em que os insetos vivem e trabalham.

Para comunicar com outros dispositivos, essas máquinas usam sinais de luz. Os corvos colocam materiais reflexivos em suportes especiais para comunicação e os insetos posicionam eles para que reflitam luz em outro ninho, codificando os dados numa sequência de rápidos flashes. Isso significa que apenas ninhos que tem uma conexão visual clara podem se comunicar.

Nosso amigo, o especialista em corvídeos, fez um mapa das redes de ninhos de corvos no vilarejo de ((Hières-sur-Amby)), às margens do rio Rhône. Esse mapa mostra os ninhos e suas conexões:

{{figure {url: "img/Hieres-sur-Amby.png", alt: "A network of crow nests in a small village"}}}

É um exemplo impressionante de convergência na evolução, computadores de corvos rodam JavaScript. Neste capítulo, iremos escrever algumas funções básicas de redes para eles.

## _Callbacks_

{{indexsee [function, callback], "callback function"}}

Uma forma de programação assíncrona é fazer funções que executam ações lentas recebam um argumento extra, uma função _callback_. A ação inicia e quando ela termina, a função _callback_ é chamada e executada.

{{index "setTimeout function", waiting}}

Por exemplo, a função `setTimeout`, disponível tanto em Node.js quanto em navegadores, el espera um dado número de milissegundos (um segundo equivale a mil milissegundos) e então chama a função.

```{test: no}
setTimeout(() => console.log("Tick"), 500);
```

Esperar não é em geral uma tarefa muito importante, mas pode ser útil ao fazer algo como atualizar uma animação ou verificar se algo está levando mais tempo do um dado tempo.

Realizar várias ações assíncronas em sequência utilizando _callbacks_ significa que você precisa continuar passando novas funções para lidar com a continuação da computação após cada ação.

{{index "hard disk"}}

A maioria dos computadores de ninho de corvo possuem bulbos de armazenamento de dados de longa duração, onde os pedaços de informação estão marcados em galhos para que possam ser acessados depois. Acessar, ou encontrar os pedaços de dados leva um momento, então a interface com o armazenamento de dados é assíncrono e utiliza funções _callback_.

Bulbos de armazenamento guardam pedaços de dado codificação em ((JSON)) na forma de nomes. Um ((corvo)) pode guardar informações sobre lugares em que está escondido comida no nome de “_caches_ de comida”, que podem guardar um _array_ de nomes de lugares que apontam para outros pedaços de dados, descrevendo um verdadeiro _cache_. Para procurar um _cache_ de comida em um dos bulbos de armazenamento ninho _Big Oak_, um corvo poderia executar o seguinte código:

{{index "readStorage function"}}

```{includeCode: "top_lines: 1"}
import {bigOak} from "./crow-tech";

bigOak.readStorage("food caches", caches => {
  let firstCache = caches[0];
  bigOak.readStorage(firstCache, info => {
    console.log(info);
  });
});
```

( Todos os nomes e _strings_ foram traduzidas da linguagem dos corvos para Português.)

Esse estilo de programação é funcional, mas o nível de indentação aumenta a cada ação assíncrona porque você acaba em outra função. Fazendo coisas mais complicadas, como rodar ações múltiplas ao mesmo tempo pode ficar um pouco esquisito.

Ninhos de corvos computacionais são construídos para se comunicar utilizando pares de _request_-respostas. Isso significa que um ninho deve mandar uma _request_ para outro, o qual deve imediatamente enviar uma mensagem de resposta, confirmando o recebimento e possivelmente incluindo a resposta da pergunta feita na mensagem.

Cada mensagem é marcada com um tipo (_type_), o que vai determinar como ela será tratada. Nosso código pode definir tratadores específicos para tipos diferentes de _requests_, e quando uma _request_ chega, o tratador será chamado para produzir uma resposta.

{{index "crow-tech module", "send method"}}

A interface exportada pelo módulo `./crow-tech` fornece funções baseadas em _callbacks_ para comunicação. Ninhos possuem o método `send` para enviar _requests_. Ele espera o nome do ninho de destino, o tipo da _request_ e conteúdo da _request_ como seu terceiro argumento. E no quarto e último argumento espera a função a ser chamada quando a resposta chegar.

```
bigOak.send("Cow Pasture", "note", "Let's caw loudly at 7PM",
            () => console.log("Note delivered."));
```

Mas para tornar esses ninhos capazes de receber essa _request_, nós primeiro precisamos definir uma _request_ chamada “`note`”. O código que vai tratar com _requests_ precisa ser executado não apenas no ninho computacional mas em todos ninhos que podem receber mensagens desse tipo. Nós vamos apenas assumir que um corvo vôe e instale nosso código que trata essa _request_ em todos os ninhos.

{{index "defineRequestType function"}}

```{includeCode: true}
import {defineRequestType} from "./crow-tech";

defineRequestType("note", (nest, content, source, done) => {
  console.log(`${nest.name} received note: ${content}`);
  done();
});
```

A `defineRequestType` é uma função que define um novo tipo de _request_. O exemplo adiciona o suporte para _requests_ “`note`”, que apenas enviam uma nota para um dado ninho. Nossa implementação chama o `console.log` para que possamos verificar que a nossa nota chegou. Ninhos possuem uma propriedade `name`  guardada em seus nomes.

{{index "asynchronous programming"}}

O quarto argumento dado ao tratador, `done`, é a função de _callback_ que precisa ser chamada quando a _request_ termina. Se tivéssemos utilizado o retorno do tratador como resposta, isso iria significar que o tratador não pode por si só performar uma atividade assíncrona. Uma função realizando um trabalho assíncrono geralmente irá  retornar antes do trabalho terminar, tendo que fazer um arranjo para que o _callback_ seja chamada quando for completado. Portanto, iremos precisar de algum mecanismo assíncrono, nesse caso outra função _callback_ para sinalizar quando a resposta for válida.

De certo modo, assincronicidade é **contagiante**. Qualquer função que chama uma função que trabalha assincronicamente precisa por si só ser assíncrona. utilizando um _callback_ ou mecanismo similar para entregar resultado. Chamando um _callback_ é algo mais complicado e sujeito a erro do que simplesmente retornar um valor, logo necessita estruturar grandes partes do seu código, o que não é prático.

## _Promises_

Trabalhar com conceitos abstratos é em geral mais fácil quando esses conceitos podem ser representados por valores. No caso de ações assíncronas, você poderia ao invés de arranjar que uma função fosse chamada em algum momento no futuro, retornar um objeto que represente esse evento no futuro.

{{index "Promise class", "asynchronous programming"}}

É pra isso que a classe padrão `Promise` serve. Uma _promise_ é uma ação assíncrona que pode, em algum momento, produzir um valor. Ela pode notificar qualquer um que estiver interessado quando seu valor estiver disponível.

{{index "Promise.resolve function", "resolving (a promise)"}}

A maneira mais fácil de criar uma _promise_ é chamando` Promise.resolve`. Essa função garante que o valor dado está dentro da _promise_. Se já for uma _promise_, pode ser simplesmente retornado — caso o contrário,  você recebe uma nova _promise_ que imediatamente termina com seu valor como resultado.

```
let fifteen = Promise.resolve(15);
fifteen.then(value => console.log(`Got ${value}`));
// → Got 15
```

{{index "then method"}}

Para conseguir o resultado da _promise_, pode-se utilizar o método` then`. Isso registra uma função _callback_ que pode ser chamada quando a _promise_ se resolve e produz um valor. Pode-se adicionar múltiplas _callbacks_ em uma única _promise_, elas serão chamadas, mesmo que sejam adicionadas depois da _promise_ ter sido **resolvida** (terminada).

Porém, isso não é tudo o que o método `then` faz. Ele retorna outra _promise_, que resolve o valor que a função tratadora retorna ou, se retornar uma _promise_, espera a _promise_ e depois o seu resultado.

É útil pensar em _promises_ como dispositivos para transportar o valor em uma realidade assíncrona. Um valor normal simplesmente está aqui. Um valor prometido é um valor que **pode** já estar aqui ou em algum ponto do futuro. Computações definidas em termos de _promises_ agem em cima desses valores e eles são executados assincronamente quando o valor se mostra disponível.

{{index "Promise class"}}

Para criar uma _promise_, pode-se utilizar `Promise` como um construtor. Ele possui uma interface peculiar — o construtor espera uma função como argumento, que é chamada imediatamente, passando uma função que pode ser utilizada para resolver a _promise_. Funciona deste modo, ao invés do exemplo com o método `resolve`, para que apenas o código que criou a _promise_ possa resolvê-lo.

{{index "storage function"}}

Esta é a forma como seria criada uma _promise_ com a sua interface para a  função `readStorage`:

```{includeCode: "top_lines: 5"}
function storage(nest, name) {
  return new Promise(resolve => {
    nest.readStorage(name, result => resolve(result));
  });
}

storage(bigOak, "enemies")
  .then(value => console.log("Got", value));
```

Essa função assíncrona retorna um valor que tem um propósito. Essa é a vantagem principal das _promises_  — elas simplificam o uso de funções assíncronas. Ao invés de ficar utilizando _callbacks_, funções baseadas em _promises_ (_promise-based_) são parecidas com as convencionais, eles recebem um valor como argumento (_input_) e retornam outro (_output_). A única diferença é que o valor de saída (_output_) pode não estar disponível ainda.

## Falhas

{{index "exception handling"}}

Processos computacionais usuais com Javascript podem falhar e por jogarem uma exceção. Computação assíncrona em geral precisa de algo semelhante. A _request_ na rede pode falhar, ou algum código na parte assíncrona pode causar uma exceção.

{{index "callback function", error}}

Um dos maiores problemas com o estilo _callback_ de programação assíncrona é que se torna extremamente difícil de fazer com que as falhas sejam corretamente reportadas aos _callbacks_.

Uma convenção amplamente utilizada é que o primeiro argumento do _callback_ seja utilizado para indicar que a função falhou, o segundo contém o valor produzido pela ação quando ela foi bem sucedida. Tais funções de _callback_ precisam sempre verificar se elas receberam uma exceção e garantir que qualquer problema que ela cause, incluindo exceções jogadas por outras funções que ela chame, sejam capturadas e dadas para a função correta.

{{index "rejecting (a promise)", "resolving (a promise)", "then method"}}

As _promises_ tornam o processo mais simples. Elas podem tanto ser resolvidas (a ação termina com sucesso) ou rejeitadas (se falharem). Tratadores de resolução (como registrados com `then`) são chamados apenas quando a ação é bem sucedida, e rejeições são automaticamente propagadas para a nova _promise_ que é retornada por `then` . E quando o tratador joga uma exceção, automaticamente faz com que a _promise_ produzida por seu `then` seja rejeitada. Deste modo, se qualquer um dos elementos da corrente assíncrona falhar, o resultado de toda a corrente é marcada como rejeitado, e nenhum tratador de sucesso é chamado para além do ponto em que ocorre a falha.

{{index "Promise.reject function", "Promise class"}}

Da mesma forma que resolver uma _promise_ gera um valor, rejeitar também o faz, geralmente chamado de motivo da rejeição. Quando uma exceção na função tratadora causa uma rejeição, o valor da exceção é utilizado como causa. Semelhantemente, quando um tratador retorna uma _promise_ que foi rejeitada, a rejeição propaga para a próxima _promise_. Há a função ``` Promise.reject ``` que cria uma nova _promise_ que é rejeitada imediatamente.

{{index "catch method"}}

Para explicitar o tratamento dessas rejeições, _promises_ precisam ter um método `catch` que registre o tratador que vai ser chamado quando a _promise_ é rejeitada, da mesma forma como o tratador `then` lida com resoluções normais. É também muito semelhante com o `then`, que resolve o valor original da _promise_ se ela é resolvida normalmente e caso ao contrário, passa o resultado  ao tratador  `catch`. Se o `catch` jogar um erro, a nova _promise_ também é rejeitada.

{{index "then method"}}

Em suma, `then` também aceita uma rejeição como segundo argumento, então você pode instalar os dois tipos de tratadores em apenas uma chamada de método.

Uma função passada para o construtor da `Promise` recebe apenas um segundo argumento, junto com a função de resolução, a qual pode ser usada para rejeitar uma nova _promise_.

A corrente de _promises_ cria valores que são chamados por `then` e `catch` que podem ser vistos como um canal pelo qual valores assíncronos ou falhas se movimentam. Já que suas correntes são criadas pelo registro de tratadores, cada elo tem um tratador de sucesso e rejeição (ou ambos) associados. Tratadores que não se igualam ao tipo da conclusão (sucesso ou falha) são ignorados. Contudo, aqueles que se igualam são chamados, e suas conclusões determinam o que vai vir em seguida — sucesso quando ela retornar um valor que não é uma _promise_, rejeição quando jogar uma exceção, e a conclusão de uma _promise_ quando ela retornar uma dessas.

```{test: no}
new Promise((_, reject) => reject(new Error("Fail")))
  .then(value => console.log("Handler 1"))
  .catch(reason => {
    console.log("Caught failure " + reason);
    return "nothing";
  })
  .then(value => console.log("Handler 2", value));
// → Caught failure Error: Fail
// → Handler 2 nothing
```

{{index "uncaught exception", "exception handling"}}

De maneira parecida com uma exceção não capturada pelo ambiente, ambientes JavaScript podem detectar quando a rejeição de uma  _promise_ não é tratada e vai reportar um erro.

## Redes são Difíceis

{{index [network, reliability]}}

De tempos em tempos, não há luz suficiente para o sistema de espelho dos corvos transmitir um sinal ou tem algo bloqueando o caminho do sinal. É possível que um sinal seja enviado e nunca recebido.

{{index "send method", error, timeout}}

Deixando desse jeito, isso iria resultar no _callback_ do `send` nunca sendo chamado, o que iria provavelmente fazer com que o programa pare sem nunca perceber que há um problema. Seria legal se, após um dado tempo sem nenhuma resposta ( _timeout_ ), uma _request_ iria estourar o tempo limite e reportar uma falha.

Geralmente, falhas em transmissões são acidentes aleatórios, como o farol de um carro interferindo num sinal de luz, e simplesmente tentando novamente a _request_ pode ser bem sucedida. Então, enquanto estamos nessa, vamos fazer com que nossa função de _request_ automaticamente tente novamente enviar a _request_ algumas vezes antes de desistir.

{{index "Promise class", "callback function", [interface, object]}}

E já que estabelecemos que _promises_ são coisas boas, nós vamos fazer que nossa função de _request_ retorne uma _promise_ . Em termos do que elas podem expressar, _callbacks_ e _promises_ são equivalentes. Funções baseadas em _promises_ pode ser envoltas para expor a interface de _promise_ e vice e versa.

Mesmo quando a _request_ e sua resposta são bem sucedidas, a resposta pode indicar falha — por exemplo, se a _request_ tenta usar um tipo de _request_ não definido ou o tratador joga um erro. Para dar esse suporte, `send` e `defineRequestType` seguem a convenção mencionada antes, onde o primeiro argumento é passado para as _callbacks_ é a razão da falha, se existir, e o segundo é o resultado de verdade.

Isso pode ser traduzido em resolução e rejeição da _promise_ em nossa interface.

{{index "Timeout class", "request function", retry}}

```{includeCode: true}
class Timeout extends Error {}

function request(nest, target, type, content) {
  return new Promise((resolve, reject) => {
    let done = false;
    function attempt(n) {
      nest.send(target, type, content, (failed, value) => {
        done = true;
        if (failed) reject(failed);
        else resolve(value);
      });
      setTimeout(() => {
        if (done) return;
        else if (n < 3) attempt(n + 1);
        else reject(new Timeout("Timed out"));
      }, 250);
    }
    attempt(1);
  });
}
```

{{index "Promise class", "resolving (a promise)", "rejecting (a promise)"}}

Já que _promises_ podem ser resolvidas (ou rejeitadas) apenas uma vez, isso irá funcionar. A primeira vez que `resolve` ou `reject` são chamados determina o resultado da _promise_, e próximas chamadas causadas por uma _request_ retornando após a primeira são ignoradas.

{{index recursion}}

Para construir um _loop_ assíncrono, para múltiplas tentativas, nós precisamos utilizar uma função recursiva — um _loop_ convencional não permite que nós esperemos a respostas de uma ação assíncrona. A função `attempt` faz uma única tentativa para enviar a _request_. Ela também estabelece um tempo de resposta (_timeout_), para caso não haja resposta depois de 250 milissegundos, ou ela tenta a próxima tentativa ou, se for a terceira tentativa, rejeita a _promise_ com uma nova instância de `Timeout` como o motivo.

{{index idempotence}}

Fazendo novas tentativas a cada quarto de segundo e desistindo quando não há resposta depois de três quartos de segundo é definitivamente arbitrário. É até possível que, se uma _request_ ocorresse mas a resposta de seus tratadores demorasse um pouco mais, a _request_ seria devolvida várias vezes. Nós vamos escrever os nossos tratadores com esse problema em mente — mensagens duplicadas devem ser inofensivas.

Em geral, não vamos construir uma rede robusta e de excelência hoje. Contudo está tudo bem — corvos não têm grandes expectativas quando se trata de computação.

{{index "defineRequestType function", "requestType function"}}

Para nos isolar das _callbacks_ completamente, nós vamos definir um embrulho para o `defineRequestType` que permite que o tratador retorne uma _promise_ ou valor puro e o ligue ele com uma _callback_.

```{includeCode: true}
function requestType(name, handler) {
  defineRequestType(name, (nest, content, source,
                           callback) => {
    try {
      Promise.resolve(handler(nest, content, source))
        .then(response => callback(null, response),
              failure => callback(failure));
    } catch (exception) {
      callback(exception);
    }
  });
}
```

{{index "Promise.resolve function"}}

`Promise.resolved` é utilizado para converter o valor retornado pelo `handler` (tratador) para a _promise_ se ela não estiver pronta.

{{index "try keyword", "callback function"}}

Perceba que a chamada do `handler` está embrulhado em um bloco `try` para garantir que qualquer exceção levantada seja diretamente direcionada para a _callback_. Isso ilustra claramente a dificuldade de tratar de maneira correta os erros com _callbacks_ cruas — é fácil de esquecer direcionar exceções dessa maneira, e se você não fizer, as falhas não irão ser reportadas para a _callback_ correta. _Promises_  fazem isso automaticamente e portanto menos capazes de produzir erros.

## Coleções de _Promises_

{{index "neighbors property", "ping request"}}

Cada ninho computador mantêm uma lista de outros ninhos com os quais pode se comunicar em sua propriedade `neighbors`. Para verificar quais estão disponíveis, você pode escrever uma função que tenta enviar uma _request_  “`ping`”  (uma _request_ que só pede uma resposta) para cada um deles e vê de quais tem-se uma resposta.

{{index "Promise.all function"}}

Quando trabalhando com coleções de _promises_ executando ao mesmo tempo, a função `Promise.all` pode ser útil. Ela retorna uma _promise_ que espera por todas as _promises_ da _array_ se resolverem e depois resolve os valores produzidos por essas _promises_ (na mesma ordem da _array_ original). Se qualquer uma dessa _promises_ é rejeitada, o resultado da ``` Promise.all ``` também é rejeitado.

```{includeCode: true}
requestType("ping", () => "pong");

function availableNeighbors(nest) {
  let requests = nest.neighbors.map(neighbor => {
    return request(nest, neighbor, "ping")
      .then(() => true, () => false);
  });
  return Promise.all(requests).then(result => {
    return nest.neighbors.filter((_, i) => result[i]);
  });
}
```

{{index "then method"}}

Quando um vizinho não está disponível, nós não queremos que o conjunto de todas as  _promises_ fracasse, já que assim ainda não saberiamos de nada. Então, a função que é mapeada em cima do conjunto de vizinhos para os tornar _requests_ de _promises_ vínculadas ao uma tratador que faz _requests_ que fazem _requests_ bem sucedidas produzem um valor `true` e as rejeitadas produzem um valor `false`.

{{index "filter method", "map method", "some method"}}

No tratador para as _promises_ combinadas, `filter` é utilizado para remover aqueles elementos do _array_ dos `neighbors` correspondentes a um valor _false_. Isso utiliza o fato de a função `filter` passar o _index_ do _array_ como segundo argumento da função de filtragem (`map`, `some `, e outros métodos de alta ordem similares dos _arrays_ fazem a mesma coisa).

## Fazendo um _flooding_ na Rede

O fato de cada ninho pode apenas conversar com seus vizinhos inibe de maneira significativa a utilidade da rede.

Para transmitir informação para toda a rede, uma solução é organizar um tipo de _request_ que automaticamente é encaminhada para os vizinhos. Esses vizinhos então encaminham para outros vizinhos, até que a rede inteira tenha recebido a mensagem.

{{index "sendGossip function"}}

```{includeCode: true}
import {everywhere} from "./crow-tech";

everywhere(nest => {
  nest.state.gossip = [];
});

function sendGossip(nest, message, exceptFor = null) {
  nest.state.gossip.push(message);
  for (let neighbor of nest.neighbors) {
    if (neighbor == exceptFor) continue;
    request(nest, neighbor, "gossip", message);
  }
}

requestType("gossip", (nest, message, source) => {
  if (nest.state.gossip.includes(message)) return;
  console.log(`${nest.name} received gossip '${
               message}' from ${source}`);
  sendGossip(nest, message, source);
});
```

{{index "everywhere function", "gossip property"}}

Para evitar enviar a mesma mensagem pela rede para sempre, cada ninho possui um _array_ de _strings_ de fofocas que já foram enviadas. Para definir esse _array_, nós utilizamos a função `everywhere`, que executa o código em cada ninho, para adicionar a propriedades ao `state` do ojeto `nest`, o qual iremos armazenar o estado do ninho local.

Quando um ninho recebe uma mensagem de fofoca duplicada, o que provavelmente pode acontecer com todo mundo a reenviando cegamente, ele a ignora. Mas se recebe uma nova mensagem, ele alegremente avisa os seus vizinhos, com exceção daquele que a enviou.

Isso irá causar uma nova fofoca para ser espalhada pela rede, como uma mancha de tinta na água. Mesmo quando algumas conexões estiverem funcionando, se há uma alternativa de rota para o dado ninho, a fofoca irá o alcançar lá.

{{index "flooding"}}

Esse estilo de comunicação é chamado de _flooding_ (inundação) — ela inunda a rede com uma pedaço de informação até que todos os nós o tenham.

{{if interactive

Nós podemos chamar o `sendGossip` para ver a mensagem fluir através da vila.

```
sendGossip(bigOak, "Kids with airgun in the park");
```

if}}

## Roteando Mensagens

{{index efficiency}}

Cada nó dado quer conversar com apenas outro nó, _flooding_ não é uma abordagem eficiente. Especialmente quando a rede é grande, o que ia levar a muitos dados inúteis sendo transferidos.

{{index "routing"}}

Uma alternativa a essa abordagem é organizar uma forma para que as mensagens pulem de nó em nó até que elas alcancem seu destino. A dificuldade é que isso requer conhecimento sobre o _layout_ (forma) da rede. Para enviar uma _request_ na direção de um ninho distante, é necessário saber qual ninho vizinho está mais perto do destino. Enviar ela numa direção errada não seria útil.

Já que cada ninho conhece apenas seus vizinhos diretos, a informação não precisa ser da rota completa. Nós precisamos de alguma forma espalhar a informação sobre essas conexões para todos os ninhos, preferivelmente de uma forma que permita mudanças com o passar do tempo, quando ninhos forem abandonados ou novos construídos.

{{index flooding}}

Nós podemos utilizar a inundação novamente, mas ao invés de checar se uma dada mensagem já foi recebida, nós podemos agora checar se os novos vizinhos são os ninhos que procuramos.

{{index "broadcastConnections function", "connections binding"}}

```{includeCode: true}
requestType("connections", (nest, {name, neighbors},
                            source) => {
  let connections = nest.state.connections;
  if (JSON.stringify(connections.get(name)) ==
      JSON.stringify(neighbors)) return;
  connections.set(name, neighbors);
  broadcastConnections(nest, name, source);
});

function broadcastConnections(nest, name, exceptFor = null) {
  for (let neighbor of nest.neighbors) {
    if (neighbor == exceptFor) continue;
    request(nest, neighbor, "connections", {
      name,
      neighbors: nest.state.connections.get(name)
    });
  }
}

everywhere(nest => {
  nest.state.connections = new Map;
  nest.state.connections.set(nest.name, nest.neighbors);
  broadcastConnections(nest, nest.name);
});
```

{{index JSON, "== operator"}}

A comparação utiliza `JSON.stringify` porque ==, em objetos ou _arrays_, irá retornar verdadeiro apenas quando os dois são exatamente o mesmo valor, o que não precisamos. Compar as _strings_ de JSON é um jeito cru, mas efetivo de comparar seu conteúdo.

Os nós imediatamente começam a transmitir a suas conexões, o que deveria, a não ser que alguns ninhos estejam completamente fora de alcance, rapidamente dá a cada ninho um mapa do diagrama de rede.

{{index pathfinding}}

Algo que é possível fazer com diagramas é encontrar as rotas, como vimos no 
[Chapter 7](robot). Se nós tivermos a rota para o destino da mensagem, nós sabemos para qual direção enviar.

{{index "findRoute function"}}


A função `findRoute`, que lembra bastante a `findRoute` do [Chapter 7](robot#findRoute), procura uma forma de alcançar um nó da rede. Mas, ao invés de retornar toda a rota, retorna apenas o próximo passo. Que o próximo ninho irá, usando a informação atual sobre a rede, decidir onde ele irá enviar a mensagem.

```{includeCode: true}
function findRoute(from, to, connections) {
  let work = [{at: from, via: null}];
  for (let i = 0; i < work.length; i++) {
    let {at, via} = work[i];
    for (let next of connections.get(at) || []) {
      if (next == to) return via;
      if (!work.some(w => w.at == next)) {
        work.push({at: next, via: via || next});
      }
    }
  }
  return null;
}
```
Agora nós podemos construir uma função que envia mensagem de distâncias longas. Se a mensagem for endereçada a um vizinho próximo, ela retorna como de costume. Se não, ela é empacotada em um objeto e enviado a um vizinho que está mais próximo do alvo, utilizando o tipo de requisição "`route`", que irá fazer com que os vizinhos repitam o mesmo comportamento.
{{index "routeRequest function"}}

```{includeCode: true}
function routeRequest(nest, target, type, content) {
  if (nest.neighbors.includes(target)) {
    return request(nest, target, type, content);
  } else {
    let via = findRoute(nest.name, target,
                        nest.state.connections);
    if (!via) throw new Error(`No route to ${target}`);
    return request(nest, via, "route",
                   {target, type, content});
  }
}

requestType("route", (nest, {target, type, content}) => {
  return routeRequest(nest, target, type, content);
});
```

{{if interactive

Nós podemos agora enviar mensagens para o ninho próximo da torre da igreja, que está há quatro pulos da rede removida.

```
routeRequest(bigOak, "Church Tower", "note",
             "Incoming jackdaws!");
```

if}}

{{index [network, abstraction], layering}}

Nós construímos várias camadas de funcionalidade em cima de um sistema de comunicação primitivo para fazer seu uso conveniente. É um bom (apesar de simplificado) modelo de como uma rede de computadores funciona.
Uma distinta propriedade de como as redes de computador é que elas não são confiáveis — abstrações construídas sobre elas podem ajudar, mas você não pode abstrair uma falha de rede. Então, programação de rede é tipicamente antecipar e lidar com suas falhas.

{{index error}}

Uma propriedade distinguidora das redes de computadores é que elas não são abstrações confiáveis que podem ajudar, porém não se pode abstrair um falha de rede. Logo, programar em rede acaba sendo sobre antecipar e lidar com falhas

## Funções Assíncronas

Para armazenar informações importantes, os corvos são conhecidos por duplicar elas através dos ninhos. Deste modo, se um falcão destruir o ninho, a informação não é perdida.

Para reter uma parte da informação que não possui seu próprio bulbo de armazenamento, um ninho computador pode consultar aleatoriamente outros ninhos da rede, até encontrar um que o possua.

{{index "findInStorage function", "network function"}}

```{includeCode: true}
requestType("storage", (nest, name) => storage(nest, name));

function findInStorage(nest, name) {
  return storage(nest, name).then(found => {
    if (found != null) return found;
    else return findInRemoteStorage(nest, name);
  });
}

function network(nest) {
  return Array.from(nest.state.connections.keys());
}

function findInRemoteStorage(nest, name) {
  let sources = network(nest).filter(n => n != nest.name);
  function next() {
    if (sources.length == 0) {
      return Promise.reject(new Error("Not found"));
    } else {
      let source = sources[Math.floor(Math.random() *
                                      sources.length)];
      sources = sources.filter(n => n != source);
      return routeRequest(nest, source, "storage", name)
        .then(value => value != null ? value : next(),
              next);
    }
  }
  return next();
}
```

{{index "Map class", "Object.keys function", "Array.from function"}}

Porque `connections` é um `Map`, `Object.keys` não funciona nele. Se possui um **método** `keys`, mas retorna um iterador  ao invés de um _array_). O iterador (ou o valor iterável) pode ser convertido em um _array_ com a função `Array.from`.

{{index "Promise class", recursion}}

Até para _promises_ esse código é esquisito. Múltiplas ações assíncronos estão encadeadas de maneiras não óbvias. Nós precisamos novamente de uma função recursiva (``` next ```) para modelar o _looping_ (estrutura de repetição) através dos ninhos.

{{index "synchronous programming", "asynchronous programming"}}

E o que o código faz na verdade é completamente linear — ele sempre espera a função anterior ser completada antes de começar a próxima. Em um modelo de programação síncrona, seria mais simples de expressar.

{{index "async function", "await keyword"}}

A boa notícia é que o JavaScript permite que você escreva código pseudo-síncrono para descrever computação assíncrona. A função `async` é uma função que implicitamente retorna uma _promise_ que pode, dentro de si, `await` outras _promises_ que parecem síncronas.

{{index "findInStorage function"}}

Nós podemos reescrever `findInStorage` da seguinte forma:

```
async function findInStorage(nest, name) {
  let local = await storage(nest, name);
  if (local != null) return local;

  let sources = network(nest).filter(n => n != nest.name);
  while (sources.length > 0) {
    let source = sources[Math.floor(Math.random() *
                                    sources.length)];
    sources = sources.filter(n => n != source);
    try {
      let found = await routeRequest(nest, source, "storage",
                                     name);
      if (found != null) return found;
    } catch (_) {}
  }
  throw new Error("Not found");
}
```

{{index "async function", "return keyword", "exception handling"}}

Uma função `async` é marcada pela palavra `async` antes da palavra-chave `function`. Métodos também podem ser transformados ao escrever `async` antes de seus nomes. Quando tal função ou método é chamado, ele retorna uma _promise_. Assim que o corpo retorna algo, a _promise_ é resolvida. Se ele joga uma exceção, a _promise_ é rejeitada.

{{if interactive

```{startCode: true}
findInStorage(bigOak, "events on 2017-12-21")
  .then(console.log);
```

if}}

{{index "await keyword", ["control flow", asynchronous]}}

Dentro de uma função `async`, a palavra `await` pode ser posta na frente de uma expressão para esperar a _promise_ ser resolvida e apenas aí continuar a execução da função.

Tal função não mais, como numa função Javascript padrão, roda do começo ao fim de uma vez. Ao invés disso, ela fica congelada no ponto que possui o `await` e pode ser retomada depois.

Para código assíncronos não triviais, essa notação é geralmente mais conveniente que utilizar _promises_ diretamente. Mesmo que você precise fazer algo que não se encaixe no modelo síncrono, como múltiplas ações ao mesmo tempo, é mais simples combinar o termo `await` ao invés de utilizar _promises_ diretamente.

## _Generators_

{{index "async function"}}

Essa habilidade de pausar as funções e depois as retomar não é exclusiva de funções `async`. No JavaScript temos também um recurso chamado funções _generator_ (geradoras). Elas são similares, mas sem as _promises_.


Quando você define uma função com `function*` (colocando um asterisco depois da palavra `function`), ela se torna um _generator_. Quando você chama um _generator_, ele retorna um iterador, o qual já vimos no [Chapter 6](object).

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

Inicialmente, quando você chama `powers`, a função é congelada quando começa. Cada vez que você chama  `next`  no iterador, a função roda até que chega na expressão `yields`, que a pausa e faz com que o valor gerado seja o próximo valor produzido pelo iterador. Quando a função retorna ( a do exemplo nunca o faz), o iterador está terminado.

Escrever iteradores é geralmente muito mais simples quando se utiliza funções geradoras. O iterador para a classe `Group` (do exercício do [Chapter 6](object#group_iterator))pode ser escrita com o gerador:

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

Não há mais necessidade de criar um objeto para manter o estado de iteração — geradores automaticamente salvam o seu estado local toda a vez que eles geram.

Tal expressão `yield` pode ocorrer apenas diretamente no próprio gerador da função e não numa função interna definida dentro dele. O estado que o gerador salva ao gerar, é apenas no ambiente local e na posição em que está sendo gerado.

{{index "await keyword"}}

Uma função `async` é um tipo especial de _generator_. Ela produz uma _promise_ quando é chamada, a qual quando é resolvida retorna (termina) e quando é rejeitada joga uma exceção. Sempre que ela gera (espera) uma _promise_, o resultado da _promise_ (valor ou exceção jogada) é o resultado da expressão _await_.

## The event loop

{{index "asynchronous programming", scheduling, "event loop", timeline}}

Programas assíncronos são executados parte por parte. Cada parte pode começar com algumas ações e agendar para que o código seja executado quando a ação terminar ou falhar. Entre essas peças, o programa está ocioso, esperando pela próxima ação.

{{index "setTimeout function"}}

Então, _callbacks_ não são diretamente chamados pelo código que os agendou. Se eu chamar `setTimeout` de dentro da função, aquela função irá ter retornado na hora em que a função _callback_ for chamada. E quando o _callback_ retornar, o controle não retorna para a função que o agendou.

{{index "Promise class", "catch keyword", "exception handling"}}

Comportamento assíncrono acontece na sua _stack_ de chamada de função vazia. Esta é uma das razões pelas quais, sem _promises_, controlar as exceções em um código assíncrono é difícil. Já que cada _callback_ começa com um _stack_ praticamente vazio, seus ``` catch ``` _handlers_ não vão estar em sua _stack_ quando jogarem uma exceção.

```
try {
  setTimeout(() => {
    throw new Error("Woosh");
  }, 20);
} catch (_) {
  // This will not run
  console.log("Caught!");
}
```

{{index thread, queue}}

Não importa o quão próximos os eventos — como os _timeouts_ ou _requests_ — ocorrem, um ambiente JavaScript sempre vai rodar apenas um programa de cada vez. Você pode pensar nisso como se ele estivesse rodando um grande _loop_ ao redor do seu programa, chamado de _loop_ de *evento*. Quando não há nada a ser feito, o _loop_ é parado. Mas, quando os eventos ocorrem, eles são adicionados a uma fila, e seu código é executado um depois do outro. Porque duas coisas não rodam ao mesmo tempo, código que roda devagar pode atrasar o tratamento de outros eventos.s.

Esse exemplo coloca um _timeout_ mas depois espera até depois do ponto no tempo pretendido, fazendo com que o _timeout_ fique tarde.

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

_Promises_ sempre resolvem ou rejeitam como um novo evento. Mesmo que uma _promise_ esteja já resolvida, esperar for ela vai resultar no seu _callback_ rodar depois que o _script_ atual, ao invés do jeito correto.

```
Promise.resolve("Done").then(console.log);
console.log("Me first!");
// → Me first!
// → Done
```

Nos próximos capítulos vamos ver vários tipos de outros eventos que rodam no evento _loop_.

## _Bugs_ Assíncronos

{{index "asynchronous programming", [state, transitions]}}

Quando seus programas rodam de forma síncrona, de uma vez só, não há mudanças no estado acontecendo, a não ser aquelas que o próprio programa faz. Para programa assíncronos isso é diferente — podem haver lacunas em suas execuções na qual outro código pode rodar.

Vamos ver um exemplo. Um dos _hobbies_ dos corvos é contar o número de franguinhos que chocam pela vila todo ano. Ninhos armazenam essa contagem em seus bulbos de armazenamento. O código a seguir tenta enumerar as contagens de todos os ninhos ao longo de um dado ano.

{{index "anyStorage function", "chicks function"}}

```{includeCode: true}
function anyStorage(nest, source, name) {
  if (source == nest.name) return storage(nest, name);
  else return routeRequest(nest, source, "storage", name);
}

async function chicks(nest, year) {
  let list = "";
  await Promise.all(network(nest).map(async name => {
    list += `${name}: ${
      await anyStorage(nest, name, `chicks in ${year}`)
    }\n`;
  }));
  return list;
}
```

{{index "async function"}}

A parte `async name =>`  mostra que funções em flecha também podem se tornar `async` ao colocar a palavra `async` na frente delas.

{{index "Promise.all function"}}

O código não parece imediatamente suspeito...ele mapeia a função flecha `async` através de um conjunto de ninhos, criando um _array_ de _promises_ e utiliza o `Promise.all` para esperar por todas aquelas antes de retornar a lista que eles construíram.

Mas isso está seriamente errado. Ele sempre irá retornar apenas uma linha de saída, listando o ninho mais devagar a responder.

{{if interactive

```
chicks(bigOak, 2017).then(console.log);
```

if}}

Você sabe dizer por quê?

{{index "+= operator"}}

O problema ocorre no operador +=, que pega o valor atual de `list` na hora em que a declaração começa a ser executada e então, quando o `await` termina, faz com que o valor de `list` seja o aquele valor mais a _string_ adicionada.

{{index "await keyword"}}

Mas entre o tempo em que a declaração começa a ser executada e o hora em que ela termina há uma lacuna assíncrona. A expressão `map` roda antes que qualquer coisa seja adicionada a lista, então o operador += começa em uma _string_ vazia e termina, quando a computação de estocagem acaba, fazendo `list` uma lista de uma linha — o resultado de adicionar sua linha a uma _string_ vazia.

{{index "side effect"}}

Isso poderia ser facilmente evitada por retornar as linhas que foram mapeadas pelas _promises_ e chamando `join` no resultado de `Promise.all`, ao invés de construir uma lista encadeando uma ligação. Como de costume, computar novos valores tende a menos erros que mudar os existentes.

{{index "chicks function"}}

```
async function chicks(nest, year) {
  let lines = network(nest).map(async name => {
    return name + ": " +
      await anyStorage(nest, name, `chicks in ${year}`);
  });
  return (await Promise.all(lines)).join("\n");
}
```

Erros assim são fáceis de cometer, especialmente quando utilizamos `await`, e você deve ficar atento de onde essas lacunas podem ocorrer. Uma vantagem a assincronicidade explícita do JavaScript (através de _callbacks_, _promises_ ou ``` await ```) é que encontrar essas lacunas é relativamente fácil.

## Resumo

Programação assíncrona torna possível expressar esperas por ações que rodam por muito tempo sem congelar o programa durante essas ações. Ambientes JavaScript tipicamente implementam esse estilo de programação utilizando _callbacks_, funções que são chamadas quando certas ações são completadas. Um evento _loop_ agenda tais _callbacks_ para serem chamadas quando apropriado, uma depois da outra, para que na execução não ocorra sobreposições.

Programando assincronamente se torna mais fácil com _promises_, objetos que representam ações que pode ser completas no futuro e funções `async`, que permitem que você escreva um programa assíncrono como se fosse síncrono.

## Exercícios

### Rastreando o Bisturi

{{index "scalpel (exercise)"}}

A vila de corvos tem um velho bisturi que eles de vez em quando usam em missões especiais — por exemplo, para cortar telas de portas ou mochilas. Para poder rastreá-lo rapidamente, toda vez que o bisturi é transportado para outro ninho, um registro é adicionado na memória de ambos os ninhos, o que tinha e o que pegou, sob o nome de “`scapel`", com sua nova localização como valor.

Isso significa que para achar o bisturi basta seguir a trilha de registros, até achar o ninho em que o ponto é o próprio ninho.

{{index "anyStorage function", "async function"}}

Escreva uma função assíncrona (`async`) `locateScalpel` que começando no ninho em que é executada. Você pode usar a função `anyStorage` definida anteriormente par acessar a memória de ninhos arbitrários. O bisturi já foi transportado tanto que você pode assumir que todo ninho tem o registro “`scalpel`" no seu banco de dados

A seguir, escreva a mesma função sem utilizar `async` e `await`.

{{index "exception handling"}}

Do request failures properly show up as rejections of the returned
promise in both versions? How?

{{if interactive

```{test: no}
async function locateScalpel(nest) {
  // Your code here.
}

function locateScalpel2(nest) {
  // Your code here.
}

locateScalpel(bigOak).then(console.log);
// → Butcher Shop
```

if}}

{{**Dica:**

{{index "scalpel (exercise)"}}

Isso pode ser feito em um _loop_ único que busca pelos ninhos, movendo adiante para o próximo quando ele encontra o valor que não equivale ao nome do ninho atual e retorna o nome quando encontra o valor. Numa função `async`, um `for` ou `while` _loop_ pode ser utilizado.

{{index recursion}}

Para fazer o mesmo numa função normal, você vai ter que construir o _loop_ utilizando uma função recursiva. A maneira mais fácil de fazer isso é ter a função retornando uma  _promise_ chamando `then` na _promise_ que mantém o valor armazenado. Dependendo se o valor equivale ao nome do próximo ninho, o tratador retorna o valor ou uma próxima _promise_ chamando o _loop_ novamente

Não se esqueça de começar o _loop_ chamando uma função recursiva uma vez na função principal.

{{index "exception handling"}}

Na função `async`, _promises_ rejeitadas são convertidas por exceções pelo `await`. Quando a função `async` joga uma exceção, a _promise_ é rejeitada. Assim funciona.

Se você implementar uma função comum como mostrado antes, o jeito que `then` funciona também automaticamente causa uma falha, o tratador passado no `then` não é chamado, e o retorna da _promise_ é rejeitado pela mesma razão.

hint}}

### Building Promise.all

{{index "Promise class", "Promise.all function", "building Promise.all (exercise)"}}

Dado um _array_ de _promises_, `Promise.all` retorna uma _promise_ que espera que todas as  _promises_ do _array_ terminarem. Se é bem sucedida, gera um _array_ dos valores dos resultados. Se uma  _promise_  no _array_ falha, a _promise_ retornada por `all` fracassa também, com a falha sendo a da  _promise_ que falhou.

Implementando algo como isso você mesmo, como uma função comum chamada `Promise_all`.

Lembrando que depois da  _promise_ ter sucesso ou falhar, ela não pode ter sucesso ou fracassar novamente, em próximas chamadas para funções que as resolvem são ignoradas. Isso pode simplificar a forma como você trata a falha da sua _promise_.

{{if interactive

```{test: no}
function Promise_all(promises) {
  return new Promise((resolve, reject) => {
    // Your code here.
  });
}

// Test code.
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

{{**Dica:**

{{index "Promise.all function", "Promise class", "then method", "building Promise.all (exercise)"}}

A função para o construtor da  `Promise` vai ter que chamar o `then` de cada _promise_ no dado _array_. Quando uma for bem sucedida, duas coisas precisam acontecer. O valor resultando precisa ser armazenado na posição correta no _array_ resultante, e precisa verificar se esse é o último valor pendente da _promise_ e terminar a própria _promise_ se for.

{{index "counter variable"}}

A última pode ser feita com um contador  que é inicializado com o comprimento do _array_ de entrada e do qual nós subtraímos 1 cada vez que a _promise_ é bem sucedida. Quando atinge 0, nós terminamos. Garante que você vai levar em conta a situação em que a entrada do _array_ for vazio (assim nenhuma _promise_ vai ser resolvida).

Tratar falhas requer raciocínio mas se torna extremamente simples. Apenas passe a função `reject` _wrapping_ a _promise_ para cada uma das _promises_ no _array_ como um tratador `catch` ou como um segundo argumento para o `then` para que a falha de uma acione a rejeição de toda a _wrapper_ _promise_.

hint}}
