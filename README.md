📦 Arquivapp

Armazenamento de arquivos na nuvem com pastas, upload seguro e gerenciamento de espaço por plano.

O Arquivapp é uma aplicação full-stack que permite aos usuários enviar, organizar e acessar arquivos na nuvem de forma simples e segura.

O projeto foi desenvolvido como parte do meu processo de transição para a área de desenvolvimento de software, com foco em arquitetura moderna e boas práticas.


🚀 Demonstração

🌐 Frontend
https://arquivapp.com.br

🔗 API
https://api.arquivapp.com.br

✨ Funcionalidades
👤 Autenticação

cadastro de usuários

login com JWT

recuperação de senha por email

redefinição de senha com token temporário


📁 Organização de arquivos

criação de pastas

listagem de arquivos

busca de arquivos

renomear pastas

exclusão de arquivos


☁️ Armazenamento

upload direto para object storage

download seguro com URL assinada

limite de armazenamento por plano

cálculo automático de uso de storage


🖼️ Visualização

preview de imagens

preview de PDFs

download de arquivos


👤 Perfil

atualização de nome

alteração de senha

upload de avatar

visualização de uso de armazenamento


📧 Email

recuperação de senha com envio de email

integração com serviço de email transacional


🧠 Arquitetura

O projeto segue uma arquitetura full-stack desacoplada.


🛠️ Tecnologias utilizadas
Frontend

React

TypeScript

Vite

Axios

React Router

React Hot Toast

Backend

Node.js

Express

TypeScript

Prisma ORM

JWT Authentication

Multer

Banco de dados

PostgreSQL

Neon

Armazenamento de arquivos

Cloudflare R2

Upload com presigned URLs

CDN via Cloudflare

Email

Resend

Cloudflare Email Routing

Deploy

Vercel (frontend)

Render (backend)

Cloudflare (DNS e CDN)


🔐 Segurança

O projeto implementa diversas boas práticas:

autenticação com JWT

tokens de recuperação de senha com expiração

upload seguro com presigned URLs

validação de tipo e tamanho de arquivos

rate limiting em endpoints sensíveis

proteção contra acesso a arquivos de outros usuários

⚙️ Como rodar o projeto localmente

1️⃣ Clonar o repositório
git clone https://github.com/seu-usuario/arquivapp.git

2️⃣ Instalar dependências
Backend
cd backend
npm install
Frontend
cd frontend
npm install

3️⃣ Configurar variáveis de ambiente
Backend .env
DATABASE_URL=
JWT_SECRET=

R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=

RESEND_API_KEY=
EMAIL_FROM=

FRONTEND_URL=
Frontend .env.development
VITE_API_URL=http://localhost:4000

4️⃣ Rodar migrations
npx prisma migrate dev

5️⃣ Iniciar aplicação

Backend:

npm run dev

Frontend:

npm run dev


📈 Possíveis melhorias futuras

compartilhamento de arquivos por link

planos pagos (PRO)

sistema de convite de usuários

deduplicação de arquivos

upload multipart para arquivos grandes

versão mobile


👨‍💻 Autor

Jorge Koch

Economista em transição de carreira para desenvolvimento de software.

LinkedIn:
https://www.linkedin.com/in/jorgeluizkoch


📄 Licença

Este projeto está sob a licença MIT.


⭐ Se você gostou do projeto

Considere dar uma estrela no repositório.

Isso ajuda bastante no crescimento do projeto 🚀
