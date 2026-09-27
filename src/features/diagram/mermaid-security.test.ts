import { describe, expect, it } from "vitest";
import { compileDiagramGraph } from "~/features/report/graph";
import { SAMPLE_REPORT } from "~/features/report/prompt";
import { enforceSafeMermaidLinks, sanitizeMermaidSourceForRender } from "./mermaid-security";
describe("local Mermaid boundary", () => {
  it("preserves compiled static charts", () => {
    const source = 'flowchart TD\n n_a["App"] --> n_b[("Database")]';
    expect(sanitizeMermaidSourceForRender(source)).toBe(source);
  });
  it("allows URL-like plain labels from the compiler", () => {
    const graph = structuredClone(SAMPLE_REPORT.graph);
    graph.nodes[0]!.label = 'https://example.test/API "client"';
    graph.nodes[1]!.label = "data: is a source label";
    graph.edges[0]!.label = "javascript: shown as inert text";
    const source = compileDiagramGraph({ graph });
    expect(source).toContain("&quot;");
    expect(sanitizeMermaidSourceForRender(source)).toBe(source);
    expect(source).not.toMatch(/^\s*click\b/m);
  });
  it.each(['click n_a "https://github.com/x/y"', "click\nn_a callback", '%%{init: {securityLevel: "loose"}}%%', 'n_a["<img src=x>"]', 'n_a@{img: "x"}', 'style n_a fill:url("https://evil.test/x")', 'linkStyle 0 stroke:red', '---\nconfig:\n  securityLevel: loose', 'classDef malicious fill:url("https://evil.test/x")'])('rejects interactions or unsafe syntax: %s', (directive) => {
    expect(() => sanitizeMermaidSourceForRender(`flowchart TD\n${directive}`)).toThrow();
  });
  it("removes links, embedded resources, external styles, and event handlers", () => {
    const root = document.createElement("div");
    root.innerHTML = '<svg><a href="https://example.com">link</a><image href="https://example.com/a"/><foreignObject>html</foreignObject><style>@import "https://example.com";</style><path id="safe" marker-end="url(#marker)" onload="evil()" style="fill:url(https://example.com)"/></svg>';
    enforceSafeMermaidLinks(root);
    expect(root.querySelector("a,image,foreignObject,style")).toBeNull();
    expect(root.querySelector("path")?.hasAttribute("onload")).toBe(false);
    expect(root.querySelector("path")?.hasAttribute("style")).toBe(false);
    expect(root.querySelector("path")?.getAttribute("marker-end")).toBe("url(#marker)");
  });
});
