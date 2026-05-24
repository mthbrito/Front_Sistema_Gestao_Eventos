import { z } from "zod";

const nomeSchema = z
  .string()
  .min(3, "O nome deve ter pelo menos 3 caracteres.");
const emailSchema = z.string().email("Informe um e-mail válido.");
const senhaSchema = z
  .string()
  .min(4, "A senha deve ter pelo menos 4 caracteres.");

export const loginSchema = z.object({
  email: emailSchema,
  senha: senhaSchema,
});

export const cadastroSchema = z
  .object({
    nome: nomeSchema,
    email: emailSchema,
    senha: senhaSchema,
    confirmarSenha: z.string(),
    funcao: z.string().min(1, "Selecione uma função."),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem.",
    path: ["confirmarSenha"],
  });

export const eventoSchema = z
  .object({
    titulo: z.string().min(3, "O título deve ter pelo menos 3 caracteres."),
    descricao: z
      .string()
      .min(5, "A descrição deve ter pelo menos 5 caracteres.")
      .max(300, "A descrição deve ter no máximo 300 caracteres."),
    dataInicio: z.string().min(1, "Informe a data de início."),
    dataTermino: z.string().min(1, "Informe a data de término."),
    tipoEvento: z
      .enum(["CURSO", "PALESTRA", "WORKSHOP"])
      .or(z.literal(""))
      .refine((val) => val !== "", "Selecione um tipo de evento."),
    salaId: z
      .number({ invalid_type_error: "Selecione uma sala." })
      .positive("Selecione uma sala.")
      .nullable()
      .refine((val) => val !== null, "Selecione uma sala."),
    organizadorId: z
      .number({ invalid_type_error: "Selecione um organizador." })
      .positive("Selecione um organizador.")
      .nullable()
      .refine((val) => val !== null, "Selecione um organizador."),
  })
  .refine(
    (data) =>
      !data.dataInicio ||
      !data.dataTermino ||
      data.dataTermino >= data.dataInicio,
    {
      message: "A data de término deve ser após o início.",
      path: ["dataTermino"],
    },
  );

export const salaSchema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  localizacao: z.string().min(2, "A localização deve ter pelo menos 2 caracteres."),
  capacidade: z
    .number({ invalid_type_error: "Informe a capacidade." })
    .min(1, "A capacidade deve ser pelo menos 1.")
    .nullable()
    .refine((val) => val !== null, "Informe a capacidade."),
});

export const perfilSchema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
});

export const notificacaoSchema = z.object({
  mensagem: z.string().min(3, "A mensagem deve ter pelo menos 3 caracteres."),
  usuarioId: z.number().nullable().optional(),
});

export const inscricaoSchema = z.object({
  usuarioId: z
    .number({ invalid_type_error: "Selecione um usuário." })
    .nullable()
    .refine((val) => val !== null, "Selecione um usuário."),
  eventoId: z
    .number({ invalid_type_error: "Selecione um evento." })
    .nullable()
    .refine((val) => val !== null, "Selecione um evento."),
});