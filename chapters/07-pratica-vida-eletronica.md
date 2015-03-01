# Projeto - Vida eletrônica

> [...] A questão da máquinas poder pensar [...] é tão relevante quanto a questão dos submarinos poderem nadar.
>
> - Edsger Dijkstra, The Threats to Computing Science

Nos capítulo "Projeto", eu vou apresentar uma nova teoria por um breve momento e trabalhar através de um programa com você. A teoria é indispensável quando aprender a programar, mas deve ser acompanhada da leitura para entender os programas não triviais.

Nosso projeto neste capítulo é construir um ecossistema virtual, um mundo pequeno povoado com criaturas que se movem e luta pela sobrevivência.

## Definição

Para tornar esta tarefa gerenciável, vamos simplificar radicalmente o conceito de um mundo. Ou seja, um mundo será uma grade bidimensional onde cada entidade ocupa um quadrado da grade. Em cada turno os bichos todos tem a chance de tomar algumas medidas.

Utilizaremos o tempo e o espaço em unidades com um tamanho fixo: quadrados para o espaço e voltas para o tempo. É claro que as aproximações seram imprecisas. Mas nossa simulação pretende ser divertida, para que possamos livremente cortar esses cantos.

Podemos definir um mundo com um plano, uma matriz de strings que estabelece uma grade do mundo usando um personagem por metro quadrado.

```js
var plan = ["############################",
            "#      #    #      o      ##",
            "#                          #",
            "#          #####           #",
            "##         #   #    ##     #",
            "###           ##     #     #",
            "#           ###      #     #",
            "#   ####                   #",
            "#   ##       o             #",
            "# o  #         o       ### #",
            "#    #                     #",
            "############################"];
```

Os caracteres `"#"` representam as paredes e rochas, e os personagens de `"O"` representam os bichos . Os espaços, como você ja deve ter pensado, é o espaço vazio.

Um plano de matriz pode ser usada para criar um objecto de mundo. Tal objeto mantém o controle do tamanho e do conteúdo do mundo. Ele tem um método toString, que converte o mundo de volta para uma seqüência de impressão(similar ao plano que foi baseado) para que possamos ver o que está acontecendo lá dentro. O objeto do mundo também tem um método por sua vez que permite que todos os bichos podem darem uma volta e atualizar o mundo para refletir suas ações.