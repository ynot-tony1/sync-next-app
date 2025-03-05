/**
 * @fileoverview Unit tests for the ProcessVideoWebSocket component's download link functionality.
 * These tests verify that when the component is in a success state and a valid download link is provided,
 * the success tick is wrapped in an anchor element with the proper attributes.
 *
 * @remarks
 * The tests override the WebSocket context's useWebSocket hook to simulate a success state and supply a custom
 * UploadFileContext value with a preset download URL and filename.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import ProcessVideoWebSocket from '../components/ProcessVideoWebSocket';
import { UploadFileContext } from '../components/UploadFileContext';
import { WebSocketProvider } from '../components/WebSocketContext';

jest.mock('@/components/WebSocketContext', () => {
  const actual = jest.requireActual('@/components/WebSocketContext');
  return {
    ...actual,
    useWebSocket: () => ({
      message: "Success",
      progressSteps: ["Initiate", "Complete"],
      indicatorState: "success",
      wsConnected: true,
      progressPercent: 100,
    }),
  };
});

describe('ProcessVideoWebSocket - Download Link', () => {
  /**
   * @test Verify that a clickable download link is rendered when the component is in a success state.
   */
  it('renders clickable download link when in success state', () => {
    const testContextValue = {
      downloadUrl: 'http://example.com/download/file.avi',
      downloadFilename: 'file.avi',
      setDownloadLink: jest.fn(),
    };

    render(
      <WebSocketProvider>
        <UploadFileContext.Provider value={testContextValue}>
          <ProcessVideoWebSocket  />
        </UploadFileContext.Provider>
      </WebSocketProvider>
    );

    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', 'http://example.com/download/file.avi');
    expect(linkElement).toHaveAttribute('download', 'file.avi');
  });
});
