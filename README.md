# Next.js Chat
Este é meu projeto de chat online utilizando Next.js (framework **React**) e **Socket.IO**.

## Configurando o projeto

No arquivo .env crie as seguintes variáveis:
```
MY_PASSWORD // Será a senha de codificação do seu jsonwebtoken
DB_STRING // String de conexão do seu banco de dados
```
## Iniciando o projeto

#### Primeiro, inicie o servidor do socket:

```
npm run ioserver
// ou
yarn ioserver
// ou
pnpm ioserver
// ou
bun ioserver
```

#### Em outra instância do terminal, inicie a aplicação:

```
npm run dev
// ou
yarn dev
// ou
pnpm dev
// ou
bun dev
```

Abra [http://localhost:3000](http://localhost:3000) com o navegador para ver o resultado.
