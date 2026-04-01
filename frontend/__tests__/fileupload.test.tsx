import "@testing-library/jest-dom";
import FileUpload from "../app/components/FileUpload";

import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
describe("FileUpload component", () => {
  it("receives an uploaded file", async () => {
    // Given a PDF is less than 50MB and less than 1000 pages
    const validPDF = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });
    const mockFileUpload = jest.fn();
    render(
      <FileUpload
        onFileUpload={mockFileUpload}
        setView={() => {}}
        setOverallResult={() => {}}
        setFindings={() => {}}
        setSummaryText={() => {}}
      />,
    );
    // When the file is uploaded
    const fileInput = screen.getByLabelText(/choose file/i);
    await userEvent.upload(fileInput, validPDF);
    const submitButton = screen.getByRole("button", { name: /verify document/i });
    await userEvent.click(submitButton);

    // Then the file is uploaded to the cloud storage
    expect(mockFileUpload).toHaveBeenCalledWith(validPDF);
  });
});
