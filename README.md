# Eloquente JavaScript - liberação antecipada ☺

### 2ª edição


Uma moderna introdução ao JavaScript, programação e maravilhas digitais.

[[nova capa aqui]]

### Escrito por **Marijn Haverbeke**

#### Traduzido por **[Eric Oliveira](https://github.com/eoop/eo_op)**

Licensiado sobre licença [Creative Commons attribution-noncommercial.](http://creativecommons.org/licenses/by-nc/3.0/) Todo código neste livro também pode ser considerado sobre [licença MIT](http://opensource.org/licenses/MIT).

Ilustrações por vários artistas: *Sea of bits* (capítulo 1) e *weresquirrel* (capítulo 4) por Margarita Martínez e José Menor. Mysterious computer (introdução) por Philip Tyrer.

## Conteúdo

* [Introdução](https://github.com/eoop/eloquente-javascript#introdu%C3%A7%C3%A3o)
1. [Valores, Tipos e Operadores]()
2. [Estrutura do Programa]()
3. [Funções]()
4. [Estrutura de Dados: Objeto e Array]()
5. [Funções de Ordem Superior]()
6. [A Vida Secreta dos Objetos]()
7. [Prática: Vida Eletrônica]()
8. [Erros e Manipulação de Erros]()


---

# Introdução

Este livro é sobre conversar com computadores. Computadores se tornaram uma das ferramentas fundamentais do nosso tempo. Ser capaz de controlá-los efetivamente é uma habilidade extremamente útil. Com a mentalidade certa, também pode ser muito divertido!

Há uma lacuna entre nós, organismos biológicos models com um talento para o raciocínio espacial e social, e o computador, um simples manipulador de dados insignificantes, sem nossos preconceitos e instintos. Felizmente, tivemos um grande progresso em preencher essa lacuna nos últimos sessenta anos.

A história da interação humano-computador tem se afastado da ideia fria e reducionista do mundo sobre o computador, apresentando camadas mais amigáveis em cima disso. As duas ideias mais importantes neste processo tem sido o uso de linguagens de computador, que mapeiam bem para o nosso cérebro por se parecer com as linguagens que usamos para conversas uns com os outros, e interfaces gráficas apontar e clicar (ou toque), que nós facilmente por causa de imitar o mundo tangível fora da máquina.

![Mysterios Computer](img/mysterious-computer.jpg)

Interfaces gráficas tendem a ser mais fáceis descobrir que linguagens - detectar um botão é mais rápido do que aprender uma gramática. Por essa razão, eles se tornaram a forma dominante de interagir com sistemas orientados ao consumidor. Compare com os telefones atuais, onde você pode realizar todo tipo de tarefa tocando e passando os elementos que aparecem na tela, com o *Commodore 64* de 1982, o aparelho que me introduziu a computação, onde tudo que você recebia era um cursor piscando, e você conseguia isto digitando comandos.

Obviamente, o telefone *touchscreen* é mais acessível, e é inteiramente apropriado que esses dispositivos utilizem uma interface gráfica. Mas as interfaces baseadas em linguagens têm outra vantagem - uma vez que você aprenda esta linguagem, ela tende a ser mais expressiva, tornando mais fácil compor a funcionalidade fornecida pelo sistema de novas maneiras, e até mesmo criando seus próprios blocos de construção.

Com o *Commodore 64*, quase todas as tarefas no sistema eram realizadas dando comandos embutidos na linguagem da máquina (um dialeto da linguagem de programação BASIC). Isto permitia aos usuários gradualmente progredir de simplesmente usar o computador (carregando programas) para de fato programá-los. Você estava *dentro* de um ambiente de programação desde o início, em vez de ter que procurar ativamente por um.

Isto foi perdido pela mudança para as interfaces gráficas de usuário. Mas as interfaces baseadas em linguagem, na forma de linguagens de programação, continuam aqui, em cada máquina, em grande parte escondida do usuário comum. Uma tal linguagem, JavaScript, está disponível em quase todos os dispositivos de consumidores como parte de um navegador web.

Este livro pretende torná-lo familiar com esta linguagem o suficiente para que você seja capaz de fazer com o computador o que você quiser.

## Na Programação

> Eu não esclareço os que não estão prontos para aprender, nem desperto aqueles que não estão ansiosos para dar uma explicação a si próprios. Se eu apresentei um canto da praça, e eles não podem voltar para mim com os outros três, eu não deveria passar por estes pontos novamentes. **Confúcio**

Antes de explicar JavaScript, eu também quero introduzir os princípios básicos de programação. Programação, ao que parece, é difícil. As regras fundamentais são claras e simples. Mas programas, criados em cima destas regras básicas, tendem a tornar-se complexos o suficiente para introduzir suas próprias regras e complexidades. Você está construindo seu próprio labirinto, e pode simplesmente perder-se nele.

Para tirar algum proveito deste livro, mais do que apenas uma leitura passiva é necessário. Trate de ficar atento, faça um esforço para entender o exemplo de código, e somente continue quando você estiver razoavelmente seguro que você entendeu o material que veio antes.

> O programador de computadores é um criador de universos no qual ele é o único responsável. Universos de complexidade virtualmente ilimitada podem ser criados sob a forma de programas de computador. **Joseph Weizenbaum, Computer Power and Human Reason**

Um programa é muitas coisas. É um pedaço de texto digitado por um programador, que é a força direta que faz que o computador faça o que faz, são dados na memória do computador, mas ele controla as ações realizadas nesta mesma memória. Analogias que tentam comparar programas com objetos que somos familiares tendem a ser insuficientes. Uma conexão superficial é a com uma máquina - muitas partes separadas tendem a ser envolvidas, e para fazer o conjunto todo precisamos considerar as maneiras que estas partes se interconectam e contribuam para a operação do todo.

Um computador é uma máquina feita para atuar como um hospedeiro para estas máquinas imateriais. Computadores por si próprios podem somente fazer coisas estúpidas e simples. A razão deles serem tão úteis que eles fazem coisas em uma velocidade incrível. Um programa pode ingenuamente combinar enormes números de simples ações ao invés de fazer coisas complicadas.

Para muitos de nós, escrever programas de computador é um fascinante jogo. Um programa é uma construção do pensamento. Não tem custos de construção, é leve e cresce facilmente ante nossas digitações.

Se não formos cuidadosos, seu tamanho e complexidade vão aumentar fora de controle, confundindo até a pessoa que o criou. Este é o principal problema da programação: manter os programas sobre controle. Quando um programa funciona, ele é lindo. A arte de programar é a habilidade de controlar a complexidade. Um grande programa é suave, é simples em sua complexidade.

Alguns programadores acreditam que esta complexidade é melhor gerenciada usando somente um pequeno conjunto de técnicas bem entendidas em seus programas. Eles compõe regras rígidas (*"boas práticas"*) prescrevendo a forma que programas devem ter, e os mais zelosos sobre isso vão considerar aqueles que saem desta pequena zona de segurança *maus programadores*.

Quanta hostilidade perante a riqueza da programação - tentar reduzir a algo simples e previsível, colocando um tabu em todos os lindos e misteriosos programas! A paisagem das técnicas de programação é enorme, fascinante em sua diversidade, e permanece largamente inexplorada. É sem dúvida perigoso ir neste caminho, atraindo o programador inexperiente em todo tipo de confusão, mas isso só significa que você deve proceder com cautela e manter o juízo. Conforme você aprende, sempre haverá novos desafios e novos territórios a ser explorados. Programadores que recusam de manter-se explorando vão estagnar, esquecer sua alegria, e ficar entediado com seu trabalho.

## Porque linguagens importam?

No começo, no nascimento da programação, não havia linguagens de programação. Programas pareciam algo desta forma:

<pre>
<code>
00110001 00000000 00000000
00110001 00000001 00000001
00110011 00000001 00000010
01010001 00001011 00000010
00100010 00000010 00001000
01000011 00000001 00000000
01000001 00000001 00000001
00010000 00000010 00000000
01100010 00000000 00000000
</code>
</pre>

Este é um programa que soma os números do 1 ao 10 e imprimi o resultado (1 + 2 + ... 10 = 55). Isso pode rodar em uma muito simples, uma máquina hipotética. Para programar os primeiros computadores, era necessário configurar grandes arrays de chaves na posição certa, ou fazer furos em cartões e alimentá-los no computador. Você pode imaginar como isso era tedioso, e um procedimento propenso ao erro. Mesmo escrever simples programas requeriam muita habilidade e disciplina. Os complexos eram quase inconcebíveis.

Claro, inserindo manualmente estes padrões misteriosos de bits (1 e 0) fez que o programador tivesse uma profunda sensação de ser um poderoso feiticeiro. E isto tem que valer alguma coisa em termos de satisfação no trabalho.

Cada linha do programa contém uma simples instrução. Isto pode ser escrito assim:

<pre>
<code>
1. Guarde o número 0 na posição da memória 0.
2. Guarde o número 1 na posição da memória 1.
3. Guarde o valor da posição da memória 1 na posição da memória 2.
4. Subtraia o número 11 do valor na posição da memória 2.
5. Se o valor na posição da memória 2 é o número 0, continue com a instrução 9.
6. Adicione o valor da posição da memória 1 para posição de memória 0.
7. Adicione o número 1 ao valor da posição de memória 1.
8. Continue com a instrução 3.
9. Retorne o valor da posição da memória 0.
</code>
</pre>

Embora isto seja mais legível que a sopa de bits, ainda continua bastante desagradável. Pode ser de auxílio usar nomes ao invés de números para as instruções e locações de memória:

<pre>
<code>
Configure "total" para 0
Configure "count" para 1
[loop]
Configure "compare" para "count"
Subtraia 11 de "compare"
Se "compare" é zero, continue até [fim]
Adicione "count" em "total"
Adicione 1 em "count"
Continue até [loop]
[fim]
Saída "total"
</code>
</pre>

Neste ponto não é tão difícil ver como os programas trabalham. Você consegue? As primeiras duas linhas fornece duas locações de memória que iniciam os valores: `total` vai ser usado para construir o resultado da computação, e `count` mantém registrado o número que nós atualmente estamos olhando. As linhas usando `compare` são provavelmente as mais estranhas. O que o programa quer fazer é ver se já pode parar. Por causa da nossa máquina hipotética ser bastante primitiva, ela somente pode testar se um número é zero e fazer a decisão (salto) baseado nisto. Então, ela usa a locação de memória rotulada `compare` para computar o valor de `count` - 11 e fazer a decisão baseada neste valor. As próximas duas linhas adicionam o valor de `count` ao resultado e incrementam `count` por 1 cada vez que o programa decide que não é 11 ainda.

Aqui temos o mesmo programa em JavaScript:

<pre>
<code>
var total = 0, count = 1;
while (count <= 10) {
	total += count;
	count += 1;
}
console.log(total);
</code>
</pre>

Isso nos dá muitas melhorias. Mais importante, não é preciso mais especificar o caminho que nós queremos que o programa salte anteriormente ou adiante. Ele continua executando o bloco (envolvido nas chaves) até que a condição que foi dada seja: `count <= 10`, que significa "count é menor que ou igual a 10". Não temos mais que criar um valor temporário e compará-lo a zero. Isso é um detalhe desinteressante, e o poder das linguagens de programação é que elas tomam conta de detalhes desinteressantes para nós.

No final do programa, depois de `while` ser definido, a operação `console.log` é aplicada ao resultado na ordem que escrevemos isso como *output* (saída).

Finalmente, aqui temos o que o programa pode parecer se nós tivermos as operações convenientes `range` (alcance) e `sum` (soma) disponíveis, que respectivamente criam uma coleção de números com um alcance e computam a soma de uma coleção de números:

<pre>
<code>
console.log(sum(range(1,10)));
// 55
</code>
</pre>

A moral da história, então, é que o mesmo programa pode ser expresso de forma longa e curta, de forma legível ou não. A primeira versão do programa foi extremamente obscura, enquanto esta última é praticamente "Inglês": `log` (registre) a `sum` (soma) da `range` (extensão) dos números de 1 a 10. (Nós vamos ver nos próximos capítulos como criar coisas do tipo `sum` e `range`).

Uma boa linguagem de programação ajuda o programador permitindo-o conversr sobre ações que o computador vai realizar em *alto nível*. Isto ajuda a deixar detalhes desinteressantes implícitos, e fornece construções convenientes de blocos (como o `while` e `console.log`), permitindo a você definir seus próprios blocos (como `sum` e `range`), e tornando simples a construção destes blocos.

## O que é JavaScript?

O JavaScript foi introduzido em 1995, como uma forma de adicionar programas a páginas da web no navegador Netscape. A linguagem foi adaptada pela maioria dos navegadores gráficos da web. Ele fez a atual geração de aplicações web possível - clientes de email baseado no navegador, mapas e redes sociais - e também é usado em sites mais tradicionais para fornecer várias formas de interatividade e inteligência.

É importante notar que JavaScript não tem quase nada a ver com a linguagem de programação Java. O nome similar foi inspirado por considerações de marketing, ao invés do bom senso. Quando o JavaScript foi introduzido, a linguagem Java estava sendo fortemente divulgada e ganhando popularidade. Alguém pensou ser uma boa ideia tentar trilhar junto com este sucesso. Agora estamos emperrados com este nome.

Depois da adoção fora do Netscape, um documento padrão foi escrito para descrever uma forma que a linguagem deve trabalhar, com um esforço para certificar-se que as várias partes do software que afirmavam suportar JavaScript estavam realmente falando sobre a mesma linguagem. Foi chamado de padrão ECMAScript, depois da organização ter feito a padronização. Na prática, os termos ECMAScript e JavaScript podem ser usados como sinônimos - são dois nomes para a mesma linguagem.

Tem alguns que vão dizer coisas *horríveis* sobre a linguagem JavaScript. Muitas dessas coisas são verdade. Quando eu fui obrigado a escrever algo em JavaScript, pela primeira vez, eu rapidamente vim a desprezá-lo - ele poderia interpretar qualquer coisa que eu digitei, mas interpretava de uma forma completamente diferente do que eu quis dizer. Isso teve muito a ver com o fato de que eu não tinha a menor ideia do que estava fazendo, claro, mas há uma questão real aqui: JavaScript é ridiculamente liberal no que ele permite. A ideia por trás deste padrão foi que isto tornaria a programação em JavaScript simples para iniciantes. Na realidade, na maior parte daz vezes isto torna a detecção de problemas em seus programas difícil, porque o sistema não vai apont-alo para você.

Esta flexibilidade também tem suas vantagens. Isso dá espaço para muitas técnicas que são impossíveis em linguagens mais rígidas, e, como iremos ver em capítulos posteriores, isto pode ser usado para superar algumas deficiências do JavaScript. Depois de aprender corretamente e trabalhar com o JavaScript por um tempo, eu aprendi a realmente *gostar* desta linguagem.

Tivemos várias *versões* do JavaScript. Versão 3 do ECMAScript foi a dominante, largamente suportado no tempo que o JavaScript ascendia para o domínio, aproximadamente entre 2000 e 2010. Durante este tempo, trabalho estava em andamento na versão 4 ambiciosa, que planeja um número de melhorias e extensões radicais para a linguagem. Porém, mudar de forma radical uma linguagem largamente usada pode ser politicamente difícil, e o trabalho na versão 4 foi abandonado em 2008, e conduzido para a 5ª edição que saiu em 2009. Estamos agora esperando que todos os maiores navegadores suportem a 5 edição, que é a linguagem da versão que este livro vai focar. O trabalho na 6ª edição está em curso.

Navegadores web não são as únicas plataformas que o JavaScript é usado. Alguns banco de dados, como MongoDB e CouchDB, usam JavaScript como sua linguagem de consulta e script. Muitas plataformas para desktop e de programação no servidor, mais notável o projeto *Node.JS*, sujeito do capítulo (AINDA NÃO ESCRITO), fornecem um poderoso ambiente de programação JavaScript fora do navegador.

## Código, e o que fazer com ele

Código é o texto que compõe os programas. Muitos capítulos deste livro contém muito código. Em minha experiência, escrever e ler códigos é uma importante parte do aprendizado da programação. Tenta não apenas olhar sobre os códigos, leia-os atenciosamente e os entenda. Isto pode ser lento e consufo no início, mas eu prometo que você vai rapidamente pegar o jeito. O mesmo acontece para os exercícios. Não assuma que você os entendeu até que você realmente tenha escrito uma solução que funcione.

Eu recomendo que você teste suas soluções dos exercícios em um interpretador JavaScript real, para obter um feedback se o que você fez está funcionando ou não, e, esperançosamente, ser incentivado a experimentar e ir além dos exercícios.

Quando ler este livro no seu navegador, você pode editar (e rodar) os programas exemplo clicando neles.

Rodando programas JavaScript fora do contexto deste livro é possível também. Você pode optar por instalar o node.js, e ler a documentação para conhecer como usá-lo para avaliar arquivos de texto que contém programas. Ou você pode usar o console de desenvolvedores no navegador (tipicamente encontrado no menu "tools" ou "developer") e divertir-se nele. No capítulo (CORRIGIR!), o jeito que os programas são embutidos em paǵinas web (arquivos HTML) é explicado. Entretanto, você pode verificar em http://jsbin.com por outra interface amigável para rodar código JavaScript no navegador.

## Conveções Tipográficas

Neste livro, texto escrito em fonte `monoespaçada` deve ser entendido por representações de elementos dos programas - algumas vezes são fragmentos auto-suficientes, e algumas vezes eles somente referenciam para alguma parte de um programa próximo. Programas (que você já viu um pouco), são escritos assim:

<pre>
<code>
function fac(n) {
	if (n == 0)
		return 1;
	else
		return fac(n - 1) * n;
}
</code>
</pre>

Algumas vezes, para mostrar a saída que o programa produz, a mesma será escrita abaixo dele, com duas barras e uma seta na frente:

<pre>
<code>
console.log(fac(8));
// → 40320
</code>
</pre>

Boa Sorte!

#### Capítulo 1
# Valores, Tipos e Operadores

Dentro do mundo do computador, há somente dados. Nós podemos ler dados, modificar dados, criar dados - mas coisas que não são representadas por dados simplesmente não existem. Todos estes dados são armazenados em longas sequências de bits, e isso portanto é fundamentalmente parecido.

Bits podem ser qualquer tipo de coisa com 2 valores, usualmente descrito como 0 e 1. Dentro do computador, eles tomam formas como uma carga elétrica alta ou baixa, um forte ou fraco sinal, ou um ponto brilhante ou sem brilho na superfície de um CD. Qualquer pedaço de uma discreta informação, pode ser reduzida para uma sequência de 0 e 1, e então representanda por bits.

Como um exemplo, pense sobre a maneira que o número 13 pode ser armazenado em bits. A forma usual de se fazer esta analogia é a forma de escrevermos números decimais, mas ao invés de 10 dígitos, temos apenas 2. E, ao invés de o valor de um dígito aumentar dez vezes sobre o dígito após ele, o valor aumenta por um fator 2. Estes são os bits que compõem o número treze, com o valor dos dígitos mostrados abaixo deles:

<pre>
<code>
  0   0   0   0   1   1   0   1
128  64  32  16   8   4   2   1
</code>
</pre>

Então este é o 00001101, ou 8 + 4 + 1, que equivale a 13.

## Valores

Imagine um mar de bits. Um oceano deles. Um típico computador moderno vai ter em torno de trinta bilhões de bits reservados em seu armazenamento de dados volátil (em oposição ao armazenamento não volátil - o disco rígido ou não equivalente - que tende a ter algumas ordens de magnitude mais).

![Bit Sea](img/bit-sea.png)

Para trabalhar com estes sem se perder, nós temos que estruturá-los de alguma forma. Uma forma de fazer é agrupá-los dentro de pedaços que representam uma simples parte de informação. Em um ambiente JavaScript, todo os dados são separados em coisas chamadas *valores*, grupos de bits que representam um pedaço de dado coerente.

Embora todos os valores sejam feitos da mesma coisa uniforme, eles desempenham papéis diferentes. Todo valor tem um tipo, que determina o tipo de papel que desempenha. Temos seis tipos básicos de valores no JavaScript: números, strings, booleans, objetos, funções e valores indefinidos. 

> Em inglês: [number, string, boolean, object, function, undefined]

Para criar um valor, deve-se simplesmente invocar seu nome. Isto é muito conveniente. Você não tem que recolher material para construir seus valores ou pagar por eles; você só chama por um, e pronto, você o tem. Eles não são criados com ar, obviamente. Todo valor tem que ser armazenado em algum lugar, e se você quer usar uma quantidade gigante deles, ao mesmo tempo você deve rodar sobre os bits. Felizmente, este é um problema somente se você os quiser simultaneamente. Assim que você não usar mais um valor, ele será dissipado, deixando para trás os bits para serem reciclados e se tornarem materiais para a próxima geração de valores.

Este capítulo introduz os elementos atômicos dos programas JavaScript: Simples tipos de valores, e operadores que podem atuar em cada valor.

## Números

Valores do tipo *numbers* são, previsivelmente, valor numéricos. Em um programa JavaScript, eles são escritos usualmente assim:

```javascript

13

```

Coloque isto em um programa, e isto vai gerar o bir padrão para o número 13 começar a existir dentro do computador.

O JavaScript usa um número fixo de bits, 64 deles, para armazenar um único valor numérico. Isto significa que existe uma quantidade limite de tipos diferentes de números que podem ser representados - há muitos padrões diferentes que você pode criar com 64 bits. O conjunto de números podem ser representados por N dígitos decimais é 10^N. Similarmente, o conjunto de números que podem ser representados por 64 dígitos binários é 2⁶⁴, que é mais ou menos 18 quintilhões (um 18 com 18 zeros após ele).

Isto é muito. Números exponenciais tem o hábito de ficarem grandes. Já foi o tempo que as memórias eram pequenas e as pessoas tendiam a usar grupos de 8 ou 16 bits para representar estes números. Era fácil de acidentalmente "transbordarem" estes pequenos números. Hoje, temos o luxo de somente preocupar quando realmente lidamos com números astronômicos.

Todos os números abaixo de 18 quintilhões cabem no JavaScript *number*. Estes bits também armazenam números negativos, onde um destes sinais é usado para guardar o sinal do número. Uma grande questão é que números não inteiros podem ser representados. Para fazer isso, alguns bits são usados para guardar a posição do ponto decimal do número. O maior número não inteiro que pode ser armazenado está na faixa de 9 quadrilhões (15 zeros) - que continua muito grande.

Números fracionados são escritos usando o ponto:

```javascript

9.81

```

Para grandes números ou números pequenos, podemos usar a notação científica adicionando um 'e', seguido do expoente:

```javascript

2.998e8

```

Isto é 2.998 x 10⁸ = 299800000.

marcador : http://eloquentjavascript.net/2nd_edition/preview/01_values.html#p_8KgYC0F1fX