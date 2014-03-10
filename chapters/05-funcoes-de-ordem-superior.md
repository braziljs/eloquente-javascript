Funções de ordem superior

Um programa grande é um programa dispendioso. Não necessariamente porcausa do tempo que leva para construir. Tamanho quase sempre involve complexidade e complexidade confude programadores. Programadores confusos tem um efeito negativo sobre um programa -- eles tendem a criar erros (bugs). Um programa grande também provê um grande espaço para que esses bugs se escondam, ficando dificil de encontrá-los.

Vamos rapidamente voltar para os dois exemplos finais da introdução.
O primeiro é auto contido e num total de 6 linhas.

```
var total = 0, count = 1;
while (count <= 10) {
	total += count;
	count += 1;
}
console.log(total);
```

O segundo necessita de duas funções externas e é apenas numa linha.

`console.log(sum(range(1, 10)));`

Qual é mais provável de conter um erro?

Se contarmos as definições de `sum` e `range`, o segundo código é ainda maior que o primeiro, mas ainda sim, eu diria que é mais provável estar correto.

A razão de ele provávelmente estar mais correto é que, primeiramente constrói um linguagem que expressa o problema, e então resolvendo o problema no seu próprio domínio, a solução ganha claridade. Somar uma sequência de números não se trata de laços e contadores, mas sim de somas e sequência de números.

A definição do vocabulário em si (as funções `sum` e `range`) ainda sim terão que lidar elas mesmos com laços, contadores e outros detalhes bobos. Mas devido a eles expressarem conceitos mais simples (a construção de blocos é mais simples do que construir), eles são mais fáceis de entender.

É claro, conseguir uma soma de uma sequência de números é trivial, com ou sem vocabulário. Considere que é um exemplo miniatura de outro realmente dificil.

## Abstração ##

No contexto da programação, o termo normalmente usado para esses tipos de vocabulário são _abstrações_. Abstrações escondem detalhes e nos dá a habilidade de falar num nível mais alto(mais abstrato).

Uma analogia é a receita para sopa de lentilha:

> "Coloque 1 copo de lentilhas por pessoa num recipiente. Adicione água até as lentilhas ficarem cobertas. Deixa as lentilhas na água por no mínimo 12 horas. Tire as lentilhas da água e coloque-as numa panela. Adicione 4 copos de água por pessoa. Cubra a panela e deixas cozinhando por duas horas. Pegue meia cebola por pessoa, corte em pedaços com uma faca, adicione às lentilhas. Pegue um naco de aipo por pessoa, corte em pedaços com uma faca, adicione às lentilhas. Pegue uma cenoura por pessoa, corte em pedaços, com uma faca! Adicione às lentilhas. Cozinhe por 10 minutos".

Comparada com essa aqui:

> "Por pessoa: 1 copo de lentilhas, meia cebola, um naco de aipo e uma cenoura."
Embeba por 12 horas, ferva por 2 horas em 4 copos de água (por pessoa). Pique e adicione os vegetais. Deixe cozinhar por mais 10 minutos.

A segunda é menor e mais fácil de interpretar. Ela confia no seu entendimento de algumas palavras mais relacionadas à cozinhar: "Embeber", "ferva", "pique" e, acho, "vegetais".

Quando programamos, se não pudermos utilizar as palavras que já existem criadas anteriormente, esperando por nós no dicionário, é fácil cair no padrão da primeira receita -- onde damos cada comando que o computador tem que realizar, um por um, cegos a um conceito de alto nível que eles expressam.

Tem que virar algo natural, quando programamos, perceber quando um conceito implora para ser abstraído num nova palavra.

## Abstraindo a travessia do array ##

Funções, como vimos anteriormente, são boas maneiras de criar abstrações. Mas algumas vezes elas caem por terra.

No capítulo anterior, esse tipo de `loop` apareceu várias vezes:

```
var array = [1, 2, 3];
for (var i = 0; i < array.length; i++) {
	var current = array[i];
	// faça alguma coisa com current
}
```

O que ele tem dizer é "para cada elemento do array, faça isso". Mas utiliza um jeito redundante que involve uma váriavel contadora, um checagem do tamanho do array e a declaração de uma variável extra para pegar o elemento atual. Deixando de lado a monstruosidade que é, ele também nos dá espaço para possíveis erros: reuso da váriavel `i`, escrever errado `lenght`, confundir as variáveis `i` e `current`, por aí vai...

Então, vamos abstrair isso numa função. Consegue pensar num jeito?

O problema é que, onde muitas funções apenas pegam alguns valores, combina-os e talvez retorna alguma coisa, esses laços `for` contém um pedaço de código que eles devem executar. É fácil escrever uma função que passa sobre um array e chama `console.log` em cada elemento:

```
function logEach(array) {
	for (var i = 0; i < array.length; i++)
	console.log(array[i]);
}
```

But what if we want to do something else than logging the elements? Since “doing something” can be represented as a function, and functions are also values, we can pass our action as a function value:

Mas e se quisermos fazer algo diferente de escrever os elementos? Desde que "fazendo alguma coisa" pode ser representado como uma função e funções são valores também, podemos passar nossa ação como um valor de função:

```
function forEach(array, action) {
	for (var i = 0; i < array.length; i++)
	action(array[i]);
}

forEach(["Wampeter", "Foma", "Granfalloon"], console.log);
// → Wampeter
// → Foma
// → Granfalloon
```

Normalmente você não passa uma função pré-definida para o `forEach`, mas cria uma função no local.

```
var numbers = [1, 2, 3, 4, 5], sum = 0;
forEach(numbers, function(number) {
	sum += number;
});
console.log(sum);
// → 15
```

Esse parece muito com um `loop` clássico, com o seu corpo escrito como no bloco acima. Exceto que agora o corpo está dentro da função, assim como dentro do parênteses da chamada `forEach`. É por isso que precisa ser fechado com chave, parêntese e ponto e vírgula.

Nesse padrão, podemos simplificar o nome da variável (`number`) pelo elemento atual como argumento da função, ao invés de simplesmente pegar manualmente o array.

Não precisamos escrever `forEach`. É disponível como método padrão em arrays (pegando a função como primeiro argumento, já que o array é providenciado como o alvo que o método age sobre).

To illustrate how helpful this is, remember this function from the previous chapter that contains two array-traversing loops.

Para ilustrar o quão útil isso é, lembre-se dessa função do capítulo anterior que continha dois array-travessias.

```
function gatherCorrelations(journal) {
	var phis = {};
	for (var entry = 0; entry < journal.length; ++entry) {
	var events = journal[entry].events;
	for (var i = 0; i < events.length; i++) {
		var event = events[i];
		if (!(event in phis))
		phis[event] = phi(tableFor(event, journal));
	}
	}
	return phis;
}
```

Trabalhando com `forEach` faz parecer levemente menor e bem menos confuso.

```
function gatherCorrelations(journal) {
	var phis = {};
	journal.forEach(function(entry) {
	entry.events.forEach(function(event) {
		if (!(event in phis))
		phis[event] = phi(tableFor(event, journal));
	});
	});
	return phis;
}
```

## Funções de ordem superior ##

O termo para funções que operão sobre funçoes (pegando-os como argumentos, ou retornando-os) são _funções de ordem superior_. Para programadores Javascript, que estão acostumados com funções sendo valores normais, não existe nada de mais no fato de que tais funções existem. O termo vem da matemática, onde a distinção entre funções e outros valores é levado um pouco mais a sério.

Funções de ordem superior permite-nos abstrair sobre ações, não apenas valores. Eles vem em várias formas. Você pode ter funções que criam uma nova função.

```
function greaterThan(n) {
	return function(m) { return m > n; };
}
var greaterThan10 = greaterThan(10);
console.log(greaterThan10(11));
// → true
```

Ou funções que mudam outra função.

```
function noisy(f) {
	return function(arg) {
	console.log("calling with", arg);
	var val = f(arg);
	console.log("called with", arg, "- got", val);
	return val;
	};
}
noisy(Boolean)(0);
// → calling with 0
// → called with 0 - got false
```

Ou ainda criar funções que implementão seus próprios tipos de fluxo de controle.

```
function unless(test, then) {
	if (!test) then();
}
function repeat(times, body) {
	for (var i = 0; i < times; i++) body(i);
}

repeat(3, function(n) {
	unless(n % 2, function() {
	console.log(n, "is even");
	});
});
// → 0 is even
// → 2 is even
```

As regras de "escopo léxico" que discutimos no Capítulo 3 trabalham a nosso favor quando usamos funções dessa maneira. No exemplo acima, a variável `n` é o parâmetro da função de fora. Por que funções internas vivem dentro do ambiente da que existe por fora, podendo usá-la. Ainda, os corpos de tais funções podem usar livremente as variáveis ao seu redor e ter um papel similar aos blocos `{}` usados em `loops` normais e expressões de condição (n.t.: `if` e `while`, por exemplo). Uma diferença importante é que variáveis declaradas dentro delas não acabam no ambiente da função de fora. E isso normalmente é algo bom.

## Passando argumentos ##

A função `noisy` acima, que circula seu argumento em outra função, tem uma séria deficiência.

```
function noisy(f) {
	return function(arg) {
	console.log("calling with", arg);
	var val = f(arg);
	console.log("called with", arg, "- got", val);
	return val;
	};
}
```

Se `f` recebe mais de um parâmetro, apenas o primeiro é passado para ele. Podemos adicionar um monte de outros argumentos para a função interna (`arg1`, `arg2`, por aí vai), e passar elas para `f`, mas não fica claro quantos são necessários. Também tiraria de `f` a informação em `arguments.length`. Desde que sempre passamos o mesmo tamanho de argumentos para ele, ele nunca saberia quantos argumentos realmente foi passado.

For these kinds of situations, JavaScript functions have an apply method. The apply method gets passed an array (or pseudo array) of arguments, and will call the function with those arguments.

Para esse tipo de situação, funções Javascript possuem um método `apply`. O método `apply` recebe um array (ou um pseudo array) de argumentos e vai chamar a função com esses argumentos.

```
function transparentWrapping(f) {
	return function() {
	return f.apply(null, arguments);
	};
}
``` 

Essa é particularmente uma função sem uso, mas mostra o padrão que estamos interessados, a função resultante vai passar todos os argumentos dados e apenas esses argumentos para `f`. Ela faz isso apenas passando seus próprios argumentos para `apply`. O primeiro argumento para `apply`, para o quaĺ passamos `null` aqui, pode ser usado para sumlar o método `call`. Mais sobre isso no próximo capítulo.

## Exemplo de dados ##

Funções de ordem superior que de alguma forma aplicão uma para os elementos de um array são bastante usadas em JavaScript. O método `forEach` é o mais primitivo como função. Existe um número de outras variações disponíveis como métodos em arrays. Para nos familiarizarmos com eles, vamos brincar com outro conjunto de dados.

Alguns anos atras, alguém pesquisou através de um monte de arquivos, procurando juntar um livro sobre a história do nome da minha família ("Haverbeke", literalmente "Riacho de aveia"). Eu esperava encontrar cavaleiros, piratas e alquimistas... Mas o livro acabou se tornando mais sobre fazendeiros belgas. Para o meu divertimento, eu extraí a informação dos meus ancestrais diretos e coloquei-os num formato para ser lido no computador. Vamos brincar com essa informação.

## JSON ##

O arquivo que eu criei parece mais ou menos assim:

```
[
	{"name": "Emma de Milliano", "sex": "f",
	 "born": 1876, "died": 1956,
	 "father": "Petrus de Milliano",
	 "mother": "Sophia van Damme"},
	{"name": "Carolus Haverbeke", "sex": "m",
	 "born": 1832, "died": 1905,
	 "father": "Carel Haverbeke",
	 "mother": "Maria van Brussel"},
	… and so on
]
```

Essa notação é muito similar com o jeito JavaScript de escrever arrays e objetos, com algumas restrições. Todos os nomes de propriedades devem ser em aspas e apenas conjuntos simples de dados (sem chamadas de funções, ou variáveis, ou qualquer coisa que involva algum cálculo) são permitidos.

Esse forma é chamado JSON, pronuncia-se "Diêisson", que significa JavaScript Object Notation (Notação de objetos JavaScript). É muito usado como forma de armazenamento de dados e formato comunicação na internet.

JavaScript provê duas funções, `JSON.stringify` e `JSON.parse`, que converte de e para esse formato.

```
var string = JSON.stringify({name: "X", born: 1980});
console.log(string);
// → {"name":"X","born":1980}
console.log(JSON.parse(string).born);
// → 1980
```

A variável `ANCESTRY_FILE`, disponível no sandbox(caixa de areia) para esse capítulo assim como arquivo para download no site, contêm o valor do meu arquivo JSON como string. Vamos decodificar e ver quantas pessoas contêm:

```
var ancestry = JSON.parse(ANCESTRY_FILE);
console.log(ancestry.length);
// → 39
```

## Filtrando um array ##

Uma função passada como um argumento para uma função de ordem superior não representa apenas uma ação que pode ser executada. Também retorna um valor, que podemos usar, como por exemplo, tomar uma decisão.

Para encontrar as pessoas nos dados dos ancestrais que eram jovens em 1924, a função a seguir pode ser útil. Ele filtra os elementos em um array que não passa um teste.

```
function filter(array, test) {
	var passed = [];
	for (var i = 0; i < array.length; i++) {
	if (test(array[i]))
		passed.push(array[i]);
	}
	return passed;
}

console.log(filter(ancestry, function(person) {
	return person.born > 1900 && person.born < 1925;
}));
// → [{name: "Philibert Haverbeke", …}, …]
```

Três pessoas no arquivo estavam vivas e jovens em 1924: meu vô, minha vó e minha tia-avó.

Como `forEach`, filtrar é um método padrão em arrays. O exemplo define a função apenas para mostrar o que ocorre internamente. De agora em diante, usaremos `ancestry.filter(...)`.

## Transformando com map ##

Digamos que possuímos um array de objetos pessoa, produzidos ao filtrar o array de ancestrais de alguma forma, mas queremos um array de nomes, que é mais fácil de ler.

A função `map` transforma um array aplicando a função para todos os seus elementos e constrói um novo array
através dos valores retornados. O novo array vai ter o mesmo tamanho array enviado, mas seu conteúdo vai ser "mapeado" para um novo formato através da função.

```
function map(array, transform) {
	var mapped = [];
	for (var i = 0; i < array.length; i++)
	mapped.push(transform(array[i]));
	return mapped;
}

var overNinety = ancestry.filter(function(person) {
	return person.died - person.born > 90;
});
console.log(map(overNinety, function(person) {
	return person.name;
}));
// → ["Clara Aernoudts", "Emile Haverbeke",
//    "Maria Haverbeke"]
```

Interessantemente, as pessoas que viveram mais de 90 anos são as mesmas pessoas que vimos antes. Pessoas que eram jovens nos anos 20, que por acaso eram a geração mais nova nos meus dados. Acredito que a medicina realmente avançou um bocado.

Como `forEach` e `filter`, `map`também um método padrão em arrays.

## Resumindo com reduce ##

Outro padrão de computação em arrays é calcular apenas um elemento dele. No nosso exemplo recorrente, a soma de nosso interválo de números, é um exemplo disso. Se quisermos encontrar a pessoa com a primeira data de nascimento no nossos dados, também seguiria esse padrão.

Os passos são: primeiro pegar um valor de início, então, para cada elemento no array, combine o elemento e o valor atual para criar um valor novo. O valor que vem depois do último elemento no array foi transformado no que gostaríamos.

A operação de ordem superior que representa esse padrão é chamado de `reduce` (ou as vezes `fold`). É um pouco menos direto que os exemplos anteriores, mas ainda sim não é difícil de entender.

```
function reduce(array, combine, start) {
	var current = start;
	for (var i = 0; i < array.length; i++)
	current = combine(current, array[i]);
	return current;
}

console.log(reduce([1, 2, 3, 4], function(a, b) {
	return a + b;
}, 0));
// → 10
```

A maneira padrão do método `reduce`, que é claro corresponde à essa função, tem uma conveniência adicional. Se o array conter apenas um elemento, você está dispensado do argumento inicial e o método irá pegar o primeiro elemento do array como valor inicial e começará a redução a partir do segundo.

Para usá-lo para encontrar meu ancestral mais velho, podemos escrever algo assim:

```
console.log(ancestry.reduce(function(min, cur) {
	if (cur.born < min.born) return cur;
	else return min;
}));
// → {name: "Pauwels van Haverbeke", born: 1535, …}
```

## Composição ##

Vamos voltar um momento e considerar como escreveríamos o exemplo anterior (encontrando a pessoa com a data de nascimento mais antiga) sem funções de ordem superior. O código não é muito pior:

```
var min = ancestry[0];
for (var i = 1; i < ancestry.length; i++) {
	var cur = ancestry[i];
	if (cur.born < min.born)
	min = cur;
}
console.log(min);
// → {name: "Pauwels van Haverbeke", born: 1535, …}
```

Existem mais variáveis sendo criadas e atribuídas, e o fim do código é 2 linhas maior, mas assim bem fácil de entender.

The higher-order function approach really starts to shine when you need to compose several concepts. As an example, let us write code that finds the average age for men and for women in the data set.

A abordagem através da função de ordem superior começa a brilhar quando necessita-se compôr vários conceitos. Por exemplo, vamos escrever um código que encontre a média de idade para homens e para mulheres array.

```
function average(array) {
	function plus(a, b) { return a + b; }
	return array.reduce(plus) / array.length;
}
function age(p) { return p.died - p.born; }
function male(p) { return p.sex == "m"; }
function female(p) { return p.sex == "f"; }

console.log(average(ancestry.filter(male).map(age)));
// → 61.67
console.log(average(ancestry.filter(female).map(age)));
// → 54.56
```

É um pouco bobo que temos que definir `plus`("mais" da matemática) como uma função. Operadores em JavaScript, diferente de funções, não são valores, então não podemos passar como argumento.

Ao invés de juntar toda a lógica requerida num `loop` gigante, podemos decompor em conceitos que estamos interessados (decidindo pelo sexo, idade cálculada, média de números) e aplicar um por um para conseguir o resultado que estavámos procurando.

Isso é fabuloso para escrever código limpo. Mas existe um nuvem no horizonte.

## O Custo ##

No mundo elegante de códigos e lindos arco-íris, vive um monstro mal e estraga-prazeres chamado "\_ineficiência\_".

Reduzir o processamento de um array numa sequência de passos claramente separados, que cada um faz algo com o array e produz um novo array é fácil de pensar. Mas construir todos esses arrays é de certa forma custoso.

Passar uma função para `forEach` e deixar que o método cuide da iteração para nós é conveniente e elegante. Porém chamadas de funções em JavaScript são custosas, comparadas com blocos simples de `loop`.

Então entram um monte de técnicas que ajudam a esclarecer o código. Elas adicionam camadas entre as coisas cruas que o computador está fazendo com os conceitos que estamos trabalhando e faz com que a máquina faça mais trabalho. Isso não é uma lei inescapável -- existem linguagems de programação que possuem um melhor suporte para construir aplicações sem adicionar ineficiências, e ainda em JavaScript, um programador experiente pode encontrar jeitos de escrever códigos relativamente abstratos que ainda são rápidos, porém é um problema frequente.

Felizmente, muitos computadores são extremamente rápidos e se você estiver processando uma coleção de dados, ou fazendo alguma coisa que acontece no tempo de escala humano (digamos, apenas uma vez, ou toda vez que o usuário clica um botão), então não importa se você escreveu aquela linda solução que leva meio milisegundo, ou a solução super optimizada que leva um décido de um milisegundo.

É útil saber de vez enquando quanto tempo leva um trecho de código leva para executar. Se vocês tem um `loop` dentro de um `loop` (diretamente, ou através de um `loop` externo chamando uma função que executa um `loop` interno), o código dentro do `loop` interno acabará rodando número x de vezes, onde N é o número de vezes que o `loop` de fora repete e M o número de vezes o `loop` interno repete. Se esse `loop` interno conter outro `loop` que realize P voltas, seu bloco rodará MxNxP vezes, e assim vai. Isso se soma. 

## O pai do pai do pai do pai do pai... ##

Meu avô, Philibert Haverbeke, está incluído nos dados do arquivo. Como exemplo final, eu quero saber quem é o meu mais antigo ancestral no arquivo (Pauwels van Haverbeke), e se possível, quanto DNA teoricamente compartilho com ele.

Primeiro, construí um objeto que faz que seja facil encontrar pessoas através do nome.

```
var byName = {};
ancestry.forEach(function(person) {
	byName[person.name] = person;
});

console.log(byName["Philibert Haverbeke"]);
// → {name: "Philibert Haverbeke", …}
```

Agora o problema não é totalmente simples como conseguir as propriedades dos pais e ir contando quantos levam até chegar a Pauwels. Existem vários casos na família onde três pessoas casaram com seus primos segundos (pequenos vilarejos tem essas coisas). Isso faz com que ramificações da família se reencontrem em certos lugares, o que significa que eu compartilho mais de 1/2G com essa pessoa (usando G como número para gerações, cada geração dividindo os genes em dois).

Uma maneira razoável de pensar nesse problema é colocar em termos similares ao algoritmo `reduce`. Uma família tem uma estrutura mais interessante do array plano. Uma estrutura que de fato sugere uma maneira de computar valores dele.

Dado uma pessoa, uma função que combina valores de dois pais de uma certa pessoa e um valor zero que é usado para pessoas desconhecidas, a função `reduceAncestors` calcula um valor da árvore da família.

```
function reduceAncestors(person, f, zero) {
	function reduce(person) {
	if (person == null) return zero;
	var father = byName[person.father];
	var mother = byName[person.mother];
	return f(person, reduce(father), reduce(mother));
	}
	return reduce(person);
}
```

A função interna (`reduce`) lida com apenas uma pessoa. Através da magica da recursividade, ela pode chamar a si mesma para lidar com o pai e com a mãe dessa pessoa. Os resultados, junto com o objeto da pessoa em si, são passados para `f`.

O pai e a mãe de algumas pessoas não estão no arquivo (obviamente, caso contrário incluiria um grande número de pessoas). Então ao procurar o pai ou a mãe e não encontrar um valor, `reduce` simplesmente retorna o valor zero que foi passado para `reduceAncestor`.

Podemos usar isso para calcular o quanto de DNA meu avô compartilhava com Pauwels van Haverbeke e dividir por quatro.

```js
function sharedDNA(person, fromFather, fromMother) {
  if (person.name == "Pauwels van Haverbeke")
	return 1;
  else
	return (fromFather + fromMother) / 2;
}
var ph = byName["Philibert Haverbeke"];
console.log(reduceAncestors(ph, sharedDNA, 0) / 4);
// → 0.00049
```

A pessoa com o nome Pauwels van Haverbeke obviamente compartilhava 100% de seu DNA com Pauwels van Haverbeke (não existem pessoas com mesmo nome no arquivo). Todas as outras pessoas compartilham a média de que seus pais possuem.