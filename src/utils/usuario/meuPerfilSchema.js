import { z } from "zod";

export const MeuPerfilSchema = z.object({
    nome: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
    email: z.string().email("Informe um e-mail válido."),
    senha: z.string().min(4, "A senha deve ter pelo menos 4 caracteres.").optional(),
});