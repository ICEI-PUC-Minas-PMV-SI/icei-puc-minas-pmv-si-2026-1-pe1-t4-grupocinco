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

Os ícones são utilizados para melhorar a navegação e tornar a interface mais intuitiva.

- 🐶 / 🐱 → identificação do tipo de animal
- ❤️ → favoritar pet
- 💬 → mensagens
- 👤 → perfil
- 📍 → localização
- 🔎 → filtros

Eles ajudam o usuário a entender rapidamente as funções do sistema.

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
