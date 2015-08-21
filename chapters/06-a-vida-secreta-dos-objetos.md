# A vida secreta dos objetos
> "O problema com as linguagens orientadas a objeto é que elas têm tudo
implícito no ambiente que elas carregam consigo. Você queria banana, mas o que
você teve foi um gorila segurando a banana e toda a floresta."
> `Joe Armstrong, entrevistado em Coders at Work``

Quando um programador diz "objeto", isso é um termo carregado. Na minha
profissão, objetos são a maneira de viver, o sujeito das guerras santas, e um
jargão apaixonante que ainda não perdeu o seu poder.

Para um estrangeiro, isso provavelmente é um pouco confuso. Vamos começar com
uma rápida história dos objetos como constrtutores da programação.

## História
Essa história, como a maioria das histórias de programação, começa com um
problema de complexidade. A teoria é de que a complexidade pode ser
administrada separando-a em pequenos compartimentos isolados um do outro. Esses
compartimentos acabaram ganhando o nome de _objetos_.

Um objeto é um escudo duro que esconde a complexidade grudenta dentro dele e nos
apresenta pequenos conectores (como métodos) que apresentam uma interface
para utilizarmos o objeto. A ideia é que a interface seja relativamente simples
e toda as coisas complexas que vão dentro do objeto possam ser ignoradas
enquanto se trabalha com ele.

![Uma interface simples pode esconder muita complexidade.](../img/object.jpg)

Como exemplo, você pode imaginar um objeto que disponibiliza uma interface para
uma determinada área na sua tela. Ele disponibiliza uma maneira de desenhar
formas ou textos nessa área, mas esconde todos os detalhes de como essas formas
são convertidos para os pixels que compõem a tela. Você teria um conjunto de
métodos-`desenharCirculo`, por exemplo- e essas serão as únicas coisas que
você precisa saber pra usar tal objeto.

Essas ideias foram trabalhadas inicialmente por volta dos anos 70 e 80 e, nos
anos 90, foram trazidas a tona por uma enorme onda _hype_-a revolução da
programação orientada a objetos. De repente, existia uma enorme tribo de pessoas
declarando que objetos eram a maneira correta de programar-e que qualquer coisa
que não envolvesse objetos era uma loucura ultrapassada.

Esse tipo de fanatismo produz um monte de bobagem impraticável, e desde então
uma espécie de contra-revolução vem acontecendo. Em alguns círculos de
desenvolvedores, os objetos têm uma péssima reputação hoje em dia.

Eu prefiro olhar para esse problema de um ângulo prático, e não ideológico.
Existem vários conceitos úteis, dentre eles um dos mais importantes é o
_encapsulamento_ (distinguir complexidade interna e interface externa), que a
cultura orientada a objetos tem popularizado. Vamos ver esses conceitos, pois
eles valem a pena.

Esse capítulo descreve uma pegada mais excêntrica do JavaScript com foco nos
objetos e na forma como eles se relacionam com algumas técnicas clássicas de
orientação a objetos.

## Métodos
Métodos são propriedades simples que comportam valores de funções. Isso é um
método simples:

```javascript
var coelho = {};
coelho.diz = function(linha) {
  console.log("O coelho diz '" + linha + "'");
};

coelho.diz("Estou vivo.");
// → O coelho diz 'Estou vivo.'
```

Normalmente um método precisa fazer alguma coisa com o objeto pelo qual ele
foi chamado. Quando uma função é chamada como um método-visualizada como uma
propriedade e imediatamente chamada, como em `objeto.metodo()`-a variável
especial `this` no seu conteúdo vai apontar para o objeto pelo qual foi chamada.

```javascript
function speak(line) {
  console.log("The " + this.type + " rabbit says '" +
              line + "'");
}
var whiteRabbit = {type: "white", speak: speak};
var fatRabbit = {type: "fat", speak: speak};

whiteRabbit.speak("Oh my ears and whiskers, " +
                  "how late it's getting!");
// → The white rabbit says 'Oh my ears and whiskers, how
//   late it's getting!'
fatRabbit.speak("I could sure use a carrot right now.");
// → The fat rabbit says 'I could sure use a carrot
//   right now.'
```

O código acima usa a palavra chava `this` para dar a saída do tipo de coelho que
está falando. Lembrando que ambos os métodos `apply` e `bind` podem user o
primeiro argumento para simular chamadas de métodos. Esse primeiro argumento, é
na verdade, usado para passar um valor ao `this`.

Existe um método parecido ao `apply` chamado `call`. Ele também chama a função
na qual ele é um método e aceita argumentos normalmente, ao invés de um array.
Assim como `apply` e `bind`, o `call` pode ser passado com um valor específico
no `this`.

```javascript
speak.apply(fatRabbit, ["Burp!"]);
// → The fat rabbit says 'Burp!'
speak.call({type: "old"}, "Oh my.");
// → The old rabbit says 'Oh my.'
```

## Prototypes
Observe com atenção.

```javascript
var empty = {};
console.log(empty.toString);
// → function toString(){…}
console.log(empty.toString());
// → [object Object]
```

Eu acabei de sacar uma propriedade de um objeto vazio. Mágica!

Só que não. Eu venho ocultando algumas informações sobre como os objetos
funcionam no JavaScript. Além de sua lista de propriedades, quase todos os
objetos também possuem um _protótipo_, ou _prototype_. Um _prototype_ é outro objeto que é usado
como fonte de _fallback_ para as propriedades. Quando um objeto recebe uma
chamada em uma propriedade que ele não possui, seu _prototype_ designado para
aquela propriedade será buscado, e então o _prototype_ daquele _prototype_ e
assim por diante.

Então quem é o _prototype_ de um objeto vazio? É o ancestral de todos os
_prototypes_, a entidade por trás de quase todos os objetos, `Object.prototype`.

```javascript
console.log(Object.getPrototypeOf({}) ==
            Object.prototype);
// → true
console.log(Object.getPrototypeOf(Object.prototype));
// → null
```

Assim como você poderia prever, a função `Object.getPrototypeOf` retorna o
_prototype_ de um objeto.


## Definindo uma tabela

Eu vou trabalhar sobre um exemplo ou pouco mais envolvido na tentativa de dar a você uma melhor ideia de polimorfismo, assim como de programação orientada a objetos em geral. O projeto é este: nós vamos escrever um programa que, dado um array de arrays de células de uma tabela, cria uma string que contém uma tabela bem formatada - significando que colunas são retas e linhas estão alinhadas. Algo dessa forma:

```
name         height country
------------ ------ -------------
Kilimanjaro    5895 Tanzania
Everest        8848 Nepal
Mount Fuji     3776 Japan
Mont Blanc     4808 Italy/France
Vaalserberg     323 Netherlands
Denali         6168 United States
Popocatepetl   5465 Mexico
```

A forma que nosso sistema de construir tabelas vai funcionar é que a função construtora vai perguntar para cada célula quanto de altura e largura ela vai querer ter e então usar essa informação para determinar a largura das colunas e a altura das linhas. A função construtora vai então pedir para as células se desenharem no tamanho correto e montar o resultado dentro de uma string.

http://eloquentjavascript.net/06_object.html#p_AbogVAH0Wj
