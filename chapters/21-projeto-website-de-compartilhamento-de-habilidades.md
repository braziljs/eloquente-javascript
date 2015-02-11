## Projeto - Website de compartilhamento de habilidades

Uma reunião de compartilhamento de habilidades é um evento onde as pessoas com um interesse comum se juntam e dão pequenas apresentações informais sobre coisas que eles sabem. Em uma reunião de compartilhamento de habilidade de jardinagem alguém pode explicar como cultivar um Aipo. Ou em um grupo de compartilhamento de habilidades orientadas para a programação você poderia aparecer e dizer a todos sobre Node.js.

Tais meetups muitas vezes também chamados grupos de usuários quando eles estão falando sobre computadores. Isso é uma ótima maneira de aprofundar o seu horizonte e aprender sobre novos desenvolvimentos ou simplesmente reunir pessoas com interesses semelhantes. Muitas cidades grandes têm um meetup JavaScript. Eles são tipicamente livre para assistir e eu visitei uma que é amigável e acolhedora.

Neste último capítulo do projeto, o nosso objetivo é a criação de um site para gerenciar estas conversas dadas em um encontro de compartilhamento de habilidade. Imagine um pequeno grupo de pessoas que se encontra regularmente no escritório de um dos membros para falar sobre Monociclo. O problema é que quando um organizador de alguma reunião anterior se mudar para outra cidade, ninguém se apresentara para assumir esta tarefa. Queremos um sistema que permite que os participantes proponha e discuta as negociações entre si sem um organizador central.

![](http://i.imgur.com/2rIVEWv.png)

Assim como no capítulo anterior, o código neste capítulo é escrito em Node.js, e executá-lo diretamente em uma página HTML é improvável que funcione. O código completo para o projeto pode ser baixado [aqui](eloquentjavascript.net/code/skillsharing.zip).

#### Projeto

Há uma parte do servidor para este projeto escrito em Node.js e uma parte do cliente escrito para o browser. O servidor armazena os dados do sistema e fornece-o para o cliente. Ela também serve os arquivos HTML e JavaScript que implementam o sistema do lado do cliente.

O servidor mantém uma lista de conversas propostas para a próxima reunião e o cliente mostra esta lista. Cada palestra tem um nome do apresentador, um título, um resumo e uma lista de comentários associados. O cliente permite que os usuários proponha novas conversações(adicionando-os à lista), exclua as negociações, e comente sobre as negociações existentes. Sempre que o usuário faz tal mudança o cliente faz uma solicitação HTTP para informar para o servidor o que fazer.

![](http://eloquentjavascript.net/img/skillsharing.png)

O aplicativo será configurada para mostrar uma exibição em tempo real das atuais conversações propostas e seus comentários. Sempre que alguém apresentar uma nova conversa ou adiciona um comentário, todas as pessoas que têm a página aberta no navegador deve ver a mudança imediatamente. Isto coloca um pouco de um desafio, pois não há caminho para um servidor web abrir uma conexão com um cliente nem há uma boa maneira de saber o que os clientes está olhando atualmente no site.

Uma solução comum para este problema é chamado de `long polling`, que passa a ser uma das motivações para o projeto ser em Node.

#### Long polling

Para ser capaz de se comunicar imediatamente com um cliente que algo mudou precisamos de uma conexão com esses clientes. Desde navegadores não tradicionais, geralmente os dispositivos por trás bloqueiam de qualquer maneira tais conexões aceitas pelo cliente, toda essa ligação deve ser feita via servidor, o que não é muito prático.

Nós podemos mandar o cliente abrir a conexão e mantê-la de modo que o servidor possa usá-la para enviar informações quando for preciso.

Uma solicitação HTTP permite apenas um fluxo simples de informações, onde o cliente envia a solicitação e o servidor devolve uma única resposta. Há uma tecnologia chamada soquetes web, suportado pelos navegadores modernos o que torna possível abrir as ligações para a troca de dados arbitrária. É um pouco difícil usá-las corretamente.

Neste capítulo vamos utilizar uma técnica relativamente simples, `long polling`, onde os clientes continuamente pediram ao servidor para obter novas informações usando solicitações HTTP e o servidor simplesmente barrara sua resposta quando ele não tem nada de novo para relatar.

Enquanto o cliente torna-se constantemente um `long polling` aberto, ele ira receber informações do servidor imediatamente. Por exemplo, se Alice tem o nosso aplicativo de compartilhamento de habilidade aberta em seu navegador, o navegador terá feito um pedido de atualizações e estara a espera de uma resposta a esse pedido. Quando Bob submeter uma palestra sobre a `extrema Downhill Monociclo` o servidor vai notificar que Alice está esperando por atualizações e enviar essas informações sobre a nova conversa como uma resposta ao seu pedido pendente. Navegador de Alice receberá os dados e atualizara a tela para mostrar a conversa.

Para evitar que as conexões excedam o tempo limite(sendo anulado por causa de uma falta de atividade), podemos definir uma técnica que normalmente define um tempo máximo para cada pedido do `long polling`; após esse tempo o servidor irá responder de qualquer maneira, mesmo que ele não tem nada a relatar, e o cliente inicia um novo pedido. Reiniciar o pedido periodicamente torna a técnica mais robusta a qual permite aos clientes se recuperarem de falhas de conexão temporárias ou de problemas no servidor.

Um servidor que esta ocupado usando `long polling` pode ter milhares de pedidos em espera com conexões TCP em aberto. Node torna fácil de gerenciar muitas conexões sem criar uma thread separada de controle para cada uma, sendo assim uma boa opção para esse sistema.

