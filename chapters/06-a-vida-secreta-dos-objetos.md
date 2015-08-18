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
