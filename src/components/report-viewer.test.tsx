import { createElement, useEffect } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import ReportViewer from "./report-viewer";
import { SAMPLE_REPORT } from "~/features/report/prompt";

vi.mock("next/dynamic", () => ({
  default: () =>
    function FakeDiagram({
      onRenderComplete,
    }: {
      onRenderComplete: () => void;
    }) {
      useEffect(() => {
        onRenderComplete();
      }, [onRenderComplete]);
      return createElement("div", { "data-testid": "diagram" });
    },
}));
const storageKey = "gitdiagram.local.report.v1";
const serialized = JSON.stringify(SAMPLE_REPORT);
beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal(
    "URL",
    Object.assign(URL, {
      createObjectURL: vi.fn(() => "blob:local-download"),
      revokeObjectURL: vi.fn(),
    }),
  );
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
describe("local report workflow", () => {
  it("imports valid pasted JSON without remembering by default", () => {
    render(createElement(ReportViewer));
    fireEvent.change(screen.getByLabelText("Report JSON"), {
      target: { value: serialized },
    });
    fireEvent.click(screen.getByText("Import pasted JSON"));
    expect(
      screen.getByRole("heading", { name: SAMPLE_REPORT.repository.name }),
    ).toBeInTheDocument();
    expect(localStorage.getItem(storageKey)).toBeNull();
  });
  it("reads an imported file locally", async () => {
    render(createElement(ReportViewer));
    const file = new File([serialized], "report.json", {
      type: "application/json",
    });
    Object.defineProperty(file, "text", {
      value: vi.fn().mockResolvedValue(serialized),
    });
    fireEvent.change(screen.getByLabelText("Import report"), {
      target: { files: [file] },
    });
    expect(
      await screen.findByRole("heading", {
        name: SAMPLE_REPORT.repository.name,
      }),
    ).toBeInTheDocument();
    expect(file.text).toHaveBeenCalledOnce();
    expect(localStorage.getItem(storageKey)).toBeNull();
  });
  it("rejects malformed input and does not persist it", () => {
    render(createElement(ReportViewer));
    fireEvent.click(
      screen.getByLabelText("Remember this report in this browser"),
    );
    fireEvent.change(screen.getByLabelText("Report JSON"), {
      target: { value: '{"version":999}' },
    });
    fireEvent.click(screen.getByText("Import pasted JSON"));
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.queryByTestId("diagram")).toBeNull();
    expect(localStorage.getItem(storageKey)).toBeNull();
  });
  it("remembers only on opt-in and clears report and browser copy", () => {
    render(createElement(ReportViewer));
    fireEvent.click(screen.getByText("Explore a sample"));
    fireEvent.click(
      screen.getByLabelText("Remember this report in this browser"),
    );
    expect(JSON.parse(localStorage.getItem(storageKey)!)).toEqual(
      SAMPLE_REPORT,
    );
    fireEvent.click(screen.getByText("Clear report & browser copy"));
    expect(localStorage.getItem(storageKey)).toBeNull();
    expect(screen.queryByTestId("diagram")).toBeNull();
  });
  it("requires explicit restore and revalidates remembered data", () => {
    localStorage.setItem(storageKey, "invalid");
    render(createElement(ReportViewer));
    expect(screen.queryByRole("alert")).toBeNull();
    fireEvent.click(screen.getByText("Load remembered report"));
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
  it("restores a valid browser copy with the remember control enabled", async () => {
    localStorage.setItem(storageKey, serialized);
    render(createElement(ReportViewer));
    fireEvent.click(screen.getByText("Load remembered report"));
    expect(
      await screen.findByRole("heading", {
        name: SAMPLE_REPORT.repository.name,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Remember this report in this browser"),
    ).toBeChecked();
  });
  it("keeps exports ready when the same report is imported again", async () => {
    render(createElement(ReportViewer));
    fireEvent.click(screen.getByText("Explore a sample"));
    await waitFor(() => expect(screen.getByText("SVG")).toBeEnabled());
    fireEvent.click(screen.getByText("Explore a sample"));
    await waitFor(() => expect(screen.getByText("SVG")).toBeEnabled());
    expect(screen.getByText("PNG")).toBeEnabled();
  });
  it("does not resurrect a pending file after clearing", async () => {
    let finish!: (text: string) => void;
    const pending = new Promise<string>((resolve) => {
      finish = resolve;
    });
    render(createElement(ReportViewer));
    fireEvent.click(
      screen.getByLabelText("Remember this report in this browser"),
    );
    const file = new File([], "slow.json");
    Object.defineProperty(file, "text", { value: () => pending });
    fireEvent.change(screen.getByLabelText("Import report"), {
      target: { files: [file] },
    });
    fireEvent.click(screen.getByText("Clear report & browser copy"));
    finish(serialized);
    await pending;
    await waitFor(() => expect(screen.queryByTestId("diagram")).toBeNull());
    expect(localStorage.getItem(storageKey)).toBeNull();
  });
  it("uses the current remember preference when a file finishes", async () => {
    let finish!: (text: string) => void;
    const pending = new Promise<string>((resolve) => {
      finish = resolve;
    });
    render(createElement(ReportViewer));
    fireEvent.click(
      screen.getByLabelText("Remember this report in this browser"),
    );
    const file = new File([], "slow.json");
    Object.defineProperty(file, "text", { value: () => pending });
    fireEvent.change(screen.getByLabelText("Import report"), {
      target: { files: [file] },
    });
    fireEvent.click(
      screen.getByLabelText("Remember this report in this browser"),
    );
    finish(serialized);
    expect(
      await screen.findByRole("heading", {
        name: SAMPLE_REPORT.repository.name,
      }),
    ).toBeInTheDocument();
    expect(localStorage.getItem(storageKey)).toBeNull();
  });
  it("a newer import wins over a slow file read", async () => {
    let finish!: (text: string) => void;
    const pending = new Promise<string>((resolve) => {
      finish = resolve;
    });
    render(createElement(ReportViewer));
    const file = new File([], "slow.json");
    Object.defineProperty(file, "text", { value: () => pending });
    fireEvent.change(screen.getByLabelText("Import report"), {
      target: { files: [file] },
    });
    fireEvent.change(screen.getByLabelText("Report JSON"), {
      target: {
        value: JSON.stringify({
          ...SAMPLE_REPORT,
          repository: { ...SAMPLE_REPORT.repository, name: "New report" },
        }),
      },
    });
    fireEvent.click(screen.getByText("Import pasted JSON"));
    finish(serialized);
    await pending;
    expect(
      await screen.findByRole("heading", { name: "New report" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: SAMPLE_REPORT.repository.name }),
    ).toBeNull();
  });
  it("downloads prompt from a browser Blob", () => {
    render(createElement(ReportViewer));
    fireEvent.click(screen.getByText("Download prompt"));
    expect(URL.createObjectURL).toHaveBeenCalledWith(expect.any(Blob));
    expect(HTMLAnchorElement.prototype.click).toHaveBeenCalledOnce();
  });
});
