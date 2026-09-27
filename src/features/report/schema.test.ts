import { describe, expect, it } from "vitest";
import { compileDiagramGraph } from "./graph";
import { SAMPLE_REPORT, REPORT_TEMPLATE, REPORT_SCHEMA } from "./prompt";
import { MAX_REPORT_BYTES, parseReport } from "./schema";

const valid = () => structuredClone(SAMPLE_REPORT);
const parse = (value: unknown) => parseReport(JSON.stringify(value));
describe("local reports", () => {
  it("accepts usable sample and template, requiring nullable fields", () => {
    expect(parse(valid())).toEqual(SAMPLE_REPORT);
    expect(parse(REPORT_TEMPLATE)).toEqual(REPORT_TEMPLATE);
    expect(REPORT_SCHEMA).toHaveProperty("additionalProperties", false);
    const value = valid();
    delete (value.repository as { revision?: string | null }).revision;
    expect(() => parse(value)).toThrow();
  });
  it.each(["https://example.test/a", "javascript:alert(1)", "/etc/passwd", "../secret", "src/../secret", "./src/a", "src//a", "src/a/", "src\\a", "src/a?x", "src/a#x", " src/a", "src/\u0000a"])("rejects unsafe or noncanonical path %s", (path) => {
    const value = valid(); value.fileTree = [path];
    expect(() => parse(value)).toThrow();
  });
  it("rejects unknown fields and prototype payloads", () => {
    expect(() => parse({ ...valid(), callback: "https://example.test" })).toThrow();
    expect(() => parseReport(JSON.stringify(valid()).replace('"version":1', '"version":1,"__proto__":{"polluted":true}'))).toThrow();
    const value = valid(); Object.assign(value.graph.nodes[0]!, { href: "https://example.test" });
    expect(() => parse(value)).toThrow();
    expect({}).not.toHaveProperty("polluted");
  });
  it("rejects duplicate ids and dangling references", () => {
    const value = valid(); value.graph.nodes.push({ ...value.graph.nodes[0]! });
    expect(() => parse(value)).toThrow(/Duplicate/);
    const unknownGroup = valid(); unknownGroup.graph.nodes[0]!.groupId = "missing";
    expect(() => parse(unknownGroup)).toThrow(/unknown group/);
    const edge = valid(); edge.graph.edges[0]!.to = "missing";
    expect(() => parse(edge)).toThrow(/unknown node/);
    const evidence = valid(); evidence.evidence[0]!.from = "storage";
    expect(() => parse(evidence)).toThrow(/unknown graph edge/);
    const path = valid(); path.evidence[0]!.paths = ["unobserved.ts"];
    expect(() => parse(path)).toThrow(/declared fileTree/);
  });
  it("rejects controls, malformed JSON and oversized reports", () => {
    const value = valid(); value.graph.nodes[0]!.label = "bad\nclick x";
    expect(() => parse(value)).toThrow();
    expect(() => parseReport("```json {} ```")).toThrow(/valid JSON/);
    expect(() => parseReport(" ".repeat(MAX_REPORT_BYTES + 1))).toThrow(/2 MiB/);
    const explanation = valid(); explanation.explanation = "a".repeat(30001);
    expect(() => parse(explanation)).toThrow();
    const ids = valid(); ids.graph.nodes[0]!.id = "a".repeat(65);
    expect(() => parse(ids)).toThrow();
    const notes = valid(); notes.evidence[0]!.note = "a".repeat(1001);
    expect(() => parse(notes)).toThrow();
  });
  it("enforces array and path quotas", () => {
    const tree = valid(); tree.fileTree = Array.from({ length: 20001 }, (_, index) => `src/file${index}.ts`);
    expect(() => parse(tree)).toThrow();
    const paths = valid(); paths.fileTree = ["a".repeat(513)];
    expect(() => parse(paths)).toThrow();
    const groups = valid(); groups.graph.groups = Array.from({ length: 11 }, (_, index) => ({ id: `group${index}`, label: "Group", description: null }));
    expect(() => parse(groups)).toThrow();
    const nodes = valid(); nodes.graph.nodes = Array.from({ length: 35 }, () => ({ ...nodes.graph.nodes[0]! }));
    expect(() => parse(nodes)).toThrow();
    const edges = valid(); edges.graph.edges = Array.from({ length: 49 }, () => ({ ...edges.graph.edges[0]! }));
    expect(() => parse(edges)).toThrow();
    const evidence = valid(); evidence.evidence = Array.from({ length: 49 }, () => ({ ...evidence.evidence[0]! }));
    expect(() => parse(evidence)).toThrow();
    const uncertainties = valid(); uncertainties.uncertainties = Array(41).fill("Unknown") as string[];
    expect(() => parse(uncertainties)).toThrow();
  });
  it("escapes Mermaid injection without adding callbacks or links", () => {
    const value = valid(); value.graph.nodes[0]!.label = '`"] click node_storage "https://evil.test"';
    const graph = compileDiagramGraph({ graph: parse(value).graph });
    expect(graph).toContain("&#96;");
    expect(graph).toContain("&quot;");
    expect(graph).not.toMatch(/^\s*(click|href|callback)\b/m);
    expect(graph).not.toContain('"https://evil.test"');
    const sample = compileDiagramGraph({ graph: SAMPLE_REPORT.graph });
    expect(sample).not.toMatch(/https?:|\bclick\b|\bhref\b/);
  });
});
