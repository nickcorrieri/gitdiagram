"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import DOMPurify from "dompurify";
import mermaid from "mermaid";

import { MermaidDiagramToolbar } from "~/components/mermaid-diagram-toolbar";
import {
  createHiddenRenderTarget,
  withDomNodesSerializingSafely,
} from "~/components/mermaid-diagram-helpers";
import {
  enforceSafeMermaidLinks,
  sanitizeMermaidSourceForRender,
} from "~/features/diagram/mermaid-security";
import { useMermaidViewport } from "~/hooks/use-mermaid-viewport";

interface MermaidChartProps {
  chart: string;
  zoomingEnabled?: boolean;
  onRenderError?: (message: string) => void;
  onRenderComplete?: () => void;
  containerClassName?: string;
  diagramClassName?: string;
  backgroundColor?: string;
  fitToContainer?: boolean;
}

const INTERACTIVE_FIT_PADDING = 24;
const PREVIEW_FIT_PADDING = 16;
const INTERACTIVE_VIEWER_PROPS = {
  "aria-label": "Interactive diagram viewer",
  role: "region",
  tabIndex: 0,
};

const MermaidChart = ({
  chart,
  zoomingEnabled = true,
  onRenderError,
  onRenderComplete,
  containerClassName,
  diagramClassName,
  backgroundColor,
  fitToContainer = false,
}: MermaidChartProps) => {
  const reportedRenderErrorRef = useRef<string | null>(null);
  const [renderMessage, setRenderMessage] = useState<string | null>(null);
  const [renderVersion, setRenderVersion] = useState(0);
  const fitPadding = zoomingEnabled
    ? INTERACTIVE_FIT_PADDING
    : fitToContainer
      ? PREVIEW_FIT_PADDING
      : 0;
  const {
    containerRef,
    diagramRef,
    disconnectResizeObserver,
    fitDiagram,
    formattedZoom,
    handleClickCapture,
    handleDragStart,
    handleKeyDown,
    handleLostPointerCapture,
    handlePointerCancel,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    interactionLayerRef,
    isPanZoomReady,
    prepareForRender,
    stepZoom,
  } = useMermaidViewport({
    fitPadding,
    fitToContainer,
    onRenderComplete,
    renderVersion,
    zoomingEnabled,
  });

  const reportRenderError = useEffectEvent((message: string) => {
    onRenderError?.(message);
  });

  useEffect(() => {
    let cancelled = false;

    const baseConfig = {
      startOnLoad: false,
      suppressErrorRendering: true,
      securityLevel: "strict" as const,
      secure: ["securityLevel", "startOnLoad", "maxTextSize"],
      theme: "base" as const,
      // Pure SVG labels survive strict sanitization without relying on
      // foreignObject HTML, which is both harder to secure and less portable.
      htmlLabels: false,
      layout: "dagre",
      // Mermaid 12 defaults to the "neo" look and a 120px wrap, which splits
      // file paths mid-name; keep the classic look and the old 200px wrap.
      look: "classic" as const,
      flowchart: {
        wrappingWidth: 200,
        curve: "linear" as const,
        nodeSpacing: 50,
        rankSpacing: 50,
        padding: 15,
      },
      themeVariables: {
        background: backgroundColor ?? "#ffffff",
        primaryColor: "#f7f7f7",
        primaryBorderColor: "#334155",
        primaryTextColor: "#171717",
        lineColor: "#64748b",
        secondaryColor: "#f0f0f0",
        tertiaryColor: "#f7f7f7",
      },

    };

    const renderDiagram = async () => {
      const mermaidElement = diagramRef.current;
      if (!(mermaidElement instanceof HTMLDivElement)) return;

      setRenderMessage(null);
      prepareForRender();
      mermaid.initialize(baseConfig);
      mermaidElement.removeAttribute("data-processed");
      const renderTarget = createHiddenRenderTarget(
        Math.round(
          mermaidElement.getBoundingClientRect().width ||
            containerRef.current?.getBoundingClientRect().width ||
            window.innerWidth,
        ),
      );

      try {
        const renderId = `gitdiagram-${Math.random().toString(36).slice(2)}`;
        const safeChart = sanitizeMermaidSourceForRender(chart);
        const { svg } = await withDomNodesSerializingSafely(() =>
          mermaid.render(renderId, safeChart, renderTarget),
        );
        if (cancelled) return;

        const sanitized = document.createElement("div");
        sanitized.innerHTML = DOMPurify.sanitize(svg, {
          USE_PROFILES: { svg: true, svgFilters: true },
          FORBID_TAGS: ["script", "foreignObject", "image", "a", "iframe", "animate", "set"],
          FORBID_ATTR: ["href", "xlink:href"],
        });
        enforceSafeMermaidLinks(sanitized);
        mermaidElement.replaceChildren(...Array.from(sanitized.childNodes));
        setRenderVersion((currentVersion) => currentVersion + 1);
      } catch (error) {
        if (cancelled) return;
        console.error("Mermaid render failed:", error);
        const message =
          error instanceof Error
            ? error.message
            : "Unknown Mermaid render error.";
        setRenderMessage(`Mermaid render failed: ${message}`);
        const reportKey = `${chart}::${message}`;
        if (reportedRenderErrorRef.current !== reportKey) {
          reportedRenderErrorRef.current = reportKey;
          reportRenderError(message);
        }
      } finally {
        renderTarget.remove();
      }
    };

    void renderDiagram();

    return () => {
      cancelled = true;
      disconnectResizeObserver();
    };
  }, [
    backgroundColor,
    chart,
    containerRef,
    diagramRef,
    disconnectResizeObserver,
    prepareForRender,
  ]);

  return (
    <div ref={containerRef} className={`diagram-shell ${containerClassName ?? ""}`}>
      {renderMessage && <p role="alert" className="error">{renderMessage}</p>}
      <div ref={interactionLayerRef}
        {...(zoomingEnabled ? INTERACTIVE_VIEWER_PROPS : {})}
        onKeyDown={handleKeyDown} className="diagram-interaction"
        onClickCapture={handleClickCapture} onDragStart={handleDragStart}
        onLostPointerCapture={handleLostPointerCapture} onPointerCancel={handlePointerCancel}
        onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
        {zoomingEnabled && <MermaidDiagramToolbar formattedZoom={formattedZoom}
          isPanZoomReady={isPanZoomReady} onFit={() => fitDiagram(true)}
          onZoomIn={() => stepZoom(1.18)} onZoomOut={() => stepZoom(1 / 1.18)} />}
        <div ref={diagramRef} className={`mermaid ${!isPanZoomReady ? "pending" : ""} ${diagramClassName ?? ""}`} />
      </div>
    </div>
  );
};

export default MermaidChart;
