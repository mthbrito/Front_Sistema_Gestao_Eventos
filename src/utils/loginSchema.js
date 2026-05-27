import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().email("Informe um e-mail válido."),
    senha: z.string().min(4, "A senha deve ter pelo menos 4 caracteres."),
});