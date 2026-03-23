import "@testing-library/jest-dom";

import "@testing-library/jest-dom";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MainComponent from "../app/components/MainComponent";

global.fetch = jest.fn()

describe("Main component", () => {
  it("navigates to results page on submit", async () => {
    // Given a PDF is less than 50MB and less than 1000 pages
    const validPDF = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ gcsUri: "gs://tia-files/tia-uploads/test.pdf" }),
      });
    render(<MainComponent />);
    // When the file is uploaded
    const fileInput = screen.getByLabelText(/choose file/i);
    await userEvent.upload(fileInput, validPDF);
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);

    // Then user should see the results page
    expect(screen.getByText(/result/i)).toBeVisible();
    expect(screen.getByText(/summary/i)).toBeVisible();
    expect(screen.getByText(/findings/i)).toBeVisible();
    expect(screen.getByText(/methodology flags/i)).toBeVisible();
  });

  it("navigates back to homepage on 'Upload another file'", async () => {
    // Given the file is successfully uploaded and submitted
    const validPDF = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ gcsUri: "gs://tia-files/tia-uploads/test.pdf" }),
      });
    render(<MainComponent />);
    const fileInput = screen.getByLabelText(/choose file/i);
    await userEvent.upload(fileInput, validPDF);
    const submitButton = screen.getByRole("button", { name: /submit/i });
    await userEvent.click(submitButton);
    // And the user clicks Back to Home
    const backToHomeLink = screen.getByText(/upload another/i);
    await userEvent.click(backToHomeLink)

    // Then user should see the results page
    expect(screen.getByText(/file/i)).toBeVisible();
  });
});
