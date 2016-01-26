# Introdução

Esse livro é sobre como fazer com que os computadores façam exatamente o que você quer que eles façam. Hoje em dia, os computadores são tão comuns quanto as chaves de fenda, mas possuem uma complexidade escondida que os torna mais difíceis de se operar e entender. Para muitos, eles continuam sendo não muito familiares e ameaçadores.

![Communicating with a computer](../img/computer.png)

Nós encontramos duas maneiras efetivas para aproximar o espaço vazio que existe na comunicação entre nós, organismos biológicos com um talento para o raciocínio espacial e social, e os computadores, que não possuem sentimentos e são apenas manipuladores de dados. A primeira delas, é baseada em usar nosso senso do mundo físico e construir interfaces que simulam esse mundo, permitindo manipular estruturas na tela com os nossos dedos. Isso funciona muito bem para interações casuais com a máquina.

Entretanto, ainda não encontramos uma maneira boa de usar a abordagem de apontar e clicar para comunicar ao computador as coisas que o designer da interface não previu. Para interfaces mais gerais, como instruir o computador a executar tarefas arbitrárias, tivemos mais sorte com uma abordagem que utiliza nosso talento para linguagem: ensinar uma linguagem à maquina.

As linguagens humanas possibilitam que palavras e frases sejam combinadas de diferentes maneiras, nos permitindo falar diferentes coisas. As linguagens de computador, normalmente menos flexíveis em sua gramática, seguem um princípio similar.

O uso da computação casual se tornou cada vez mais popular nos últimos vinte anos e as interfaces baseadas em linguagens, que era a forma na qual as pessoas interagiam com os computares, foram amplamente substituídas por interfaces gráficas. Mesmo assim, elas continuam por aí, basta saber onde procurá-las. Uma linguagem específica chamada JavaScript está presente em praticamente todos os navegadores e, por isso, está disponível em quase todos os aparelhos.

Esse livro tem o objetivo de familiarizá-lo o suficiente com essa linguagem para que você seja capaz de fazer com que o computador faça o que você quiser.

## Sobre Programação

> Eu não esclareço aqueles que não têm vontade de aprender, nem desperto aqueles que não estão ansiosos para dar uma explicação a si mesmos. Se eu mostrei um lado de um quadrado e eles não conseguem chegar nos outros três, eu não deveria passar pelos mesmos pontos novamente.
>
> — Confúcio

Antes de explicar o JavaScript, irei introduzir também os princípios básicos de programação. Programação é de fato difícil. As regras fundamentais são geralmente simples e claras. Entretanto, programas construídos em cima dessas regras tendem a se tornar complexos, introduzindo suas próprias regras e complexidades adicionais. De certa forma, você estará construindo o seu próprio labirinto e, talvez, possa acabar se perdendo nele.

Haverá momentos de frustração quando estiver lendo esse livro e, se você é novo em programação, haverá uma grande quantidade de material para ser digerido. Durante a leitura, muitos desses conceitos serão _combinados_ de várias formas, forçando-o a fazer novas conexões.

Fica a seu critério saber qual o nível de esforço necessário. Quando estiver passando por dificuldades para acompanhar o livro, não tire conclusões imediatas sobre sua própria capacidade. Você estará bem, apenas não desista. Tire um tempo de descanso, releia algum material anterior e _sempre_ certifique-se de que leu e entendeu os programas apresentados nos exemplos e nos exercícios. Aprender é um trabalho árduo, mas tudo o que for aprendido será completamente seu e ajudará com que o aprendizado posterior seja ainda mais fácil.

> O programador é um criador de universos nos quais ele é o único responsável. Universos com complexidades totalmente ilimitadas podem ser criados na forma de programas de computador.
>
> — Joseph Weizenbaum, Computer Power and Human Reason

Um programa pode ser considerado muitas coisas. Ele é um pedaço de texto digitado por um programador, a força que direciona o computador a fazer o que ele faz e, também, os dados contidos na memória do computador, controlando as ações executadas nessa mesma memória. Analogias que tentam comparar programas aos objetos que conhecemos, normalmente tendem a ser insuficientes. Uma dessas comparações superficiais é com uma máquina, com várias partes separadas que normalmente estão relacionadas e, para fazer com que a máquina toda funcione, precisamos considerar a maneira nas quais essas partes estão conectadas e como cada uma contribui para a operação da máquina como um todo.

Um computador é uma máquina construída para atuar como um hospedeiro para essas máquinas imateriais. Os computadores por si sós, conseguem apenas fazer coisas fáceis e pouco complicadas. A razão deles serem tão úteis, é que eles conseguem executar essas coisas em uma velocidade incrivelmente rápida. Um programa pode combinar uma grande quantidade dessas coisas simples a fim de executar coisas mais complicadas.

Para alguns de nós, escrever programas de computador é um fascinante jogo. Um programa é uma construção do pensamento. Não possui custos de construção, é leve e cresce facilmente com a digitação feita por nossas mãos.

Entretanto, se não formos cuidadosos, o tamanho e a complexidade de um programa pode crescer e ficar fora de controle, confundindo, até mesmo, a pessoa que o criou. Manter os programas sob controle é o maior desafio da programação. Quando um programa funciona, é lindo. A arte de programar é, basicamente, a habilidade de controlar a complexidade. Um ótimo programa é suave e simples em sua própria complexidade.

Muitos programadores acreditam que essa complexidade é melhor gerenciada usando, em seus programas, apenas um pequeno conjunto de técnicas bem entendidas. Eles criaram uma série de regras rígidas ("boas práticas") recomendando a forma que os programas deveriam ter. Os mais zelosos entre eles, vão considerar como _maus programadores_ aqueles que saem dessa pequena zona de segurança.

Quanta hostilidade em relação à riqueza da programação, tentar reduzi-lá a algo simples e previsível, colocando um tabu em todos os estranhos e bonitos programas. A dimensão das técnicas de programação é enorme e fascinante em sua diversidade e, ainda assim, amplamente inexplorada. É certamente muito perigoso atrair programadores inexperientes nesses tipos de confusões, entretanto, você deve seguir com cautela e manter o seu senso comum em relação a elas. Conforme você aprende, sempre haverá novos territórios e desafios a serem explorados. Programadores que se recusam a continuar explorando irão estagnar, esquecer da alegria que é programar e acabarão ficando entediados com as coisas que constroem.

## Porque linguagens importam?

No início, quando a computação nasceu, não haviam linguagens de programação. Os programas eram parecidos com algo assim:

```
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

Esse é um programa que soma os números de 1 a 10 e imprime o resultado: `1 + 2 + … + 10 = 55`. Ele poderia ser executado em qualquer máquina simples. Para programar os computadores antigos, era necessário configurar longos conjuntos de chaves na posição correta ou, então, fazer perfurações em cartões que eram usados para alimentar o computador. Você provavelmente deve estar imaginando como tedioso e propenso a erros esse procedimento era. Até para escrever programas simples precisava de muita habilidade e disciplina. Os programas mais complexos eram praticamente inimagináveis de serem criados.

É claro que inserir esses padrões "arcanos" de bits (zeros e uns) dava ao programador a profunda sensação de ser um poderoso mago, e isso devia significar alguma coisa em relação ao sentimento de satisfação em seu trabalho.

Cada linha do programa contém uma simples instrução. Isto pode ser escrito assim:

```
1. Guarde o número 0 na posição da memória 0.
2. Guarde o número 1 na posição da memória 1.
3. Guarde o valor da posição da memória 1 na posição da memória 2.
4. Subtraia o número 11 do valor na posição da memória 2.
5. Se o valor na posição da memória 2 é o número 0, continue com a instrução 9.
6. Adicione o valor da posição da memória 1 para posição de memória 0.
7. Adicione o número 1 ao valor da posição de memória 1.
8. Continue com a instrução 3.
9. Retorne o valor da posição da memória 0.
```

Embora isto seja mais legível que a sopa de bits, ainda continua bastante desagradável. Pode ser de auxílio usar nomes ao invés de números para as instruções e locações de memória:

```
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
```

Neste ponto não é tão difícil ver como os programas trabalham. Você consegue? As primeiras duas linhas fornece duas locações de memória que iniciam os valores: `total` vai ser usado para construir o resultado da computação, e `count` mantém registrado o número que nós atualmente estamos olhando. As linhas usando `compare` são provavelmente as mais estranhas. O que o programa quer fazer é ver se já pode parar. Por causa da nossa máquina hipotética ser bastante primitiva, ela somente pode testar se um número é zero e fazer a decisão (salto) baseado nisto. Então, ela usa a locação de memória rotulada `compare` para computar o valor de `count` - 11 e fazer a decisão baseada neste valor. As próximas duas linhas adicionam o valor de `count` ao resultado e incrementam `count` por 1 cada vez que o programa decide que não é 11 ainda.

Aqui temos o mesmo programa em JavaScript:

```javascript
var total = 0, count = 1;
while (count <= 10) {
	total += count;
	count += 1;
}
console.log(total);
```

Isso nos dá muitas melhorias. E o mais importante, não é preciso mais especificar o caminho que nós queremos que o programa salte anteriormente ou adiante. Ele continua executando o bloco (envolvido nas chaves) até que a condição que foi dada seja: `count <= 10`, que significa "count é menor que ou igual a 10". Não temos mais que criar um valor temporário e compará-lo a zero. Isso é um detalhe desinteressante, e o poder das linguagens de programação é que elas tomam conta de detalhes desinteressantes para nós.

No final do programa, depois de `while` ser definido, a operação `console.log` é aplicada ao resultado na ordem que escrevemos isso como *output* (saída).

Finalmente, aqui temos o que o programa pode parecer se nós tivermos as operações convenientes `range` (alcance) e `sum` (soma) disponíveis, que respectivamente criam uma coleção de números com um alcance e computam a soma de uma coleção de números:

```javascript
console.log(sum(range(1,10)));
// 55
```

A moral da história, então, é que o mesmo programa pode ser expresso de forma longa e curta, de forma legível ou não. A primeira versão do programa foi extremamente obscura, enquanto esta última é praticamente "Inglês": `log` (registre) a `sum` (soma) da `range` (extensão) dos números de 1 a 10. (Nós vamos ver nos próximos capítulos como criar coisas do tipo `sum` e `range`).

Uma boa linguagem de programação ajuda o programador permitindo-o conversar sobre ações que o computador vai realizar em *alto nível*. Isto ajuda a deixar detalhes desinteressantes implícitos, e fornece construções convenientes de blocos (como o `while` e `console.log`), permitindo a você definir seus próprios blocos (como `sum` e `range`), e tornando simples a construção destes blocos.

## O que é JavaScript?

O JavaScript foi introduzido em 1995, como uma forma de adicionar programas a páginas da web no navegador Netscape. A linguagem foi adaptada pela maioria dos navegadores gráficos da web. Ele fez a atual geração de aplicações web possível - clientes de email baseado no navegador, mapas e redes sociais - e também é usado em sites mais tradicionais para fornecer várias formas de interatividade e inteligência.

É importante notar que JavaScript não tem quase nada a ver com a linguagem de programação Java. O nome similar foi inspirado por considerações de marketing, ao invés do bom senso. Quando o JavaScript foi introduzido, a linguagem Java estava sendo fortemente divulgada e ganhando popularidade. Alguém pensou ser uma boa ideia tentar trilhar junto com este sucesso. Agora estamos emperrados com este nome.

Depois da adoção fora do Netscape, um documento padrão foi escrito para descrever uma forma que a linguagem deve trabalhar, com um esforço para certificar-se que as várias partes do software que afirmavam suportar JavaScript estavam realmente falando sobre a mesma linguagem. Foi chamado de padrão ECMAScript, depois da organização ter feito a padronização. Na prática, os termos ECMAScript e JavaScript podem ser usados como sinônimos - são dois nomes para a mesma linguagem.

Tem alguns que vão dizer coisas *horríveis* sobre a linguagem JavaScript. Muitas dessas coisas são verdade. Quando eu fui obrigado a escrever algo em JavaScript, pela primeira vez, eu rapidamente vim a desprezá-lo - ele poderia interpretar qualquer coisa que eu digitei, mas interpretava de uma forma completamente diferente do que eu quis dizer. Isso teve muito a ver com o fato de que eu não tinha a menor ideia do que estava fazendo, claro, mas há uma questão real aqui: JavaScript é ridiculamente liberal no que ele permite. A ideia por trás deste padrão foi que isto tornaria a programação em JavaScript simples para iniciantes. Na realidade, na maior parte das vezes isto torna a detecção de problemas em seus programas difícil, porque o sistema não vai apontá-lo para você.

Esta flexibilidade também tem suas vantagens. Isso dá espaço para muitas técnicas que são impossíveis em linguagens mais rígidas, e, como iremos ver em capítulos posteriores, isto pode ser usado para superar algumas deficiências do JavaScript. Depois de aprender corretamente e trabalhar com o JavaScript por um tempo, eu aprendi a realmente *gostar* desta linguagem.

Tivemos várias *versões* do JavaScript. Versão 3 do ECMAScript foi a dominante, largamente suportado no tempo que o JavaScript ascendia para o domínio, aproximadamente entre 2000 e 2010. Durante este tempo, trabalho estava em andamento na versão 4 ambiciosa, que planeja um número de melhorias e extensões radicais para a linguagem. Porém, mudar de forma radical uma linguagem largamente usada pode ser politicamente difícil, e o trabalho na versão 4 foi abandonado em 2008, e conduzido para a 5ª edição que saiu em 2009. Estamos agora esperando que todos os maiores navegadores suportem a 5 edição, que é a linguagem da versão que este livro vai focar. O trabalho na 6ª edição está em curso.

Navegadores web não são as únicas plataformas que o JavaScript é usado. Alguns banco de dados, como MongoDB e CouchDB, usam JavaScript como sua linguagem de consulta e script. Muitas plataformas para desktop e de programação no servidor, mais notável o projeto *Node.JS*, sujeito do capítulo (AINDA NÃO ESCRITO), fornecem um poderoso ambiente de programação JavaScript fora do navegador.

## Código, e o que fazer com ele

Código é o texto que compõe os programas. Muitos capítulos deste livro contém muito código. Em minha experiência, escrever e ler códigos é uma importante parte do aprendizado da programação. Tenta não apenas olhar sobre os códigos, leia-os atenciosamente e os entenda. Isto pode ser lento e confuso no início, mas eu prometo que você vai rapidamente pegar o jeito. O mesmo acontece para os exercícios. Não assuma que você os entendeu até que você realmente tenha escrito uma solução que funcione.

Eu recomendo que você teste suas soluções dos exercícios em um interpretador JavaScript real, para obter um feedback se o que você fez está funcionando ou não, e, esperançosamente, ser incentivado a experimentar e ir além dos exercícios.

Quando ler este livro no seu navegador, você pode editar (e rodar) os programas exemplo clicando neles.

Rodando programas JavaScript fora do contexto deste livro é possível também. Você pode optar por instalar o node.js, e ler a documentação para conhecer como usá-lo para avaliar arquivos de texto que contém programas. Ou você pode usar o console de desenvolvedores no navegador (tipicamente encontrado no menu "tools" ou "developer") e divertir-se nele. No capítulo (CORRIGIR!), o jeito que os programas são embutidos em páginas web (arquivos HTML) é explicado. Entretanto, você pode verificar em http://jsbin.com por outra interface amigável para rodar código JavaScript no navegador.

## Convenções Tipográficas

Neste livro, texto escrito em fonte `monoespaçada` deve ser entendido por representações de elementos dos programas - algumas vezes são fragmentos auto-suficientes, e algumas vezes eles somente referenciam para alguma parte de um programa próximo. Programas (que você já viu um pouco), são escritos assim:

```javascript
function fac(n) {
	if (n == 0)
		return 1;
	else
		return fac(n - 1) * n;
}
```

Algumas vezes, para mostrar a saída que o programa produz, a mesma será escrita abaixo dele, com duas barras e uma seta na frente:

```javascript
console.log(fac(8));
// → 40320
```

Boa Sorte!
