import { z } from "zod";

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