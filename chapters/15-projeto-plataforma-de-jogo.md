## Plataforma de jogo

> Toda realidade é um jogo.

> `Iain Banks, The Player of Games`

Meu fascínio inicial com computadores como o de muitas crianças originou-se com jogos. Fui convocado para o pequeno mundo simulado por computador que eu poderia manipular as histórias(mais ou menos) que iam se desenrolando-se, mas suponho por causa da maneira que eu poderia projetar a minha imaginação para eles do que pelas possibilidades que eles realmente tenha sido oferecido.

Eu não desejo uma carreira na programação com jogos a ninguém. Assim como a indústria da música a discrepância entre os muitos jovens ansiosos que querem trabalhar nela e a demanda real para essas pessoas cria um ambiente não muito saudável. Mas escrever jogos para se divertir é muito legal.

?????????
Este capítulo vai falar sobre da implementação de um jogo de plataforma simples. Jogos de Plataforma(ou jogos de "saltar e correr") são os jogos que esperam o jogador para mover uma figura através de um mundo, que muitas vezes é bidimensional e visto de lado , e fazer muitas saltar para e sobre as coisas.

#### O jogo

Nosso jogo será mais ou menos baseado em azul escuro por Thomas Palef. Eu escolhi este jogo porque é divertido e minimalista e porque pode ser construído sem muito código. Observe:

![image](http://i.imgur.com/JNqX4Y0.png)

A caixa escura representa o jogador cuja a tarefa é coletar as caixas amarelas(moedas) evitando o material vermelho(lava). Um nível é concluído quando todas as moedas forem recolhidos.

O jogador pode andar por aí com as setas do teclado para movimentar para esquerda, para a direita ou pular com a seta para cima. `Jumping` é uma especialidade deste personagem do jogo. Ela pode atingir várias vezes sua própria altura e é capaz de mudar de direção em pleno ar. Isto pode não ser inteiramente realista mas ajuda a dar ao jogador a sensação de estar no controle direto do avatar na tela.

O jogo consiste em um fundo fixo como uma grade e com os elementos que se deslocam sobreposta ao fundo. Cada campo na grade pode estar vazio, sólido ou ser uma lava. Os elementos móveis são os jogadores, moedas e alguns pedaços de lava. Ao contrário da simulação de vida artificial a partir do Capítulo 7 as posições destes elementos não são limitados à rede de suas coordenadas e pode ser fracionada permitindo movimento suave.

## A tecnologia

Nós vamos usar o DOM e o navegador para exibir o jogo e iremos ler a entrada do usuário por manipulação de eventos de tecla.

O código de triagem e relacionadas com o teclado é apenas uma pequena parte do trabalho que precisamos fazer para construir este jogo. A parte do desenho é simples uma vez que tudo parece colorido: criamos elementos no DOM e usamos `styling` para dar-lhes uma cor de fundo, tamanho e posição.

Podemos representar o fundo como uma tabela uma vez que é uma grade imutável de quadrados. Os elementos de movimento livre pode ser coberto em cima disso utilizando-se de posicionamentos absolutos.

Em jogos e outros programas que têm que animar gráficos e responder à entrada do usuário sem demora notável a eficiência é importante. Embora o DOM não foi originalmente projetado para gráficos de alto desempenho mas é o melhor que podemos esperar. Você viu algumas animações no capítulo 13. Em uma máquina moderna um jogo simples como este tem um bom desempenho mesmo se não estivermos pensando sobre otimização.

No próximo capítulo vamos explorar uma outra tecnologia de navegador a tag `<canvas>` o que proporciona uma forma mais tradicional para desenhar gráficos trabalhando em termos de formas e pixels em vez de elementos no DOM.