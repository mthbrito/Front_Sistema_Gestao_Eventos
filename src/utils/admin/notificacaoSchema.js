import { z } from "zod";

export const notificacaoSchema = z.object({
  mensagem: z.string().min(3, "A mensagem deve ter pelo menos 3 caracteres."),
  usuarioId: z.number().nullable().optional(),
});