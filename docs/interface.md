
# Projeto de Interface

Visão geral da interação do usuário pelas telas do sistema e protótipo interativo das telas com as funcionalidades que fazem parte do sistema (wireframes).

 Apresente as principais interfaces da plataforma. Discuta como ela foi elaborada de forma a atender os requisitos funcionais, não funcionais e histórias de usuário abordados nas <a href="2-Especificação do Projeto.md"> Documentação de Especificação</a>.

## User Flow

![Exemplo de UserFlow](img/userflow.jpg)

Fluxo de usuário (User Flow) é uma técnica que permite ao desenvolvedor mapear todo fluxo de telas do site ou app. Essa técnica funciona para alinhar os caminhos e as possíveis ações que o usuário pode fazer junto com os membros de sua equipe.

> **Links Úteis**:
> - [User Flow: O Quê É e Como Fazer?](https://medium.com/7bits/fluxo-de-usu%C3%A1rio-user-flow-o-que-%C3%A9-como-fazer-79d965872534)
> - [User Flow vs Site Maps](http://designr.com.br/sitemap-e-user-flow-quais-as-diferencas-e-quando-usar-cada-um/)
> - [Top 25 User Flow Tools & Templates for Smooth](https://www.mockplus.com/blog/post/user-flow-tools)


## Wireframes

 
<img width="1408" height="768" alt="Image" src="https://github.com/user-attachments/assets/5cea47da-9494-42f6-84c9-477a9a201fd1" />

Esta interface apresenta os animais disponíveis para adoção, podendo ser acessada por meio do botão de destaque na página anterior ou através da opção "Pets" no menu superior. A tela dispõe de um menu lateral destinado à aplicação de filtros, visando otimizar a busca. Na seção superior, uma barra de pesquisa permite a localização de animais por características específicas, tais como raça e porte. Os botões de autenticação (login) e cadastro permanecem visíveis; contudo, o acesso às funcionalidades detalhadas do sistema exige que o usuário realize o login previamente.
 
<img width="1347" height="727" alt="Image" src="https://github.com/user-attachments/assets/c77b23a2-6225-424b-af52-946908b52527" />

O redirecionamento para esta interface ocorre ao selecionar os botõe "Login/Cadastro", presente nas telas anteriores, ou ao tentar acessar seções restritas que não correspondam à página inicial ou à listagem de animais. A tela dispõe de campos de entrada para a inserção de credenciais (login e senha), além de permitir a seleção do perfil de acesso: doador ou adotante. Na seção inferior, encontram-se dois comandos distintos: o botão de confirmação para usuários já cadastrados e o botão de registro, que direciona o indivíduo a uma nova interface específica para a realização do cadastro no sistema.

<img width="825" height="750" alt="Image" src="https://github.com/user-attachments/assets/023bde26-6749-40ea-a9f6-d6c9720d6310" />

Esta interface é destinada ao registro de novos usuários, sendo responsável pela coleta de informações cadastrais iniciais. O preenchimento destes dados é requisito fundamental para a criação da conta no sistema. Ressalta-se que a personalização detalhada e a edição de informações adicionais devem ser realizadas posteriormente, por meio do acesso à seção específica de edição de perfil.

<img width="825" height="750" alt="Image" src="https://github.com/user-attachments/assets/e84d32bf-928d-4b35-a2ec-5d8f99ce9919" />

Esta interface apresenta o perfil detalhado do animal, fornecendo informações sobre suas características, galeria de imagens, localização e dados referentes à autoria e data da publicação. A tela disponibiliza três funcionalidades distintas: a opção de "favoritar", para salvar o perfil; a função de compartilhamento; e o botão de interesse. Este último permite o envio de uma mensagem direta ao atual responsável, formalizando a intenção de adotar o animal.

<img width="1052" height="1152" alt="Image" src="https://github.com/user-attachments/assets/83f006a9-ff78-45e8-b256-370f6336b902" />

Esta interface é acessada após a autenticação sob o perfil de doador, sendo destinada à criação e gestão do animal cadastrado para adoção. A tela apresenta um comando de compartilhamento (identificado pelo ícone de conexão tripla) e um botão de edição(representado por um ícone de lápis) que possibilita a alteração das informações do perfil e por ultimo disponibiliza-se o botão "Interessados" que, ao ser acionado, redireciona o usuário à listagem de indivíduos que manifestaram intenção de adotar o animal.

<img width="1052" height="1152" alt="Image" src="https://github.com/user-attachments/assets/57b1f10c-ebc8-47cd-9efc-fb9176d64c43" />

Esta interface é destinada à comunicação entre os usuários, permitindo o diálogo entre interessados na adoção e os respectivos doadores. A tela apresenta uma barra de busca para a localização de conversas específicas, utilizando como critérios o nome do interlocutor ou a identificação do animal envolvido no processo. No ambiente de chat, disponibiliza-se o envio de mensagens em formato de texto ou áudio, visando facilitar a interação entre as partes.

<img width="1077" height="1168" alt="Image" src="https://github.com/user-attachments/assets/10bcbbcd-700d-4c06-b646-ed3d0dc1b95a" />

Nesta interface, o usuário adotante dispõe da funcionalidade de inclusão de informações complementares, permitindo a personalização detalhada de seu perfil. O processo de edição é viabilizado por meio do acionamento do comando identificado pelo ícone de lápis, localizado na seção principal da tela.

<img width="1173" height="896" alt="Image" src="https://github.com/user-attachments/assets/8fd72ffb-ad38-498e-9c98-c6e255d54325" />

O acesso a esta interface é facultado ao doador exclusivamente no momento em que um usuário adotante manifesta intenção de adotar um animal sob sua responsabilidade. Nesta tela, o doador realiza a análise das informações fornecidas pelo interessado, sendo viabilizada a abertura de um canal de comunicação direto para o prosseguimento do processo de adoção.

<img width="1185" height="1028" alt="Image" src="https://github.com/user-attachments/assets/06483327-6bdf-4fbd-b176-879380a00e8e" />

O acesso a esta interface é restrito ao usuário doador, sendo disponibilizada ao acionar o comando "Interessados" no perfil do animal sob sua responsabilidade. A tela permite a gestão e a filtragem dos adotantes que manifestaram interesse. São apresentadas informações relevantes sobre os interessados, tais como nome, localização e nível de experiência prévia com animais. Adicionalmente, a interface dispõe de um menu lateral destinado à aplicação de filtros, visando otimizar a seleção e a análise dos perfis.

<img width="679" height="707" alt="Image" src="https://github.com/user-attachments/assets/c21c359a-31ab-43d5-9854-1e2e7d35fadd" />

Esta interface apresenta o perfil do usuário doador, permitindo a visualização do histórico de animais já doados e a criação de novos perfis para animais destinados à adoção. A tela disponibiliza campos para a edição de informações de contato e do nome do responsável. Na seção inferior, encontram-se as opções para alteração de senha (identificada pelo ícone de engrenagem) e configurações de preferências de notificação (identificada pelo ícone de sino).

<img width="365" height="600" alt="Image" src="https://github.com/user-attachments/assets/b1484c17-e4e8-4816-9dbf-b3dc5ff6808f" />




# Prototipo:
https://www.figma.com/make/YKeoiiQ6OVUps1m8r2fKiz/Wireframes-for-Dog-Adoption-Social-Network?p=f&t=GzYvBCB2mKURTniW-0

