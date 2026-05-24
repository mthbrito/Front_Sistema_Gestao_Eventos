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
      .max(300, "A descrição deve ter no máximo 300 caracteres.")
      .or(z.literal("")),
    tipoEvento: z.enum(["CURSO", "PALESTRA", "WORKSHOP"], {
      errorMap: () => ({ message: "Selecione um tipo de evento." }),
    }),
    dataInicio: z.string().min(1, "Informe a data de início."),
    dataTermino: z.string().min(1, "Informe a data de término."),
    salaId: z.number().nullable(),
    organizadorId: z.number().nullable(),
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
  localizacao: z.string().optional(),
  capacidade: z
    .number({ invalid_type_error: "Informe a capacidade." })
    .min(1, "A capacidade deve ser pelo menos 1."),
});

export const perfilSchema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
});

export const notificacaoSchema = z.object({
  mensagem: z.string().min(5, "A mensagem deve ter pelo menos 5 caracteres."),
  destinatario: z.string().min(1, "Selecione um destinatário."),
});

export const inscricaoSchema = z.object({
  usuarioId: z.number({ invalid_type_error: "Selecione um usuário." }),
  eventoId: z.number({ invalid_type_error: "Selecione um evento." }),
});
