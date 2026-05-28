# Cadastro

## Objetivo
Cadastrar e autenticar novos usuários no sistema.

---

# Regras

- se usuário já estiver autenticado, redirecionar conforme role sem renderizar o formulário
- nome obrigatório e >= 3 caracteres
- função/cargo obrigatória
- email obrigatório e válido
- senha obrigatória e >= 4 caracteres
- confirmação de senha obrigatória e igual à senha
- impedir submissão inválida do formulário
- campos não devem ser limpos após erro
- botão deve ser reabilitado após erro para nova tentativa
- loading obrigatório durante requisição
- token deve ser persistido após cadastro
- usuário deve ser autenticado automaticamente após cadastro
- redirecionamento baseado em RBAC

---

# Fluxo

1. usuário acessa /cadastro
2. sistema verifica se já existe sessão ativa
3. se autenticado, redireciona conforme role sem renderizar formulário
4. usuário preenche formulário
5. sistema valida os campos
6. sistema chama POST /auth/cadastro
7. sistema recebe token e dados do usuário
8. token é persistido no localStorage
9. usuário é autenticado automaticamente via loginComToken
10. usuário é salvo no cache React Query
11. sistema redireciona conforme role

---

# Inputs

- nome
- função/cargo
- email
- senha
- confirmação de senha

---

# Outputs

- toast de sucesso no cadastro
- toast de erro para email já cadastrado
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

## 409
- toast: "Este email já está em uso"

## 500
- toast: "Erro interno"

## Resposta inválida
- se response não contiver token, tratar como erro interno
- toast: "Erro interno"
- não autenticar nem redirecionar

## Network Error
- toast: "Não foi possível conectar ao servidor"

---

# Acessibilidade

- formulário navegável por teclado
- campos com labels associados via htmlFor
- botão com estado aria-disabled durante loading
- erros com role="alert" para leitores de tela
- foco retorna ao campo com erro após submissão inválida

---

# Persistência

- token salvo no localStorage via authStorage
- usuário salvo no cache React Query

---

# React Query

- mutação de cadastro não deve fazer retry automático
- erro deve ser propagado imediatamente ao usuário

---

# API Contract

## Request

POST /auth/cadastro

```json
{
  "nome": "string",
  "funcao": "ALUNO | PROFESSOR | SERVIDOR",
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
    "funcao": "ALUNO | PROFESSOR | SERVIDOR",
    "role": "USUARIO"
  }
}
```

## Response 409

```json
{
  "status": 409,
  "message": "string"
}
```

---

# Estrutura esperada

- CadastroPage.jsx
- CadastroForm.jsx
- useCadastro.js
- cadastroService.js
- cadastroSchema.js
- cadastro.schema.test.js
- cadastro.test.js

---

# Responsabilidades

## CadastroPage.jsx

- renderizar estrutura da página
- centralizar composição da feature
- conectar layout e formulário
- evitar lógica de negócio
- evitar chamadas HTTP
- controlar apenas responsabilidades de página

---

## CadastroForm.jsx

- renderizar formulário de cadastro
- integrar React Hook Form
- integrar validação com Zod
- controlar submissão
- desabilitar botão durante loading
- exibir feedback visual dos inputs
- exibir erros por meio de toasts
- delegar fluxo de cadastro para useCadastro
- impedir submissão inválida

---

## useCadastro.js

- gerenciar mutation sem retry automático
- tratar estados loading/error/success
- centralizar fluxo de cadastro
- chamar cadastroService
- tratar respostas da API por status HTTP
- disparar toasts
- autenticar usuário automaticamente via loginComToken
- salvar usuário no cache React Query
- realizar redirecionamento baseado em RBAC

---

## cadastroService.js

- realizar chamadas HTTP
- centralizar integração com API
- abstrair Axios da UI
- enviar request de cadastro
- retornar dados normalizados
- lançar erros tratados para camada superior

---

## cadastroSchema.js

- validar nome
- validar email
- validar senha
- validar confirmação de senha
- validar correspondência entre senha e confirmação
- definir mensagens de validação
- impedir submissão inválida

---

## cadastro.schema.test.js

- validar campos obrigatórios
- validar nome com menos de 3 caracteres
- validar email inválido
- validar senha com menos de 4 caracteres
- validar confirmação de senha divergente
- validar mensagens de erro de cada campo
- garantir que schema válido não retorna erros

---

## cadastro.test.js

- validar que usuário autenticado é redirecionado sem ver o formulário
- validar renderização do formulário
- validar que campos inválidos não disparam chamada HTTP
- validar submissão válida com payload correto
- validar loading durante requisição
- validar que botão é reabilitado após erro
- validar tratamento de erro 409
- validar tratamento de erro 500
- validar Network Error
- validar resposta 200 sem token
- validar persistência do token no authStorage
- validar autenticação automática após cadastro
- validar redirecionamento RBAC para ADMIN
- validar redirecionamento RBAC para USUARIO
- validar feedback visual/toasts
- validar integração entre formulário e hook