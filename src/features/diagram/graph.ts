import { z } from "zod";

// Use the interpreted validator; dynamic code generation is unnecessary here.
z.config({ jitless: true });

export function normalizeDiagramText(value: string): string {
  return value.normalize("NFC").replace(/\s+/gu, " ").trim();
}

const noControls = /^[^\p{C}\u2028\u2029]*$/u;
export const repositoryPathSchema = z
  .string()
  .min(1)
  .max(512)
  .regex(
    /^[^\\:?#\p{C}\u2028\u2029]+$/u,
    "Use a repository relative POSIX path without URLs or controls.",
  )
  .refine(
    (path) =>
      path === path.trim() &&
      !path.startsWith("/") &&
      path
        .split("/")
        .every((part) => part !== "" && part !== "." && part !== ".."),
    "Path must be canonical and repository relative.",
  );
const id = z
  .string()
  .max(64)
  .regex(/^[a-z][a-z0-9_]*$/);
const text = (max: number) =>
  z
    .string()
    .min(1)
    .max(max)
    .regex(noControls)
    .refine((value) => value.trim().length > 0, "Must contain visible text.");
const description = z.string().max(240).regex(noControls).nullable();
const diagramGroupSchema = z.strictObject({ id, label: text(72), description });
const diagramNodeSchema = z.strictObject({
  id,
  label: text(72),
  type: text(72),
  description,
  groupId: id.nullable(),
  path: repositoryPathSchema.nullable(),
  shape: z
    .enum(["box", "database", "queue", "document", "circle", "hexagon"])
    .nullable(),
});
const diagramEdgeSchema = z.strictObject({
  from: id,
  to: id,
  label: text(72).nullable(),
  description,
  style: z.enum(["solid", "dashed"]).nullable(),
});
export const diagramGraphSchema = z.strictObject({
  groups: z.array(diagramGroupSchema).max(10),
  nodes: z.array(diagramNodeSchema).min(1).max(34),
  edges: z.array(diagramEdgeSchema).max(48),
});
export type DiagramGraphNode = z.infer<typeof diagramNodeSchema>;
export type DiagramGraphEdge = z.infer<typeof diagramEdgeSchema>;
export type DiagramGraph = z.infer<typeof diagramGraphSchema>;
