"use client";
interface Props {
  formattedZoom: string;
  isPanZoomReady: boolean;
  onFit: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}
export function MermaidDiagramToolbar(props: Props) {
  return <div data-diagram-toolbar className="diagram-toolbar">
    <button aria-label="Zoom out" disabled={!props.isPanZoomReady} onClick={props.onZoomOut}>−</button>
    <span>{props.formattedZoom}</span>
    <button aria-label="Zoom in" disabled={!props.isPanZoomReady} onClick={props.onZoomIn}>+</button>
    <button disabled={!props.isPanZoomReady} onClick={props.onFit}>Fit</button>
  </div>;
}
