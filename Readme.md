Esse aplicativo foi desenvolvido utilizando o AngularJS, Material Design e Electron. Foi um estudo que realizei para testar o Electron. Caso queira testar ou colaborar fique a vontade para dar um fork no projeto ou clonar o repositório.

#Passo a passo para roda em sua maquina

Clone o projeto para sua máquina:

> git clone https://github.com/edyonil/app-eRamal.git

Depois entre no repositório app-eRamal e instale as dependências do node

> cd app-eRamal
> node install

Agora é necessário instalar as dependências do Bower

> bower install

Após isso você já está pronto para testar o eRamal. Execute o comando

> gulp run

Se tudo ocorreu com sucesso, nesse momento o Electron está rodando, e você deve ver o app eRamal funcionando.

**Preparando para distribuição.**

Os arquivos com as marcas e ícones do projeto encontra-se dentro de resources. Você pode ficar a vontade para alterar o ícone que você quiser. 

Caso você não tenha modificado nada no código fonte  que fica dentro de /app, então não é necessário você rodar a buid no app. Apenas execute o comando abaixo para gerar o aplicativo:

> npm run release

Isso só é possível porque deixei um exemplo já com o build do projeto para caso queiram testar. 

Esse comando release, a depender da plataforma que você está usando, já vai gerar o aplicativo com extensão correta. Para MacOs .app, Windows .exe e Linux(Só teste o app no ubuntu, prometo que vou testar em outro linux) um .deb. 

**Procedimento Obrigatório: Caso você tenha alterado o fonte do projeto em App**

Caso tenha alterado o fonte para melhorar algo, você deverá realizar comando abaixo para surtir efeito para seu projeto final:

> gulp build

Depois de realizar o build, certifique de copiar os seguintes arquivos para a pasta nova build/

* Copiar os arquivos de fontes que estão em /bower_components/material-design-icons/iconfont/ para build/assets/css/
* Copiar a pasta images que estão em /app/assets/ e colar em /build/assets/

**Aviso:** Esse procedimento é temporário. Deu preguiça!

Depois que você fez a build do código fonte rode novamente o comando abaixo para gerar o aplicativo final

npm run release

**Nota 1:**
Estarei adicionando, em breve, três rotinas no gulp que não foi incluída. 

* Uma para copiar as images da pasta app/assets/images para a build/assets/images;
* Uma para copiar os fonticon da pasta do material design para a pasta build/assets/css
* Uma para minificar os fontes do app
* Uma para gerar os templateCache das views do Angular

**Nota 2:**
Além das rotinas do Gulp, teremos mais algumas funcionalidades no app.

* Exportar/Importar a lista de ramal em csv
* Integrar com Firebase

