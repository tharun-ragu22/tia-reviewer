import "@testing-library/jest-dom";

import "@testing-library/jest-dom";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MainComponent from "../app/components/MainComponent";

global.fetch = jest.fn();

describe("Main component", () => {
  beforeEach(() => {
    global.fetch = jest.fn(async (url: string) => {
      if (url.includes("api/presigned-url")) {
        console.log("getting fake presigned url");
        return Promise.resolve({
          ok: true,
          json: async () => ({
            presigned_url: "/fake-url",
            file_uri: "",
          }),
        });
      }
      if (url.includes("fake-url")) {
        return Promise.resolve({
          ok: true,
        });
      }
      if (url.includes("api/verification")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({
            overall_rating: "",
            summary: "",
            findings: [],
          }),
        });
      }
    }) as jest.Mock;
  });
  it("navigates to results page on submit", async () => {
    // Given a PDF is less than 50MB and less than 1000 pages
    const validPDF = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });
    render(<MainComponent />);
    // When the file is uploaded
    const fileInput = screen.getByLabelText(/choose file/i);
    await userEvent.upload(fileInput, validPDF);
    const submitButton = screen.getByRole("button", { name: /verify document/i });
    await userEvent.click(submitButton);

    // Then user should see the results page
    expect(screen.getByText(/results/i)).toBeVisible();
    expect(screen.getByText(/summary/i)).toBeVisible();
    expect(screen.getByText(/findings/i)).toBeVisible();
  });

  it("displays loading screen after submit", async () => {
    // Given a PDF is less than 50MB and less than 1000 pages
    let resolveMock: (value: any) => void = ()=> {};
    const originalMock = global.fetch;
    global.fetch = jest.fn((url: string) => {
      if (url.includes("api/presigned-url")) {
        return new Promise((resolve)=> {
          resolveMock = resolve;
        });
      }
      return originalMock(url);
    }) as jest.Mock;
    const validPDF = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });
    render(<MainComponent />);
    // When the file is uploaded
    const fileInput = screen.getByLabelText(/choose file/i);
    await userEvent.upload(fileInput, validPDF);
    const submitButton = screen.getByRole("button", { name: /verify document/i });
    await userEvent.click(submitButton);

    // Then user should see the loading page first
    expect(screen.getByText(/loading/i)).toBeVisible();
    // And user should see results page after loading
    await act(async () => {
      resolveMock({
          ok: true,
          json: async () => ({
            presigned_url: "/fake-url",
            file_uri: "",
          })
        })
    })
    resolveMock({
          ok: true,
          json: async () => ({
            presigned_url: "/fake-url",
            file_uri: "",
          })
        })
    expect(screen.getByText(/results/i)).toBeVisible();
  });

  it("navigates back to homepage on 'Upload another file'", async () => {
    // Given the file is successfully uploaded and submitted
    const validPDF = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });
    render(<MainComponent />);
    const fileInput = screen.getByLabelText(/choose file/i);
    await userEvent.upload(fileInput, validPDF);
    const submitButton = screen.getByRole("button", { name: /verify document/i });
    await userEvent.click(submitButton);
    // And the user clicks Back to Home
    const backToHomeLink = screen.getByText(/upload another/i);
    await userEvent.click(backToHomeLink);

    // Then user should see the results page
    expect(screen.getByText(/file/i)).toBeVisible();
  });
});
