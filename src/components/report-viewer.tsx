"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import Hero from "~/components/hero";
import {
  parseReport,
  MAX_REPORT_BYTES,
  type ArchitectureReport,
} from "~/features/report/schema";
import { compileDiagramGraph } from "~/features/report/graph";
import {
  REPORT_PROMPT,
  REPORT_SCHEMA,
  REPORT_TEMPLATE,
  SAMPLE_REPORT,
} from "~/features/report/prompt";
import { exportMermaidSvgAsPng } from "~/features/diagram/export";

const MermaidChart = dynamic(() => import("~/components/mermaid-diagram"), {
  ssr: false,
  loading: () => <p role="status">Loading local diagram renderer…</p>,
});

const STORAGE_KEY = "gitdiagram.local.report.v1";
function download(content: string, name: string, type = "application/json") {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
const json = (value: unknown) => JSON.stringify(value, null, 2);

export default function ReportViewer() {
  const generation = useRef(0);
  const rememberRef = useRef(false);
  const [renderEpoch, setRenderEpoch] = useState(0);
  const [report, setReport] = useState<ArchitectureReport | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [remember, setRemember] = useState(false);
  const [paste, setPaste] = useState("");
  const [tab, setTab] = useState("overview");
  const [rendered, setRendered] = useState(false);
  const diagram = useRef<HTMLDivElement>(null);
  const chart = report ? compileDiagramGraph({ graph: report.graph }) : "";

  function importText(text: string, request = ++generation.current) {
    if (request !== generation.current) return;
    try {
      const validated = parseReport(text);
      setRenderEpoch((epoch) => epoch + 1);
      setRendered(false);
      setReport(validated);
      setError("");
      setNotice("Report loaded locally.");
      if (rememberRef.current) {
        try {
          localStorage.setItem(STORAGE_KEY, json(validated));
        } catch {
          setError("Report loaded, but browser storage is unavailable.");
        }
      }
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to import report.",
      );
    }
  }
  function toggleRemember(enabled: boolean) {
    try {
      if (enabled && report) localStorage.setItem(STORAGE_KEY, json(report));
      if (!enabled) localStorage.removeItem(STORAGE_KEY);
      rememberRef.current = enabled;
      setRemember(enabled);
      setError("");
    } catch {
      setError(
        "Browser storage is unavailable. The report is still available in this session.",
      );
    }
  }
  function clear() {
    generation.current += 1;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      setError("Unable to clear browser storage.");
      return;
    }
    setError("");
    setReport(null);
    setPaste("");
    rememberRef.current = false;
    setRemember(false);
    setRendered(false);
    setNotice("Report and remembered browser copy cleared.");
  }
  function restore() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setNotice("No remembered report in this browser.");
        return;
      }
      parseReport(stored);
      rememberRef.current = true;
      setRemember(true);
      importText(stored);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Browser storage is unavailable.",
      );
    }
  }
  async function exportImage(format: "svg" | "png") {
    const svg = diagram.current?.querySelector("svg");
    if (!svg) return;
    try {
      if (format === "png") await exportMermaidSvgAsPng(svg);
      else
        download(
          new XMLSerializer().serializeToString(svg),
          "diagram.svg",
          "image/svg+xml",
        );
    } catch {
      setError("Unable to export the diagram image.");
    }
  }
  return (
    <main className="app-shell">
      <header className="hero">
        <Hero />
        <p>
          Turn your repository report into an interactive architecture diagram.
        </p>
        <p className="hero-caption">
          Your tools prepare it. Everything here stays on your machine.
        </p>
      </header>
      <section className="workflow neo-panel" aria-label="Report workflow">
        <div className="step import-step">
          <label className="report-import">
            <span className="report-file-slot neo-input">
              <svg
                className="import-icon"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" />
                <path d="M14 2v6h6M8 13h8M8 17h5" />
              </svg>
              <span className="import-copy">
                <strong>Choose a JSON report</strong>
                <span>From your own coding tools</span>
              </span>
            </span>
            <span className="import-cta neo-button">
              Import report <span aria-hidden="true">→</span>
            </span>
            <input
              aria-label="Import report"
              type="file"
              accept=".json,application/json"
              onChange={async (event) => {
                const request = ++generation.current;
                const file = event.currentTarget.files?.[0];
                event.currentTarget.value = "";
                if (!file) return;
                if (file.size > MAX_REPORT_BYTES) {
                  setError("Report must be smaller than 2 MB.");
                  return;
                }
                try {
                  importText(await file.text(), request);
                } catch {
                  if (request === generation.current)
                    setError("Unable to read that file.");
                }
              }}
            />
          </label>
          <div className="sample-actions">
            <span>Try it first:</span>
            <button
              className="neo-button sample-button"
              onClick={() => importText(json(SAMPLE_REPORT))}
            >
              Explore a sample
            </button>
            <button
              className="text-button"
              onClick={() =>
                download(json(SAMPLE_REPORT), "sample-report.json")
              }
            >
              Download sample
            </button>
          </div>
          <details className="paste-details">
            <summary>Paste JSON instead</summary>
            <textarea
              aria-label="Report JSON"
              value={paste}
              maxLength={MAX_REPORT_BYTES}
              onChange={(event) => setPaste(event.target.value)}
            />
            <button className="neo-button" onClick={() => importText(paste)}>
              Import pasted JSON
            </button>
          </details>
        </div>
        <div className="step prepare-step">
          <div className="prepare-copy">
            <h2>Need a report?</h2>
            <p>Give your coding assistant the prompt and template.</p>
          </div>
          <div className="actions">
            <button
              className="neo-button-muted"
              onClick={() =>
                download(REPORT_PROMPT, "architecture-prompt.txt", "text/plain")
              }
            >
              Download prompt
            </button>
            <button
              className="neo-button-muted"
              onClick={() =>
                download(json(REPORT_TEMPLATE), "report-template.json")
              }
            >
              Template
            </button>
            <button
              className="neo-button-muted"
              onClick={() =>
                download(json(REPORT_SCHEMA), "report-schema.json")
              }
            >
              Schema
            </button>
          </div>
        </div>
        <svg
          className="card-sparkle"
          viewBox="0 0 100 100"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="m39 9 10 28 30 4-25 17 4 31-21-22-29 10 14-27L9 30l29 8Z"
            fill="#38bdf8"
            stroke="black"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M82 10v14M75 17h14M12 85v10M7 90h10"
            stroke="black"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </section>
      <div className="storage-controls">
        <label>
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => toggleRemember(event.target.checked)}
          />{" "}
          Remember this report in this browser
        </label>
        <button className="text-button" onClick={restore}>
          Load remembered report
        </button>
        <button className="text-button" onClick={clear}>
          Clear report &amp; browser copy
        </button>
      </div>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="notice">
          {notice}
        </p>
      )}
      {report ? (
        <section className="report-section">
          <div className="report-heading">
            <div>
              <span className="eyebrow">03 / EXPLORE</span>
              <h2>{report.repository.name}</h2>
              <p>{report.repository.revision ?? "Revision not provided"}</p>
            </div>
            <div className="actions">
              <button
                onClick={() =>
                  download(json(report), "architecture-report.json")
                }
              >
                Report JSON
              </button>
              <button
                onClick={() => download(chart, "diagram.mmd", "text/plain")}
              >
                Mermaid
              </button>
              <button
                disabled={!rendered}
                onClick={() => void exportImage("svg")}
              >
                SVG
              </button>
              <button
                disabled={!rendered}
                onClick={() => void exportImage("png")}
              >
                PNG
              </button>
            </div>
          </div>
          <div ref={diagram}>
            <MermaidChart
              key={renderEpoch}
              chart={chart}
              onRenderComplete={() => setRendered(true)}
              onRenderError={() => setRendered(false)}
            />
          </div>
          <p className="diagram-help">
            Drag to pan · Use + / − to zoom · Fit to reset · Focus the diagram
            for keyboard controls
          </p>
          <div className="tabs" role="tablist" aria-label="Report details">
            {["overview", "components", "evidence", "files"].map((name) => (
              <button
                key={name}
                role="tab"
                id={`tab-${name}`}
                aria-controls="report-panel"
                aria-selected={tab === name}
                onClick={() => setTab(name)}
              >
                {name}
              </button>
            ))}
          </div>
          <div
            id="report-panel"
            className="report-panel"
            role="tabpanel"
            aria-labelledby={`tab-${tab}`}
          >
            {tab === "overview" && (
              <>
                <p className="explanation">{report.explanation}</p>
                <h3>Uncertainties</h3>
                {report.uncertainties.length ? (
                  <ul>
                    {report.uncertainties.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No uncertainties recorded.</p>
                )}
              </>
            )}
            {tab === "components" && (
              <div className="node-grid">
                {report.graph.nodes.map((node) => (
                  <article key={node.id}>
                    <span className="eyebrow">{node.type}</span>
                    <h3>{node.label}</h3>
                    <p>{node.description}</p>
                    <code>{node.path}</code>
                  </article>
                ))}
              </div>
            )}
            {tab === "evidence" && (
              <div className="evidence-list">
                {report.evidence.length ? (
                  report.evidence.map((item, index) => (
                    <article key={index}>
                      <h3>
                        {item.from} → {item.to}{" "}
                        <span className="confidence">{item.confidence}</span>
                      </h3>
                      <p>{item.note}</p>
                      <ul>
                        {item.paths.map((path, i) => (
                          <li key={i}>
                            <code>{path}</code>
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))
                ) : (
                  <p>No relationship evidence recorded.</p>
                )}
              </div>
            )}
            {tab === "files" && (
              <pre className="file-tree">{report.fileTree.join("\n")}</pre>
            )}
          </div>
        </section>
      ) : null}
    </main>
  );
}
