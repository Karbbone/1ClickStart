import { z } from "zod/v4";

const openBrowserSchema = z.object({
  type: z.literal("open_browser"),
  url: z.url("URL invalide"),
});

const runTerminalSchema = z.object({
  type: z.literal("run_terminal"),
  command: z.string().min(1, "La commande ne peut pas être vide"),
  open_in_terminal: z.boolean(),
});

const openTerminalSchema = z.object({
  type: z.literal("open_terminal"),
});

const projectActionSchema = z.discriminatedUnion("type", [
  openBrowserSchema,
  runTerminalSchema,
  openTerminalSchema,
]);

export const projectFormSchema = z.object({
  name: z.string().min(1, "Le nom du projet est requis"),
  path: z.string().min(1, "Le dossier du projet est requis"),
  actions: z.array(projectActionSchema),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
