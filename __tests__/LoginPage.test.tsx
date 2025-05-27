/**
 * @file LoginPage.test.tsx
 * @description Contains unit tests for the LoginPage component, verifying that:
 * - The default view is the login mode.
 * - The view toggles to registration mode when the toggle button is clicked.
 * - The signIn function is called with the correct credentials when a login is submitted.
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../components/LoginPage';
import { signIn } from 'next-auth/react';

jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}));

/**
 * Test suite for the LoginPage component.
 */
describe('LoginPage', () => {
  /**
   * Test that the login mode is rendered by default.
   */
  it('renders login mode by default', () => {
    render(<LoginPage />);
    expect(
      screen.getByRole('heading', { name: /login/i })
    ).toBeInTheDocument();
  });

  /**
   * Test that the registration mode is displayed after clicking the toggle button.
   */
  it('toggles to registration mode when button is clicked', async () => {
    render(<LoginPage />);
    const toggleButton = screen.getByRole('button', {
      name: /switch to register/i,
    });
    await userEvent.click(toggleButton);
    expect(
      screen.getByRole('heading', { name: /register/i })
    ).toBeInTheDocument();
  });

  /**
   * Test that the signIn function is called with correct credentials on login submission.
   */
  it('calls signIn on login submission', async () => {
    render(<LoginPage />);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    // type into inputs
    await userEvent.type(emailInput, 'thonself@thinegaff.com');
    await userEvent.type(passwordInput, 'synxorpass123');

    // click login
    await userEvent.click(submitButton);

    // assert signIn was called with the right args
    expect(signIn).toHaveBeenCalledWith(
      'credentials',
      expect.objectContaining({
        email: 'thonself@thinegaff.com',
        password: 'synxorpass123',
      })
    );
  });
});
