# Template padrão do site

O site LarCerto é uma rede social voltada para adoção de cães e gatos. O layout padrão foi desenvolvido utilizando HTML e CSS, garantindo consistência visual em todas as páginas, além de responsividade e uso de iconografia para facilitar a navegação.

O layout utiliza uma estrutura semântica em HTML com `<header>`, `<nav>`, `<main>`, `<section>` e `<footer>`, organizando o conteúdo de forma clara e acessível. O CSS é responsável pela estilização e organização visual, utilizando Flexbox para alinhamento de elementos, Grid para organização dos cards e Media Queries para garantir a responsividade em diferentes dispositivos como celulares, tablets e computadores.

Explique as guias de estilo utilizadas no seu projeto.

O projeto segue guias de estilo que garantem padronização e qualidade visual:

- Uso consistente de cores
- Tipografia padronizada
- Hierarquia visual (títulos, textos e botões)
- Espaçamento uniforme entre elementos
- Componentização com uso de cards
- Interface responsiva
- Uso de iconografia para melhorar a navegação

---

## Design

O layout do site foi projetado para ser simples, moderno e intuitivo.

- O logo "LarCerto" está localizado no canto superior esquerdo
- O menu principal fica no topo com as opções:
  - Início
  - Adotantes
  - Favoritos
  - Mensagens
  - Perfil

Os animais (cachorros e gatos) são exibidos em formato de cards contendo:

- Imagem do pet
- Nome
- Raça
- Idade
- Sexo
- Localização
- Botão de favorito (❤️)

O layout utiliza organização em grade (grid), com conteúdo centralizado e espaçamento uniforme, facilitando a navegação do usuário.

---

## Cores

A paleta de cores foi definida para transmitir acolhimento, confiança e cuidado com os animais.

- Laranja (#F97316): cor principal utilizada em botões e destaques
- Bege (#F5F5F4): fundo do site
- Branco (#FFFFFF): fundo dos cards
- Cinza (#6B7280): textos secundários
- Preto (#111827): texto principal

A paleta pode ser criada utilizando a ferramenta Adobe Color:
https://color.adobe.com/pt/create/color-wheel

---

## Tipografia

As fontes foram escolhidas para garantir boa leitura e organização visual.

- Título de página: Poppins / Arial (negrito e maior destaque)
- Título de seção: Poppins / Arial
- Rótulos de componentes: Roboto / Arial
- Corpo do texto: Roboto / Arial

A tipografia é utilizada para criar hierarquia visual, destacar informações importantes e facilitar a leitura do usuário.

---

## Iconografia

1. Navegação Principal (Rodapé)
Ícone Tela de Início: Disponível em: https://www.flaticon.com/br/icon-font-gratis/casa_3917014. 
Representa o acesso à página inicial (Home) na barra de navegação superior.

Ícone Favoritos: Disponível em: https://www.flaticon.com/br/icon-font-gratis/coracao_3916585. 
Utilizado na barra de navegação para acessar itens salvos e no perfil dos animais para a função "favoritar".

Ícone Pets: Disponível em: https://www.flaticon.com/br/icon-font-gratis/comercial_3914353.
Empregado na barra de navegação para simbolizar a seção de animais disponíveis.

Ícone Mensagem: Disponível em: https://www.flaticon.com/br/icon-font-gratis/baliza_9291594. 
Representa a caixa de entrada no rodapé e o redirecionamento para o chat nos perfis de adotantes e animais.

Ícone Perfil: Disponível em: https://www.flaticon.com/br/icon-font-gratis/do-utilizador_3917688. 
Indica o acesso à área de informações pessoais do usuário na barra de navegação.

2. Redes Sociais e Compartilhamento
Ícone Facebook: Disponível em: https://www.flaticon.com/br/icon-font-gratis/facebook_6422199. 
Redireciona o usuário para a página oficial da plataforma no Facebook.

Ícone Instagram: Disponível em: https://www.flaticon.com/br/icon-font-gratis/instagram_6422200. 
Redireciona o usuário para o perfil oficial da plataforma no Instagram.

Ícone Twitter: Disponível em: https://www.flaticon.com/br/icon-font-gratis/twitter_6422210. 
Redireciona o usuário para o perfil oficial da plataforma no Twitter.

Ícone Compartilhar: Disponível em: https://www.flaticon.com/br/icon-font-gratis/compartilhar_3917574. 
Permite o compartilhamento de perfis e conteúdos com outros usuários.

3. Funcionalidades e Edição
Ícone Editar: Disponível em: https://www.flaticon.com/br/icon-font-gratis/lapis_3917376. 
Utilizado para a edição de informações existentes ou adição de novos conteúdos nos perfis.

Ícone Gravar Áudio: Disponível em: https://www.flaticon.com/br/icon-font-gratis/microfone-circular_10742083. 
Localizado na interface de mensagens para a gravação de conteúdos em áudio.

Ícone Configurações: Disponível em: https://www.flaticon.com/br/icon-font-gratis/definicoes_3917035. 
Redireciona o usuário para a interface de ajustes de segurança e alteração de senha.

Ícone Notificações: Disponível em: https://www.flaticon.com/br/icon-font-gratis/sino_3917270. 
Destinado ao gerenciamento e configuração de alertas do sistema.

4. Informações de Perfil e Metadados
Ícone Localização: Disponível em: https://www.flaticon.com/br/icon-font-gratis/marcador_3916882. 
Identifica visualmente os campos de endereço e geolocalização.

Ícone Tempo/Idade: Disponível em: https://www.flaticon.com/br/icon-font-gratis/calendario_3917262. 
Indica a idade do animal ou o tempo transcorrido desde a publicação de um conteúdo.

Ícone Trabalho: Disponível em: https://www.flaticon.com/br/icon-font-gratis/pasta_3916698. 
Identifica a ocupação profissional informada no perfil do usuário.
---

## Estilos CSS

Abaixo estão exemplos dos estilos utilizados no projeto:

```css
body {
  font-family: Arial, sans-serif;
  background-color: #F5F5F4;
  color: #111827;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #F97316;
  color: white;
}

nav a {
  margin-left: 15px;
  text-decoration: none;
  color: white;
}

.card {
  background-color: #FFFFFF;
  border-radius: 10px;
  padding: 10px;
  width: 250px;
}

.card img {
  width: 100%;
  border-radius: 10px;
}

button {
  background-color: #F97316;
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}

@media (max-width: 768px) {
  .container {
    flex-direction: column;
    align-items: center;
  }
}
