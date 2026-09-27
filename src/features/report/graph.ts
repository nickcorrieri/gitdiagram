import type { DiagramGraph, DiagramGraphEdge, DiagramGraphNode } from "~/features/diagram/graph";
import { diagramGraphSchema, normalizeDiagramText } from "~/features/diagram/graph";

function escapeMermaidText(value: string): string {
  const escaped = normalizeDiagramText(value)
    .replace(/&/g, "&amp;")
    // Mermaid decodes its own '#nn;' entity codes inside label text, so an
    // unescaped '#' would reintroduce characters the rules below just removed.
    .replace(/#/g, "&#35;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    // A label that opens with a backtick turns the whole quoted string into a
    // Mermaid markdown string, which fails to lex and takes the entire diagram
    // down. Nothing downstream parses Mermaid on the server, so an unescaped
    // backtick would be persisted and break the artifact for every later reader.
    .replace(/`/g, "&#96;")
    .replace(/\\/g, "&#92;")
    .replace(/\|/g, "&#124;")
    .replace(/\[/g, "&#91;")
    .replace(/\]/g, "&#93;")
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;")
    .replace(/\(/g, "&#40;")
    .replace(/\)/g, "&#41;")
    .trim();

  return escaped || "Unnamed";
}

const genericNodeTypes = new Set([
  "app",
  "application",
  "component",
  "directory",
  "folder",
  "library",
  "module",
  "package",
  "project",
  "repo",
  "repository",
  "service",
  "system",
  "utility",
]);
const MAX_NODE_FILE_HINT_LENGTH = 18;

function detailForNode(node: DiagramGraphNode): string | null {
  const type = node.type.trim();
  if (!type) {
    return null;
  }

  const normalizedType = type.toLowerCase();
  const normalizedLabel = node.label.trim().toLowerCase();
  if (
    genericNodeTypes.has(normalizedType) ||
    normalizedType === normalizedLabel ||
    normalizedType.includes(normalizedLabel) ||
    normalizedLabel.includes(normalizedType) ||
    type.split(/\s+/).length > 4
  ) {
    return null;
  }

  return escapeMermaidText(type);
}

function fileHintForNode(node: DiagramGraphNode): string | null {
  const path = node.path?.trim();
  if (!path || path.endsWith("/") || !path.includes(".")) {
    return null;
  }

  const fileName = path.split("/").pop()?.trim();
  if (!fileName || fileName.length > MAX_NODE_FILE_HINT_LENGTH) {
    return null;
  }

  return `[${escapeMermaidText(fileName)}]`;
}

function labelForNode(node: DiagramGraphNode): string {
  const primaryLabel = escapeMermaidText(node.label);
  const secondaryDetail = detailForNode(node);
  const fileHint = fileHintForNode(node);

  return [primaryLabel, secondaryDetail ?? fileHint]
    .filter(Boolean)
    .join(" / ");
}

function mermaidNodeId(nodeId: string): string {
  return `node_${nodeId}`;
}

function mermaidGroupId(groupId: string): string {
  return `group_${groupId}`;
}

function renderNode(node: DiagramGraphNode): string {
  const label = labelForNode(node);
  const shape = node.shape ?? "box";
  const nodeId = mermaidNodeId(node.id);

  switch (shape) {
    case "database":
      return `${nodeId}[("${label}")]`;
    case "circle":
      return `${nodeId}(("${label}"))`;
    case "hexagon":
      return `${nodeId}{{"${label}"}}`;
    case "queue":
    case "document":
    case "box":
    default:
      return `${nodeId}["${label}"]`;
  }
}

function renderEdge(edge: DiagramGraphEdge): string {
  const connector = edge.style === "dashed" ? "-.->" : "-->";
  const from = mermaidNodeId(edge.from);
  const to = mermaidNodeId(edge.to);
  if (!edge.label) {
    return `${from} ${connector} ${to}`;
  }

  return `${from} ${connector}|"${escapeMermaidText(edge.label)}"| ${to}`;
}

const toneClassNames = [
  "toneBlue",
  "toneAmber",
  "toneMint",
  "toneRose",
  "toneIndigo",
  "toneTeal",
] as const;

function toneClassForNode(
  node: DiagramGraphNode,
  groupOrder: Map<string, number>,
): string {
  const groupIndex = node.groupId ? groupOrder.get(node.groupId) : undefined;
  if (groupIndex !== undefined)
    return toneClassNames[groupIndex % toneClassNames.length]!;
  // Meaningful colour is a compiler guarantee, even when the planner needs no
  // groups. Existing grouped diagrams retain their familiar subsystem palette.
  const words = `${node.label} ${node.type}`.toLowerCase();
  if (
    node.shape === "database" ||
    /database|storage|cache|postgres|sqlite|redis|clickhouse/.test(words)
  )
    return "toneAmber";
  if (/queue|worker|background|scheduler|task/.test(words)) return "toneRose";
  if (/client|browser|user|frontend|view|screen|ui\b/.test(words))
    return "toneBlue";
  if (/api|server|route|request|handler|webhook/.test(words)) return "toneMint";
  if (!node.path || /model|inference|provider|integration/.test(words))
    return "toneIndigo";
  return "toneTeal";
}

export function compileDiagramGraph(params: { graph: DiagramGraph }): string {
  const graph = diagramGraphSchema.parse(params.graph);
  const lines: string[] = ["flowchart TD"];
  const groupedNodeIds = new Set<string>();
  const classAssignments = new Map<string, string[]>();
  const groupOrder = new Map(
    graph.groups.map((group, index) => [group.id, index]),
  );

  const pushNode = (node: DiagramGraphNode, indent = "") => {
    lines.push(`${indent}${renderNode(node)}`);
    const className = toneClassForNode(node, groupOrder);
    classAssignments.set(className, [
      ...(classAssignments.get(className) ?? []),
      node.id,
    ]);
  };

  for (const group of graph.groups) {
    lines.push("");
    lines.push(
      `subgraph ${mermaidGroupId(group.id)}["${escapeMermaidText(group.label)}"]`,
    );
    for (const node of graph.nodes.filter(
      (candidate) => candidate.groupId === group.id,
    )) {
      pushNode(node, "  ");
      groupedNodeIds.add(node.id);
    }
    lines.push("end");
  }

  const ungroupedNodes = graph.nodes.filter(
    (node) => !groupedNodeIds.has(node.id),
  );
  if (ungroupedNodes.length) {
    lines.push("");
    for (const node of ungroupedNodes) {
      pushNode(node);
    }
  }

  if (graph.edges.length) {
    lines.push("");
    for (const edge of graph.edges) {
      lines.push(renderEdge(edge));
    }
  }

  lines.push("");
  lines.push(
    "classDef toneNeutral fill:#f8fafc,stroke:#334155,stroke-width:1.5px,color:#0f172a",
  );
  lines.push(
    "classDef toneBlue fill:#dbeafe,stroke:#2563eb,stroke-width:1.5px,color:#172554",
  );
  lines.push(
    "classDef toneAmber fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#78350f",
  );
  lines.push(
    "classDef toneMint fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#14532d",
  );
  lines.push(
    "classDef toneRose fill:#ffe4e6,stroke:#e11d48,stroke-width:1.5px,color:#881337",
  );
  lines.push(
    "classDef toneIndigo fill:#e0e7ff,stroke:#4f46e5,stroke-width:1.5px,color:#312e81",
  );
  lines.push(
    "classDef toneTeal fill:#ccfbf1,stroke:#0f766e,stroke-width:1.5px,color:#134e4a",
  );

  for (const [className, nodeIds] of classAssignments) {
    if (!nodeIds.length) continue;
    lines.push(`class ${nodeIds.map(mermaidNodeId).join(",")} ${className}`);
  }

  return lines.join("\n").trim();
}
