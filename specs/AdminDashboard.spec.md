# AdminDashboard

## Objetivo
Permitir que administradores autenticados gerenciem todas as entidades do sistema — eventos, usuários, salas, inscrições, notificações e perfis — através de um dashboard centralizado.

---

# Regras

- acesso permitido apenas para usuários autenticados
- acesso permitido apenas para role ADMIN
- impedir acesso não autenticado
- impedir acesso sem permissão
- se usuário já estiver autenticado como USUARIO, redirecionar para /dashboard sem renderizar o painel
- carregar dados automaticamente ao acessar dashboard
- loading obrigatório durante carregamento
- erros devem ser tratados visualmente por aba
- dados devem ser sincronizados com React Query
- logout deve limpar cache e sessão e redirecionar para /login
- toda exclusão exige confirmação via modal antes de executar
- impedir ações durante mutações em andamento
- admin não cria usuários — cadastro é responsabilidade do próprio usuário
- admin edita apenas função e perfil do usuário, não senha ou email
- ordenação e busca são client-side, sem parâmetros de API

---

# Fluxo

1. admin autenticado acessa /admin/dashboard
2. sistema valida autenticação via AuthContext
3. sistema valida role via PrivateRoute
4. se não autenticado, redireciona para /login
5. se role inválido, redireciona conforme RBAC
6. sistema carrega dados iniciais de todas as abas em paralelo
7. sistema exibe loading durante carregamento
8. sistema renderiza dashboard com aba padrão (eventos)
9. admin interage com as funcionalidades disponíveis
10. sistema sincroniza dados automaticamente após mutações
11. exclusões sempre passam por modal de confirmação antes de executar

---

# Inputs

- navegação entre abas
- logout
- criação de eventos, salas, perfis
- edição de eventos, salas, usuários (função e perfil), inscrições (presença)
- exclusão de eventos, salas, usuários, inscrições, notificações, perfis
- envio de notificações (individual ou broadcast)
- busca por texto em todas as tabelas
- ordenação por coluna em todas as tabelas
- filtros específicos por entidade
- confirmação de modal antes de exclusão

---

# Outputs

- renderização das tabelas por aba
- loading visual durante carregamento e mutações
- spinners/skeletons
- modal de confirmação antes de exclusões
- modal de formulário para criação e edição
- toast para ações realizadas
- atualização automática da interface após mutações
- redirecionamento para /login por sessão expirada
- redirecionamento por RBAC
- estados vazios por aba

---

# Estados

- idle
- loading
- success
- empty
- error
- mutating

---

# RBAC

## ADMIN
- permitir acesso

## USUARIO
- acesso negado
- redirecionar para /dashboard

---

# Erros

## 400
- erros de validação
- toast correspondente

## 401
- redirecionar para /login
- limpar sessão e cache
- toast: "Sessão expirada"

## 403
- toast: "Usuário sem permissão"

## 404
- exibir estado vazio na aba correspondente

## 409
- toast: "Usuário já inscrito neste evento"

## 500
- toast: "Erro interno"

## Network Error
- toast: "Não foi possível conectar ao servidor"

---

# Acessibilidade

- dashboard navegável por teclado
- abas com role="tablist" e aria-selected
- botões com labels acessíveis
- loading com aria-busy
- mensagens de erro com role="alert"
- modais com foco gerenciado (focus trap)
- modal fechável com tecla Escape
- modal de confirmação com botão cancelar acessível por teclado

---

# Persistência

- token salvo no localStorage via authStorage
- nome salvo no localStorage via authStorage
- sessão validada via AuthContext
- dados em cache via React Query por aba

---

# React Query

- dados devem usar useQuery por aba
- mutações devem usar useMutation
- nenhuma mutação deve fazer retry automático
- queries devem possuir queryKey padronizada com prefixo "admin-"
- invalidation após mutações
- sincronização automática após:
  - criação, edição ou exclusão de evento
  - criação, edição ou exclusão de sala
  - edição ou exclusão de usuário
  - edição ou exclusão de inscrição
  - envio ou exclusão de notificação
  - criação ou exclusão de perfil

---

# Loading

Durante carregamento:

- spinner visível por aba
- ações desabilitadas
- impedir múltiplos submits
- evitar layout shift

---

# Segurança

- rotas protegidas via PrivateRoute com role="ADMIN"
- token obrigatório para requisições
- logout deve limpar cache e sessão
- admin não pode editar senha ou email de outros usuários

---

# Confirmação de Exclusão

- toda exclusão abre modal de confirmação antes de executar
- modal exibe: "Tem certeza que deseja excluir?"
- modal possui botão confirmar e botão cancelar
- botão confirmar executa a exclusão
- botão cancelar fecha o modal sem ação
- durante a exclusão, botão confirmar exibe spinner e fica desabilitado

---

# API Contract

## GET /api/sge/eventos?page=0&size=100
```json
{
  "content": [
    {
      "id": 1,
      "titulo": "string",
      "descricao": "string",
      "dataInicio": "string",
      "dataTermino": "string",
      "tipoEvento": "CURSO | PALESTRA | WORKSHOP",
      "salaId": 1,
      "salaNome": "string",
      "salaLocalizacao": "string",
      "organizadorId": 1,
      "organizadorNome": "string",
      "totalInscricoes": 0
    }
  ]
}
```

## POST /api/sge/eventos
## PUT /api/sge/eventos/{id}
```json
{
  "titulo": "string",
  "descricao": "string",
  "dataInicio": "string",
  "dataTermino": "string",
  "tipoEvento": "CURSO | PALESTRA | WORKSHOP",
  "salaId": 1,
  "organizadorId": 1
}
```

## DELETE /api/sge/eventos/{id}
- sem body — response 204

---

## GET /api/sge/usuarios?page=0&size=100
```json
{
  "content": [
    {
      "id": 1,
      "nome": "string",
      "email": "string",
      "funcao": "string",
      "perfis": []
    }
  ]
}
```

## PUT /api/sge/usuarios/{id}
```json
{
  "funcao": "string",
  "perfisIds": [1, 2]
}
```

## DELETE /api/sge/usuarios/{id}
- sem body — response 204

---

## GET /api/sge/salas?page=0&size=100
```json
{
  "content": [
    {
      "id": 1,
      "nome": "string",
      "localizacao": "string",
      "capacidade": 0
    }
  ]
}
```

## POST /api/sge/salas
## PUT /api/sge/salas/{id}
```json
{
  "nome": "string",
  "localizacao": "string",
  "capacidade": 0
}
```

## DELETE /api/sge/salas/{id}
- sem body — response 204

---

## GET /api/sge/inscricoes?page=0&size=200
```json
{
  "content": [
    {
      "id": 1,
      "usuarioId": 1,
      "usuarioNome": "string",
      "eventoId": 1,
      "eventoNome": "string",
      "status": "CONFIRMADA | CANCELADA | PENDENTE",
      "presente": false,
      "dataInscricao": "string"
    }
  ]
}
```

## PUT /api/sge/inscricoes/{id}
```json
{ "presente": true }
```

## DELETE /api/sge/inscricoes/{id}
- sem body — response 204

---

## GET /api/sge/notificacoes?page=0&size=100
```json
{
  "content": [
    {
      "id": 1,
      "mensagem": "string",
      "usuarioId": 1,
      "dataEnvio": "string"
    }
  ]
}
```

## POST /api/sge/notificacoes
```json
{
  "mensagem": "string",
  "usuarioId": 1
}
```
- usuarioId null = broadcast para todos

## DELETE /api/sge/notificacoes/{id}
- sem body — response 204

---

## GET /api/sge/perfis?page=0&size=100
```json
{
  "content": [
    {
      "id": 1,
      "nome": "string"
    }
  ]
}
```

## POST /api/sge/perfis
```json
{ "nome": "string" }
```

## DELETE /api/sge/perfis/{id}
- sem body — response 204

---

# Estrutura esperada

- AdminDashboardPage.jsx
- EventosTabela.jsx
- EventoFormulario.jsx
- UsuariosTabela.jsx
- UsuarioFormulario.jsx
- SalasTabela.jsx
- SalaFormulario.jsx
- InscricoesTabela.jsx
- NotificacoesTabela.jsx
- NotificacaoFormulario.jsx
- PerfisTabela.jsx
- BaseModal.jsx
- ConfirmacaoModal.jsx
- useDashboardAdmin.js
- useEventosAdmin.js
- useUsuariosAdmin.js
- useSalasAdmin.js
- useInscricoesAdmin.js
- useNotificacoesAdmin.js
- usePerfisAdmin.js

---

# Responsabilidades

## AdminDashboardPage.jsx

- renderizar estrutura da página
- controlar aba ativa com padrão em eventos
- compor as abas e passar callbacks
- chamar logout e redirecionar para /login
- evitar lógica de negócio além de navegação entre abas

---

## useDashboardAdmin.js

- orquestrar todos os hooks de aba
- expor estado agregado de carregamento

---

## useEventosAdmin.js

- buscar lista via useQuery
- queryKey: ["admin-eventos"]
- gerenciar mutations de criação, edição e exclusão
- invalidar queryKey após cada mutação
- disparar toasts de sucesso e erro por ação

---

## useUsuariosAdmin.js

- buscar lista via useQuery
- queryKey: ["admin-usuarios"]
- gerenciar mutation de edição (funcao e perfisIds apenas)
- gerenciar mutation de exclusão
- invalidar queryKey após mutações
- disparar toasts de sucesso e erro

---

## useSalasAdmin.js

- buscar lista via useQuery
- queryKey: ["admin-salas"]
- gerenciar mutations de criação, edição e exclusão
- invalidar queryKey após cada mutação
- disparar toasts de sucesso e erro por ação

---

## useInscricoesAdmin.js

- buscar lista via useQuery
- queryKey: ["admin-inscricoes"]
- gerenciar mutation de marcar/desmarcar presença
- gerenciar mutation de exclusão
- invalidar queryKey após mutações
- disparar toasts de sucesso e erro

---

## useNotificacoesAdmin.js

- buscar lista via useQuery
- queryKey: ["admin-notificacoes"]
- gerenciar mutation de envio (individual e broadcast)
- gerenciar mutation de exclusão individual e em lote
- invalidar queryKey após mutações
- disparar toasts de sucesso e erro

---

## usePerfisAdmin.js

- buscar lista via useQuery
- queryKey: ["admin-perfis"]
- gerenciar mutations de criação e exclusão
- invalidar queryKey após cada mutação
- disparar toasts de sucesso e erro

---

## BaseModal.jsx

- renderizar estrutura base do modal
- gerenciar focus trap
- fechar com tecla Escape
- receber título e conteúdo via props

---

## ConfirmacaoModal.jsx

- renderizar mensagem de confirmação
- botão confirmar com spinner durante exclusão
- botão confirmar desabilitado durante exclusão
- botão cancelar fecha sem ação

---

# Seções

## Header

- logo e nome do projeto
- nome do admin autenticado
- avatar do admin (inicial do nome)
- botão logout

---

## Aba Eventos

- listar eventos em formato tabela
- busca por título
- ordenação por título, data, tipo
- filtro por tipo (CURSO, PALESTRA, WORKSHOP)

### Colunas da tabela

- título
- tipo
- data início
- data término
- sala
- organizador
- total inscritos
- ações (editar, excluir)

### Ações

- criar evento via modal de formulário
- editar evento via modal de formulário
- excluir evento com confirmação
- loading durante mutações

### Formulário de Evento

#### Inputs
- título (obrigatório, mínimo 3 caracteres)
- descrição (obrigatório, mínimo 5, máximo 300 caracteres)
- data início (obrigatório)
- data término (obrigatório, deve ser após data início)
- tipo (CURSO, PALESTRA, WORKSHOP — obrigatório)
- sala (select — obrigatório)
- organizador (select de usuários — obrigatório)

### Outputs

- toast: "Evento criado!"
- toast: "Evento atualizado!"
- toast: "Evento removido!"
- atualização automática da tabela

### Estados

- loading
- success
- empty
- error

---

## Aba Usuários

- listar usuários em formato tabela
- busca por nome ou email
- ordenação por nome, email, função

### Colunas da tabela

- nome
- email
- função
- perfis
- ações (editar, excluir)

### Ações

- editar usuário (função e perfil apenas) via modal de formulário
- excluir usuário com confirmação
- loading durante mutações

### Formulário de Usuário

#### Inputs
- função (obrigatório)
- perfis (select múltiplo)

### Outputs

- toast: "Usuário atualizado!"
- toast: "Usuário removido!"
- atualização automática da tabela

### Estados

- loading
- success
- empty
- error

---

## Aba Salas

- listar salas em formato tabela
- busca por nome ou localização
- ordenação por nome, localização, capacidade

### Colunas da tabela

- nome
- localização
- capacidade
- ações (editar, excluir)

### Ações

- criar sala via modal de formulário
- editar sala via modal de formulário
- excluir sala com confirmação
- loading durante mutações

### Formulário de Sala

#### Inputs
- nome (obrigatório, mínimo 2 caracteres)
- localização (obrigatório, mínimo 2 caracteres)
- capacidade (obrigatório, mínimo 1)

### Outputs

- toast: "Sala criada!"
- toast: "Sala atualizada!"
- toast: "Sala removida!"
- atualização automática da tabela

### Estados

- loading
- success
- empty
- error

---

## Aba Inscrições

- listar inscrições em formato tabela
- busca por nome do usuário
- filtro por evento
- filtro por status (CONFIRMADA, CANCELADA, PENDENTE)
- ordenação por usuário, evento, status, data

### Colunas da tabela

- usuário
- evento
- status
- presença
- data inscrição
- ações (marcar presença, excluir)

### Ações

- marcar/desmarcar presença
- excluir inscrição com confirmação
- loading durante mutações

### Outputs

- toast: "Presença marcada!"
- toast: "Presença desmarcada!"
- toast: "Inscrição excluída!"
- atualização automática da tabela

### Estados

- loading
- success
- empty
- error

---

## Aba Notificações

- listar notificações enviadas em formato tabela
- busca por mensagem
- ordenação por mensagem, destinatário, data

### Colunas da tabela

- mensagem
- destinatário (nome do usuário ou "Todos")
- data envio
- ações (excluir)

### Ações

- enviar notificação via modal de formulário
- excluir notificação individual com confirmação
- excluir múltiplas notificações com confirmação
- loading durante mutações

### Formulário de Notificação

#### Inputs
- mensagem (obrigatório, mínimo 3 caracteres)
- destinatário: usuário específico (select) ou broadcast para todos (toggle)

#### Regras
- se broadcast selecionado, campo de usuário é desabilitado
- se usuário específico selecionado, campo de usuário é obrigatório

### Outputs

- toast: "Notificação enviada!"
- toast: "Notificação removida!"
- toast: "Notificações removidas!"
- atualização automática da tabela

### Estados

- loading
- success
- empty
- error

---

## Aba Perfis

- listar perfis em formato tabela
- busca por nome
- ordenação por nome

### Colunas da tabela

- nome
- ações (excluir)

### Ações

- criar perfil via modal de formulário
- excluir perfil com confirmação
- sem edição — perfil só pode ser criado ou excluído
- loading durante mutações

### Formulário de Perfil

#### Inputs
- nome (obrigatório, mínimo 2 caracteres)

### Outputs

- toast: "Perfil criado!"
- toast: "Perfil removido!"
- atualização automática da tabela

### Estados

- loading
- success
- empty
- error