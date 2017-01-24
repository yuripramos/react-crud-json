# React-Crud-Conta-azul

Esse Projeto foi concebido para um desafio proposto pela conta azul durante seu processo seletivo.

O seu uso foi feito de acordo com as especificações com algumas ressalvas que serão explicadas na parte sobre o roadmap. 

Aproveitei esse desafio para criar um webapp totalmente feito em react, sem redux e claro, sem jQuery. Devido ao email ter caído na caixa de spam e eu somente ter visto (por sorte rs) no sábado houve pouco tempo hábil entao algumas micro-features ficaram devendo e não houve review do código.

## Instalação

A instalação do ambiente de dev se dá pelo npm e a administração das dependências fiz questão de adotar o yarn devido a sua performance.

logo, 

1. Entre na folder do projeto, e dê `npm install`
2. Rode o webpack dev server, eu já criei um script para facilitar a execução logo `npm run dev`
3. Utilize a aplicação na porta default setada (normalmente 8080)


## Uso em produção ( deploy contínuo)

http://58876a0ad6865d5c694f29fb.minister-chipmunk-88805.netlify.com (link temporário enquanto não é feito o deploy via heroku)


## Roadmap

Release 0.0.1 (atual) - Cadastrando novos carros e seguindo todos os requisitos funcionais necessários, exceto pelo replace do link pela palavra imagem seguida de seu href.

Release 0.0.2 - Habilitando localstorage com um timeout de 8h para salvar os dados cadastrados.

Release 0.0.3 - Fazer a carga inicial extraindo os dados de uma API.

Release 0.0.4 - Inserir transitions e interatividade, melhora na UIX.

Release 0.0.5 - Inserir Mocha.js para testes 

## Creditos

Yuri Pereira Ramos 

## Licença

MIT