/**
 * @file LoginPage.test.tsx
 * @description Contains unit tests for the LoginPage component, verifying that:
 * - The default view is the login mode.
 * - The view toggles to registration mode when the toggle button is clicked.
 * - The signIn function is called with the correct credentials when a login is submitted.
 */

import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../components/LoginPage';
import { signIn } from 'next-auth/react';

// Mock next-auth's signIn function for testing purposes.
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

/**
 * Test suite for the LoginPage component.
 */
describe('LoginPage', () => {
  /**
   * Test that the login mode is rendered by default.
   *
   * This test renders the LoginPage component and asserts that the heading
   * containing "login" (case-insensitive) is present in the document.
   */
  it('renders login mode by default', () => {
    render(<LoginPage />);
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
  });

  /**
   * Test that the registration mode is displayed after clicking the toggle button.
   *
   * This test renders the LoginPage component, simulates a click on the button
   * that switches the view to registration mode, and asserts that the heading
   * containing "register" (case-insensitive) appears in the document.
   */
  it('toggles to registration mode when button is clicked', () => {
    render(<LoginPage />);
    const toggleButton = screen.getByRole('button', { name: /switch to register/i });
    fireEvent.click(toggleButton);
    expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
  });

  /**
   * Test that the signIn function is called with correct credentials on login submission.
   *
   * This test simulates a user filling in the email and password fields on the LoginPage,
   * submitting the login form, and asserts that the signIn function is invoked with a
   * credentials object containing the expected email and password.
   */
  it('calls signIn on login submission', async () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    fireEvent.change(emailInput, { target: { value: 'thonself@thinegaff.com' } });
    fireEvent.change(passwordInput, { target: { value: 'synxorpass123' } });
    fireEvent.click(submitButton);

    expect(signIn).toHaveBeenCalledWith('credentials', expect.objectContaining({
      email: 'thonself@thinegaff.com',
      password: 'synxorpass123',
    }));
  });
});
