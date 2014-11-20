---
layout: chapter
title: Introdução
next: /chapters/valores-tipos-operadores
---

Este livro é sobre como conversar com computadores. Computadores se tornaram uma das ferramentas fundamentais do nosso tempo. Ser capaz de controlá-los efetivamente é uma habilidade extremamente útil. Com a mentalidade certa, também pode ser muito divertido!

Há uma lacuna entre nós, organismos biológicos com um talento para o raciocínio espacial e social, e o computador, um simples manipulador de dados insignificantes, sem nossos preconceitos e instintos. Felizmente, tivemos um grande progresso em preencher essa lacuna nos últimos sessenta anos.

A história da interação humano-computador tem se afastado da ideia fria e reducionista do mundo sobre o computador, apresentando camadas mais amigáveis em cima disso. As duas ideias mais importantes neste processo tem sido o uso de linguagens de computador, que mapeiam bem para o nosso cérebro por se parecer com as linguagens que usamos para conversar uns com os outros, e interfaces gráficas de apontar e clicar (ou toque), que nós facilmente entendemos por imitar o mundo tangível fora da máquina.

![Mysterios Computer](../../assets/images/computer.png)

Interfaces gráficas tendem a ser mais fáceis de descobrir que linguagens - detectar um botão é mais rápido do que aprender uma gramática. Por essa razão, elas se tornaram a forma dominante de interagir com sistemas orientados ao consumidor. Compare com os telefones atuais, onde você pode realizar todo tipo de tarefa tocando e passando os elementos que aparecem na tela, com o *Commodore 64* de 1982, o aparelho que me introduziu a computação, onde tudo que você recebia era um cursor piscando, e você conseguia isto digitando comandos.

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

Um computador é uma máquina feita para atuar como um hospedeiro para estas máquinas imateriais. Computadores por si próprios podem somente fazer coisas estúpidas e simples. A razão deles serem tão úteis é que eles fazem coisas em uma velocidade incrível. Um programa pode ingenuamente combinar enormes números de simples ações ao invés de fazer coisas complicadas.

Para muitos de nós, escrever programas de computador é um fascinante jogo. Um programa é uma construção do pensamento. Não tem custos de construção, é leve e cresce facilmente ante nossas digitações.

Se não formos cuidadosos, seu tamanho e complexidade vão aumentar fora de controle, confundindo até a pessoa que o criou. Este é o principal problema da programação: manter os programas sobre controle. Quando um programa funciona, ele é lindo. A arte de programar é a habilidade de controlar a complexidade. Um grande programa é suave, é simples em sua complexidade.

Alguns programadores acreditam que esta complexidade é melhor gerenciada usando somente um pequeno conjunto de técnicas bem entendidas em seus programas. Eles compõe regras rígidas (*"boas práticas"*) prescrevendo a forma que programas devem ter, e os mais zelosos sobre isso vão considerar aqueles que saem desta pequena zona de segurança *maus programadores*.

Quanta hostilidade perante a riqueza da programação - tentar reduzir a algo simples e previsível, colocando um tabu em todos os lindos e misteriosos programas! A paisagem das técnicas de programação é enorme, fascinante em sua diversidade, e permanece largamente inexplorada. É sem dúvida perigoso ir neste caminho, atraindo o programador inexperiente em todo tipo de confusão, mas isso só significa que você deve proceder com cautela e manter o juízo. Conforme você aprende, sempre haverá novos desafios e novos territórios a serem explorados. Programadores que recusam de manter-se explorando vão estagnar, esquecer sua alegria, e ficar entediado com seu trabalho.

## Porque linguagens importam?

No começo, no nascimento da programação, não havia linguagens de programação. Programas pareciam algo desta forma:

<pre data-language="text/plain" class="snippet cm-s-default">
00110001 00000000 00000000
00110001 00000001 00000001
00110011 00000001 00000010
01010001 00001011 00000010
00100010 00000010 00001000
01000011 00000001 00000000
01000001 00000001 00000001
00010000 00000010 00000000
01100010 00000000 00000000
</pre>

Este é um programa que soma os números do 1 ao 10 e imprimi o resultado (1 + 2 + ... 10 = 55). Isso pode rodar em uma máquina hipotética muito simples. Para programar os primeiros computadores, era necessário configurar grandes `arrays` de chaves na posição certa, ou fazer furos em cartões e alimentá-los no computador. Você pode imaginar como isso era tedioso, e um procedimento propenso ao erro. Mesmo escrever simples programas requeriam muita habilidade e disciplina. Os complexos eram quase inconcebíveis.

Claro, inserindo manualmente estes padrões misteriosos de bits (1 e 0) fez que o programador tivesse uma profunda sensação de ser um poderoso feiticeiro. E isto tem que valer alguma coisa em termos de satisfação no trabalho.

Cada linha do programa contém uma simples instrução. Isto pode ser escrito assim:

<pre data-language="text/plain" class="snippet cm-s-default">
1. Guarde o número 0 na posição da memória 0.
2. Guarde o número 1 na posição da memória 1.
3. Guarde o valor da posição da memória 1 na posição da memória 2.
4. Subtraia o número 11 do valor na posição da memória 2.
5. Se o valor na posição da memória 2 é o número 0, continue com a instrução 9.
6. Adicione o valor da posição da memória 1 para posição de memória 0.
7. Adicione o número 1 ao valor da posição de memória 1.
8. Continue com a instrução 3.
9. Retorne o valor da posição da memória 0.
</pre>

Embora isto seja mais legível que a sopa de bits, ainda continua bastante desagradável. Pode ser de auxílio usar nomes ao invés de números para as instruções e locações de memória:

<pre data-language="text/plain" class="snippet cm-s-default">
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
</pre>

Neste ponto não é tão difícil ver como os programas trabalham. Você consegue? As primeiras duas linhas fornece duas locações de memória que iniciam os valores: `total` vai ser usado para construir o resultado da computação, e `count` mantém registrado o número que nós atualmente estamos olhando. As linhas usando `compare` são provavelmente as mais estranhas. O que o programa quer fazer é ver se já pode parar. Por causa da nossa máquina hipotética ser bastante primitiva, ela somente pode testar se um número é zero e fazer a decisão (salto) baseado nisto. Então, ela usa a locação de memória rotulada `compare` para computar o valor de `count - 11` e fazer a decisão baseada neste valor. As próximas duas linhas adicionam o valor de `count` ao resultado e incrementam `count` por 1 cada vez que o programa decide que não é 11 ainda.

Aqui temos o mesmo programa em JavaScript:

<pre data-language="javascript" class="prettyprint lang-javascript snippet cm-s-default">
var total = 0, count = 1;
while (count <= 10) {
    total += count;
    count += 1;
}
console.log(total); // 55
</pre>

Isso nos dá muitas melhorias. E o mais importante, não é preciso mais especificar o caminho que nós queremos que o programa salte anteriormente ou adiante. Ele continua executando o bloco (envolvido nas chaves) até que a condição que foi dada seja: `count <= 10`, que significa "count é menor que ou igual a 10". Não temos mais que criar um valor temporário e compará-lo a zero. Isso é um detalhe desinteressante, e o poder das linguagens de programação é que elas tomam conta de detalhes desinteressantes para nós.

No final do programa, depois de `while` ser definido, a operação `console.log` é aplicada ao resultado na ordem que escrevemos isso como *output* (saída).

Finalmente, aqui temos o que o programa pode parecer se nós tivermos as operações convenientes `range` (alcance) e `sum` (soma) disponíveis, que respectivamente criam uma coleção de números com um alcance e computam a soma de uma coleção de números:

<pre data-language="javascript" class="prettyprint lang-javascript snippet cm-s-default">
console.log(sum(range(1,10))); // 55
</pre>

A moral da história, então, é que o mesmo programa pode ser expresso de forma longa e curta, de forma legível ou não. A primeira versão do programa foi extremamente obscura, enquanto esta última é praticamente "Inglês": `log` (registre) a `sum` (soma) da `range` (extensão) dos números de 1 a 10. (Nós vamos ver nos próximos capítulos como criar coisas do tipo `sum` e `range`).

Uma boa linguagem de programação ajuda o programador permitindo-o conversar sobre ações que o computador vai realizar em *alto nível*. Isto ajuda a deixar detalhes desinteressantes implícitos, e fornece construções convenientes de blocos (como o `while` e `console.log`), permitindo a você definir seus próprios blocos (como `sum` e `range`), e tornando simples a construção destes blocos.

## O que é JavaScript?

O JavaScript foi introduzido em 1995, como uma forma de adicionar programas a páginas da web no navegador Netscape. A linguagem foi adaptada pela maioria dos navegadores gráficos da web. Ele fez a atual geração de aplicações web possível - clientes de email baseado no navegador, mapas e redes sociais - e também é usado em sites mais tradicionais para fornecer várias formas de interatividade e inteligência.

É importante notar que JavaScript não tem quase nada a ver com a linguagem de programação Java. O nome similar foi inspirado por considerações de marketing, ao invés do bom senso. Quando o JavaScript foi introduzido, a linguagem Java estava sendo fortemente divulgada e ganhando popularidade. Alguém pensou ser uma boa ideia tentar trilhar junto com este sucesso. Agora estamos emperrados com este nome.

Depois da adoção fora do Netscape, um documento padrão foi escrito para descrever uma forma que a linguagem deve trabalhar, com um esforço para certificar-se que as várias partes do software que afirmavam suportar JavaScript estavam realmente falando sobre a mesma linguagem. Foi chamado de padrão ECMAScript, depois da organização ter feito a padronização. Na prática, os termos ECMAScript e JavaScript podem ser usados como sinônimos - são dois nomes para a mesma linguagem.

Tem alguns que vão dizer coisas *horríveis* sobre a linguagem JavaScript. Muitas dessas coisas são verdade. Quando eu fui obrigado a escrever algo em JavaScript, pela primeira vez, eu rapidamente vim a desprezá-lo - ele poderia interpretar qualquer coisa que eu digitei, mas interpretava de uma forma completamente diferente do que eu quis dizer. Isso teve muito a ver com o fato de que eu não tinha a menor ideia do que estava fazendo, claro, mas há uma questão real aqui: JavaScript é ridiculamente liberal no que ele permite. A ideia por trás deste padrão foi que isto tornaria a programação em JavaScript simples para iniciantes. Na realidade, na maior parte das vezes isto torna a detecção de problemas em seus programas difícil, porque o sistema não vai apontá-lo para você.

Esta flexibilidade também tem suas vantagens. Isso dá espaço para muitas técnicas que são impossíveis em linguagens mais rígidas, e, como iremos ver em capítulos posteriores, isto pode ser usado para superar algumas deficiências do JavaScript. Depois de aprender corretamente e trabalhar com o JavaScript por um tempo, eu aprendi a realmente *gostar* desta linguagem.

Tivemos várias *versões* do JavaScript. Versão 3 do ECMAScript foi a dominante, largamente suportado no tempo que o JavaScript ascendia para o domínio, aproximadamente entre 2000 e 2010. Durante este tempo, trabalho estava em andamento na versão 4 ambiciosa, que planeja um número de melhorias e extensões radicais para a linguagem. Porém, mudar de forma radical uma linguagem largamente usada pode ser politicamente difícil, e o trabalho na versão 4 foi abandonado em 2008, e conduzido para a 5ª edição que saiu em 2009. Estamos agora esperando que todos os maiores navegadores suportem a 5ª edição, que é a linguagem da versão que este livro vai focar. O trabalho na 6ª edição está em curso.

Navegadores web não são as únicas plataformas que o JavaScript é usado. Alguns banco de dados, como MongoDB e CouchDB, usam JavaScript como sua linguagem de consulta e script. Muitas plataformas para desktop e de programação no servidor, mais notável o projeto *Node.JS*, sujeito do capítulo (AINDA NÃO ESCRITO), fornecem um poderoso ambiente de programação JavaScript fora do navegador.

## Código, e o que fazer com ele

Código é o texto que compõe os programas. Muitos capítulos deste livro contém muito código. Em minha experiência, escrever e ler códigos é uma importante parte do aprendizado da programação. Tenta não apenas olhar sobre os códigos, leia-os atenciosamente e os entenda. Isto pode ser lento e confuso no início, mas eu prometo que você vai rapidamente pegar o jeito. O mesmo acontece para os exercícios. Não assuma que você os entendeu até que você realmente tenha escrito uma solução que funcione.

Eu recomendo que você teste suas soluções dos exercícios em um interpretador JavaScript real, para obter um feedback se o que você fez está funcionando ou não, e, esperançosamente, ser incentivado a experimentar e ir além dos exercícios.

Quando ler este livro no seu navegador, você pode editar (e rodar) os programas exemplo clicando neles.

Rodando programas JavaScript fora do contexto deste livro é possível também. Você pode optar por instalar o node.js, e ler a documentação para conhecer como usá-lo para avaliar arquivos de texto que contém programas. Ou você pode usar o console de desenvolvedores no navegador (tipicamente encontrado no menu "tools" ou "developer") e divertir-se nele. No capítulo (CORRIGIR!), o jeito que os programas são embutidos em paǵinas web (arquivos HTML) é explicado. Entretanto, você pode verificar em http://jsbin.com por outra interface amigável para rodar código JavaScript no navegador.

## Conveções Tipográficas

Neste livro, texto escrito em fonte `monoespaçada` deve ser entendido por representações de elementos dos programas - algumas vezes são fragmentos auto-suficientes, e algumas vezes eles somente referenciam para alguma parte de um programa próximo. Programas (que você já viu um pouco), são escritos assim:


<pre data-language="javascript" class="prettyprint lang-javascript snippet cm-s-default">
function fac(n) {
    if (n == 0)
        return 1;
    else
        return fac(n - 1) * n;
}
</pre>

Algumas vezes, para mostrar a saída que o programa produz, a mesma será escrita abaixo dele, com duas barras e uma seta na frente:

<pre data-language="javascript" class="prettyprint lang-javascript snippet cm-s-default">
console.log(fac(8)); // 40320
</pre>

Boa Sorte!
