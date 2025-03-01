/**
 * @module UploadFormTests
 * @description Unit tests for the UploadForm component.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadForm from '../components/UploadForm';

describe('UploadForm', () => {
  /**
   * Setup before each test.
   * Mocks the global fetch function to simulate file upload responses.
   */
  beforeEach(() => {
    process.env.NEXT_PUBLIC_BACKEND_URL = '';
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ url: '/download/file', filename: 'file.avi' }),
      })
    ) as jest.Mock;
  });

  /**
   * Cleanup after each test.
   * Resets all mocks.
   */
  afterEach(() => {
    jest.resetAllMocks();
  });

  /**
   * Test that the UploadForm renders the file input and upload button.
   */
  it('renders file input and upload button', () => {
    render(<UploadForm />);
    expect(screen.getByLabelText(/browse/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
  });

  /**
   * Test that the UploadForm uploads a file and displays a download link.
   *
   * This test simulates:
   * - Selecting a file using the file input.
   * - Clicking the upload button.
   * - Verifying that a download link with the expected attributes is rendered.
   */
  it('uploads a file and displays download link', async () => {
    render(<UploadForm />);
    const fileInput = screen.getByLabelText(/browse/i);
    const file = new File(["rando0m content"], "synksynk-cherrou.avi", { type: "video/avi" });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    const uploadButton = screen.getByRole('button', { name: /upload/i });
    fireEvent.click(uploadButton);

    const downloadLink = await waitFor(() => screen.getByRole('link', { name: /download/i }));
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute("download", "file.avi");
  });
});
