import { z } from "zod";

export const salaSchema = z.object({
  nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  localizacao: z.string().min(2, "A localização deve ter pelo menos 2 caracteres."),
  capacidade: z
    .number({ invalid_type_error: "Informe a capacidade." })
    .min(1, "A capacidade deve ser pelo menos 1.")
    .nullable()
    .refine((val) => val !== null, "Informe a capacidade."),
});