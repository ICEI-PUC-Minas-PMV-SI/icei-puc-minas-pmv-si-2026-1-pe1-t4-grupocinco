# Especificações do Projeto

## Personas
Perfis de Usuários - Perfil de quem irá acessar a aplicação

|Doador  | Descrição  | 
|--------|------------|
|Nome|Helena Soares|  
|Idade| 34 anos|
|Endereço|Residente em Jardim América, BH|
|Detalhes| Helena mora em BH sozinha à muitos anos, natural de rio acima, possui uma excelente relação com seu fiel escudeiro Beto, um cachorro vira lata de porte médio. Porém Helena passa por uma grave crise financeira, necessitando voltar à sua cidade natal, onde não terá os meios necessários para cuidar do leal Beto. Ela se sente culpada e não éseu desejo abandonar o cão. Ela se registra no site e busca alguém tranquilo que possa cuidar bem de sua criação.|

|Adotante  | Descrição  | 
|--------|------------|
|Nome|Marcos Almeida|  
|Idade| 26 anos|
|Endereço|Residente em Barreiro , BH|
|Detalhes| Marcos é um jovem trabalhador, mora com sua mãe em uma casa com quintal. Gosta muito de animais e busca companhia para seus dias.Possui renda fixa e o desejo ardente por adotar um cachorro, logo se cadastrou no site e busca um cão de porte médio.|

|Adotante  | Descrição  | 
|--------|------------|
|Nome|Ludmilla Lara|  
|Idade| 51 anos|
|Endereço|Residente em Buritis, BH|
|Detalhes| Ludmilla é uma programadora que mora em um apartamento sozinha, tem profunda admiração pela lealdade dos cães e após o falecimento de sua esposa busca um cachorro pequeno para lhe acompanhar.|

Se aprovado, o perfil terá acesso à uma rede social de adoção onde tanto o adotante quanto o doador trocarão contatos por compatibilidade previamente analisada.


## Histórias de Usuários
|Eu como    | ...Quero/Desejo que... | ...Para... | 
|------|-----------------------------------------|----| 
|Doador| Quero criar uma conta | Para acessar a plataforma.|  
|Doador| Quero cadastrar pets  | Para serem escolhidos. | 
|Doador| Quero gerenciar pets  | Para controlar quais foram e não foram adotados. | 
|Doador| Desejo receber candidatos  |Para poder avaliá-los.| 
|Doador| Desejo avaliar adotantes  | Para decidir qual deles é o mais adequado para o pet. | 
|Doador| Quero aprovar a adoção   | Para encerrar o processo deescolha do tutor. | 
|Adotante| Quero criar uma conta   | Para acessar a plataforma.| 
|Adotante| Desejo visualizar pets disponíveis  | Para poder ler as informações de cada um. | 
|Adotante|  Desejo filtrar pets  | Para restringir os pets que melhor atendem à minha realidade. | 
|Adotante|  Quero me candidatar à adoção  | Para poder ficar com um pet. | 
|Adotante| Desejo acompanhar o status da candidatura   | Para saber se serei selecionado como tutor do pet escolhido. | 

A referência utilizada nesta parte foi (SANTOS, 2017).


## Requisitos

Com base nas informações apresentadas, o projeto irá conectar ONGs e adotantes para
facilitar o processo de adoção. Para isso, o site utilizará diversas ferramentas para melhorar
a experiência do usuário, como por exemplo a criação de uma conta e descrição detalhada
dos pets. Com isso, a plataforma será dinâmica e de fácil uso, para atender às
necessidades do usuário, (CODIFICAR, s.d.).

### Requisitos Funcionais

|ID    | Descrição do Requisito  | Prioridade | 
|------|-----------------------------------------|----| 
|RF-001| O sistema deve permitir o cadastro de doadores e adotantes na plataforma com informações como nome, e-mail, telefone,endereço e senha. | Alta |  
|RF-002| O sistema deve permitir que doadores e adotantes cadastrados realizem login na plataforma utilizando e-mail e senha.   | Alta | 
|RF-003| O sistema deve permitir que doadores cadastrem pets disponíveis para adoção informando características como nome, espécie, raça, idade, porte, vacinas, comportamento e fotos.   | Alta | 
|RF-004| O sistema deve permitir que doadores gerenciem (editar, remover, visualizar) as informações de pets cadastrados.   | Média | 
|RF-005| O sistema deve permitir que adotantes visualizem os pets disponíveis para adoção.   | Alta | 
|RF-006| O sistema deve permitir que adotantes filtrem pets por critérios como doador, espécie, idade, porte ou localização.   | Média | 
|RF-007| O sistema deve permitir que adotantes visualizem os detalhes completos de um pet, incluindo descrição e fotos.  | Alta | 
|RF-008| O sistema deve permitir que adotantes enviem candidatura para adoção de um pet.   | Alta | 
|RF-009| O sistema deve disponibilizar um formulário de candidatura solicitando informações adicionais ao adotante, como tipo de moradia e experiência com animais.  | Alta | 
|RF-010| O sistema deve permitir que doadores gerenciem (visualizar, aceitar, rejeitar, etc) o perfil completo do candidato interessado na adoção.  | Média | 
|RF-011| O sistema deve atualizar o status da candidatura (pendente, aprovada ou rejeitada).  | Alta | 
|RF-012| O sistema deve notificar o doador quando um novo candidato enviar uma solicitação de adoção.  | Média | 
|RF-013| O sistema deve notificar o adotante quando sua candidatura for analisada pelo doador.   | Média | 
|RF-014| O sistema deve permitir que adotantes visualizem o histórico de suas candidaturas enviadas.   | Baixa | 
|RF-015| O sistema deve permitir que doadores visualizem o histórico de adoções realizadas.  | Baixa | 


### Requisitos não Funcionais
|ID     | Descrição do Requisito  | Prioridade | 
|-------|-----------------------------------------|----| 
|RNF-001| O sistema deve possuir menus claros e navegação acessível. | Média |  
|RNF-002| As informações dos cadastros devem ser armazenadas de forma consistente e sem perdas. | Alta |  
|RNF-003| O sistema deve funcionar um múltiplas plataformas. | Média |  
|RNF-004| O sistema tem que ser capaz de armazenar de forma segura as informações dos usuários. | Alta |  
|RNF-005| O sistema tem que ter disponibilidade 24h. | Média |  
|RNF-006| O sistema deve suportar no mínimo 500 usuários simultâneos sem degradação perceptível de desempenho. | Alta |  

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |
|02| Não pode ser desenvolvido um módulo de backend        |

