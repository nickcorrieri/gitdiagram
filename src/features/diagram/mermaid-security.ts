// Only the app's graph compiler supplies Mermaid. Reject configuration and
// interaction syntax before the strict renderer.
export function sanitizeMermaidSourceForRender(source: string): string {
  // Compiler labels are quoted and quotes within labels are entity escaped.
  // Strip quoted text only for syntax inspection: a URL in a label is inert.
  const syntax = source.replace(/"[^"\r\n]*"/gu, '""');
  const withoutArrows = source.replace(/-->|-\.->|---/gu, "");
  if (
    /%%\{|<|>/u.test(withoutArrows) ||
    /^\s*(?:---|click(?:\s|$)|style(?:\s|$)|linkStyle(?:\s|$))/imu.test(
      syntax,
    ) ||
    /@\{|@import|\b(?:https?:|javascript:|data:|url\s*\()/iu.test(syntax)
  ) {
    throw new Error(
      "Interactive or external Mermaid content is not supported.",
    );
  }
  return source;
}

function hasExternalResource(value: string): boolean {
  if (/@import/iu.test(value)) return true;
  return Array.from(value.matchAll(/url\(\s*([^)]*)\)/giu)).some(
    (match) => !/^(["']?)#[a-z0-9_-]+\1$/iu.test(match[1]?.trim() ?? ""),
  );
}
export function enforceSafeMermaidLinks(root: ParentNode): void {
  for (const element of root.querySelectorAll(
    "a, image, foreignObject, script, iframe, animate, set",
  ))
    element.remove();
  for (const element of root.querySelectorAll("*")) {
    for (const attribute of Array.from(element.attributes)) {
      if (
        /^(?:href|xlink:href|src|on)/iu.test(attribute.name) ||
        hasExternalResource(attribute.value)
      )
        element.removeAttribute(attribute.name);
    }
  }
  for (const style of root.querySelectorAll("style")) {
    if (hasExternalResource(style.textContent ?? "")) style.remove();
  }
}
