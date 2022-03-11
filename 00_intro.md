
{{meta {load_files: ["code/intro.js"]}}}

# Introdução

{{quote {author: "Ellen Ullman", title: "Close to the Machine: Technophilia and its Discontents", chapter: true}

Achamos que estamos criando o sistema para nossas próprias necessidades.
Acreditamos que estamos fazendo-o à nossa própria imagem... Mas o computador
não é realmente como nós. Ele é uma projeção de uma parte muito tênue de nós mesmos:
Aquela parte dedicada à lógica, ordem, regra e clareza.

quote}}

{{figure {url: "img/chapter_picture_00.jpg", alt: "Picture of a screwdriver and a circuit board", chapter: "framed"}}}

Este é um livro é sobre dar instruções a ((computador))es. Computadores são hoje 
tão comuns quanto chaves de fenda, só que eles são um pouco mais complexos, e 
fazer com que eles façam o que você quer que façam não é sempre fácil.

Se a tarefa que você tem para seu computador é comum, bem entendida, como lhe 
mostrar seu e-mail ou agir como uma calculadora, você pode abrir um 
((programa)) e trabalhar. Mas para tarefas únicas ou abertas é provável que 
não exista um programa.

É aqui que a ((programação)) pode entrar. _Programar_ é o ato de construir 
um _programa_-um conjunto de instruções precisas que dizem ao computador o que 
fazer. Por conta dos computadores serem bestas burras e pedantes, programar é
fundamentalmente tedioso e frustrante.

{{index [programming, "joy of"], speed}}

Felizmente, se você conseguir superar este fato, e talvez até gostar do rigor
de pensar em termos com os quais máquinas burras consigam lidar, a 
programação pode ser recompensadora. Ela permite que você faça em segundos 
coisas que levariam _para sempre_ se feitas à mão. É uma forma de fazer seu 
computador fazer o que ele não conseguia antes. E ela oferece um maravilhoso 
exercício de pensamento abstrato.


A maior parte da programação é feita com ((linguagens de programação).
Uma _linguagem de programação_ é uma linguagem construída artificialmente
usada para dar instruções a computadores. É interessante que a forma mais
eficiente de nos comunicarmos com um computador  empreste tão pesadamente da
forma como nos comunicamos uns com os outros. Como linguagens humanas, 
linguagens de computador permitem com que palavras e frases sejam combinadas
de novas formas, tornando possível expressar sempre novos conceitos.

{{index [JavaScript, "availability of"], "casual computing"}}

Em algum momento, interfaces baseadas em linguagem, como os _prompts_ BASIC e 
DOS dos anos 1980 e 90, eram o método principal de interagir com computadores.
Elas foram largamente substituídos por interfaces visuais, que são mais fáceis
de aprender apesar de  oferecem menos liberdade. Linguagens de computador ainda 
estão por aí, se você souber onde olhar. Uma destas linguagens, o JavaScript, está
incorporada em todos os ((navegador))es web modernos e está portanto disponível em
quase qualquer dispositivo.

{{indexsee "web browser", browser}}

Este livro tentará fazer com que você se familiarize o suficiente com esta
linguagem para poder fazer com ela coisas úteis e divertidas.

## Sobre programação

{{index [programming, "difficulty of"]}}

Além de explicar JavaScript, eu vou apresentar os princípios básicos  de
programação. Acontece que programação é difícil. As regras fundamentais são
simples e claras, mas programas construídos a partir destas regras tendem a
se tornar complexos o suficiente para apresentar  suas próprias regras e
complexidade. Você está construindo seu próprio labirinto, de certa forma, e
você pode simplesmente se perder nele.

{{index learning}}

Terá momentos em que ler este livro será terrivelmente frustrante.
Se você é novo na programação, haverá muito material novo para digerir. Muito
deste material será então combinado em formas que vão precisar que você faça
novas conexões.

Cabe a você fazer o esforço necessário. Quando estiver com dificuldade para
acompanhar o livro, não tire quaisquer conclusões sobre suas próprias
capacidades. Está tudo bem, você só precisa continuar. Faça uma pausa, releia o
material e ((exercícios)). Aprender é trabalhoso, mas tudo que você aprende é
seu e tornará o aprendizado a seguir mais fácil.

{{quote {author: "Ursula K. Le Guin", title: "A mão esquerda da escuridão"}

{{index "Le Guin, Ursula K."}}

Quando ação não trouxer lucro, reúna informação, quando informação não trouxer
lucro, durma.

quote}}

{{index [program, "nature of"], data}}

Um programa é muitas coisas. É um trecho de texto digitado pelo programador, é a
força direcionadora que faz com que o computador faça o que ele faz, são os
dados na memória do computador, ainda sim, controla as ações desempenhadas por
esta mesma memória. Analogias que tentam comparar programas com objetos que são
familiares tenderão a deixar a desejar. Uma que serve superficialmente é a que
tende a envolver lotes de máquina de partes separadas, e que para fazer toda a
coisa funcionar, precisamos considerar formas em que essas partes se conectem e
contribuam para o funcionamento do todo.

Um ((computador)) é uma máquina física que age como um hospedeiro para estas
máquinas imateriais. Computadores por sí mesmos só podem fazer coisas
estupidamente diretas. A razão pela qual eles são tão úteis é que eles fazem
estas coisas em uma ((velocidade)) incrivelmente alta. Um programa pode
engenhosamente combinar um número enorme destas ações simples para fazer coisas
complicadas.

{{index [programming, "joy of"]}}

Um programa é uma construção de pensamento. É sem custo para construir, não tem
peso e cresce facilmente sob seus dedos digitando.

Mas sem cuidado, o tamanho do programa e sua ((complexidade)) crescerão fora de
controle, confundindo até mesmo a pessoa que o criou. Manter programas sob
controle é o problema principal da programação. Quando um programa funciona, é
bonito. A arte de programar é a habilidade de controlar complexidade. Um grande
programa é feito sob controle para ser simples em sua complexidade.

{{index "programming style", "best practices"}}

Alguns programadores acreditam que esta complexidade é melhor administrada
usando um pequeno conjunto de técnicas bem entendidas em seus programas. Eles 
compuseram regras rigorosas ("boas práticas") prescrevendo a forma que os
programas devem ter e serem mantidos dentro de sua pequena zona segura.

{{index experiment}}

Isto não é só chato, é ineficiente. Novos problemas geralmente precisam de novas
soluções. O campo da programação é jovem, ainda se desenvolve rapidamente e é
variado o suficiente para que haja espaço para abordagens totalmente diferentes.
Existem muitos erros terríveis para serem cometidos no design de programas e
você deve ir a diante e cometê-los  para que você os entenda. A sensação de como
se parece um bom programa é desenvolvida na prática, não aprendida de uma lista
de regras

## Por quê a linguagem importa

{{index "programming language", "machine code", "binary data"}}

No começo, no nascimento da computação, não haviam linguagens de programação.
Programas se pareciam com algo assim:

```{lang: null}
00110001 00000000 00000000
00110001 00000001 00000001
00110011 00000001 00000010
01010001 00001011 00000010
00100010 00000010 00001000
01000011 00000001 00000000
01000001 00000001 00000001
00010000 00000010 00000000
01100010 00000000 00000000
```

{{index [programming, "history of"], "punch card", complexity}}

Isto é um programa que soma os números de 1 até 10 e exibe o resultado: `1 + 2 +
... + 10 = 55`. Poderia ser executado em uma máquina hipotética simples. Para
programar os computadores antigos, era necessário preparar grandes conjuntos de
interruptores na posição certa ou perfurar tiras de papelão e alimentar os
computadores com elas. Você pode provavelmente imaginar como este procedimento
era tedioso e sujeito a erro. Mesmo escrever programas simples exigia muita
inteligência e disciplina. Programas complexos eram quase inconcebíveis. 

{{index bit, "wizard (mighty)"}}
Claro, entrar manualmente estes padrões arcanos de bits (Os uns e zeros) dava ao
programador um profundo sentimento de ser um mago poderoso. E isto valia alguma
coisa em termos de satisfação de trabalho.

{{index memory, instruction}}

Cada linha do programa anterior continha uma única instrução. Ele poderia ser
escrito em Português assim:

 1. Armazene o número 0 no endereço de memória 0.
 2. Armazene o número 1 no endereço de memória 1.
 3. Armazene o valor do endereço de memória 1 no endereço de memória 2.
 4. Subtraia o número 11 do valor no endereço de memória 2.
 5. Se o valor no endereço de memória 2 é o número 0, continue com a instrução 9.
 6. Adicione o valor no endereço de memória 1 ao valor no endereço de memória 0.
 7. Adicione o número 1 ao valor da memória no endereço 1.
 8. Continue com a instrução 3.
 9. Retorne o valor do endereço de memória 0.

{{index readability, naming, binding}}

Embora isto seja mais legível que uma sopa de bits, ainda é um pouco obscuro.
Usar nomes ao invés de números para as instruções e endereços de memória
ajuda.

```{lang: "text/plain"}
 Defina "total" como 0.
 Defina "contagem" como 1.
 [laço]
 Defina "comparar" como "contagem"
 Subtraia 11 de "comparar".
 Se "comparar" for zero, continue no [fim]
 Adicione "contagem" a "total".
 Adicione 1 a "contagem".
 Continue no [laço].
 [fim]
 retorne “total”.
```

{{index loop, jump, "summing example"}}

Você pode ver como o programa funciona nesse ponto? As primeiras duas linhas dão
a dois endereços de memória seus valores iniciais: `total` será usado para
construir o resultado da computação, e `contagem` será usado para monitorar o
número para o qual estamos olhando agora. Estas linhas usando `comparar` são
provavelmente as mais estranhas. O programa quer ver se `contagem` é igual a 11
para decidir se deve parar de rodar. Por sua máguina hipótetica ser bem
primitiva, ela só pode testar se o número é zero e tomar uma decisão baseado
nisso. Então ela usa o endereço de memória etiquetado como `comparar` para
computar o valor de `contagem - 11` e fazer esta decisão baseada no valor. As
próximas duas linhas somam o valor de `contagem` para o resultado e aumentar a
`contagem` em 1 toda vez que o programa tiver decidido que `contagem` ainda não
é 11.

Aqui está o mesmo programa em JavaScript:

```
let total = 0, count = 1;
while (count <= 10) {
  total += count;
  count += 1;
}
console.log(total);
// → 55
```

{{index "while loop", loop, [braces, block]}}

Esta versão nos dá um pouco mais de melhorias. O mais importante, não há
mais a necessidade de especificar a forma como queremos que o programa
salte para tás e a diante. A construção `while` toma conta disto. Ele continua
executando o bloco (entre chaves) abaixo enquanto a condição executando o
bloco continuar verdadeira. Esta condição é `count <= 10`, a qual significa
"_count_ é menor ou igual a 10". Nós não mais precisamos criar um valor
temporário e compará-lo com zero, o que era apenas um detalhe desinteressante.
Parte do poder das linguagens de programação é que elas podem tomar conta dos
detalhes desinteressantes para nós.

{{index "console.log"}}

No fim do programa, depois que a  construção `while` tiver terminado, a operação
`console.log`será usada para escrever o resultado.

{{index "sum function", "range function", abstraction, function}}

Finalmente, aqui é como o programa se pareceria se nós tivéssemos as
convenientes operações `range` e `sum` disponíveis, as quais respectivamente
criam uma ((coleção)) de números dentro de um intervalo e computa a soma de uma
coleção de números:

```{startCode: true}
console.log(sum(range(1, 10)));
// → 55
```

{{index readability}}

A moral desta historia é que o mesmo programa pode ser expresso de formas
longa, curta, legível e ilegível. A primeira versão do programa era extremamente
obscura, enquanto esta última é quase Inglês `log` a `sum` do `range` de números
de 1 a 10. (Nós veremos em [próximos capítulos](data) como definimos operações como
`sum` e `range`.)

{{index ["programming language", "power of"], composability}}

Uma boa linguagem de programação ajuda o programador permitindo que ele fale a
respeito das ações que o computador tem que desempenhar em um nível alto. Ela
ajuda a omitir detalhes, oferece blocos de construção convenientes (como `while`
e `console.log`), permite que você defina seus próprios blocos de construção (
tais como `soma` e `range`), e torna fácil compor com estes blocos.

## O que é JavaScript?

{{index history, Netscape, browser, "web application", JavaScript, [JavaScript, "history of"], "World Wide Web"}}

{{indexsee WWW, "World Wide Web"}}

{{indexsee Web, "World Wide Web"}}

JavaScript foi apresentado em 1995 como uma forma de adicionar programas a
páginas da web no navegador Netscape. A linguagem foi então adotada por
todos os outros maiores navegadores web gráficos. Ele tornou possíveis 
aplicações web modernas com as quais você pode interagir diretamente
sem recarregar a página para cada ação. JavaScript é também usado em websites
mais tradicionais para fornecer várias formas de interatividade e inteligência.

{{index Java, naming}}

É importante notar que JavaScript não tem quase nada a ver com a linguagem de
programação chamada Java. O nome parecido foi inspirado por considerações de
marketing ao invés de bom julgamento. Quando JavaScript foi apresentado, a
linguagem Java estava sendo pesadamente comercializada e ganhando popularidade.
Alguém pensou que seria uma boa ideia pegar uma carona no sucesso. Agora nós
estamos presos ao nome.

{{index ECMAScript, compatibility}}

Depois de sua adoção fora do Netscape, um documento ((padrão)) foi escrito para
descrever a forma como a linguagem JavaScript deveria funcionar para que vários
softwares que alegavam suporte a JavaScript estavam realmente falando sobre a
mesma linguagem. Isto é chamado de padrão ECMAScript, em favor da organização
Internacional Ecma que fez a padronização. Na prática, os termos ECMAScript e
JavaScript podem ser usados de forma intercambiável-são dois nomes para a mesma
lnguagem.

{{index [JavaScript, "weaknesses of"], debugging}}

Há aqueles que dirão coisas _terríveis_ sobre JavaScript. Muitas destas coisas
são verdade. Quando foi necessário que eu escrevesse algo em JavaScript pela
primeira vez, eu rapidamente passei a desprezá-lo. Ele aceitaria quase qualquer
coisa que eu digitasse, mas interpretaria de uma forma completamente diferente
do que eu queria dizer. Isto tem muito a ver com o fato de eu não ter ideia do
que estava fazendo, é claro, mas há um problema real aqui: JavaScript é
ridiculamente liberal no que ele permite. A ideia por trás deste design é que
tornaria programação mais fácil para iniciantes. Na realidade, na maioria das
vezes é o que torna encontrar problemas em seus programas mais difícil porque o
sistema não vai apontá-los para você.

{{index [JavaScript, "flexibility of"], flexibility}}

Esta flexibilidade também tem suas vantagens, no entanto. Ela deixa espaço para
muitas técnicas que são impossíveis em linguagens mais rígidas, e como vocẽ
verá (por exemplo no [capítulo ?](modules)), ela poderá ser usada para superar as
deficiências do JavaScript. Depois de ((aprender)) a linguagem devidamente e
trabalhar com ela um pouco, eu aprendi a realmente _gostar_ de JavaScript.

{{index future, [JavaScript, "versions of"], ECMAScript, "ECMAScript 6"}}

Houveram diversas versões de JavaScript. ECMAScript versão 3 foi a versão
largamente suportada na época de ascenção ao domínio do JavaScript
aproximadamente entre 2000 e 2010. Durante este tempo, trabalho estava em
andamento em uma ambiciosa versão 4, que planejava um número de melhoras
radicais e extensões para a linguagem. Mudar uma linguagem viva, largamente
usada mostrou-se politicamente difícil, e trabalho na versão 4 foi abandonado em
2008, levando a muito menos ambiciosa versão 5, que fez apenas algumas melhoras
incontroversas, saindo em 2009. Então em 2015 a versão 6 saiu, uma atualização
maior que incluiu algumas das ideias planejadas para a versão 4. Desde então nós
temos recebido pequenas, novas atualizações todo ano.

O fato da linguagem estar evoluindo significa que navegadores precisam
acompanhar constantemente, e se você estiver usando um navegador antigo, ele
pode não suportar todas suas características. Os desingers da linguagem tomaram
cuidado para não fazer mudanças que pudessem quebrar programas já existentes,
para que novos browsers ainda pudessem executar programas antigos. Neste livro,
eu estou usando a versão de 2017 de JavaScript.

{{index [JavaScript, "uses of"]}}

Navegadores web não são as únicas plataformas onde JavaScript é usado.
Alguns bancos de dados, como MongoDB e CouchDB, usam JavaScript como sua
linguagem de scripting e de consulta. Diversas plataformas para programação 
desktop e de servidores, a mais notável delas o ((Node.js)) projeto (o assunto
do [Capítulo ?](node), fornece um ambiente para programação JavaScript fora do
navegador.

## Código, e o que fazer com ele

{{index "reading code", "writing code"}}

_Código_ é o texto que faz estes programas. A maioria dos capítulos neste livro
contém bastante coisas sobre código. Eu acredito que ler código e esscrever
((código)) são partes indispensáveis de ((apender)) a programar. Tente não
apenas olhar por cima dos exemplos-leia-os atentamente e compreenda-os.
Isto pode ser lento e confuso no começo, mas eu prometo que você rápidamente vai
pegar o jeito. O mesmo vale para os ((exercícios)). Não presuma que você os
entendeu até que você realmente tenha escrito uma solução que funcione.

{{index interpretation}}

Eu recomendo que você teste suas soluções para os exercícios em um interpretador
JavaScript. Desta forma, você terá feedback imediato sobre se o que você estiver 
fazendo está funcionando, e, eu espero, você ficará tentado a ((experimentar)) 
e ir além dos exercícios.

{{if interactive

Quando estiver lendo este livro em seu navegador, você poderá editar (e
executar) todos os programas de exemplo clicando neles.

if}}

{{if book

{{index download, sandbox, "running code"}}

A forma mais fácil de executar o código de exemplo neste livro, e experimentar
com ele, é olhar na versão online do livro em
[_https://eloquentjavascript.net_](https://eloquentjavascript.net/). Lá, você
pode clicar em qualquer código de exemplo para editar e executá-lo para ver a
saída que ele produz. Para fazer os exercícios, vá para
[_https://eloquentjavascript.net/code_](https://eloquentjavascript.net/code),
que fornece código inicial para cada exercício de código e permite que você veja
as soluções.

if}}

{{index "developer tools", "JavaScript console"}}

Se você quer executar programas definidos neste livro fora do site, algum
cuidado será necessário. Muitos exemplos se sustentam em sí mesmos e devem
funcionar em qualquer ambiente JavaScript. Mas o código nos últimos capítulos é
geramente escrito para embientes específicos (o navegador ou Node.js) e só pode
ser executado lá. Além disso, muitos capítulos definem programas maiores, e
trechos de código que aparecem neles dependem de outros arquivos externos. O
[sandbox](https://eloquentjavascript.net/code) no site fornece links para
arquivos Zip contento todos os scripts e arquivos de dados necessários para
executar o código para um determinado capítulo.

## Visão geral deste livro

Este livro contém três partes. Os primeiros 12 capítulos discutem a linguagem
JavaScript. Os próximos sete capítulos são sobre ((navegadores)) web e a forma
como JavaScript é usado para programá-los. Finalmente, os dois capítulos
dedicados ao ((Node.js)), outro ambiente onde programar JavaScript.

Ao longo do livro, existem cinco _capítulos de projeto_, onde descreveremos
programas de exemplo maiores, para lhe dar uma amostra da programação real. Em
ordem em que aparecem, trabalharemos construindo um [robô de entregas](robot),
uma [linguagem de programação](language), um [jogo de plataforma](game), um [programa de
pintura](paint), e um [website dinâmico](skillsharing).

A parte de linguagem do livro começa com quatro capítulos que apresentam a
estrutura básica da linguagem JavaScript. Elas apresentam [estruturas de
controle](program_structure) (como a palavra `while` que você viu nesta
introdução). [funções](functions) (escrever seus próprios blocos de
construção). e [estruturas de dados](data). Depois destes, você será capaz de
escrever programas básicos. A seguir, Capítulos [?](higher_order) e [?](object)
apresentarão técnicas para usar funções e objetos para escrever código mais
_abstrato_ e manter a complexidade sob controle.

Depois do [primeiro capítulo de projeto](robot), a parte de linguagem do livro continua
em capítulos sobre [administração de erro e correção de bugs](error),
[expressões regulares](regexp) (uma ferramenta importante para trabalhar com texto),
[modularidade](modules) (outra defesa contra complexidade), e [programação
assíncrona](async) (lidando com eventos que levam tempo). O [segundo capítulo de
projeto](language) conclui a primeira parte do livro.

A segunda parte, Capítulos [?](browser) até [?](paint), descreve as ferramentas
que o JavaScript tem acesso no navegador. Você aprenderá a exibir coisas na tela
(Capítulos [?](dom) e [?](canvas)), responder a entrada do usuário ([Capítulo
?](event)), e se comunicar através da rede ([Capítulo ?](http)). Novamente,
existem dois capítulos de projeto nesta parte.

Depois disso, [Capítulo ?](node) descreverá Node.js, e [Capítulo ?](skillsharing)
constrói um pequeno website usando a ferramenta.

{{if commercial

Finalmente, [Capítulo ?](fast) descreve algumas considerações que podem surgir ao
otimizar programas JavaScript para velocidade.

if}}

## Convenções tipográficas

{{index "factorial function"}}

Neste livro, texto escrito em uma fonte `monospaced` representará elementos de
programas-às vezes eles são fragmentos autossuficientes, e algumas vezes eles
irão se referir a parte de um programa próximo. Programas (dos quais você já viu
alguns) são escritos como segue:

```
function factorial(n) {
  if (n == 0) {
    return 1;
  } else {
    return factorial(n - 1) * n;
  }
}
```

{{index "console.log"}}

Algumas vezes para mostrar a saída que o programa produz, a saída esperada é
escrita depois dele, com duas barras e uma flecha na frente.

```
console.log(factorial(8));
// → 40320
```

Boa sorte!
