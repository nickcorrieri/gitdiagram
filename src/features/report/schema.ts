import { z } from "zod";
import { diagramGraphSchema, repositoryPathSchema } from "~/features/diagram/graph";

export const MAX_REPORT_BYTES = 2 * 1024 * 1024;
const prose = (max: number) => z.string().max(max).regex(/^[^\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]*$/u, "Text contains unsupported control characters.");
const id = z.string().max(64).regex(/^[a-z][a-z0-9_]*$/);
export const architectureReportSchema = z.strictObject({
  version: z.literal(1),
  repository: z.strictObject({ name: prose(200).min(1), revision: prose(200).nullable() }),
  explanation: prose(30_000).min(1),
  fileTree: z.array(repositoryPathSchema).max(20_000),
  graph: diagramGraphSchema,
  evidence: z.array(z.strictObject({
    from: id, to: id, paths: z.array(repositoryPathSchema).min(1).max(48),
    note: prose(1000).min(1), confidence: z.enum(["confirmed", "inferred"]),
  })).max(48),
  uncertainties: z.array(prose(1000).min(1)).max(40),
});
export type ArchitectureReport = z.infer<typeof architectureReportSchema>;

/** Validates the report's declared tree; this does not verify a filesystem. */
export function parseReport(text: string): ArchitectureReport {
  if (new TextEncoder().encode(text).byteLength > MAX_REPORT_BYTES) throw new Error("Report exceeds the 2 MiB limit.");
  let input: unknown;
  try { input = JSON.parse(text); } catch { throw new Error("Report must be a valid JSON object without Markdown fences."); }
  const result = architectureReportSchema.safeParse(input);
  if (!result.success) {
    const issue = result.error.issues[0]!;
    throw new Error(`Invalid report at ${issue.path.join(".") || "report"}: ${issue.message}`);
  }
  const report = result.data;
  const unique = (values: string[], name: string) => {
    const set = new Set(values);
    if (set.size !== values.length) throw new Error(`Duplicate ${name} in report.`);
    return set;
  };
  const tree = unique(report.fileTree, "file tree paths");
  const groups = unique(report.graph.groups.map((group) => group.id), "group ids");
  const nodes = unique(report.graph.nodes.map((node) => node.id), "node ids");
  for (const node of report.graph.nodes) {
    if (node.groupId !== null && !groups.has(node.groupId)) throw new Error(`Node ${node.id} references an unknown group.`);
    if (node.path !== null && !tree.has(node.path)) throw new Error(`Node ${node.id} path is missing from the declared fileTree.`);
  }
  const edges = unique(report.graph.edges.map((edge) => `${edge.from}:${edge.to}`), "edge pairs");
  for (const edge of report.graph.edges) {
    if (!nodes.has(edge.from) || !nodes.has(edge.to)) throw new Error("Graph edge references an unknown node.");
  }
  for (const evidence of report.evidence) {
    if (!edges.has(`${evidence.from}:${evidence.to}`)) throw new Error("Evidence references an unknown graph edge.");
    if (new Set(evidence.paths).size !== evidence.paths.length) throw new Error("Evidence contains duplicate paths.");
    for (const path of evidence.paths) if (!tree.has(path)) throw new Error("Evidence path is missing from the declared fileTree.");
  }
  return report;
}
