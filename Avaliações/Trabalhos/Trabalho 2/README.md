# Sistema de Cadastro de Pacientes e Consultas Médicas

Este é um sistema de cadastro de pacientes, médicos e consultas médicas desenvolvido com Flask. Ele permite realizar o cadastro de pacientes, médicos e consultas, com dependências entre as tabelas.

## Descrição

O sistema é baseado em um banco de dados PostgreSQL, e possui as funcionalidades básicas de CRUD (Criar, Ler, Atualizar e Excluir) para pacientes, médicos e consultas médicas. Ele também utiliza autenticação JWT para proteger as rotas de acesso, garantindo que apenas usuários autenticados possam interagir com o sistema.

### Funcionalidades:

- Cadastro de pacientes
- Cadastro de médicos
- Cadastro de consultas
- Autenticação via JWT
- Sistema de gerenciamento de consultas médicas

## Tecnologias Utilizadas

- **Flask**: Framework web para Python
- **Flask-SQLAlchemy**: ORM para integração com bancos de dados SQL
- **Flask-Migrate**: Extensão para gerenciamento de migrações de banco de dados
- **Flask-JWT-Extended**: Implementação de JWT para autenticação
- **PostgreSQL**: Banco de dados
- **Python-dotenv**: Para carregar variáveis de ambiente
- **Flask-CORS**: Suporte para requisições entre diferentes origens (CORS)

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/Sistemas-Internet-2-FURG/Jessica-Ferraz-155459.git
   ```
2. Crie um ambiente virtual e ative-o:

   ```bash
   python -m venv venv
   source venv/bin/activate  # No Windows use venv\Scripts\activate
   ```
3. Instale as dependências:

   ```bash
   pip install -r requirements.txt
   ```
4. Crie e configure o banco de dados PostgreSQL, garantindo que as variáveis de ambiente estejam configuradas corretamente em um arquivo `.env` (exemplo de configuração disponível abaixo):

   ```
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/nomedobanco
   FLASK_APP=app.py
   FLASK_ENV=development
   ```
5. Execute as migrações para criar as tabelas no banco de dados:

   ```bash
   flask db upgrade
   ```
6. Inicie o servidor:

   ```bash
   flask run
   ```

   O servidor estará disponível em `http://127.0.0.1:5000/`.

## Vídeo da Apresentação

Assista ao vídeo da apresentação do projeto no seguinte link: [Link para o vídeo](https://www.youtube.com/watch?v=gJybwzx6GNg)
