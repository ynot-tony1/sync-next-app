/**
 * @module ProcessVideoWebSocketTests
 * @description Test suite for the ProcessVideoWebSocket component.
 */

import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import ProcessVideoWebSocket from '../components/ProcessVideoWebSocket';
import { WebSocketProvider } from '../components/WebSocketContext';

describe('ProcessVideoWebSocket', () => {
  /**
   * A mock WebSocket instance used to simulate real WebSocket behavior.
   * @type {any}
   */
  let mockWsInstance: any;

  /**
   * Setup before each test: enable fake timers and create a mock WebSocket.
   */
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

  /**
   * Cleanup after each test: restore real timers and reset mocks.
   */
  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  /**
   * Test that a valid milestone message updates the displayed message and milestone.
   *
   * This test simulates:
   * - Advancing timers to trigger the WebSocket connection.
   * - Firing the onopen callback.
   * - Sending a message ("Here we go") that matches the "Initiate" milestone.
   * - Verifying that the message and milestone are rendered.
   */
  it('updates message and milestone when a valid milestone message is received', async () => {
    render(
      <WebSocketProvider>
        <ProcessVideoWebSocket visible={true} />
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
   * Test that an error message updates the indicator to the error state.
   *
   * This test simulates:
   * - Advancing timers to trigger connection.
   * - Firing the onopen callback.
   * - Sending an error message ("no video").
   * - Verifying that the error indicator (with data-testid "sync-icon-error") is rendered.
   */
  it('sets error indicator when an error message is received', async () => {
    render(
      <WebSocketProvider>
        <ProcessVideoWebSocket visible={true} />
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
   * Test that a success message updates the indicator to the success state.
   *
   * This test simulates:
   * - Advancing timers to trigger connection.
   * - Firing the onopen callback.
   * - Sending a success message ("get your file") that matches the success regex.
   * - Verifying that the success indicator (with data-testid "sync-icon-success") is rendered.
   */
  it('sets success indicator when a success message is received', async () => {
    render(
      <WebSocketProvider>
        <ProcessVideoWebSocket visible={true} />
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
