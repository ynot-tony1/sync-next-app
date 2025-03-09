/**
 * @fileoverview Unit tests for the WebSocket component. These tests verify that the component properly
 * updates its message, milestone, and indicator state based on simulated WebSocket messages.
 *
 * @remarks
 * The tests cover three cases:
 *  - When a valid milestone message is received, the displayed message and milestone update accordingly.
 *  - When an error message is received, the error indicator is rendered.
 *  - When a success message is received, the success indicator is rendered.
 */

import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import WebSocket from '../components/WebSocket';
import { WebSocketProvider } from '../components/WebSocketContext';
import { UploadFileProvider } from '../components/UploadFileContext';

describe('WebSocket', () => {
  let mockWsInstance: any;

  beforeEach(() => {
    jest.useFakeTimers();
    mockWsInstance = {
      onopen: null,
      onmessage: null,
      onclose: null,
      onerror: null,
      close: jest.fn(),
      CONNECTING: 0,
      OPEN: 1,
      CLOSING: 2,
      CLOSED: 3,
    };
    global.WebSocket = jest.fn(() => mockWsInstance) as any;
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  /**
   * @test Verify that the component updates the message and milestone when a valid milestone message is received.
   */
  it('updates message and milestone when a valid milestone message is received', async () => {
    render(
      <WebSocketProvider>
        <UploadFileProvider>
          <WebSocket  />
        </UploadFileProvider>
      </WebSocketProvider>
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    act(() => {
      mockWsInstance.onopen?.();
    });

    act(() => {
      mockWsInstance.onmessage?.({ data: "Here we go" } as MessageEvent<string>);
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      const msgContainer = screen.getByTestId("message-container");
      expect(msgContainer.textContent?.trim()).toContain("Here we go");
    }, { timeout: 3000 });

    expect(screen.getByText("Initiate")).toBeInTheDocument();
  });

  /**
   * @test Verify that the error indicator is rendered when an error message is received.
   */
  it('sets error indicator when an error message is received', async () => {
    render(
      <WebSocketProvider>
        <UploadFileProvider>
          <WebSocket  />
        </UploadFileProvider>
      </WebSocketProvider>
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    act(() => {
      mockWsInstance.onopen?.();
    });

    act(() => {
      mockWsInstance.onmessage?.({ data: "no video" } as MessageEvent<string>);
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(screen.getByTestId("sync-icon-error")).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  /**
   * @test Verify that the success indicator is rendered when a success message is received.
   */
  it('sets success indicator when a success message is received', async () => {
    render(
      <WebSocketProvider>
        <UploadFileProvider>
          <WebSocket  />
        </UploadFileProvider>
      </WebSocketProvider>
    );

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    act(() => {
      mockWsInstance.onopen?.();
    });

    act(() => {
      mockWsInstance.onmessage?.({ data: "get your file" } as MessageEvent<string>);
      jest.advanceTimersByTime(500);
    });

    await waitFor(() => {
      expect(screen.getByTestId("sync-icon-success")).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});
