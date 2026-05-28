# UsuarioDashboard

## Objetivo
Permitir que usuários autenticados visualizem e interajam com informações principais do sistema através do dashboard do usuário.

---

# Regras

- acesso permitido apenas para usuários autenticados
- acesso permitido apenas para role USUARIO
- impedir acesso não autenticado
- impedir acesso sem permissão
- carregar dados automaticamente ao acessar dashboard
- loading obrigatório durante carregamento
- erros devem ser tratados visualmente
- dados devem ser sincronizados com React Query
- logout deve limpar cache e sessão e redirecionar para /login
- impedir inscrições duplicadas
- impedir ações durante mutações em andamento
- senha é opcional na edição de perfil — atualizar apenas se preenchida

---

# Fluxo

1. usuário autenticado acessa /dashboard
2. sistema valida autenticação via AuthContext
3. sistema valida role via PrivateRoute
4. se não autenticado, redireciona para /login
5. se role inválido, redireciona conforme RBAC
6. sistema carrega dados iniciais de todas as abas em paralelo
7. sistema exibe loading durante carregamento
8. sistema renderiza dashboard com aba padrão (eventos)
9. usuário interage com funcionalidades disponíveis
10. sistema sincroniza dados automaticamente após mutações

---

# Inputs

- navegação entre abas
- logout
- inscrição em eventos
- desinscrição em eventos
- exclusão de notificação individual
- exclusão de múltiplas notificações
- atualização de perfil (nome, email, senha opcional)

---

# Outputs

- renderização dos dados do dashboard
- loading visual por aba
- spinners durante carregamento
- mensagens de erro por aba
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
- acesso negado
- redirecionar para /admin/dashboard

## USUARIO
- permitir acesso

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
- botões de ação desabilitados com aria-disabled durante mutações

---

# Persistência

- token salvo no localStorage via authStorage
- usuário salvo no cache React Query
- sessão validada via AuthContext

---

# React Query

- dados devem usar useQuery por aba
- mutações devem usar useMutation
- queries devem possuir queryKey padronizada
- nenhuma mutação deve fazer retry automático
- invalidation após mutações
- sincronização automática após:
  - inscrição em evento
  - desinscrição de evento
  - atualização de perfil
  - exclusão de notificação individual
  - exclusão de múltiplas notificações

---

# Loading

Durante carregamento:

- spinner visível por aba
- ações desabilitadas
- impedir múltiplos submits
- evitar layout shift

---

# Segurança

- rotas protegidas via PrivateRoute
- token obrigatório para requisições
- logout deve limpar cache e sessão
- usuário não pode acessar recursos de outros usuários

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
      "salaNome": "string",
      "salaLocalizacao": "string",
      "organizadorNome": "string",
      "totalInscricoes": 0
    }
  ]
}
```

## GET /api/sge/inscricoes/usuario/{usuarioId}

```json
[
  {
    "id": 1,
    "eventoNome": "string",
    "status": "CONFIRMADA | CANCELADA | PENDENTE",
    "presente": false,
    "dataInscricao": "string"
  }
]
```

## POST /api/sge/inscricoes

```json
{
  "usuarioId": 1,
  "eventoId": 1
}
```

## DELETE /api/sge/inscricoes/{inscricaoId}

- sem body
- response 204

## GET /api/sge/notificacoes/usuario/{usuarioId}

```json
[
  {
    "id": 1,
    "mensagem": "string",
    "dataEnvio": "string"
  }
]
```

## DELETE /api/sge/notificacoes/{notificacaoId}

- sem body
- response 204

## GET /api/sge/usuarios/{usuarioId}

```json
{
  "id": 1,
  "nome": "string",
  "email": "string",
  "funcao": "string"
}
```

## PUT /api/sge/usuarios/{usuarioId}

```json
{
  "nome": "string",
  "email": "string",
  "senha": "string | omitido se não alterado"
}
```

---

# Seções

## Header

- logo e nome do projeto
- nome do usuário autenticado
- botão logout

---

## Aba Eventos

- listar eventos disponíveis em formato card
- aba padrão ao abrir o dashboard

### Card Evento

- tipo do evento
- nome
- descrição
- data início e data término
- localização
- organizador
- quantidade de inscritos

### Ações

- botão inscrever-se
- impedir inscrição duplicada
- botão desabilitado durante mutação
- sincronização automática após inscrição

### Outputs

- toast: "Inscrição realizada com sucesso!"
- toast: "Usuário já inscrito neste evento" (409)
- toast: "Erro interno" (500)
- atualização automática da lista de inscrições

### Estados

- loading
- success
- empty
- error

---

## Aba Minhas Inscrições

- listar inscrições do usuário em formato card

### Card Inscrição

- nome do evento
- status da inscrição (CONFIRMADA | CANCELADA | PENDENTE)
- data de inscrição
- presença confirmada ou pendente
- botão cancelar inscrição (oculto se status CANCELADA)

### Ações

- cancelar inscrição
- botão desabilitado durante mutação
- sincronização automática após cancelamento

### Outputs

- toast: "Inscrição cancelada com sucesso!"
- toast: "Erro interno" (500)
- atualização automática da lista

### Estados

- loading
- success
- empty
- error

---

## Aba Notificações

- listar notificações do usuário em formato card

### Card Notificação

- mensagem
- data de envio
- botão excluir

### Ações

- excluir notificação individual
- excluir todas as notificações
- botões desabilitados durante mutação
- sincronização automática após exclusão

### Outputs

- toast: "Notificação removida!"
- toast: "Todas as notificações foram removidas!"
- toast: "Erro interno" (500)
- atualização automática da lista

### Estados

- loading
- success
- empty
- error

---

## Aba Meu Perfil

- visualizar dados atuais do usuário
- atualizar dados do usuário

### Inputs

- nome completo (obrigatório, mínimo 3 caracteres)
- email (obrigatório, válido)
- nova senha (opcional, mínimo 8 caracteres se preenchida)
- confirmação de senha (obrigatória se senha preenchida, deve ser igual)

### Regras

- senha é opcional — campo vazio não atualiza a senha
- confirmação de senha só é validada se senha foi preenchida
- nome e email são sempre obrigatórios
- dados atuais devem ser exibidos antes do formulário

### Ações

- salvar alterações
- impedir submit inválido
- botão desabilitado durante mutação
- sincronização do cache React Query após atualização

### Outputs

- toast: "Perfil atualizado!"
- toast: "Erro interno" (500)
- atualização dos dados exibidos

### Estados

- loading
- success
- error

---

# Estrutura esperada

- UsuarioDashboardPage.jsx
- EventosAba.jsx
- EventoCard.jsx
- InscricoesAba.jsx
- InscricaoCard.jsx
- NotificacoesAba.jsx
- NotificacaoCard.jsx
- MeuPerfilAba.jsx
- MeuPerfilFormulario.jsx
- useDashboardUsuario.js
- useEventosUsuario.js
- useInscricoesUsuario.js
- useNotificacoesUsuario.js
- useMeuPerfilUsuario.js

---

# Responsabilidades

## UsuarioDashboardPage.jsx

- renderizar estrutura da página
- controlar aba ativa
- compor as abas disponíveis
- passar dados e callbacks para cada aba
- chamar logout e redirecionar para /login
- evitar lógica de negócio além de navegação entre abas

---

## EventosAba.jsx

- renderizar lista de eventos em cards
- exibir spinner durante carregamento
- exibir estado vazio se sem eventos
- exibir erro se query falhar
- delegar inscrição para useInscricoesUsuario

---

## EventoCard.jsx

- renderizar dados do evento
- renderizar botão inscrever-se
- desabilitar botão durante mutação
- emitir callback de inscrição com eventoId

---

## InscricoesAba.jsx

- renderizar lista de inscrições em cards
- exibir spinner durante carregamento
- exibir estado vazio com link para aba de eventos
- exibir erro se query falhar
- delegar cancelamento para useInscricoesUsuario

---

## InscricaoCard.jsx

- renderizar dados da inscrição
- renderizar botão cancelar (oculto se CANCELADA)
- desabilitar botão durante mutação
- emitir callback de cancelamento com inscricaoId

---

## NotificacoesAba.jsx

- renderizar lista de notificações em cards
- exibir spinner durante carregamento
- exibir estado vazio
- exibir botão apagar todas quando lista não vazia
- delegar exclusão para useNotificacoesUsuario

---

## NotificacaoCard.jsx

- renderizar mensagem e data da notificação
- renderizar botão excluir com aria-label
- desabilitar botão durante mutação
- emitir callback de exclusão com notificacaoId

---

## MeuPerfilAba.jsx

- renderizar dados atuais do usuário
- renderizar MeuPerfilFormulario
- delegar busca e atualização para useMeuPerfilUsuario

---

## MeuPerfilFormulario.jsx

- renderizar formulário de edição
- integrar React Hook Form
- integrar validação com Zod
- pré-popular campos com dados atuais
- tratar senha como campo opcional
- desabilitar botão durante mutação
- delegar salvamento para useMeuPerfilUsuario

---

## useDashboardUsuario.js

- orquestrar useEventosUsuario, useInscricoesUsuario e useNotificacoesUsuario
- expor estado agregado de carregamento
- expor função recarregarTudo
- expor totalNotificacoes não lidas para badge

---

## useEventosUsuario.js

- buscar lista de eventos via useQuery
- queryKey: ["eventos"]
- expor lista, carregando, erro e recarregar

---

## useInscricoesUsuario.js

- buscar inscrições do usuário via useQuery
- queryKey: ["inscricoes", usuarioId]
- gerenciar mutation de inscrição
- gerenciar mutation de cancelamento
- invalidar ["inscricoes", usuarioId] após mutações
- disparar toasts de sucesso e erro
- expor lista, carregando, salvando, erro, inscrever, desinscrever, recarregar

---

## useNotificacoesUsuario.js

- buscar notificações do usuário via useQuery
- queryKey: ["notificacoes-usuario", usuarioId]
- gerenciar mutation de exclusão individual
- gerenciar exclusão em lote via Promise.all
- invalidar ["notificacoes-usuario", usuarioId] após mutações
- disparar toasts de sucesso e erro
- expor lista, carregando, deletando, erro, deletar, deletarTodas, recarregar

---

## useMeuPerfilUsuario.js

- buscar dados do usuário via useQuery
- queryKey: ["meu-perfil-usuario"]
- gerenciar mutation de atualização
- invalidar ["meu-perfil-usuario"] após atualização
- omitir senha do payload se não preenchida
- disparar toasts de sucesso e erro
- expor usuario, carregando, salvando, salvar