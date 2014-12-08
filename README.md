# [Eloquent Javascript](http://eloquentjavascript.com.br) por Marijn Haverbeke

[![Gitter](https://badges.gitter.im/Join Chat.svg)](https://gitter.im/randsonjs/eloquent-javascript?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge) [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/randsonjs/eloquent-javascript/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

Projeto que visa a tradução da segunda edição do livro Eloquent JavaScript por Marijn Haverbeke.

* [Artigo falando como está sendo o inicio do projeto](http://randsonjs.com/uma-boa-referencia/)

## Como isso funciona?

Nós usamos o [Jekyll](http://jekyllrb.com/), um gerador de site estático em Ruby para criar este site.

## Primeiros passos

1 - Instale o [Git](http://git-scm.com/downloads) e o [Ruby](https://www.ruby-lang.org/pt/downloads/), caso você ainda não tenha instalado.

2 - Depois de instalado as depedências, abra o terminal e instale o [Jekyll](http://jekyllrb.com) com os seguintes comandos.

```sh
$ gem install jekyll
```

3 - Agora clone o projeto.

```sh
$ git clone git@github.com:randsonjs/eloquent-javascript.git
```

4 - Navegue até a pasta do projeto

```sh
$ cd eloquent-javascript
```

5 - E finalmente rode:

```sh
$ jekyll server --watch
```

Agora você terá acesso ao website por `http://0.0.0.0:4000/` :D

## Estrutura de arquivos

A estrutura de arquivos do projetos é organizada da seguinte maneira:

```
.
|-- _includes
|-- _layouts
|-- _posts
|-- _config.yml
`-- index.html
```

### [_includes](https://github.com/randsonjs/eloquent-javascript/_includes)

São blocos de códigos usados para gerar a página inicial do site(index.html).

### [_layouts](https://github.com/randsonjs/eloquent-javascript/_layouts)

Aqui você encontrará os templates padrão usados pelo site.

### [_posts](https://github.com/randsonjs/eloquent-javascript/_posts)

Aqui você encontrará as listas de posts. Não estamos usando esta pasta, já que não precisamos de posts para este projeto. Veja no [guia de contribuição](./CONTRIBUTING.md) como ajudar com traduções ou revisões.

### [_config.yml](https://github.com/randsonjs/eloquent-javascript/_config.yml)

Aqui fica as configurações do site.

### [index.html](https://github.com/randsonjs/eloquent-javascript/index.html)

Este arquivo é a página principal, responsável por todo o resto do conteúdo.

_Mais informações sobre a estrutura de arquivos do jekyll veja [aqui](https://github.com/mojombo/jekyll/wiki/Usage)._

## Como participar do projeto?

### Seja um tradutor

Primeiro verifique quem está **traduzindo** o que. [Para isso confira essa página](https://github.com/ericdouglas/eloquente-javascript/issues).

Depois é só escolher um capitulo que não está sendo traduzido mandar bala!

### Seja um revisor

Primeiro verifique quem está **revisando** o que. [Para isso confira essa página](https://github.com/ericdouglas/eloquente-javascript/issues).

Depois é só escolher um capitulo que não está sendo revisado mandar bala!

### Reporte um erro

Caso encontre algum erro de tradução, por favor nos avise através das [issues](https://github.com/randsonjs/eloquent-javascript/issues).

### Contribuindo com código-fonte

1. Faça um fork!
2. Crie sua branch: `git checkout -b meu-novo-recurso`
3. Faça um commit de suas modificações: `git commit -am 'Adiciona mais recursos'`
4. Realize um push na sua branch: `git push origin meu-novo-recurso`
5. Realize um pull request :D

## Licença
[Licença MIT](./LICENSE) © Randson Oliveira
