/**
 * @fileoverview Unit tests for the UploadForm component. These tests verify that the UploadForm
 * renders the file input and upload button as expected.
 *
 * @remarks
 * The tests simulate the environment for file uploading by mocking the global fetch function and verifying that
 * the file input and upload button are rendered correctly.
 */

import { render, screen } from '@testing-library/react';
import UploadForm from '../components/UploadForm';
import { UploadFileProvider } from '../components/UploadFileContext';

describe('UploadForm', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_BACKEND_URL = '';
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ url: '/download/file', filename: 'file.avi' }),
      })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  /**
   * @test Verify that the UploadForm renders a file input (browse button) and an upload button.
   */
  it('renders file input and upload button', () => {
    render(
      <UploadFileProvider>
        <UploadForm />
      </UploadFileProvider>
    );
    expect(screen.getByLabelText(/browse/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload/i })).toBeInTheDocument();
  });
});
