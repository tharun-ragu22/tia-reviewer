import "@testing-library/jest-dom";

import "@testing-library/jest-dom";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MainComponent from "../app/components/MainComponent";

global.fetch = jest.fn()

describe("Main component", () => {
  it("receives an uploaded file", async () => {
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
  });
});
