# Eloquente JavaScript

### 2ª edição

Uma moderna introdução ao JavaScript, programação e maravilhas digitais.

[[nova capa aqui]]

### Escrito por **Marijn Haverbeke**

Traduzido por **[Eric Oliveira](https://github.com/eoop/eo_op)**

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

![Mysterios Computar](http://eloquentjavascript.net/2nd_edition/preview/img/mysterious-computer.jpg)

Interfaces gráficas tendem a ser mais fáceis descobrir que linguagens - detectar um botão é mais rápido do que aprender uma gramática. Por essa razão, eles se tornaram a forma dominante de interagir com sistemas orientados ao consumidor. Compare com os telefones atuais, onde você pode realizar todo tipo de tarefa tocando e passando os elementos que aparecem na tela, com o *Commodore 64* de 1982, o aparelho que me introduziu a computação, onde tudo que você recebia era um cursor piscando, e você conseguia isto digitando comandos.

Obviamente, o telefone *touchscreen* é mais acessível, e é inteiramente apropriado que esses dispositivos utilizem uma interface gráfica. Mas as interfaces baseadas em linguagens têm outra vantagem - uma vez que você aprenda esta linguagem, ela tende a ser mais expressiva, tornando mais fácil compor a funcionalidade fornecida pelo sistema de novas maneiras, e até mesmo criando seus próprios blocos de construção.

Com o *Commodore 64*, quase todas as tarefas no sistema eram realizadas dando comandos embutidos na linguagem da máquina (um dialeto da linguagem de programação BASIC). Isto permitia aos usuários gradualmente progredir de simplesmente usar o computador (carregando programas) para de fato programá-los. Você estava *dentro* de um ambiente de programação desde o início, em vez de ter que procurar ativamente por um.

Isto foi perdido pela mudança para as interfaces gráficas de usuário. Mas as interfaces baseadas em linguagem, na forma de linguagens de programação, continuam aqui, em cada máquina, em grande parte escondida do usuário comum. Uma tal linguagem, JavaScript, está disponível em quase todos os dispositivos de consumidores como parte de um navegador web.

Este livro pretende torná-lo familiar com esta linguagem o suficiente para que você seja capaz de fazer com o computador o que você quiser.

# Na Programação

> Eu não esclareço os que não estão prontos para aprender, nem desperto aqueles que não estão ansiosos para dar uma explicação a si próprios. Se eu apresentei um canto da praça, e eles não podem voltar para mim com os outros três, eu não deveria passar por estes pontos novamentes. **Confúcio**

Antes de explicar JavaScript, eu também quero introduzir os princípios básicos de programação. Programação, ao que parece, é difícil. As regras fundamentais são claras e simples. Mas programas, criados em cima destas regras básicas, tendem a tornar-se complexos o suficiente para introduzir suas próprias regras e complexidades. Você está construindo seu próprio labirinto, e pode simplesmente perder-se nele.

Para tirar algum proveito deste livro, mais do que apenas uma leitura passiva é necessário. Trate de ficar atento, faça um esforço para entender o exemplo de código, e somente continue quando você estiver razoavelmente seguro que você entendeu o material que veio antes.

> O programador de computadores é um criador de universos no qual ele é o único responsável. Universos de complexidade virtualmente ilimitada podem ser criados sob a forma de programas de computador. **Joseph Weizenbaum, Computer Power and Human Reason**

marcador: http://eloquentjavascript.net/2nd_edition/preview/00_intro.html#p_mDbd/yWUsd
