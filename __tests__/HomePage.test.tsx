/**
 * @fileoverview Tests for the HomePage component.
 *
 * This module tests the HomePage component behavior under different session states.
 * It uses Jest for mocking and React Testing Library for rendering the component and querying
 * the DOM. The tests cover two scenarios:
 *
 * 1. When there is no active session (user is not logged in)
 * 2. When a valid session exists (user is logged in)
 *
 * Dependencies:
 * - @testing-library/react: For rendering and querying the component.
 * - next-auth/react: For mocking authentication hooks (useSession and signOut).
 *
 * @module HomePage.test
 */

import { render, screen } from '@testing-library/react';
import HomePage from '../components/HomePage';
import { useSession, signOut } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  useSession: jest.fn(),
  signOut: jest.fn(),
}));

describe('HomePage', () => {
  /**
   * Test case: Renders the "not logged in" view when there is no active session.
   *
   * This test mocks the useSession hook to return a null session. It then verifies that the
   * component renders text indicating the user is not logged in and that it includes a link
   * to navigate to the login page.
   */
  it('renders not logged in view when session is null', () => {
    (useSession as jest.Mock).mockReturnValue({ data: null });
    render(<HomePage />);
    expect(screen.getByText("You’re not logged in")).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /go to login/i })
    ).toBeInTheDocument();
  });

  /**
   * Test case: Renders the welcome view when a valid session exists.
   *
   * This test mocks the useSession hook to return a session with a valid user object.
   * It then verifies that the component displays a welcome message with the user's email and
   * a logout button.
   */
  it('renders welcome view when session exists', () => {
    (useSession as jest.Mock).mockReturnValue({
      data: { user: { email: "test@example.com" } },
    });
    render(<HomePage />);
    expect(
      screen.getByText(/welcome, test@example.com/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /logout/i })
    ).toBeInTheDocument();
  });
});
