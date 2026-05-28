# Login

## Objetivo
Autenticar usuários autorizados no sistema.

---

# Regras

- impedir acesso de usuários não permitidos
- se usuário já estiver autenticado, redirecionar conforme role sem renderizar o formulário
- token expirado detectado antes da submissão deve ser removido silenciosamente
- email obrigatório e válido
- senha obrigatória e >= 4 caracteres
- impedir submissão inválida do formulário
- campos não devem ser limpos após erro
- foco deve retornar ao campo de email após erro de credenciais
- botão deve ser reabilitado após erro para nova tentativa
- loading obrigatório durante requisição
- token deve ser persistido após autenticação
- redirecionamento baseado em RBAC

---

# Fluxo

1. usuário acessa /login
2. sistema verifica se já existe sessão ativa
3. se autenticado, redireciona conforme role sem renderizar formulário
4. usuário preenche formulário
5. sistema valida os campos
6. sistema chama POST /auth/login
7. sistema recebe token e dados do usuário
8. token é persistido no localStorage
9. usuário é salvo no cache React Query
10. sistema redireciona conforme role

---

# Inputs

- email
- senha

---

# Outputs

- toast de sucesso no login
- toast de erro para credenciais inválidas
- toast para erro interno
- toast para Network Error
- toast para erros de validação
- botão desabilitado durante loading
- redirecionamento após autenticação

---

# Estados

- idle
- loading
- success
- error

---

# RBAC

## ADMIN
- redirecionar para /admin/dashboard

## USUARIO
- redirecionar para /dashboard

---

# Erros

## 400
- erros de validação do formulário

## 401
- toast: "Credenciais inválidas"

## 403
- toast: "Usuário sem permissão"

## 500
- toast: "Erro interno"

## Resposta inválida
- se response não contiver token, tratar como erro interno
- toast: "Erro interno"
- não redirecionar

## Network Error
- toast: "Não foi possível conectar ao servidor"

---

# Acessibilidade

- formulário navegável por teclado
- campos com labels associados via htmlFor
- botão com estado aria-disabled durante loading
- erros com role="alert" para leitores de tela
- foco retorna ao campo após erro

---

# Persistência

- token salvo no localStorage
- usuário salvo no cache React Query

---

# React Query

- mutação de login não deve fazer retry automático
- erro deve ser propagado imediatamente ao usuário

---

# API Contract

## Request

POST /auth/login

```json
{
  "email": "string",
  "senha": "string"
}
```

## Response 200

```json
{
  "token": "jwt",
  "usuario": {
    "id": 1,
    "nome": "string",
    "email": "string",
    "role": "ADMIN | USUARIO"
  }
}
```

## Response 401

```json
{
  "status": 401,
  "message": "string"
}
```

---

# Estrutura esperada

- LoginPage.jsx
- LoginForm.jsx
- useLogin.js
- authService.js
- loginSchema.js
- authStorage.js
- login.test.js

---

# Responsabilidades

## LoginPage.jsx

- renderizar estrutura da página
- centralizar composição da feature
- conectar layout e formulário
- evitar lógica de negócio
- evitar chamadas HTTP
- controlar apenas responsabilidades de página

---

## LoginForm.jsx

- renderizar formulário
- integrar React Hook Form
- integrar validação com Zod
- controlar submissão
- desabilitar botão durante loading
- exibir feedback visual do formulário
- exibir erros por meio de toasts
- delegar autenticação para useLogin

---

## useLogin.js

- gerenciar mutation sem retry automático
- tratar estados loading/error/success
- centralizar fluxo de autenticação
- chamar authService
- tratar respostas da API por status HTTP
- disparar toasts
- persistir autenticação via authStorage
- invalidar/atualizar cache React Query
- realizar redirecionamento baseado em RBAC

---

## authService.js

- realizar chamadas HTTP
- centralizar integração com API
- abstrair Axios da UI
- enviar request de login
- retornar dados normalizados
- lançar erros tratados para camada superior

---

## loginSchema.js

- validar email
- validar senha
- definir mensagens de validação
- centralizar regras de input
- impedir submissão inválida

---

## authStorage.js

- persistir token
- recuperar token
- remover token
- abstrair acesso ao localStorage
- centralizar persistência de autenticação
- evitar acesso direto ao storage na UI

---

## login.test.js

- validar que usuário autenticado é redirecionado sem ver o formulário
- validar renderização do formulário
- validar regras do schema
- validar que campos inválidos não disparam chamada HTTP
- validar submissão válida com payload correto
- validar loading durante requisição
- validar que botão é reabilitado após erro
- validar tratamento de erros 401, 403, 500
- validar Network Error
- validar resposta 200 sem token
- validar persistência do token no authStorage
- validar redirecionamento RBAC para ADMIN
- validar redirecionamento RBAC para USUARIO
- validar feedback visual/toasts
- validar integração entre formulário e hook