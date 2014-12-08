# Manipulando eventos

> Você tem o poder sobre sua mente e não sobre eventos externos. Perceba isso e você vai encontrar resistência.

> `Marcus Aurelius, Meditations`

Alguns programas funcionam com entradas direta do usuário, tais como a interação de mouse e teclado. O tempo e a ordem de tal entrada não pode ser previsto com antecedência. Isso requer uma abordagem diferente para controlar o fluxo do que utilizamos até agora.

## Os manipuladores de eventos

Imaginem uma interface onde a única maneira de descobrir se uma tecla está sendo pressionada é ler o estado atual dessa chave. Para ser capaz de reagir às pressões de teclas você teria que ler constantemente o estado da chave para pegá-lo antes que ele fique liberado novamente. Seria perigoso executar outros cálculos demoradas pois você pode perder uma tecla.

É assim que tal atributo foi tratado em máquinas primitivas. A um passo para o hardware o sistema operacional deve notificar qual a tecla pressionada e colocá-lo em uma fila. Um programa pode então, verificar periodicamente a fila para novos eventos e reagir para o que se encontra lá.

É claro que ele tem sempre de olhar para a fila, e executa-las muitas vezes, porque a qualquer momento entre a teclas que está sendo pressionado o programa vai perceber que o evento fará com que o software sinta-se que não esta tendo resposta. Esta abordagem é chamada de `polling`. A maioria dos programadores tenta evitar sempre que possível.

A melhor mecanismo para o sistema subjacente é dar ao nosso código a chance de reagir a eventos que ocorrerem. Os browsers podem fazerem isto por que nos permite registrar funções como manipuladores para eventos específicos.

````html
<p>Click this document to activate the handler.</p>
<script>
  addEventListener("click", function() {
    console.log("You clicked!");
  });
</script>
````

A função `addEventListener` registra seu segundo argumento a ser chamado sempre que o evento descrito por seu primeiro argumento ocorre.