# Guia Para Iniciantes Absolutos em Node.js

#### Artigo traduzido de *blog.modulus.io*. Confira o texto original [aqui](http://blog.modulus.io/absolute-beginners-guide-to-nodejs).

Não existe uma escassez de tutoriais para Node.js, mas a maioria deles cobrem usos e casos específicos, ou tópicos que somente aplicáveis se você já tiver um conhecimento prático do Node. Eu vejo vários comentários que se parecem com coisas do tipo: "Eu fiz o download do node, agora o que fazer?" Este tutorial responde esta questão e explica como iniciar bem do princípio.

## O que é Node.js?

Muitos iniciantes em Node tem a dúvida de o quê exatamente ele é, e a descrição em [nodejs.org](http://nodejs.org/) definitivamente não ajuda.

Uma coisa importante de se perceber é que o Node não é um servidor web. Por ele próprio, não se tem nada. Ele não funciona como o Apache. Não existe um arquivo de configuração onde você o aponta para seus arquivos html. Se você quer que o Node seja um servidor HTTP, você tem que escrever um servidor HTTP (com a ajuda das bibliotecas incluídas). O Node.js é somente outra forma de executar código em seu computador. Ele é simplesmente um *JavaScript runtime* (ambiente de execução de código JavaScript).